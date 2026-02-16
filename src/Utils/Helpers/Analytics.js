// analyticsTracker.js

// analyticsTracker.js

import analytics from '@react-native-firebase/analytics';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useSelector } from 'react-redux';

// store current screen
let CURRENT_SCREEN = 'unknown';

// 👉 called by navigation
export const setCurrentScreen = (screenName) => {
  CURRENT_SCREEN = screenName;
};

// 👉 event function
export const trackEvent = async (eventName) => {
const AuthReducer = useSelector(state => state.AuthReducer);
  try {
    const userId = AuthReducer?.loginResponse?.user?.id || "11211" ;

    const params = {
      user_id: String(userId),
      screen_name: CURRENT_SCREEN,
      timestamp: new Date().toISOString(),
      device: `${Platform.OS}-${DeviceInfo.getModel()}`,
      country: DeviceInfo.getDeviceCountry() || 'unknown',
    };

    console.log('📊 Sending Analytics:', eventName, params);

    await analytics().logEvent(eventName, params);
  } catch (error) {
    console.log('Analytics Error:', error);
  }
};
