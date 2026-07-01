/**
 * ApiRequest.js  — v5 (SINGLE REFRESH LOCK — delegates to TokenManager)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ARCHITECTURE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * axiosInstance handles ALL app API calls.
 * plain `axios` is used ONLY for the refresh call itself (inside TokenManager).
 *
 * Interceptors (registered in this order, run in REVERSE for responses — LIFO):
 *
 *   Request  [R1]  — always inject the FRESHEST token from AsyncStorage
 *                    before every outgoing request (overrides stale Redux token)
 *
 *   Response [A]   — registered FIRST → runs LAST
 *                    Token Auto-Saver: persists any token/refresh_token the
 *                    server returns to AsyncStorage + Redux
 *
 *   Response [B]   — registered SECOND → runs FIRST (LIFO)
 *                    Expiry Detector: delegates refresh to TokenManager.forceRefresh().
 *                    TokenManager uses a shared _refreshPromise so ALL callers
 *                    (AppState, timer, this interceptor) share ONE HTTP call.
 *
 * GOLDEN RULE — NO FORCED LOGOUT
 * ────────────────────────────────
 * Neither the refresh logic nor any interceptor ever calls logoutSuccess or
 * clears AsyncStorage. If a refresh fails, the original response is returned.
 *
 * SINGLE REFRESH LOCK
 * ───────────────────
 * Token refresh is handled EXCLUSIVELY by TokenManager._refreshPromise.
 * This prevents the race condition where two concurrent verifyRefreshToken
 * calls are made with the same (single-use) refresh token — the server would
 * accept the first and reject the second with "token expired".
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './constants';
import TokenManager from './TokenManager';
import getUserAgentJSON from './UserAgent';
import { fetchAndStoreBasicAuthToken, getBasicAuthorizationHeader } from './BasicAuth';
/**
 * API endpoints that use dashboard request coalescing.
 *
 * @type {Set<string>}
 */
const DASHBOARD_ENDPOINTS = new Set(['user/dashboard', '/user/dashboard']);
/**
 * Minimum interval before the same dashboard response can be reused.
 *
 * @type {number}
 */
const DASHBOARD_COOLDOWN_MS = 3000;
/**
 * Shared in-flight dashboard request promise.
 *
 * @type {Promise<import('axios').AxiosResponse> | null}
 */
let dashboardInFlightPromise = null;
/**
 * Cache key for the current in-flight dashboard request.
 *
 * @type {string}
 */
let dashboardInFlightKey = '';
/**
 * Last successful dashboard response.
 *
 * @type {import('axios').AxiosResponse | null}
 */
let lastDashboardResponse = null;
/**
 * Timestamp of the last dashboard response reuse.
 *
 * @type {number}
 */
let lastDashboardHitAt = 0;
/**
 * Cache key for the last completed dashboard request.
 *
 * @type {string}
 */
let lastDashboardRequestKey = '';

/**
 * Normalizes an endpoint path for cache lookups.
 *
 * @function normalizeEndpoint
 * @param {string} url - Raw endpoint path.
 * @returns {string} Lowercased trimmed endpoint path.
 */
const normalizeEndpoint = (url = '') => String(url).trim().toLowerCase();
/**
 * Determines whether an endpoint should use dashboard request coalescing.
 *
 * @function isDashboardEndpoint
 * @param {string} url - Raw endpoint path.
 * @returns {boolean} `true` when the endpoint is a dashboard route.
 */
const isDashboardEndpoint = (url = '') => DASHBOARD_ENDPOINTS.has(normalizeEndpoint(url));
/**
 * Serializes a dashboard request payload into a stable cache key.
 *
 * @function getDashboardRequestKey
 * @param {Record<string, unknown> | null | undefined} payload - Request payload.
 * @returns {string} Serialized cache key or a fallback token when serialization fails.
 */
const getDashboardRequestKey = (payload) => {
  try {
    return JSON.stringify(payload ?? {});
  } catch (_) {
    return '__unserializable_dashboard_payload__';
  }
};
/**
 * Determines whether dashboard caching should be bypassed for a request.
 *
 * @function shouldBypassDashboardCache
 * @param {Record<string, unknown> & {
 *   force_dashboard_refresh?: boolean;
 *   _forceDashboardRefresh?: boolean;
 *   bypass_cache?: boolean;
 * }} payload - Request payload.
 * @returns {boolean} `true` when cache reuse should be skipped.
 */
