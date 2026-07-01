/**
 * User agent utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: _cachedUserAgentJSON, _hasSentUserAgent, _userAgentScopeMap, getUserAgentJSONOnce, getUserAgentJSONByScope.
 */

import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

// Memoized userAgent JSON string to avoid recalculating on every API call
/**
 * Cached user agent json value.
 * @returns {*}
 */
let _cachedUserAgentJSON = null;
/**
 * Has sent user agent value.
 * @returns {boolean}
 */
let _hasSentUserAgent = false;
/**
 * User agent scope map value.
 * @returns {*}
 */
const _userAgentScopeMap = new Set();

/**
 * User agent default export.
 *
 * @returns {*}
 */
export default function getUserAgentJSON() {
    if (_cachedUserAgentJSON) {
        return _cachedUserAgentJSON;
    }

    try {
        const isTablet = DeviceInfo.isTablet();
        const isAndroid = Platform.OS === 'android';
        const isIos = Platform.OS === 'ios';

        const userAgentObj = {
            isMobile: !isTablet,
            isTablet: isTablet,
            isIphone: isIos && !isTablet,
            isIpad: isIos && isTablet,
            isAndroid: isAndroid,
            isIos: isIos,
            os: isAndroid ? 'Android' : isIos ? 'Ios' : Platform.OS,
            osVersion: DeviceInfo.getSystemVersion(),
            deviceType: isTablet ? 'Tablet' : 'Mobile',
            browser: 'eMedEvents App', // App identifier
            isBot: false,
            isDesktop: false,
            isMac: false,
        };

        _cachedUserAgentJSON = JSON.stringify(userAgentObj);
        return _cachedUserAgentJSON;
    } catch (err) {
        // Safe fallback if DeviceInfo fails for some native reason
        console.warn('[UserAgent] Failed to build advanced userAgent', err);
        return JSON.stringify({
            isMobile: true,
            isAndroid: Platform.OS === 'android',
            isIos: Platform.OS === 'ios',
            os: Platform.OS === 'android' ? 'Android' : 'Ios',
            browser: 'eMedEvents App',
        });
    }
}

// Returns userAgent only once per app process; next calls return null.
export function getUserAgentJSONOnce() {
    if (_hasSentUserAgent) return null;
    _hasSentUserAgent = true;
    return getUserAgentJSON();
}

// Returns userAgent once per provided scope (example: "Dashboard|user/dashboard").
export function getUserAgentJSONByScope(scopeKey) {
    const key = String(scopeKey || 'global');
    if (_userAgentScopeMap.has(key)) return null;
    _userAgentScopeMap.add(key);
    return getUserAgentJSON();
}
