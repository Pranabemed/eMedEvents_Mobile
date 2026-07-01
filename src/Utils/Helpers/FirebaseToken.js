/**
 * Firebase token utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: generateDeviceToken.
 */

import messaging from '@react-native-firebase/messaging';
import { ensureRemoteMessagingReady } from './PushNotifications';

export /**
 * Generate device token utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
const generateDeviceToken = async () => {
  try {
    const isReady = await ensureRemoteMessagingReady();
    if (!isReady) {
      return null;
    }

    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('FCM Error:', error);
    return null;
  }
};
