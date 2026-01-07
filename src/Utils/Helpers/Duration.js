import { ToastAndroid, Platform } from 'react-native'
import Toast from 'react-native-simple-toast'

export default function showDur(message, customDuration = 5000) {
  if (Platform.OS === "android") {
    const interval = 3500; // LONG duration ~3.5s
    let elapsed = 0;

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
