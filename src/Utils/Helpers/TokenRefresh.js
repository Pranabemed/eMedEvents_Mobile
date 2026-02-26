/**
 * TokenRefresh.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised refresh-token helper for Redux-Saga.
 *
 * GOLDEN RULE — NO FORCED LOGOUT
 * ────────────────────────────────
 * If the refresh call fails for any reason:
 *   → We return null from doRefreshToken.
 *   → callWithTokenRefresh returns the ORIGINAL response to the saga.
 *   → The saga shows a normal error message or silently does nothing.
 *   → The user STAYS on their current screen. No logout. Ever.
 *
 * Only the user pressing the “Logout” button dispatches logoutRequest.
 *
 * ⚠️  Server behaviour (token expired):
 *      HTTP 200  +  { success: false, msg: "Missing or Invalid Token" }
 *      (NOT a 401 — detection is purely body-based)
 *
 * Usage inside any saga:
 *
 *   import { callWithTokenRefresh } from '../../Utils/Helpers/TokenRefresh';
 *
 *   export function* mySaga(action) {
 *     const { response, error } = yield call(
 *       callWithTokenRefresh, postApi, 'some/endpoint', action.payload
 *     );
 *     if (error || !response?.data?.success) {
 *       yield put(myFailure(response?.data || error));
 *       return;
 *     }
 *     yield put(mySuccess(response.data));
 *   }
 *
 * Flow:
 *  1. Attach current token → make original call.
 *  2. Detect expiry from response body.
 *  3. Call `user/verifyRefreshToken` with stored refresh_token (plain axios).
 *  4. On success: save new token → Redux + AsyncStorage → retry original call.
 *  5. On failure: return original response — saga shows normal error. No logout.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { call, put, select } from 'redux-saga/effects';
import {
    tokenSuccess,
    refreshTokenSuccess,
} from '../../Redux/Reducers/AuthReducer';
import constants from './constants';
import TokenManager from './TokenManager';

// ─── Selector ────────────────────────────────────────────────────────────────

const getAuthState = state => state.AuthReducer;

// ─── Header builder ──────────────────────────────────────────────────────────

function buildHeader(token, extra = {}) {
    return {
        Accept: 'application/json',
        contenttype: 'application/json',
        authorization: token || '',
        ...extra,
    };
}

// ─── Expiry detector ─────────────────────────────────────────────────────────
/**
 * Returns true when the server signals the token is missing / expired.
 *
 * The server always returns HTTP 200 with:
 *   { success: false, msg: "Missing or Invalid Token" }
 *
 * We also guard against the standard HTTP 401 just in case.
 */
function isTokenExpired(response) {
    if (!response) return false;

    // Standard HTTP expiry
    if (response.status === 401) return true;

    // Server-side body-based expiry (HTTP 200 but invalid token)
    if (response?.data?.success === false) {
        const msg = (response.data.msg || response.data.message || '').toLowerCase();
        return (
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

// ─── Core refresh (exported so AuthSaga can reuse it) ────────────────────────

/**
 * Calls `user/verifyRefreshToken` via PLAIN axios (NOT postApi / axiosInstance).
 *
 * ⚠️  Using postApi here would cause an interceptor loop:
 *     postApi → interceptor detects expired → calls doRefreshToken → postApi again...
 *
 * ✅  On success: saves tokens, updates Redux, returns new token string.
 * ✅  On failure: returns null. User stays logged in. No logoutSuccess dispatched.
 */
export function* doRefreshToken() {
    try {
        console.log('[TokenRefresh] 🔄 Redux Saga detected expired token. Delegating to TokenManager shared lock...');
        // Delegate directly to the TokenManager Promise lock. BOTH iOS and Android MUST share
        // this single lock, otherwise Redux Sagas and Axios Interceptors will fire duplicate
        // refresh token requests when the app wakes up.
        const lockedToken = yield call(() => TokenManager.forceRefresh());
        return lockedToken || null;
    } catch (err) {
        console.warn('[TokenRefresh] ⚠️  Shared TokenManager refresh failed via saga (non-fatal):', err?.message || err);
        return null;
    }
}

// ─── Main helper — used in every saga ────────────────────────────────────────

/**
 * callWithTokenRefresh
 * ─────────────────────────────────────────────────────────────────────────────
 * Transparent drop-in for:  yield call(postApi | getApi | deleteApi, url, …)
 *
 * Detects the server's token-expiry response (HTTP 200 + success:false +
 * "Missing or Invalid Token"), silently refreshes the token, and retries the
 * original call — all invisible to the saga that calls this helper.
 *
 * @param {Function} apiFn         postApi | getApi | deleteApi
 * @param {string}   url           Endpoint path (e.g. 'Conference/conferenceDetailPage')
 * @param {object}   payload       Request body (pass null for GET requests)
 * @param {object}   extraHeaders  Additional headers (e.g. { IPADDRESS: '...' })
 * @returns {{ response, error }}  Always resolves — never throws
 */
export function* callWithTokenRefresh(apiFn, url, payload, extraHeaders = {}) {
    try {
        // ── Step 1: get the current token ────────────────────────────────────────
        const authState = yield select(getAuthState);
        let token =
            authState?.token ||
            (yield call(AsyncStorage.getItem, constants.TOKEN));

        // ── Step 2: first attempt ────────────────────────────────────────────────
        let response = yield call(apiFn, url, payload, buildHeader(token, extraHeaders));

        console.log(`[TokenRefresh] 📡 ${url} → success:${response?.data?.success} msg:"${response?.data?.msg || ''}"`);

        // ── Step 3: check if token expired ───────────────────────────────────────
        if (isTokenExpired(response)) {
            console.log('[TokenRefresh] 🔑 Token expired detected — refreshing silently…');

            const newToken = yield call(doRefreshToken);

            if (newToken) {
                // ── Step 4: retry with new token ─────────────────────────────────────
                console.log('[TokenRefresh] 🔁 Retrying original request with fresh token…');
                response = yield call(apiFn, url, payload, buildHeader(newToken, extraHeaders));
                console.log(`[TokenRefresh] 🔁 Retry result → success:${response?.data?.success}`);
            } else {
                // Refresh failed but we do NOT force logout.
                // Return the original expired response — the calling saga handles it.
                console.warn('[TokenRefresh] ⚠️  Refresh failed – returning original response without logout.');
            }
        }

        return { response, error: null };
    } catch (err) {
        console.error('[TokenRefresh] ❌ Unexpected error in callWithTokenRefresh:', err?.message || err);
        return { response: null, error: err };
    }
}
