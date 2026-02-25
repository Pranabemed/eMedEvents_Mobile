/**
 * TokenManager.js  — v2 (JWT-schedule based)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * WHY THIS EXISTS
 * ───────────────
 * The server issues access_token and refresh_token with the SAME expiry window
 * (e.g. 10 minutes). Once both expire there is no way to refresh silently.
 *
 * The reactive Axios interceptor (ApiRequest.js) handles the case where the
 * server REJECTS an API call due to an expired token. But if the user is idle
 * on a screen for 10+ minutes with no API calls, the interceptor never fires.
 * By the time they next tap, BOTH tokens are expired and refresh fails.
 *
 * SOLUTION — Proactive timer-based refresh
 * ────────────────────────────────────────
 * 1. On every new token (login, signup, or any refresh), decode the JWT to get
 *    its exact expiry time (exp).
 * 2. Schedule a setTimeout to fire REFRESH_BUFFER_MS before expiry.
 * 3. When the timer fires, call verifyRefreshToken while both tokens are still valid.
 * 4. Save the new tokens, then schedule the next timer automatically.
 *
 * This loop keeps tokens alive as long as the app is in the foreground,
 * regardless of whether the user is tapping or idle.
 *
 * APP BACKGROUND HANDLING
 * ───────────────────────
 * When the app is backgrounded, JS timers may freeze (especially iOS).
 * On AppState → 'active' we immediately check if the token valid window
 * has passed. If so, we attempt an emergency refresh. If that also fails
 * (both tokens truly expired), we clear the session and navigate to login.
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
// 60 seconds → fires at T+9min when token expires at T+10min.
// Even for 1-hour tokens this is harmless (fires at T+59min).
const REFRESH_BUFFER_MS = 60 * 1000;

// ─── State ─────────────────────────────────────────────────────────────────────
let _refreshTimerId = null;
let _isRefreshing = false;
let _appStateSubscription = null;

// ─────────────────────────────────────────────────────────────────────────────
// JWT decoder — pure JS, no external library required
//
// Extracts { exp, iat } from the JWT payload (second segment, base64url encoded).
// Works on Hermes (RN 0.64+) and JavaScriptCore.
// ─────────────────────────────────────────────────────────────────────────────
function decodeJWTPayload(token) {
    try {
        if (!token || typeof token !== 'string') return null;
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        // Base64URL → Base64 → String
        let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        // Pad to multiple of 4
        while (b64.length % 4 !== 0) b64 += '=';

        // Decode — `atob` is available in Hermes (RN ≥ 0.64)
        let decoded;
        if (typeof atob === 'function') {
            decoded = atob(b64);
        } else {
            // Fallback: manual base64 decode
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
// Core proactive refresh — uses plain axios (NOT axiosInstance) so it is
// COMPLETELY outside the Axios interceptor chain. No infinite-loop risk.
// ─────────────────────────────────────────────────────────────────────────────
async function performRefresh(reason) {
    if (_isRefreshing) {
        console.log('[TokenManager] Already refreshing — skipping:', reason);
        return false;
    }

    const refreshToken = await AsyncStorage.getItem(constants.REFRESH_TOKEN);
    if (!refreshToken) {
        console.warn('[TokenManager] No refresh_token stored — cannot refresh:', reason);
        return false;
    }

    // Quick sanity check: is the refresh_token itself already expired?
    const refreshExpMs = getTokenExpiryMs(refreshToken);
    if (refreshExpMs && Date.now() >= refreshExpMs) {
        console.warn('[TokenManager] ⚠️  refresh_token is expired — refresh will likely fail:', reason);
        // We still attempt it because the server is the source of truth
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

            // ── Persist ────────────────────────────────────────────────────────────
            await AsyncStorage.setItem(constants.TOKEN, newToken);
            await AsyncStorage.setItem(constants.REFRESH_TOKEN, newRefreshToken);

            // ── Push to Redux ───────────────────────────────────────────────────────
            try {
                const Store = require('../../Redux/Store').default;
                const { tokenSuccess, refreshTokenSuccess } = require('../../Redux/Reducers/AuthReducer');
                Store.dispatch(tokenSuccess(newToken));
                Store.dispatch(refreshTokenSuccess(res.data));
            } catch (_) { }

            console.log('[TokenManager] ✅ Proactive refresh succeeded:', reason);

            // ── Schedule the NEXT proactive refresh for the new token ──────────────
            _scheduleTimer(newToken);
            return true;
        } else {
            console.warn('[TokenManager] ❌ verifyRefreshToken rejected:', res?.data?.msg, '| reason:', reason);
            return false;
        }
    } catch (err) {
        console.warn('[TokenManager] ❌ Network error during refresh:', err?.message, '| reason:', reason);
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
        console.warn('[TokenManager] Cannot decode token expiry — no timer scheduled.');
        return;
    }

    const now = Date.now();
    const msUntilExpiry = expiryMs - now;
    const msUntilRefresh = msUntilExpiry - REFRESH_BUFFER_MS;

    if (msUntilRefresh <= 0) {
        // Token is already within the buffer window or expired — refresh immediately
        console.log(`[TokenManager] Token expires in ${Math.round(msUntilExpiry / 1000)}s — refreshing immediately.`);
        performRefresh('immediate-within-buffer');
    } else {
        const secUntilRefresh = Math.round(msUntilRefresh / 1000);
        console.log(`[TokenManager] ⏱️  Next proactive refresh in ${secUntilRefresh}s (token expires in ${Math.round(msUntilExpiry / 1000)}s).`);
        _refreshTimerId = setTimeout(() => {
            _refreshTimerId = null;
            performRefresh('timer-fired');
        }, msUntilRefresh);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// AppState handler — fires when app returns from background
// ─────────────────────────────────────────────────────────────────────────────
async function _onAppStateChange(nextState) {
    if (nextState !== 'active') return;

    try {
        const token = await AsyncStorage.getItem(constants.TOKEN);
        if (!token) return;

        const expiryMs = getTokenExpiryMs(token);
        if (!expiryMs) {
            // Can't decode — just try a refresh as a safety measure
            performRefresh('foreground-unknown-expiry');
            return;
        }

        const now = Date.now();

        if (now >= expiryMs) {
            // Token is already expired — attempt emergency refresh immediately
            console.log('[TokenManager] 🔴 Token EXPIRED on foreground — attempting emergency refresh…');
            const ok = await performRefresh('foreground-expired');
            if (!ok) {
                // Both tokens expired — session is unrecoverable — force re-login
                console.warn('[TokenManager] 🔴 Session expired — forcing logout and re-login.');
                _forceLogout();
            }
        } else if (now >= expiryMs - REFRESH_BUFFER_MS) {
            // Token is about to expire within buffer window — refresh now
            console.log('[TokenManager] 🟡 Token expiring soon on foreground — proactive refresh…');
            performRefresh('foreground-near-expiry');
        } else {
            // Token still healthy — just reschedule timer (OS may have cleared it)
            console.log(`[TokenManager] 🟢 Token healthy on foreground — ${Math.round((expiryMs - now) / 1000)}s remaining.`);
            _scheduleTimer(token);
        }
    } catch (e) {
        console.warn('[TokenManager] AppState handler error:', e?.message);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Force logout — clears tokens so the app redirect to login on next launch
// ─────────────────────────────────────────────────────────────────────────────
function _forceLogout() {
    try {
        AsyncStorage.multiRemove([constants.TOKEN, constants.REFRESH_TOKEN]);

        const Store = require('../../Redux/Store').default;
        const { tokenSuccess, logoutSuccess } = require('../../Redux/Reducers/AuthReducer');
        Store.dispatch(tokenSuccess(null));
        Store.dispatch(logoutSuccess('session-expired'));

        console.log('[TokenManager] 🔴 Session cleared. User will need to re-login.');
    } catch (e) {
        console.warn('[TokenManager] Force logout error:', e?.message);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Async startup logic — called from init() in the background.
// Reads AsyncStorage (async) and schedules the proactive timer.
// Runs after init() already returns the cleanup function to React.
// ─────────────────────────────────────────────────────────────────────────────
async function _initAsync() {
    try {
        const token = await AsyncStorage.getItem(constants.TOKEN);
        if (!token) {
            console.log('[TokenManager] No token on init — user not logged in.');
            return;
        }

        const expiryMs = getTokenExpiryMs(token);
        if (expiryMs && Date.now() >= expiryMs) {
            // Token already expired on cold start — attempt emergency refresh
            console.log('[TokenManager] Token already expired on cold start — emergency refresh…');
            const ok = await performRefresh('cold-start-expired');
            if (!ok) {
                console.warn('[TokenManager] Session unrecoverable on cold start — Splash will handle.');
                // Do NOT force logout here; let Splash/verifyToken handle navigation
            }
        } else {
            // Token still valid — schedule proactive timer
            _scheduleTimer(token);
        }
    } catch (e) {
        console.warn('[TokenManager] _initAsync error:', e?.message);
    }
}



// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

const TokenManager = {
    /**
     * Call ONCE from App.js on mount.
     * Returns a SYNCHRONOUS cleanup function (never a Promise).
     *
     * The async work (reading AsyncStorage, scheduling timer) runs in the
     * background and does NOT block the return of this function.
     */
    init() {
        // ── Register AppState listener immediately (synchronous) ────────────────
        if (_appStateSubscription) {
            _appStateSubscription.remove();
        }
        _appStateSubscription = AppState.addEventListener('change', _onAppStateChange);

        // ── Async startup work runs in background — does NOT block ──────────────
        _initAsync();

        // ── Return a plain cleanup function — NEVER a Promise ───────────────────
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
     * Force an immediate refresh — e.g. after a failed API call tells you
     * the token is expired.
     */
    forceRefresh() {
        return performRefresh('manual-force');
    },
};

export default TokenManager;
