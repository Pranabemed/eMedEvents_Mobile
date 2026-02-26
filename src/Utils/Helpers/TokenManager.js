/**
 * TokenManager.js  — v3 (SAFE — never force-logout)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * WHY THIS EXISTS
 * ───────────────
 * The server issues access_token and refresh_token. If the user is idle on a
 * screen for 10+ minutes with no API calls, the interceptor never fires.
 * This module proactively refreshes the token before it expires so the user
 * is NEVER kicked out while the app is open.
 *
 * GOLDEN RULE — NO FORCED LOGOUT
 * ────────────────────────────────
 * This module NEVER logs the user out. It NEVER clears AsyncStorage. It NEVER
 * dispatches logoutSuccess. The ONLY thing that may log a user out is when the
 * user explicitly taps the "Logout" button (logoutSaga).
 *
 * If a proactive refresh fails (network error, server down, token expired):
 *   → We silently log the failure and do NOTHING.
 *   → The user stays on whichever screen they are on.
 *   → The next API call from the Axios interceptor (ApiRequest.js) will
 *     transparently retry the refresh at that point.
 *
 * PROACTIVE TIMER STRATEGY
 * ────────────────────────
 * 1. On every new token, decode the JWT to get its exact expiry time (exp).
 * 2. Schedule a setTimeout to fire REFRESH_BUFFER_MS before expiry.
 * 3. When the timer fires, silently call verifyRefreshToken.
 * 4. On success: save new tokens + schedule next timer.
 * 5. On failure: do nothing. User stays logged in.
 *
 * APP BACKGROUND HANDLING
 * ───────────────────────
 * On AppState → 'active':
 *   • If token is still valid  → reschedule timer (OS may have killed it).
 *   • If token is near expiry  → attempt proactive refresh silently.
 *   • If token is expired      → attempt proactive refresh silently.
 *                                If refresh fails → DO NOTHING. User stays in.
 *                                The next API call interceptor will handle it.
 *
 * USAGE — call once from App.js:
 *
 *   import TokenManager from './src/Utils/Helpers/TokenManager';
 *
 *   useEffect(() => {
 *     const cleanup = TokenManager.init();
 *     return cleanup;
 *   }, []);
 *
 * When a new token arrives anywhere (from any saga/interceptor):
 *
 *   TokenManager.onNewToken(newTokenString);
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import constants from './constants';

// ─── How many ms before expiry we proactively refresh ─────────────────────────
// 90 seconds → fires at T+8m30s when token expires at T+10min.
// This gives us a comfortable window to complete the refresh call.
const REFRESH_BUFFER_MS = 90 * 1000;

// ─── Minimum ms before we bother scheduling a timer ───────────────────────────
// If the token has less than 5 seconds left, refresh immediately instead.
const MIN_SCHEDULE_MS = 5 * 1000;

// ─── State ─────────────────────────────────────────────────────────────────────
let _refreshTimerId = null;
let _isRefreshing = false;
let _appStateSubscription = null;

// ─────────────────────────────────────────────────────────────────────────────
// JWT decoder — pure JS, no external library required
// ─────────────────────────────────────────────────────────────────────────────
function decodeJWTPayload(token) {
    try {
        if (!token || typeof token !== 'string') return null;
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4 !== 0) b64 += '=';

        let decoded;
        if (typeof atob === 'function') {
            decoded = atob(b64);
        } else {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            let str = '';
            let i = 0;
            while (i < b64.length) {
                const e1 = chars.indexOf(b64[i++]);
                const e2 = chars.indexOf(b64[i++]);
                const e3 = chars.indexOf(b64[i++]);
                const e4 = chars.indexOf(b64[i++]);
                str += String.fromCharCode(
                    (e1 << 2) | (e2 >> 4),
                    ((e2 & 15) << 4) | (e3 >> 2),
                    ((e3 & 3) << 6) | e4,
                );
            }
            decoded = str;
        }

        return JSON.parse(decoded);
    } catch (e) {
        console.warn('[TokenManager] JWT decode failed:', e?.message);
        return null;
    }
}

// Returns expiry timestamp in ms, or null if undecodable
function getTokenExpiryMs(token) {
    const payload = decodeJWTPayload(token);
    if (!payload?.exp) return null;
    return payload.exp * 1000; // JWT exp is in seconds
}

// ─────────────────────────────────────────────────────────────────────────────
// Core proactive refresh
//
// ⚠️  Uses plain axios (NOT axiosInstance) so it is COMPLETELY outside the
//     Axios interceptor chain. No infinite-loop risk.
//
// ✅  NEVER throws. NEVER forces logout. Returns true/false only.
// ─────────────────────────────────────────────────────────────────────────────
async function performRefresh(reason) {
    if (_isRefreshing) {
        console.log('[TokenManager] Already refreshing — skipping:', reason);
        return false;
    }

    const refreshToken = await AsyncStorage.getItem(constants.REFRESH_TOKEN);
    if (!refreshToken) {
        // No refresh token stored. This is a guest/not-logged-in state.
        // Do nothing — this is perfectly normal.
        console.log('[TokenManager] No refresh_token — user not logged in, skipping:', reason);
        return false;
    }

    _isRefreshing = true;
    console.log(`[TokenManager] 🔄 Proactive refresh (${reason})…`);

    try {
        const res = await axios.post(
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

        if (res.data?.success && res.data?.token) {
            const newToken = res.data.token;
            const newRefreshToken = res.data.refresh_token || refreshToken;

            // ── Persist ──────────────────────────────────────────────────────────
            await AsyncStorage.setItem(constants.TOKEN, newToken);
            await AsyncStorage.setItem(constants.REFRESH_TOKEN, newRefreshToken);

            // ── Push to Redux ─────────────────────────────────────────────────────
            try {
                const Store = require('../../Redux/Store').default;
                const { tokenSuccess, refreshTokenSuccess } = require('../../Redux/Reducers/AuthReducer');
                Store.dispatch(tokenSuccess(newToken));
                Store.dispatch(refreshTokenSuccess(res.data));
            } catch (_) { }

            console.log('[TokenManager] ✅ Proactive refresh succeeded:', reason);

            // ── Schedule the NEXT proactive refresh for the new token ─────────────
            _scheduleTimer(newToken);
            return true;

        } else {
            // ✅ IMPORTANT: Server rejected the refresh token (it may be expired).
            // We do NOT log the user out. The user will simply get a fresh
            // token error on their NEXT API call, and the Axios interceptor
            // will handle it gracefully at that point.
            console.warn(
                '[TokenManager] ⚠️  verifyRefreshToken rejected:',
                res?.data?.msg,
                '| Reason:', reason,
                '| User remains logged in — will retry on next API call.',
            );
            return false;
        }
    } catch (err) {
        // ✅ IMPORTANT: Network failure (offline, timeout, server down).
        // We do NOT log the user out. The user is still authenticated from
        // their last successful session. When they come back online and make
        // an API call, the Axios interceptor will handle the refresh then.
        console.warn(
            '[TokenManager] ⚠️  Network error during proactive refresh:',
            err?.message,
            '| Reason:', reason,
            '| User remains logged in.',
        );
        return false;
    } finally {
        _isRefreshing = false;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Timer scheduler — reads the token, decodes exp, sets a setTimeout to fire
// REFRESH_BUFFER_MS before expiry.
// ─────────────────────────────────────────────────────────────────────────────
function _scheduleTimer(token) {
    // Clear any existing timer first
    if (_refreshTimerId !== null) {
        clearTimeout(_refreshTimerId);
        _refreshTimerId = null;
    }

    if (!token) return;

    const expiryMs = getTokenExpiryMs(token);
    if (!expiryMs) {
        // Non-JWT token or opaque token — can't decode expiry.
        // Don't schedule anything; the interceptor handles reactive refresh.
        console.warn('[TokenManager] Cannot decode token expiry — no proactive timer scheduled.');
        return;
    }

    const now = Date.now();
    const msUntilExpiry = expiryMs - now;
    const msUntilRefresh = msUntilExpiry - REFRESH_BUFFER_MS;

    if (msUntilRefresh <= MIN_SCHEDULE_MS) {
        // Token is already within the buffer window or expired.
        // Attempt immediate refresh — but if it fails, user stays logged in.
        console.log(`[TokenManager] Token expires in ${Math.round(msUntilExpiry / 1000)}s — refreshing immediately.`);
        performRefresh('immediate-near-expiry');
    } else {
        const secUntilRefresh = Math.round(msUntilRefresh / 1000);
        console.log(
            `[TokenManager] ⏱️  Next proactive refresh in ${secUntilRefresh}s` +
            ` (token expires in ${Math.round(msUntilExpiry / 1000)}s).`
        );
        _refreshTimerId = setTimeout(() => {
            _refreshTimerId = null;
            performRefresh('timer-fired');
        }, msUntilRefresh);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// AppState handler — fires when app returns from background / becomes active
//
// KEY PRINCIPLE: We always attempt a refresh if the token is expired or near
// expiry. But if the refresh fails for any reason, we do NOTHING. The user
// stays on their current screen. Logout only happens via explicit user action.
// ─────────────────────────────────────────────────────────────────────────────
async function _onAppStateChange(nextState) {
    if (nextState !== 'active') return;

    try {
        const token = await AsyncStorage.getItem(constants.TOKEN);
        if (!token) {
            // No token = user is not logged in. Nothing to do.
            return;
        }

        const expiryMs = getTokenExpiryMs(token);
        if (!expiryMs) {
            // Non-decodable token — attempt a proactive refresh as a safety measure.
            // If it fails, user stays where they are.
            console.log('[TokenManager] 🟡 Foreground: unknown token expiry — attempting proactive refresh…');
            performRefresh('foreground-unknown-expiry');
            return;
        }

        const now = Date.now();

        if (now >= expiryMs) {
            // Token is already expired. Attempt refresh silently.
            // ✅ If refresh FAILS → do nothing. User stays logged in.
            //    The next API call will trigger the Axios interceptor refresh.
            console.log(
                `[TokenManager] 🔴 Foreground: token expired ${Math.round((now - expiryMs) / 1000)}s ago — attempting silent refresh…`
            );
            performRefresh('foreground-expired');
            // ⛔ NO _forceLogout() call here. EVER.

        } else if (now >= expiryMs - REFRESH_BUFFER_MS) {
            // Token is about to expire within buffer window — refresh proactively.
            console.log(
                `[TokenManager] 🟡 Foreground: token expires in ${Math.round((expiryMs - now) / 1000)}s — proactive refresh…`
            );
            performRefresh('foreground-near-expiry');

        } else {
            // Token is healthy — just reschedule timer (OS may have cleared it while backgrounded).
            console.log(
                `[TokenManager] 🟢 Foreground: token healthy — ${Math.round((expiryMs - now) / 1000)}s remaining. Rescheduling timer.`
            );
            _scheduleTimer(token);
        }
    } catch (e) {
        // Error reading AsyncStorage or decoding — do nothing. User stays logged in.
        console.warn('[TokenManager] AppState handler error (non-fatal):', e?.message);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Async startup logic — called from init() in the background.
// Reads AsyncStorage (async) and schedules the proactive timer.
// ─────────────────────────────────────────────────────────────────────────────
async function _initAsync() {
    try {
        const token = await AsyncStorage.getItem(constants.TOKEN);
        if (!token) {
            console.log('[TokenManager] No token on cold start — user not logged in.');
            return;
        }

        const expiryMs = getTokenExpiryMs(token);

        if (!expiryMs) {
            // Non-decodable token — try a refresh just to be safe.
            console.log('[TokenManager] Cold start: non-JWT token — attempting proactive refresh…');
            performRefresh('cold-start-non-jwt');
            return;
        }

        if (Date.now() >= expiryMs) {
            // Token already expired on cold start — attempt emergency refresh silently.
            // ✅ If this fails, do nothing. Splash.js will handle navigation normally.
            //    The verifyToken call in Splash will fail and the Axios interceptor
            //    will attempt a refresh at that point.
            console.log('[TokenManager] Cold start: token expired — attempting silent refresh…');
            performRefresh('cold-start-expired');
            // ⛔ NO _forceLogout() call if this fails.

        } else {
            // Token still valid — schedule proactive timer.
            console.log('[TokenManager] Cold start: token valid — scheduling proactive refresh timer.');
            _scheduleTimer(token);
        }
    } catch (e) {
        console.warn('[TokenManager] _initAsync error (non-fatal):', e?.message);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

const TokenManager = {
    /**
     * Call ONCE from App.js on mount.
     * Returns a SYNCHRONOUS cleanup function (never a Promise).
     */
    init() {
        // ── Register AppState listener immediately (synchronous) ──────────────────
        if (_appStateSubscription) {
            _appStateSubscription.remove();
        }
        _appStateSubscription = AppState.addEventListener('change', _onAppStateChange);

        // ── Async startup work runs in background — does NOT block ────────────────
        _initAsync();

        // ── Return a plain cleanup function — NEVER a Promise ─────────────────────
        return () => {
            if (_refreshTimerId !== null) {
                clearTimeout(_refreshTimerId);
                _refreshTimerId = null;
            }
            if (_appStateSubscription) {
                _appStateSubscription.remove();
                _appStateSubscription = null;
            }
        };
    },

    /**
     * Call this whenever a new token is received (login, signup, any API response).
     * Resets and reschedules the proactive refresh timer.
     *
     * The TokenAutoSave interceptor in ApiRequest.js calls this automatically.
     * You can also call it manually after any saga that receives a new token.
     *
     * @param {string} newToken — the fresh JWT access token
     */
    onNewToken(newToken) {
        if (!newToken) return;
        _scheduleTimer(newToken);
    },

    /**
     * Attempt an immediate proactive refresh.
     * Never throws. Never forces logout.
     */
    forceRefresh() {
        return performRefresh('manual-force');
    },
};

export default TokenManager;
