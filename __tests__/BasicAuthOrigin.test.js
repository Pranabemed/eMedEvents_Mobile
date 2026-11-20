import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchAndStoreBasicAuthToken, getBasicAuthorizationHeader} from '../src/Utils/Helpers/BasicAuth';

jest.mock('axios', () => ({post: jest.fn()}));
jest.mock('../src/Utils/Helpers/constants', () => ({BASE_URL: 'https://newdev.emedevents.com', BASIC_AUTH_TOKEN: 'BASIC_AUTH_TOKEN'}));
jest.mock('../src/Utils/Helpers/UserAgent', () => () => 'test-agent');

beforeEach(() => {
  jest.clearAllMocks();
  AsyncStorage.getItem.mockResolvedValue(null);
});

test('uses v2api authentication for v2api tickets even in a production build', async () => {
  AsyncStorage.getItem.mockImplementation(async key => key === 'BASIC_AUTH_TOKEN' ? 'Basic production-token' : null);
  axios.post.mockResolvedValueOnce({data: {batoken: 'v2-token'}});
  expect(await getBasicAuthorizationHeader('https://v2api.emedevents.com/transaction/saveTickets')).toBe('Basic v2-token');
  expect(axios.post).toHaveBeenCalledWith('https://v2api.emedevents.com/AccessControl/fetchABAtok', null, expect.any(Object));
  expect(AsyncStorage.setItem).toHaveBeenCalledWith('BASIC_AUTH_TOKEN:https://v2api.emedevents.com', 'Basic v2-token');
});

test('refreshes the token on the failed request origin', async () => {
  axios.post.mockResolvedValueOnce({data: {batoken: 'fresh-v2-token'}});
  expect(await fetchAndStoreBasicAuthToken('https://v2api.emedevents.com/transaction/saveTickets')).toBe('Basic fresh-v2-token');
  expect(axios.post.mock.calls[0][0]).toBe('https://v2api.emedevents.com/AccessControl/fetchABAtok');
});

test('retains cached default API credentials for ordinary relative requests', async () => {
  AsyncStorage.getItem.mockResolvedValueOnce('Basic default-token');
  expect(await getBasicAuthorizationHeader('user/dashboard')).toBe('Basic default-token');
  expect(AsyncStorage.getItem).toHaveBeenCalledWith('BASIC_AUTH_TOKEN');
  expect(axios.post).not.toHaveBeenCalled();
});

test('keeps simultaneous authentication requests separate by origin', async () => {
  axios.post.mockImplementation(async url => ({data: {batoken: url.includes('v2api') ? 'v2-token' : 'default-token'}}));
  const values = await Promise.all([
    fetchAndStoreBasicAuthToken('https://v2api.emedevents.com/transaction/saveTickets'),
    fetchAndStoreBasicAuthToken('https://v2api.emedevents.com/transaction/saveRegistration'),
    fetchAndStoreBasicAuthToken(),
  ]);
  expect(values).toEqual(['Basic v2-token', 'Basic v2-token', 'Basic default-token']);
  expect(axios.post).toHaveBeenCalledTimes(2);
});
