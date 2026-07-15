/**
 * Push notifications utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: ANDROID_CHANNEL_ID, ANDROID_CHANNEL_NAME, foregroundUnsubscribe, openedUnsubscribe, initialNotificationHandled, channelPromise, notifeeForegroundUnsubscribe, notifeeBackgroundRegistered, resolveNotificationUrl, isEmedEventsUrl, normalizeNotificationUrlForApp, forwardNotificationToDeepLink, getRemoteMessagePayload, ensureAndroidChannel, displayIncomingNotification, requestPushPermission, ensureRemoteMessagingReady, registerPushNotificationListeners, registerBackgroundPushHandler.
 */

import { DeviceEventEmitter, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
import { saveNotification } from './Notification/NotificationStorage';
import { handleNotification } from './Notification/NotificationService';

/**
 * Android channel id constant.
 * @returns {string}
 */
const ANDROID_CHANNEL_ID = 'emed-events-default';
/**
 * Android channel name constant.
 * @returns {string}
 */
const ANDROID_CHANNEL_NAME = 'eMedEvents Updates';

/**
 * Foreground unsubscribe value.
 * @returns {*}
 */
let foregroundUnsubscribe = null;
/**
 * Opened unsubscribe value.
 * @returns {*}
 */
let openedUnsubscribe = null;
/**
 * Initial notification handled constant.
 * @returns {boolean}
 */
let initialNotificationHandled = false;
/**
 * Channel promise value.
 * @returns {*}
 */
let channelPromise = null;
/**
 * Notifee foreground unsubscribe value.
 * @returns {*}
 */
let notifeeForegroundUnsubscribe = null;
/**
 * Notifee background registered value.
 * @returns {boolean}
 */
let notifeeBackgroundRegistered = false;

/**
 * Log exact notification payload utility helper.
 * @param {*} payload - Input value.
 * @returns {void}
 */
const logExactNotificationJson = payload => {
  console.log(JSON.stringify(payload ?? {}, null, 2),"newnotification===");
};

/**
 * Resolve notification url utility helper.
 * @param {*} remoteMessage - Input value.
 * @returns {*}
 */
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

/**
 * Is emed events url utility helper.
 * @param {*} value - Input value.
 * @returns {*}
 */
const isEmedEventsUrl = value => {
  if (!value) return false;
  const normalized = String(value).toLowerCase();
  return (
    normalized.includes('emedevents.com') ||
    normalized.includes('emedevents.net')
  );
};

/**
 * Normalize notification url for app utility helper.
 * @param {*} remoteMessage - Input value.
 * @returns {string}
 */
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

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Forward notification to deep link utility helper.
 * @param {*} remoteMessage - Input value.
 * @param {*} source - Input value.
 * @returns {void}
 */
const forwardNotificationToDeepLink = async remoteMessage => {
  logExactNotificationJson(remoteMessage);

  if (remoteMessage) {
    await saveNotification(remoteMessage);
    const resolvedUrl = normalizeNotificationUrlForApp(remoteMessage);
    if (resolvedUrl && resolvedUrl !== 'https://emedevents.com') {
      try {
        await Promise.all([
          AsyncStorage.setItem('PENDING_NOTIFICATION_URL', resolvedUrl),
          AsyncStorage.setItem('PENDING_DEEP_LINK', resolvedUrl),
        ]);
        DeviceEventEmitter.emit('DEEP_LINK_URL', { url: resolvedUrl });
      } catch (e) {
        console.log('[PushNotifications] Error saving pending notification url', e);
      }
    }
  }
};

/**
 * Get remote message payload utility helper.
 * @param {*} remoteMessage - Input value.
 * @returns {Object}
 */
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

/**
 * Ensure android channel utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
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

/**
 * Display incoming notification utility helper.
 *
 * @async
 * @param {*} remoteMessage - Input value.
 * @param {*} source - Input value.
 * @returns {Promise<*>}
 */
const displayIncomingNotification = async remoteMessage => {
  try {
    logExactNotificationJson(remoteMessage);
    
    // Save to storage immediately when received
    await saveNotification(remoteMessage);

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

  } catch (error) {
    console.warn('[PushNotifications] Failed to display notification:', error?.message || error);
  }
};

export /**
 * Request push permission utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
const requestPushPermission = async () => {
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

export /**
 * Ensure remote messaging ready utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
const ensureRemoteMessagingReady = async () => {
  const granted = await requestPushPermission();
  if (!granted) {
    return false;
  }

  await messaging().registerDeviceForRemoteMessages();
  await ensureAndroidChannel();
  return true;
};

export /**
 * Register push notification listeners utility helper.
 * @returns {*}
 */
const registerPushNotificationListeners = () => {
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

export /**
 * Register background push handler utility helper.
 * @returns {void}
 */
const registerBackgroundPushHandler = () => {
  if (!notifeeBackgroundRegistered) {
    notifeeBackgroundRegistered = true;
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
        forwardNotificationToDeepLink(detail?.notification, 'Notifee background press');
      }
    });
  }

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (remoteMessage?.notification) {
      await saveNotification(remoteMessage);
      return;
    }

    await displayIncomingNotification(remoteMessage, 'Background message');
  });
};