const shouldBypassDashboardCache = (payload) =>
  Boolean(payload?.force_dashboard_refresh || payload?._forceDashboardRefresh || payload?.bypass_cache);
/**
 * Builds a fully qualified API URL from a relative path.
 *
 * @function buildApiUrl
 * @param {string} url - Relative endpoint path.
 * @returns {string} Absolute API URL.
 */
const buildApiUrl = (url = '') => `${constants.BASE_URL}/${String(url).replace(/^\/+/, '')}`;

// ─────────────────────────────────────────────────────────────────────────────
// Token-expiry detection — STRICT
//
// ❗ Do NOT add broad words like 'unauthorized' or 'unauthenticated' here.
//    Those words appear in ordinary business-logic responses (e.g.
//    "User not authorized to access this content") and would wrongly trigger
//    a refresh loop on valid API failures.
//
// Only match the server's EXACT known token-expiry messages.
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Known server messages that indicate an expired access token.
 *
 * @type {string[]}
 */
const TOKEN_EXPIRY_MESSAGES = [
  'missing or invalid token',
  'token is missing or invalid',
  'token is expired',
  'token expired',
  'invalid token',
  'missing token',
];

/**
 * Detects whether an API response indicates that the token expired.
 *
 * @function isTokenExpiredResponse
 * @param {{ data?: { success?: boolean, msg?: string, message?: string, error?: string } } | null | undefined} response - Axios response payload.
 * @returns {boolean} `true` when the response matches a known token-expiry shape.
 */
