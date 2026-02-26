/**
 * TokenManager.js  — v4 (SINGLE REFRESH LOCK — shared promise pattern)
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
 * SINGLE REFRESH LOCK (Key Design)
 * ─────────────────────────────────
 * There is ONE shared _refreshPromise. If a refresh is already in progress
 * from ANY source (AppState handler, timer, ApiRequest interceptor), every
 * other caller JOINS the same promise instead of making a second HTTP call.
 *
 * ⚠️  Refresh tokens are SINGLE-USE on the server. Two concurrent
 *     verifyRefreshToken calls with the same refresh_token means the server
 *     accepts the first and REJECTS the second → "token expired" shown to user.
 *     This shared-promise pattern prevents that race condition entirely.
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
 * On AppState → background/inactive:  clear any pending timer.
 * On AppState → 'active':
 *   • If token is still valid  → reschedule timer (OS may have killed it).
 *   • If token is near expiry  → attempt proactive refresh immediately.
 *   • If token is expired      → attempt proactive refresh immediately.
 *                                If refresh fails → DO NOTHING. User stays in.
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
 * ApiRequest.js delegates its refresh to TokenManager.forceRefresh() so ALL
 * refresh attempts share the same lock and single HTTP call.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import constants from './constants';
import getUserAgentJSON from './UserAgent';

// ─── How many ms before expiry we proactively refresh ─────────────────────────
// 90 seconds → fires at T+8m30s when token expires at T+10min.
const REFRESH_BUFFER_MS = 90 * 1000;

// ─── Minimum ms before we bother scheduling a timer ───────────────────────────
const MIN_SCHEDULE_MS = 5 * 1000;

// ─── State ─────────────────────────────────────────────────────────────────────
let _refreshTimerId = null;
let _appStateSubscription = null;

// ─── Single shared refresh promise ────────────────────────────────────────────
// KEY: All callers (timer, AppState handler, ApiRequest interceptor) share this
// ONE promise. When a refresh is already running, new callers join it instead
// of making a duplicate HTTP call. Refresh tokens are single-use on the server.
let _refreshPromise = null;

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
            // Manual Base64 decode for React Native Release builds
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            let str = '';
            let i = 0;
            while (i < b64.length) {
                const e1 = chars.indexOf(b64[i++]);
                const e2 = chars.indexOf(b64[i++]);
                const e3 = chars.indexOf(b64[i++]);
                const e4 = chars.indexOf(b64[i++]);

                const b1 = (e1 << 2) | (e2 >> 4);
                const b2 = ((e2 & 15) << 4) | (e3 >> 2);
                const b3 = ((e3 & 3) << 6) | e4;

                str += String.fromCharCode(b1);
                if (e3 !== 64) str += String.fromCharCode(b2);
                if (e4 !== 64) str += String.fromCharCode(b3);
            }
            decoded = str;
        }

        return decoded; // Return RAW byte string
    } catch (e) {
        console.warn('[TokenManager] JWT extract failed:', e?.message);
        return null;
    }
}

// Returns expiry timestamp in ms, or null if undecodable
function getTokenExpiryMs(token) {
    const rawPayload = decodeJWTPayload(token);
    if (!rawPayload) return null;

    try {
        // Try elegant JSON decode first (only works perfectly on ASCII payloads)
        const parsed = JSON.parse(rawPayload);
        if (parsed?.exp) return parsed.exp * 1000;
    } catch (_) {
        // UTF-8 names inside JWTs break pure JS JSON.parse on Native Release builds.
        // Fallback: strictly Regex out the 'exp' integer since it's purely ASCII.
    }

    // RegEx fallback for the exact `"exp": 1234567` block
    const match = /"exp"\s*:\s*(\d+)/.exec(rawPayload);
    if (match && match[1]) {
        return parseInt(match[1], 10) * 1000;
    }

    return null; // JWT exp is in seconds
}

// ─────────────────────────────────────────────────────────────────────────────
// _doActualRefresh — the ONLY function that calls verifyRefreshToken HTTP API.
//
// ⚠️  Uses plain axios (NOT axiosInstance) so it is COMPLETELY outside the
//     Axios interceptor chain. No infinite-loop risk.
//
// ✅  Returns new token string on success.
// ✅  Returns null on failure. NEVER throws. NEVER forces logout.
// ─────────────────────────────────────────────────────────────────────────────
async function _doActualRefresh(reason) {
    const refreshToken = await AsyncStorage.getItem(constants.REFRESH_TOKEN);
    if (!refreshToken) {
        console.log('[TokenManager] No refresh_token — user not logged in, skipping:', reason);
        return null;
    }

    console.log(`[TokenManager] 🔄 Calling verifyRefreshToken (${reason})…`);

    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
        attempt++;
        try {
            const res = await axios.post(
                `${constants.BASE_URL}/user/verifyRefreshToken`,
                { refresh_token: refreshToken },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        userAgent: getUserAgentJSON(),
                    },
                    timeout: 15000,
                },
            );

            if (res.data?.success && res.data?.token) {
                const newToken = res.data.token;
                const newRefreshToken = res.data.refresh_token || refreshToken;

                // ── Persist ──────────────────────────────────────────────────────
                await AsyncStorage.setItem(constants.TOKEN, newToken);
                await AsyncStorage.setItem(constants.REFRESH_TOKEN, newRefreshToken);

                // ── Push to Redux ─────────────────────────────────────────────────
                try {
                    const Store = require('../../Redux/Store').default;
                    const { tokenSuccess, refreshTokenSuccess } = require('../../Redux/Reducers/AuthReducer');
                    Store.dispatch(tokenSuccess(newToken));
                    Store.dispatch(refreshTokenSuccess(res.data));
                } catch (_) { }

                console.log('[TokenManager] ✅ Token refreshed successfully:', reason);

                // ── Schedule NEXT proactive refresh for the new token ─────────────
                _scheduleTimer(newToken);
                return newToken;

            } else {
                // If it's an explicit rejection (e.g. 401 or success:false) from the server,
                // do NOT retry. The server has legitimately rejected the token.
                console.warn(
                    '[TokenManager] ⚠️  verifyRefreshToken rejected by server:',
                    res?.data?.msg,
                    '| Reason:', reason,
                    '| User remains logged in.',
                );
                return null;
            }
        } catch (err) {
            // It is a true Network/OS Error (or 5xx timeout).
            // This happens instantly on iOS Native when waking from deep sleep
            // because the OS network stack is temporarily unavailable for ~1 second.
            if (attempt < maxAttempts) {
                console.warn(
                    `[TokenManager] ⚠️ Network error on attempt ${attempt}. Retrying in 1.5s...`
                );
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else {
                console.warn(
                    '[TokenManager] ⚠️  Network error during refresh (final):',
                    err?.message,
                    '| Reason:', reason,
                    '| User remains logged in.',
                );
                return null;
            }
        }
    }
    return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// performRefresh — shared-promise deduplication wrapper
//
// If a refresh is already in progress from ANY caller (AppState, timer,
// ApiRequest interceptor), new callers JOIN the existing promise instead of
// making a duplicate HTTP call.
//
// Refresh tokens are single-use — two concurrent calls = server rejects the
// second one with "token expired". This function prevents that entirely.
// ─────────────────────────────────────────────────────────────────────────────
function performRefresh(reason) {
    if (_refreshPromise) {
        console.log('[TokenManager] 🔗 Joining existing refresh in progress:', reason);
        return _refreshPromise;
    }

    _refreshPromise = _doActualRefresh(reason).finally(() => {
        _refreshPromise = null;
    });

    return _refreshPromise;
}

// ─────────────────────────────────────────────────────────────────────────────
// Timer scheduler — reads the token, decodes exp, sets a setTimeout to fire
// REFRESH_BUFFER_MS before expiry.
// ─────────────────────────────────────────────────────────────────────────────
function _scheduleTimer(token) {
    if (_refreshTimerId !== null) {
        clearTimeout(_refreshTimerId);
        _refreshTimerId = null;
    }

    if (!token) return;

    const expiryMs = getTokenExpiryMs(token);
    if (!expiryMs) {
        console.warn('[TokenManager] Cannot decode token expiry — no proactive timer scheduled.');
        return;
    }

    const now = Date.now();
    const msUntilExpiry = expiryMs - now;
    const msUntilRefresh = msUntilExpiry - REFRESH_BUFFER_MS;

    if (msUntilRefresh <= MIN_SCHEDULE_MS) {
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
// ─────────────────────────────────────────────────────────────────────────────
async function _onAppStateChange(nextState) {
    // When app goes to background ('inactive' or 'background')
    if (nextState !== 'active') {
        if (_refreshTimerId !== null) {
            clearTimeout(_refreshTimerId);
            _refreshTimerId = null;
        }
        return;
    }

    // When app returns to 'active'
    // Give JS a tiny window to completely unfreeze on Android Release builds
    // before we recalculate the exact token timestamp delta.
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
        const token = await AsyncStorage.getItem(constants.TOKEN);
        if (!token) return; // Guest / not logged in

        const expiryMs = getTokenExpiryMs(token);
        if (!expiryMs) {
            console.log('[TokenManager] 🟡 Foreground: unknown token expiry — attempting proactive refresh…');
            performRefresh('foreground-unknown-expiry');
            return;
        }

        const now = Date.now();

        if (now >= expiryMs) {
            // Token already expired — refresh immediately.
            // performRefresh uses shared promise so won't duplicate with ApiRequest.
            console.log(
                `[TokenManager] 🔴 Foreground: token expired ${Math.round((now - expiryMs) / 1000)}s ago — refreshing now…`
            );
            performRefresh('foreground-expired');

        } else if (now >= expiryMs - REFRESH_BUFFER_MS) {
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
        console.warn('[TokenManager] AppState handler error (non-fatal):', e?.message);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Async startup logic — called from init() in the background.
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
            console.log('[TokenManager] Cold start: non-JWT token — attempting proactive refresh…');
            performRefresh('cold-start-non-jwt');
            return;
        }

        if (Date.now() >= expiryMs) {
            console.log('[TokenManager] Cold start: token expired — attempting silent refresh…');
            performRefresh('cold-start-expired');
        } else {
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
        if (_appStateSubscription) {
            _appStateSubscription.remove();
        }
        _appStateSubscription = AppState.addEventListener('change', _onAppStateChange);
        _initAsync();

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
     * @param {string} newToken — the fresh JWT access token
     */
    onNewToken(newToken) {
        if (!newToken) return;
        _scheduleTimer(newToken);
    },

    /**
     * Attempt an immediate token refresh.
     *
     * KEY: Uses the shared _refreshPromise deduplication — if a refresh is
     * already running from any source, this joins it rather than starting a
     * second HTTP call. Safe to call from ApiRequest.js interceptor.
     *
     * @returns {Promise<string|null>}  new token string on success, null on failure.
     *                                  Never throws. Never forces logout.
     */
    forceRefresh() {
        return performRefresh('force-refresh');
    },
};

export default TokenManager;
