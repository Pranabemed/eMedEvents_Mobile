import messaging from '@react-native-firebase/messaging';
import { ensureRemoteMessagingReady } from './PushNotifications';

export const generateDeviceToken = async () => {
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
