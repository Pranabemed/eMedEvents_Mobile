/**
 * TokenRefresh.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised refresh-token helper for Redux-Saga.
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
 *  3. Call `user/verifyRefreshToken` with stored refresh_token.
 *  4. Save new token → Redux + AsyncStorage.
 *  5. Retry original call once with new token.
 *  6. Return { response } — caller never knows a refresh happened.
 *
 *  NO forced logout. Seamless for the user.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { call, put, select } from 'redux-saga/effects';
import {
    tokenSuccess,
    refreshTokenSuccess,
    refreshTokenFailure,
} from '../../Redux/Reducers/AuthReducer';
import { postApi } from './ApiRequest';
import constants from './constants';

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
 * Calls `user/verifyRefreshToken`.
 * Returns the new token string on success, or null on failure.
 * Does NOT log the user out on failure — caller decides what to do.
 */
export function* doRefreshToken() {
    try {
        const refreshToken = yield call(AsyncStorage.getItem, constants.REFRESH_TOKEN);

        if (!refreshToken) {
            console.warn('[TokenRefresh] No refresh_token stored – skipping refresh.');
            yield put(refreshTokenFailure({ message: 'No refresh_token stored' }));
            return null;
        }

        console.log('[TokenRefresh] 🔄 Access token expired – refreshing via verifyRefreshToken…');

        // No auth header needed for the refresh call itself
        const header = buildHeader(null);
        const refreshResponse = yield call(
            postApi,
            'user/verifyRefreshToken',
            { refresh_token: refreshToken },
            header,
        );

        if (refreshResponse?.data?.success && refreshResponse?.data?.token) {
            const newToken = refreshResponse.data.token;
            // Some servers rotate the refresh token too; fall back to existing one
            const newRefreshToken = refreshResponse.data.refresh_token || refreshToken;

            // ── Persist ──────────────────────────────────────────────────────────
            yield call(AsyncStorage.setItem, constants.TOKEN, newToken);
            yield call(AsyncStorage.setItem, constants.REFRESH_TOKEN, newRefreshToken);

            // ── Update Redux (token field in AuthReducer) ─────────────────────────
            yield put(tokenSuccess(newToken));
            yield put(refreshTokenSuccess(refreshResponse.data));

            console.log('[TokenRefresh] ✅ Token refreshed successfully.');
            return newToken;
        }

        // Refresh endpoint itself returned failure
        console.warn('[TokenRefresh] ❌ verifyRefreshToken responded with failure:', refreshResponse?.data);
        yield put(refreshTokenFailure(refreshResponse?.data));
        return null;

    } catch (err) {
        console.error('[TokenRefresh] ❌ Network/runtime error during refresh:', err?.message || err);
        yield put(refreshTokenFailure({ message: err?.message || 'Refresh error' }));
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
