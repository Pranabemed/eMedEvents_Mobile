/**
 * Notification storage utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: NOTIFICATION_HISTORY, saveNotification, getNotifications, removeNotification, clearNotifications.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Notification history constant.
 * @returns {string}
 */
const NOTIFICATION_HISTORY = 'NOTIFICATION_HISTORY';

/**
 * Save notification utility helper.
 *
 * @async
 * @param {*} payload - Input value.
 * @returns {Promise<*>}
 */
export const saveNotification = async (payload) => {
  try {
    const existingStr = await AsyncStorage.getItem(NOTIFICATION_HISTORY);
    const existing = existingStr ? JSON.parse(existingStr) : [];

    // Assuming payload has notification_id, title, body, activity_url, url, sentTime
    const notificationId = payload.notification_id || payload.messageId || Date.now().toString();

    // Check for duplicates
    const isDuplicate = existing.some(item => item.notification_id === notificationId);
    if (!isDuplicate) {
      const newNotification = {
        ...payload,
        notification_id: notificationId,
        sentTime: payload.sentTime || new Date().toISOString()
      };
      
      // Add to beginning of array
      const updated = [newNotification, ...existing];
      await AsyncStorage.setItem(NOTIFICATION_HISTORY, JSON.stringify(updated));
    }
  } catch (error) {
    console.warn('Error saving notification:', error);
  }
};

/**
 * Get notifications utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
export const getNotifications = async () => {
  try {
    const existingStr = await AsyncStorage.getItem(NOTIFICATION_HISTORY);
    return existingStr ? JSON.parse(existingStr) : [];
  } catch (error) {
    console.warn('Error getting notifications:', error);
    return [];
  }
};

/**
 * Remove notification utility helper.
 *
 * @async
 * @param {*} notificationId - Input value.
 * @returns {Promise<*>}
 */
export const removeNotification = async (notificationId) => {
  try {
    const existingStr = await AsyncStorage.getItem(NOTIFICATION_HISTORY);
    if (existingStr) {
      const existing = JSON.parse(existingStr);
      const updated = existing.filter(item => item.notification_id !== notificationId);
      await AsyncStorage.setItem(NOTIFICATION_HISTORY, JSON.stringify(updated));
    }
  } catch (error) {
    console.warn('Error removing notification:', error);
  }
};

/**
 * Clear notifications utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
export const clearNotifications = async () => {
  try {
    await AsyncStorage.removeItem(NOTIFICATION_HISTORY);
  } catch (error) {
    console.warn('Error clearing notifications:', error);
  }
};
