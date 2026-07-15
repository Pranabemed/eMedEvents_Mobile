/**
 * Notification service utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: handleNotification.
 */

import { saveNotification } from './NotificationStorage';
import { parseActivityUrl } from './DeepLinkHelper';
import { parseNotificationUrl } from './NotificationParser';
import { handleActivityUrlNavigation, handleUrlNavigation } from './NotificationNavigation';

/**
 * Main handler for any push notification tap.
 * Ensures data is saved and navigates to the proper screen.
 */
/**
 * Handle notification utility helper.
 *
 * @async
 * @param {*} payload - Input value.
 * @returns {Promise<*>}
 */
export const handleNotification = async (payload) => {
  if (!payload) return;

  // 1. Ensure it's saved in AsyncStorage
  await saveNotification(payload);

  const activity_url = payload?.data?.activity_url || payload?.activity_url;
  const url = payload?.data?.url || payload?.url;

  // 2. Priority 1: activity_url
  if (activity_url) {
    const parsedActivity = parseActivityUrl(activity_url);
    if (parsedActivity) {
      const { conference_id, activity_id } = parsedActivity;
      await handleActivityUrlNavigation(conference_id, activity_id);
      return;
    }
  }

  // 3. Priority 2: Standard URL
  if (url) {
    const parsedUrl = parseNotificationUrl(url);
    if (parsedUrl.type !== 'unknown') {
      handleUrlNavigation(parsedUrl);
      return;
    }
  }

  // 4. Priority 3: Fallback (e.g. general notification screen)
  // If no matching URL logic is found, the user remains on the current screen
  // or could be navigated to a default Notification tab if required.
  console.log('Notification tapped, but no valid url or activity_url found for deep linking.');
};
