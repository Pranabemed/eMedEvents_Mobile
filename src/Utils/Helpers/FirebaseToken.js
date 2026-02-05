import messaging from '@react-native-firebase/messaging';

export const generateDeviceToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages(); 
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    // This will now catch "No APNS token specified" errors specifically
    console.error('FCM Error:', error); 
  }
};
