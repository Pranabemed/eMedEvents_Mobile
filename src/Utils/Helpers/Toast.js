/**
 * Cross-platform Toast notification utility.
 * 
 * @module Toast
 */
import { ToastAndroid, Platform } from 'react-native'
import Toast from 'react-native-simple-toast';

/**
 * Displays a toast message on the screen.
 * Automatically handles the difference between Android (using native ToastAndroid) 
 * and iOS (using react-native-simple-toast).
 * 
 * @function showErrorAlert
 * @param {string} message - The message to display in the toast.
 * @param {boolean} [isLong=false] - If true, displays the toast for a longer duration.
 */
export default function showErrorAlert(message,isLong=false) {
  if (Platform.OS == "android") {
    ToastAndroid.show(message, isLong==true?ToastAndroid.LONG : ToastAndroid.SHORT);
  } else {
    Toast.show(message,isLong==true?Toast.LONG : Toast.SHORT)
  }
}