function isTokenExpiredResponse(response) {
  if (!response) return false;

  // Standard HTTP 401 (some endpoints may still use this)
  // if (response.status === 401) return true; // Disabled strictly, let's only use body match

  // Server's custom format: HTTP 200 + { success: false, msg: "..." }
  if (response?.data?.success === false) {
    const msg = (
      response.data.msg ||
      response.data.message ||
      response.data.error ||
      ''
    ).toLowerCase().trim();

    return TOKEN_EXPIRY_MESSAGES.some(pattern => msg === pattern || msg.startsWith(pattern));
  }

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// handleTokenExpiry — delegates token refresh to the SINGLE LOCK TokenManager
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Handles token expiry by retrying the original request after refresh.
 *
 * @function handleTokenExpiry
 * @async
 * @param {import('axios').InternalAxiosRequestConfig & { _retried?: boolean, headers?: Record<string, string> }} originalConfig - Original Axios request config.
 * @param {import('axios').AxiosResponse} originalResponse - Original Axios response.
 * @returns {Promise<import('axios').AxiosResponse>} The retried response when refresh succeeds, otherwise the original response.
 */
async function handleTokenExpiry(originalConfig, originalResponse) {
  // Guard: don't retry the same request twice
  if (originalConfig._retried) {
    console.warn('[TokenRefresh] ⚠️  Request already retried — returning original response.');
    return originalResponse;
  }
  originalConfig._retried = true;

  try {
    // 🔗 DELEGATION: use TokenManager's single shared promise.
    // If a refresh is already in progress, this simply waits for it.
    // If not, it starts one HTTP call.
    const newToken = await TokenManager.forceRefresh();

    if (newToken) {
      originalConfig.headers['eMedAuthorization'] = newToken;
      console.log('[TokenRefresh] 🔁 Retrying original request:', originalConfig.url);
      return axiosInstance(originalConfig);   // retry with fresh token
    } else {
      console.warn('[TokenRefresh] ⚠️  Refresh rejected/failed — returning original response.');
      return originalResponse;
    }

  } catch (refreshErr) {
    console.warn('[TokenRefresh] ⚠️  Refresh attempt failed (non-fatal):', refreshErr?.message);

    // ✅ IMPORTANT: Return the original response — DO NOT force logout.
    // The saga/screen will receive this response and show a normal error
    // message (e.g. "Session expired, please try again") if needed.
    // The user stays on their current screen.
    // ⛔ Never call logoutSuccess or clear AsyncStorage here.
    return originalResponse;
  }
}

/**
 * Retries a request after refreshing the basic authorization token.
 *
 * @function retryWithFreshBasicAuth
 * @async
 * @param {import('axios').InternalAxiosRequestConfig & { _retriedBasicAuth?: boolean, skipBasicAuth?: boolean, headers?: Record<string, string> }} originalConfig - Original Axios request config.
 * @returns {Promise<import('axios').AxiosResponse | null>} The retried response when refresh succeeds, otherwise `null`.
 */
async function retryWithFreshBasicAuth(originalConfig) {
  if (!originalConfig || originalConfig._retriedBasicAuth || originalConfig.skipBasicAuth) {
    return null;
  }

  originalConfig._retriedBasicAuth = true;
  originalConfig.headers = originalConfig.headers || {};

  let basicAuthToken = '';
  try {
    basicAuthToken = await fetchAndStoreBasicAuthToken();
  } catch (error) {
    console.warn('[BasicAuth] Refresh failed before retry:', error?.message || error);
  }

  if (!basicAuthToken) {
    return null;
  }

  originalConfig.headers.Authorization = basicAuthToken;
  console.log('[BasicAuth] Retrying request with refreshed basic auth:', originalConfig.url);
  return axiosInstance(originalConfig);
}

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance — all app API calls go through this
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Shared Axios instance used by all application API calls.
 *
 * @type {import('axios').AxiosInstance}
 */
const axiosInstance = axios.create();

// ─── [R1] Request interceptor ─────────────────────────────────────────────────
// Always injects the FRESHEST token from AsyncStorage before each request.
// This means:
//   • Sagas that build headers from (possibly stale) Redux state still send the right token.
//   • After a proactive refresh, the new token is used automatically.
// ─────────────────────────────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      if (!config.headers) config.headers = {};
      const skipBasicAuth = config.skipBasicAuth || config.headers.skipBasicAuth;
      delete config.headers.skipBasicAuth;

      if (!skipBasicAuth) {
        const basicAuthToken = await getBasicAuthorizationHeader();
        if (basicAuthToken) {
          config.headers['Authorization'] = basicAuthToken;
        }
      }

      const freshToken = await AsyncStorage.getItem(constants.TOKEN);
      if (freshToken) {
        config.headers['eMedAuthorization'] = freshToken;
      } else {
        const { getPublicIP } = require('./IPServer');
        const ip = getPublicIP() || '';
        const uid = await AsyncStorage.getItem('PLAYERSESSION') || '';
        
        config.headers['Origin'] = '';
        config.headers['Content-Type'] = 'application/json';
        config.headers['IPADDRESS'] = ip;
        config.headers['clickedUrl'] = '';
        config.headers['referrerUrl'] = '';
        config.headers['TrackingUID'] = uid;

        console.log('[ApiRequest] Injected Guest Headers:', {
          Origin: config.headers['Origin'],
          'Content-Type': config.headers['Content-Type'],
          IPADDRESS: ip,
          clickedUrl: config.headers['clickedUrl'],
          referrerUrl: config.headers['referrerUrl'],
          TrackingUID: uid
        });
      }

      const userAgentHeader = getUserAgentJSON();
      if (userAgentHeader) {
        config.headers['userAgent'] = userAgentHeader;
      }

    } catch (_) {
      // Never block the request
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── [A] Response interceptor — Token Auto-Saver ─────────────────────────────
// Registered FIRST → runs LAST (Axios LIFO for response interceptors).
// Persists ANY token/refresh_token the server returns, EXCEPT for recovery flows.
// Note: we save even when success:false (unverified-user temporary tokens).
// Also reschedules the proactive refresh timer via TokenManager.
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Endpoints that should not trigger token refresh persistence.
 *
 * @type {Set<string>}
 */
const RECOVERY_ENDPOINTS = new Set([
  'user/forgotpasswordphone',
  '/user/forgotpasswordphone',
  'user/forgotpassword',
  '/user/forgotpassword'
]);

axiosInstance.interceptors.response.use(
  async (response) => {
    try {
      const fullUrl = response?.config?.url || '';
      // Strip base URL and query parameters to get the relative path
      const urlPath = fullUrl.replace(constants.BASE_URL, '').split('?')[0].replace(/\/$/, '').toLowerCase();
      // Normalize to handle optional leading slash
      const cleanPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
      
      const isRecovery = RECOVERY_ENDPOINTS.has(cleanPath) || RECOVERY_ENDPOINTS.has(cleanPath.substring(1));

      const data = response?.data;
      if (data && typeof data === 'object' && data.token && !isRecovery) {
        await AsyncStorage.setItem(constants.TOKEN, data.token);

        if (data.refresh_token) {
          await AsyncStorage.setItem(constants.REFRESH_TOKEN, data.refresh_token);
        }

        // Push to Redux
        try {
          const Store = require('../../Redux/Store').default;
          const { tokenSuccess, refreshTokenSuccess } = require('../../Redux/Reducers/AuthReducer');
          Store.dispatch(tokenSuccess(data.token));
          if (data.refresh_token) {
            Store.dispatch(refreshTokenSuccess({ token: data.token, refresh_token: data.refresh_token }));
          }
        } catch (_) { }

        // ── Reschedule the proactive refresh timer for the new token ──────────
        try {
          TokenManager.onNewToken(data.token);
        } catch (_) { }
      }
    } catch (_) { }
    return response;
  },
  (error) => Promise.reject(error),
);

// ─── [B] Response interceptor — Expiry Detector + Refresh + Retry ─────────────
// Registered SECOND → runs FIRST (Axios LIFO).
// Catches: body-based expiry (HTTP 200 + success:false) AND HTTP 401.
// ─────────────────────────────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  // HTTP 2xx path
  async (response) => {
    if (!isTokenExpiredResponse(response)) {
      return response;
    }
    console.log('[TokenRefresh] 🔑 Token expiry detected (body) on:', response.config?.url?.split('/').pop());
    return handleTokenExpiry(response.config, response);
  },

  // HTTP 4xx/5xx/network error path
  async (error) => {
    const response = error?.response;
    const config = error?.config;

    if (response?.status === 401 && config) {
      const retriedWithBasicAuth = await retryWithFreshBasicAuth(config);
      if (retriedWithBasicAuth) {
        return retriedWithBasicAuth;
      }

      console.log('[TokenRefresh] 🔑 HTTP 401 on:', config?.url?.split('/').pop());
      return handleTokenExpiry(config, response);
    }

    // All other errors — pass through unchanged
    return Promise.reject(error);
  },
);

