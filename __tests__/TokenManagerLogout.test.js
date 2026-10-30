import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import TokenManager from '../src/Utils/Helpers/TokenManager';
import constants from '../src/Utils/Helpers/constants';

jest.mock('axios', () => ({ post: jest.fn() }));
jest.mock('../src/Utils/Helpers/UserAgent', () => jest.fn(() => 'test'));
jest.mock('../src/Utils/Helpers/BasicAuth', () => ({
  getBasicAuthorizationHeader: jest.fn(async () => 'basic'),
}));

test('a refresh response arriving during logout cannot restore old credentials', async () => {
  await AsyncStorage.setItem(constants.REFRESH_TOKEN, 'previous-refresh');
  let resolveRequest;
  let requestStarted;
  const started = new Promise(resolve => { requestStarted = resolve; });
  axios.post.mockImplementation(() => {
    requestStarted();
    return new Promise(resolve => { resolveRequest = resolve; });
  });
  const refresh = TokenManager.forceRefresh('test');
  await started;
  const logout = TokenManager.endSession();
  await AsyncStorage.removeItem(constants.TOKEN);
  await AsyncStorage.removeItem(constants.REFRESH_TOKEN);
  resolveRequest({ data: { success: true, token: 'old-account-token', refresh_token: 'old-account-refresh' } });
  await logout;
  expect(await refresh).toBeNull();
  expect(await AsyncStorage.getItem(constants.TOKEN)).toBeNull();
  expect(await AsyncStorage.getItem(constants.REFRESH_TOKEN)).toBeNull();
});
