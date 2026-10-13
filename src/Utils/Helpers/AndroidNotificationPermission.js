import { AppState, PermissionsAndroid } from 'react-native';

// Android can resolve a permission request before its window has finished closing.
// Keep screen initialization from opening another modal during that transition.
export const requestAndroidNotificationPermission = async permission => {
  let focused = true;
  let settled = false;
  let settleTimer;
  let fallbackTimer;
  let finish;
  const dismissal = new Promise(resolve => { finish = resolve; });
  const scheduleFinish = () => {
    clearTimeout(settleTimer);
    if (settled && focused) {
      settleTimer = setTimeout(finish, 300);
    }
  };
  const blur = AppState.addEventListener('blur', () => {
    focused = false;
    clearTimeout(settleTimer);
  });
  const focus = AppState.addEventListener('focus', () => {
    focused = true;
    scheduleFinish();
  });

  try {
    return await PermissionsAndroid.request(permission);
  } finally {
    settled = true;
    scheduleFinish();
    // Some Android versions omit window-focus events. Never block the form.
    fallbackTimer = setTimeout(finish, 1000);
    await dismissal;
    clearTimeout(settleTimer);
    clearTimeout(fallbackTimer);
    blur.remove();
    focus.remove();
  }
};