// ─── Public API functions ──────────────────────────────────────────────────────
/**
 * Fetches data from the API using a GET request.
 *
 * @function getApi
 * @async
 * @param {string} url - Relative endpoint path.
 * @param {Object} header - Request header options.
 * @param {string} [header.Accept] - Accept header value.
 * @param {string} [header.contenttype] - Content-Type header value.
 * @param {string} [header.authorization] - eMed authorization token.
 * @param {boolean} [header.skipBasicAuth] - Skips basic auth header when `true`.
 * @returns {Promise<import('axios').AxiosResponse>} API response.
 * @throws {Error} Throws when the request fails.
 */
export async function getApi(url, header = {}) {
  const userAgentHeader = getUserAgentJSON();
  const basicAuthToken = header.skipBasicAuth ? '' : await getBasicAuthorizationHeader();
  const reqHeaders = {
    Accept: header.Accept,
    'Content-type': header.contenttype,
    ...(!header.skipBasicAuth && basicAuthToken ? { Authorization: basicAuthToken } : {}),
    ...(header.authorization ? { eMedAuthorization: header.authorization } : {}),
    ...(userAgentHeader ? { userAgent: userAgentHeader } : {}),
  };
  return axiosInstance.get(buildApiUrl(url), {
    headers: reqHeaders,
    skipBasicAuth: header.skipBasicAuth,
  });
}

/**
 * Fetches data from the API using a GET request with query parameters.
 *
 * @function getApiWithParam
 * @async
 * @param {string} url - Relative endpoint path.
 * @param {Record<string, unknown>} param - Query parameters.
 * @param {Object} header - Request header options.
 * @param {string} [header.Accept] - Accept header value.
 * @param {string} [header.contenttype] - Content-Type header value.
 * @param {string} [header.authorization] - eMed authorization token.
 * @param {boolean} [header.skipBasicAuth] - Skips basic auth header when `true`.
 * @returns {Promise<import('axios').AxiosResponse>} API response.
 * @throws {Error} Throws when the request fails.
 */
export async function getApiWithParam(url, param, header = {}) {
  const userAgentHeader = getUserAgentJSON();
  const basicAuthToken = header.skipBasicAuth ? '' : await getBasicAuthorizationHeader();
  const reqHeaders = {
    Accept: header.Accept,
    'Content-type': header.contenttype,
    ...(!header.skipBasicAuth && basicAuthToken ? { Authorization: basicAuthToken } : {}),
    ...(header.authorization ? { eMedAuthorization: header.authorization } : {}),
    ...(userAgentHeader ? { userAgent: userAgentHeader } : {}),
  };
  return axiosInstance({
    method: 'GET',
    baseURL: constants.BASE_URL,
    url: url,
    params: param,
    headers: reqHeaders,
    skipBasicAuth: header.skipBasicAuth,
  });
}

