/**
 * ApiRequest.js  — v4 (SAFE — never force-logout)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ARCHITECTURE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * axiosInstance handles ALL app API calls.
 * plain `axios` is used ONLY for the refresh call itself (avoids interceptor loop).
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
 *                    Expiry Detector: detects the server's custom expiry signal,
 *                    silently refreshes, and retries ONCE
 *
 * GOLDEN RULE — NO FORCED LOGOUT
 * ────────────────────────────────
 * Neither the refresh logic nor any interceptor ever calls logoutSuccess or
 * clears AsyncStorage. If a refresh fails, the original response is returned
 * and the saga/screen decides what to show (a normal error message, NOT a
 * logout). Only the explicit Logout button dispatches logoutRequest.
 *
 * Token-expiry detection — STRICT matching only:
 *   We only intercept responses whose msg matches the server's known error
 *   strings. Broad words like "unauthorized" appearing in business-logic
 *   error messages will NOT trigger a refresh to avoid false-positives.
 *
 * Refresh loop prevention:
 *   • The `user/verifyRefreshToken` call uses plain `axios`, NOT axiosInstance,
 *     so it is completely outside the interceptor chain.
 *   • `_retried` flag on the original config prevents double retries.
 *   • `isRefreshing` flag + queue prevents parallel refresh storms.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './constants';

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
  if (response.status === 401) return true;

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
// Refresh-token queue — prevents parallel refresh storms
// ─────────────────────────────────────────────────────────────────────────────
let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, token = null) {
  pendingQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
  pendingQueue = [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Core token refresher
//
// ⚠️  Uses plain `axios` (NOT axiosInstance) so this call is 100% outside
//     the interceptor chain — zero chance of an infinite refresh loop.
// ─────────────────────────────────────────────────────────────────────────────
async function refreshAccessToken() {
  const refreshToken = await AsyncStorage.getItem(constants.REFRESH_TOKEN);

  // ── Diagnostic log — visible in Metro/device logs ──────────────────────────
  console.log(
    '[TokenRefresh] 🔍 refresh_token in storage:',
    refreshToken ? `"${refreshToken.substring(0, 20)}…"` : 'NULL ← THIS IS THE PROBLEM'
  );

  if (!refreshToken) {
    throw new Error('NO_REFRESH_TOKEN');
  }

  console.log('[TokenRefresh] 🔄 Calling user/verifyRefreshToken with plain axios…');

  const res = await axios.post(                        // ← plain axios, NOT axiosInstance
    `${constants.BASE_URL}/user/verifyRefreshToken`,
    { refresh_token: refreshToken },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    },
  );

  console.log('[TokenRefresh] verifyRefreshToken response:', JSON.stringify(res?.data)?.substring(0, 200));

  if (res.data?.success && res.data?.token) {
    const newToken = res.data.token;
    // Server may rotate the refresh token; keep current one if it doesn't
    const newRefresh = res.data.refresh_token || refreshToken;

    await AsyncStorage.setItem(constants.TOKEN, newToken);
    await AsyncStorage.setItem(constants.REFRESH_TOKEN, newRefresh);

    try {
      const Store = require('../../Redux/Store').default;
      const { tokenSuccess, refreshTokenSuccess } = require('../../Redux/Reducers/AuthReducer');
      Store.dispatch(tokenSuccess(newToken));
      Store.dispatch(refreshTokenSuccess(res.data));
    } catch (_) { }

    console.log('[TokenRefresh] ✅ Access token refreshed successfully.');
    return newToken;
  }

  // Refresh token itself is expired or invalid
  console.error(
    '[TokenRefresh] ❌ verifyRefreshToken FAILED. Server said:',
    JSON.stringify(res?.data)
  );
  throw new Error(`REFRESH_FAILED: ${res?.data?.msg || 'server rejected refresh'}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// handleTokenExpiry — called from BOTH the success and error interceptor paths
// ─────────────────────────────────────────────────────────────────────────────
async function handleTokenExpiry(originalConfig, originalResponse) {
  // Guard: don't retry the same request twice
  if (originalConfig._retried) {
    console.warn('[TokenRefresh] ⚠️  Request already retried — returning original response.');
    return originalResponse;
  }
  originalConfig._retried = true;

  // If a refresh is already in progress, queue this request
  if (isRefreshing) {
    console.log('[TokenRefresh] ⏳ Refresh in progress — queuing request:', originalConfig.url);
    return new Promise((resolve, reject) => {
      pendingQueue.push({ resolve, reject });
    })
      .then(newToken => {
        originalConfig.headers['eMedAuthorization'] = newToken;
        return axiosInstance(originalConfig);
      })
      .catch(() => originalResponse);
  }

  isRefreshing = true;
  try {
    const newToken = await refreshAccessToken();
    processQueue(null, newToken);

    originalConfig.headers['eMedAuthorization'] = newToken;
    console.log('[TokenRefresh] 🔁 Retrying:', originalConfig.url);
    return axiosInstance(originalConfig);   // retry with fresh token

  } catch (refreshErr) {
    processQueue(refreshErr, null);

    if (refreshErr?.message === 'NO_REFRESH_TOKEN') {
      console.warn(
        '[TokenRefresh] ⚠️  No refresh_token stored. User likely not logged in yet.\n' +
        'Check that login/signup saves refresh_token to AsyncStorage.'
      );
    } else {
      console.warn('[TokenRefresh] ⚠️  Refresh attempt failed (non-fatal):', refreshErr?.message);
    }

    // ✅ IMPORTANT: Return the original response — DO NOT force logout.
    // The saga/screen will receive this response and show a normal error
    // message (e.g. "Session expired, please try again") if needed.
    // The user stays on their current screen.
    // ⛔ Never call logoutSuccess or clear AsyncStorage here.
    return originalResponse;
  } finally {
    isRefreshing = false;
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
      const freshToken = await AsyncStorage.getItem(constants.TOKEN);
      if (freshToken) {
        config.headers['eMedAuthorization'] = freshToken;
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
          console.log('[TokenAutoSave] ✅ token + refresh_token from:', response.config?.url?.split('/').pop());
        } else {
          console.log('[TokenAutoSave] ✅ token only (no refresh_token) from:', response.config?.url?.split('/').pop());
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
          const TokenManager = require('./TokenManager').default;
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
  return axiosInstance.get(`${constants.BASE_URL}/${url}`, {
    headers: {
      Accept: header.Accept,
      'Content-type': header.contenttype,
      eMedAuthorization: header.authorization,
    },
  });
}

export async function getApiWithParam(url, param, header) {
  return axiosInstance({
    method: 'GET',
    baseURL: constants.BASE_URL,
    url: url,
    params: param,
    headers: {
      Accept: header.Accept,
      'Content-type': header.contenttype,
    },
  });
}

export async function postApi(url, payload, header) {
  return axiosInstance.post(`${constants.BASE_URL}/${url}`, payload, {
    headers: {
      Accept: header.Accept,
      'Content-Type': header.contenttype,
      eMedAuthorization: header.authorization,
      IPADDRESS: header.IPADDRESS,
    },
  });
}

export async function deleteApi(url, payload, header) {
  const cleanUrl = `${constants.BASE_URL}/${url}`.replace(/\/\/+/g, '/').trim();
  try {
    return await axiosInstance.delete(cleanUrl, {
      headers: {
        Accept: header.Accept,
        'Content-Type': header.contenttype,
        eMedAuthorization: header.authorization,
      },
      data: payload,
    });
  } catch (error) {
    console.error('[ApiRequest] DELETE error:', error.response?.data || error.message);
    throw error;
  }
}
