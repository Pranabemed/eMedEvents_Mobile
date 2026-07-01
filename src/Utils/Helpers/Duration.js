/**
 * Duration utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: showToast.
 */

import { ToastAndroid, Platform } from 'react-native'
import Toast from 'react-native-simple-toast'

/**
 * Duration default export.
 *
 * @returns {*}
 */
export default function showDur(message, customDuration = 5000) {
  if (Platform.OS === "android") {
    const interval = 3500; // LONG duration ~3.5s
    let elapsed = 0;

        /**
 * Show toast utility helper.
 * @returns {void}
 */
const showToast = () => {
      ToastAndroid.show(message, ToastAndroid.LONG);
      elapsed += interval;
      if (elapsed < customDuration) {
        setTimeout(showToast, interval);
      }
    };

    showToast();
  } else {
    const interval = 2000; // LONG duration ~2s
    let elapsed = 0;

        /**
 * Show toast utility helper.
 * @returns {void}
 */
const showToast = () => {
      Toast.show(message, Toast.LONG);
      elapsed += interval;
      if (elapsed < customDuration) {
        setTimeout(showToast, interval);
      }
    };

    showToast();
  }
}
