/**
 * ApiRequest.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All HTTP helpers used by Redux-Saga.
 *
 * 🔄  AUTOMATIC TOKEN REFRESH (applies to EVERY API call globally)
 *
 *  The server signals token expiry as:
 *    HTTP 200  +  { success: false, msg: "Missing or Invalid Token" }
 *
 *  The Axios response interceptor catches this on EVERY request, calls
 *  `user/verifyRefreshToken`, replaces the token in AsyncStorage + Redux store,
 *  and transparently retries the original request — zero changes needed in any saga.
 *
 *  • NO automatic logout
 *  • NO user-visible disruption
 *  • Only ONE refresh runs at a time (queue prevents parallel refresh storms)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './constants';

// ─── Detect token expiry from response body ────────────────────────────────────
function isTokenExpiredResponse(response) {
  if (!response) return false;
  // Standard HTTP 401
  if (response.status === 401) return true;
  // Server always returns HTTP 200 + success:false + msg
  if (response.data?.success === false) {
    const msg = (response.data.msg || response.data.message || '').toLowerCase();
    return (
      msg === 'missing or invalid token' ||
      msg.includes('missing or invalid token') ||
      msg.includes('invalid token') ||
      msg.includes('missing token') ||
      msg.includes('token expired') ||
      msg.includes('token is expired') ||
      msg.includes('unauthorized') ||
      msg.includes('unauthenticated')
    );
  }
  return false;
}

// ─── Refresh token queue (prevents multiple parallel refreshes) ────────────────
let isRefreshing = false;
let pendingQueue = []; // [{ resolve, reject }]

function processQueue(error, token = null) {
  pendingQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
  pendingQueue = [];
}

async function refreshAccessToken() {
  const refreshToken = await AsyncStorage.getItem(constants.REFRESH_TOKEN);
  if (!refreshToken) {
    throw new Error('No refresh_token stored');
  }

  console.log('[ApiRequest] 🔄 Refreshing token via user/verifyRefreshToken…');

  const res = await axios.post(
    `${constants.BASE_URL}/user/verifyRefreshToken`,
    { refresh_token: refreshToken },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  if (res.data?.success && res.data?.token) {
    const newToken = res.data.token;
    const newRefresh = res.data.refresh_token || refreshToken;

    // ── Persist ──────────────────────────────────────────────────────────────
    await AsyncStorage.setItem(constants.TOKEN, newToken);
    await AsyncStorage.setItem(constants.REFRESH_TOKEN, newRefresh);

    // ── Update Redux store silently ───────────────────────────────────────────
    try {
      // Import lazily to avoid circular dependency
      const Store = require('../../Redux/Store').default;
      const { tokenSuccess, refreshTokenSuccess } = require('../../Redux/Reducers/AuthReducer');
      Store.dispatch(tokenSuccess(newToken));
      Store.dispatch(refreshTokenSuccess(res.data));
    } catch (storeErr) {
      console.warn('[ApiRequest] Could not update Redux store:', storeErr?.message);
    }

    console.log('[ApiRequest] ✅ Token refreshed successfully.');
    return newToken;
  }

  throw new Error(res.data?.msg || 'Token refresh failed');
}

// ─── Axios instance with interceptor ─────────────────────────────────────────
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  async (response) => {
    // Check if this response signals token expiry
    if (!isTokenExpiredResponse(response)) {
      return response; // Normal path — pass through untouched
    }

    const originalRequest = response.config;

    // Prevent infinite retry loop
    if (originalRequest._retried) {
      console.warn('[ApiRequest] ⚠️  Token still invalid after refresh — returning original response.');
      return response;
    }
    originalRequest._retried = true;

    if (isRefreshing) {
      // Another refresh is already in progress — queue this retry
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      })
        .then(newToken => {
          originalRequest.headers['eMedAuthorization'] = newToken;
          return axiosInstance(originalRequest);
        })
        .catch(err => {
          console.error('[ApiRequest] Queued retry failed:', err?.message);
          return response; // Return original expired response — no user disruption
        });
    }

    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);

      // Retry original request with new token
      originalRequest.headers['eMedAuthorization'] = newToken;
      console.log('[ApiRequest] 🔁 Retrying original request with fresh token…');
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      console.error('[ApiRequest] ❌ Token refresh failed:', refreshError?.message);
      // Return the original expired response — NO logout, NO alert
      return response;
    } finally {
      isRefreshing = false;
    }
  },
  (error) => {
    // Network error / 5xx etc. — pass through
    return Promise.reject(error);
  },
);

// ─── Public API functions (same signature as before) ─────────────────────────

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
  console.log('Full URL:', cleanUrl, `${constants.BASE_URL}/${url}`);

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
    console.error('Error with DELETE request:', error.response?.data || error.message);
    throw error;
  }
}
