import { DeviceEventEmitter, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';

const ANDROID_CHANNEL_ID = 'emed-events-default';
const ANDROID_CHANNEL_NAME = 'eMedEvents Updates';

let foregroundUnsubscribe = null;
let openedUnsubscribe = null;
let initialNotificationHandled = false;
let channelPromise = null;
let notifeeForegroundUnsubscribe = null;
let notifeeBackgroundRegistered = false;

const resolveNotificationUrl = remoteMessage => {
  return (
    remoteMessage?.data?.activity_url ||
    remoteMessage?.data?.activityUrl ||
    remoteMessage?.data?.url ||
    remoteMessage?.data?.deep_link ||
    remoteMessage?.data?.deeplink ||
    remoteMessage?.data?.link ||
    null
  );
};

const isEmedEventsUrl = value => {
  if (!value) return false;
  const normalized = String(value).toLowerCase();
  return (
    normalized.includes('emedevents.com') ||
    normalized.includes('emedevents.net')
  );
};

const normalizeNotificationUrlForApp = remoteMessage => {
  const rawUrl = resolveNotificationUrl(remoteMessage);
  if (!rawUrl) {
    return 'https://emedevents.com';
  }

  if (/^(https?:|emedevents:)/i.test(rawUrl)) {
    // Only allow actual eMedEvents domains if it's an HTTP link, to prevent external web redirects
    return isEmedEventsUrl(rawUrl) ? rawUrl : 'https://emedevents.com';
  }

  return `https://www.emedevents.com/c/${rawUrl.replace(/^\/+/, '')}`;
};

const forwardNotificationToDeepLink = (remoteMessage, source) => {
  const url = normalizeNotificationUrlForApp(remoteMessage);

  console.log('[PushNotifications] Raw payload:', JSON.stringify(remoteMessage || {}, null, 2));
  console.log('[PushNotifications]', source, {
    messageId: remoteMessage?.messageId || remoteMessage?.notification?.id,
    url,
  });

  if (url) {
    DeviceEventEmitter.emit('DEEP_LINK_URL', { url });
  }
};

const getRemoteMessagePayload = remoteMessage => {
  const title =
    remoteMessage?.data?.title ||
    remoteMessage?.notification?.title ||
    'eMedEvents';
  const body =
    remoteMessage?.data?.body ||
    remoteMessage?.notification?.body ||
    remoteMessage?.data?.message ||
    '';

  const data = {
    ...(remoteMessage?.data || {}),
    messageId: remoteMessage?.messageId || '',
  };

  return { title, body, data };
};

const ensureAndroidChannel = async () => {
  if (Platform.OS !== 'android') {
    return ANDROID_CHANNEL_ID;
  }

  if (!channelPromise) {
    channelPromise = notifee.createChannel({
      id: ANDROID_CHANNEL_ID,
      name: ANDROID_CHANNEL_NAME,
      importance: AndroidImportance.HIGH,
    });
  }

  return channelPromise;
};

const displayIncomingNotification = async (remoteMessage, source) => {
  try {
    const { title, body, data } = getRemoteMessagePayload(remoteMessage);
    if (!title && !body) {
      return;
    }

    const androidChannelId = await ensureAndroidChannel();

    await notifee.displayNotification({
      title,
      body,
      data,
      android: {
        channelId: androidChannelId,
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
        style:
          body && body.length > 120
            ? {
                type: AndroidStyle.BIGTEXT,
                text: body,
              }
            : undefined,
      },
      ios: {
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    });

    console.log('[PushNotifications] Displayed notification from:', source);
  } catch (error) {
    console.warn('[PushNotifications] Failed to display notification:', error?.message || error);
  }
};

export const requestPushPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      return enabled;
    }

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true;
  } catch (error) {
    console.warn('[PushNotifications] Permission request failed:', error?.message || error);
    return false;
  }
};

export const ensureRemoteMessagingReady = async () => {
  const granted = await requestPushPermission();
  if (!granted) {
    return false;
  }

  await messaging().registerDeviceForRemoteMessages();
  await ensureAndroidChannel();
  return true;
};

export const registerPushNotificationListeners = () => {
  if (!foregroundUnsubscribe) {
    foregroundUnsubscribe = messaging().onMessage(async remoteMessage => {
      await displayIncomingNotification(remoteMessage, 'Foreground message');
    });
  }

  if (!openedUnsubscribe) {
    openedUnsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      forwardNotificationToDeepLink(remoteMessage, 'Notification opened');
    });
  }

  if (!notifeeForegroundUnsubscribe) {
    notifeeForegroundUnsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
        forwardNotificationToDeepLink(detail?.notification, 'Notifee foreground press');
      }
    });
  }

  messaging().getInitialNotification().then(remoteMessage => {
    if (!remoteMessage || initialNotificationHandled) {
      return;
    }

    initialNotificationHandled = true;
    forwardNotificationToDeepLink(remoteMessage, 'Initial notification');
  });

  notifee.getInitialNotification().then(initialNotification => {
    if (!initialNotification || initialNotificationHandled) {
      return;
    }

    initialNotificationHandled = true;
    forwardNotificationToDeepLink(initialNotification.notification, 'Notifee initial notification');
  });

  return () => {
    if (foregroundUnsubscribe) {
      foregroundUnsubscribe();
      foregroundUnsubscribe = null;
    }

    if (openedUnsubscribe) {
      openedUnsubscribe();
      openedUnsubscribe = null;
    }

    if (notifeeForegroundUnsubscribe) {
      notifeeForegroundUnsubscribe();
      notifeeForegroundUnsubscribe = null;
    }
  };
};

export const registerBackgroundPushHandler = () => {
  if (!notifeeBackgroundRegistered) {
    notifeeBackgroundRegistered = true;
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
        forwardNotificationToDeepLink(detail?.notification, 'Notifee background press');
      }
    });
  }

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    await displayIncomingNotification(remoteMessage, 'Background message');
  });
};
