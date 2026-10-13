import {AppState, PermissionsAndroid} from 'react-native';
import {requestAndroidNotificationPermission} from '../src/Utils/Helpers/AndroidNotificationPermission';

let events, remove;
beforeEach(() => {
  jest.useFakeTimers();
  events = {};
  remove = jest.fn();
  jest.spyOn(AppState, 'addEventListener').mockImplementation((event, callback) => {
    events[event] = callback;
    return {remove};
  });
});
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); jest.restoreAllMocks(); });

test('denial waits for window focus and dismissal before continuing the screen', async () => {
  jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue('denied');
  let continued = false;
  const request = requestAndroidNotificationPermission('notifications').then(result => {continued = true; return result;});
  events.blur();
  await Promise.resolve();
  await jest.advanceTimersByTimeAsync(400);
  expect(continued).toBe(false);
  events.focus();
  await jest.advanceTimersByTimeAsync(299);
  expect(continued).toBe(false);
  await jest.advanceTimersByTimeAsync(1);
  expect(await request).toBe('denied');
  expect(remove).toHaveBeenCalledTimes(2);
  expect(jest.getTimerCount()).toBe(0);
});

test('grant preserves the permission result when Android emits no focus events', async () => {
  jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue('granted');
  const request = requestAndroidNotificationPermission('notifications');
  await jest.advanceTimersByTimeAsync(300);
  expect(await request).toBe('granted');
  expect(remove).toHaveBeenCalledTimes(2);
});

test('a missing focus event cannot leave screen initialization hanging', async () => {
  jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue('denied');
  const request = requestAndroidNotificationPermission('notifications');
  events.blur();
  await jest.advanceTimersByTimeAsync(1000);
  expect(await request).toBe('denied');
  expect(remove).toHaveBeenCalledTimes(2);
  expect(jest.getTimerCount()).toBe(0);
});
