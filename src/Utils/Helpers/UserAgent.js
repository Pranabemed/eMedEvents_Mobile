import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

// Memoized userAgent JSON string to avoid recalculating on every API call
let _cachedUserAgentJSON = null;

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
