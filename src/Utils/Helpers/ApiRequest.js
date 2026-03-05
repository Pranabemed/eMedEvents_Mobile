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
const DASHBOARD_ENDPOINTS = new Set(['user/dashboard', '/user/dashboard']);
const DASHBOARD_COOLDOWN_MS = 3000;
let dashboardInFlightPromise = null;
let dashboardInFlightKey = '';
let lastDashboardResponse = null;
let lastDashboardHitAt = 0;
let lastDashboardRequestKey = '';

const normalizeEndpoint = (url = '') => String(url).trim().toLowerCase();
const isDashboardEndpoint = (url = '') => DASHBOARD_ENDPOINTS.has(normalizeEndpoint(url));
const getDashboardRequestKey = (payload) => {
  try {
    return JSON.stringify(payload ?? {});
  } catch (_) {
    return '__unserializable_dashboard_payload__';
  }
};
const shouldBypassDashboardCache = (payload) =>
  Boolean(payload?.force_dashboard_refresh || payload?._forceDashboardRefresh || payload?.bypass_cache);
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
const TOKEN_EXPIRY_MESSAGES = [
  'missing or invalid token',
  'token is missing or invalid',
  'token is expired',
  'token expired',
  'invalid token',
  'missing token',
];

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

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance — all app API calls go through this
// ─────────────────────────────────────────────────────────────────────────────
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
      const freshToken = await AsyncStorage.getItem(constants.TOKEN);
      if (freshToken) {
        config.headers['eMedAuthorization'] = freshToken;
      }

      const userAgentHeader = getUserAgentJSON();
      if (userAgentHeader) {
        // Keep existing custom header name expected by backend.
        config.headers['userAgent'] = userAgentHeader;
        // Also set standard header key for proxies/tools that only inspect User-Agent.
        config.headers['User-Agent'] = userAgentHeader;
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
// Persists ANY token/refresh_token the server returns.
// Note: we save even when success:false (unverified-user temporary tokens).
// Also reschedules the proactive refresh timer via TokenManager.
// ─────────────────────────────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  async (response) => {
    try {
      const data = response?.data;
      if (data && typeof data === 'object' && data.token) {
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
        // This ensures that if the user stays idle on a screen for 10+ minutes,
        // the timer fires 1 minute before expiry and refreshes silently.
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
      console.log('[TokenRefresh] 🔑 HTTP 401 on:', config?.url?.split('/').pop());
      return handleTokenExpiry(config, response);
    }

    // All other errors — pass through unchanged
    return Promise.reject(error);
  },
);

// ─── Public API functions ──────────────────────────────────────────────────────
export async function getApi(url, header) {
  const userAgentHeader = getUserAgentJSON();
  const reqHeaders = {
    Accept: header.Accept,
    'Content-type': header.contenttype,
    eMedAuthorization: header.authorization,
    ...(userAgentHeader ? { userAgent: userAgentHeader, 'User-Agent': userAgentHeader } : {}),
  };
  return axiosInstance.get(`${constants.BASE_URL}/${url}`, {
    headers: reqHeaders,
  });
}

export async function getApiWithParam(url, param, header) {
  const userAgentHeader = getUserAgentJSON();
  const reqHeaders = {
    Accept: header.Accept,
    'Content-type': header.contenttype,
    ...(userAgentHeader ? { userAgent: userAgentHeader, 'User-Agent': userAgentHeader } : {}),
  };
  return axiosInstance({
    method: 'GET',
    baseURL: constants.BASE_URL,
    url: url,
    params: param,
    headers: reqHeaders,
  });
}

export async function postApi(url, payload, header) {
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
  const reqHeaders = {
    Accept: header.Accept,
    'Content-Type': header.contenttype,
    eMedAuthorization: header.authorization,
    IPADDRESS: header.IPADDRESS,
    ...(userAgentHeader ? { userAgent: userAgentHeader, 'User-Agent': userAgentHeader } : {}),
  };
  console.log("header==========", reqHeaders);
  const requestPromise = axiosInstance.post(`${constants.BASE_URL}/${url}`, payload, {
    headers: reqHeaders,
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

export async function deleteApi(url, payload, header) {
  const cleanUrl = `${constants.BASE_URL}/${url}`.replace(/\/\/+/g, '/').trim();
  const userAgentHeader = getUserAgentJSON();
  const reqHeaders = {
    Accept: header.Accept,
    'Content-Type': header.contenttype,
    eMedAuthorization: header.authorization,
    ...(userAgentHeader ? { userAgent: userAgentHeader, 'User-Agent': userAgentHeader } : {}),
  };
  try {
    return await axiosInstance.delete(cleanUrl, {
      headers: reqHeaders,
      data: payload,
    });
  } catch (error) {
    console.error('[ApiRequest] DELETE error:', error.response?.data || error.message);
    throw error;
  }
}
