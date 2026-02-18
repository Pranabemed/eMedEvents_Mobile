// analyticsTracker.js

import analytics from '@react-native-firebase/analytics';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Store from '../../Redux/Store';

import { getPublicIP } from './IPServer';

// store current screen
let CURRENT_SCREEN = 'unknown';

// 👉 called by navigation
export const setCurrentScreen = (screenName) => {
  CURRENT_SCREEN = screenName;
};

const getCountryFromIP = async (ip) => {
  try {
    const res = await fetch(`https://ipinfo.io/${ip}/json`);
    const text = await res.text();
    if (text.startsWith('<')) {
      throw new Error('HTML response');
    }
    const data = JSON.parse(text);
    return data?.country || 'unknown'; // Returns "IN", "US", etc.
  } catch (e) {
    console.log('Geo lookup failed:', e);
    return 'unknown';
  }
};

// 👉 event function
export const trackEvent = async (eventName, additionalParams = {}) => {
  try {
    const state = Store.getState();
    const AuthReducer = state.AuthReducer;
    const userId = AuthReducer?.loginResponse?.user?.id || "11211";

    let country = 'unknown';
    try {
      country = await DeviceInfo.getDeviceCountry();
    } catch (e) {
      country = 'unknown';
    }

    // Fallback to IP Geolocation if DeviceInfo fails
    if (!country || country === 'unknown') {
      const ip = getPublicIP();
      if (ip) {
        console.log('Attempting IP Geolocation with IP:', ip);
        country = await getCountryFromIP(ip);
      }
    }

    // Set User ID for all subsequent events in this session
    if (userId) {
      await analytics().setUserId(String(userId));
    }

    const defaultParams = {
      user_id: String(userId),
      screen_name: CURRENT_SCREEN,
      timestamp: new Date().toISOString(),
      device: `${Platform.OS}-${DeviceInfo.getModel()}`,
      country: country,
    };

    const params = {
      ...defaultParams,
      ...additionalParams
    };

    console.log('📊 Sending Analytics:', eventName, params,"1", defaultParams);

    await analytics().logEvent(eventName, params);
  } catch (error) {
    console.log('Analytics Error:', error);
  }
};

// 👉 screen tracking function
export const trackScreen = async (screenName, screenClassOverride) => {
  try {
    const screenClass = screenClassOverride || screenName;
    setCurrentScreen(screenName); // ensure local state is updated too

    console.log('📍 Tracking Screen:', screenName);

    // Explicitly log screen view for Firebase to override native controller names
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass,
    });

    // Log custom event to ensure user data is captured with the screen view
    await trackEvent('screen_view_log', {
      screen_name: screenName,
      screen_class: screenClass
    });

  } catch (error) {
    console.log('Screen Analytics Error:', error);
  }
};