/**
 * Sends a POST request to the API.
 *
 * @function postApi
 * @async
 * @param {string} url - Relative endpoint path.
 * @param {Record<string, unknown>} payload - Request body payload.
 * @param {Object} header - Request header options.
 * @param {string} [header.Accept] - Accept header value.
 * @param {string} [header.contenttype] - Content-Type header value.
 * @param {string} [header.authorization] - eMed authorization token.
 * @param {string} [header.IPADDRESS] - Client IP address header.
 * @param {boolean} [header.skipBasicAuth] - Skips basic auth header when `true`.
 * @returns {Promise<import('axios').AxiosResponse>} API response.
 * @throws {Error} Throws when the request fails.
 */
export async function postApi(url, payload, header = {}) {
  if (isDashboardEndpoint(url)) {
    const bypassCache = shouldBypassDashboardCache(payload);
    const requestKey = getDashboardRequestKey(payload);
    if (dashboardInFlightPromise && dashboardInFlightKey === requestKey) {
      return dashboardInFlightPromise;
    }
    const now = Date.now();
    if (
      !bypassCache &&
      lastDashboardResponse &&
      lastDashboardRequestKey === requestKey &&
      (now - lastDashboardHitAt) < DASHBOARD_COOLDOWN_MS
    ) {
      return Promise.resolve(lastDashboardResponse);
    }
  }

  const userAgentHeader = getUserAgentJSON();
  const basicAuthToken = header.skipBasicAuth ? '' : await getBasicAuthorizationHeader();
  const reqHeaders = {
    Accept: header.Accept,
    'Content-Type': header.contenttype,
    ...(!header.skipBasicAuth && basicAuthToken ? { Authorization: basicAuthToken } : {}),
    ...(header.authorization ? { eMedAuthorization: header.authorization } : {}),
    ...(header.IPADDRESS ? { IPADDRESS: header.IPADDRESS } : {}),
    ...(userAgentHeader ? { userAgent: userAgentHeader } : {}),
  };
  console.log("header==========", reqHeaders);
  const requestPromise = axiosInstance.post(buildApiUrl(url), payload, {
    headers: reqHeaders,
    skipBasicAuth: header.skipBasicAuth,
  });

  if (isDashboardEndpoint(url)) {
    const requestKey = getDashboardRequestKey(payload);
    dashboardInFlightKey = requestKey;
    dashboardInFlightPromise = requestPromise
      .then((response) => {
        lastDashboardResponse = response;
        lastDashboardHitAt = Date.now();
        lastDashboardRequestKey = requestKey;
        return response;
      })
      .finally(() => {
        dashboardInFlightPromise = null;
        dashboardInFlightKey = '';
      });
    return dashboardInFlightPromise;
  }

  return requestPromise;
}

/**
 * Sends a DELETE request to the API.
 *
 * @function deleteApi
 * @async
 * @param {string} url - Relative endpoint path.
 * @param {Record<string, unknown>} payload - Request body payload.
 * @param {Object} header - Request header options.
 * @param {string} [header.Accept] - Accept header value.
 * @param {string} [header.contenttype] - Content-Type header value.
 * @param {string} [header.authorization] - eMed authorization token.
 * @param {boolean} [header.skipBasicAuth] - Skips basic auth header when `true`.
 * @returns {Promise<import('axios').AxiosResponse>} API response.
 * @throws {Error} Throws when the request fails.
 */
export async function deleteApi(url, payload, header = {}) {
  const cleanUrl = buildApiUrl(url).trim();
  const userAgentHeader = getUserAgentJSON();
  const basicAuthToken = header.skipBasicAuth ? '' : await getBasicAuthorizationHeader();
  const reqHeaders = {
    Accept: header.Accept,
    'Content-Type': header.contenttype,
    ...(!header.skipBasicAuth && basicAuthToken ? { Authorization: basicAuthToken } : {}),
    ...(header.authorization ? { eMedAuthorization: header.authorization } : {}),
    ...(userAgentHeader ? { userAgent: userAgentHeader } : {}),
  };
  try {
    return await axiosInstance.delete(cleanUrl, {
      headers: reqHeaders,
      data: payload,
      skipBasicAuth: header.skipBasicAuth,
    });
  } catch (error) {
    console.error('[ApiRequest] DELETE error:', error.response?.data || error.message);
    throw error;
  }
}
