/**
 * Basic auth utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: basicAuthPromise, fetchAndStoreBasicAuthToken, getBasicAuthorizationHeader.
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './constants';
import getUserAgentJSON from './UserAgent';

/**
 * Basic auth promise value.
 * @returns {*}
 */
const basicAuthPromises = new Map();

// Only bootstrap credentials from known API hosts, never from arbitrary page URLs.
const getAuthBase = requestUrl => {
  const origin = String(requestUrl || '').match(/^https:\/\/[^/]+/i)?.[0];
  return ['https://v2api.emedevents.com', 'https://newdev.emedevents.com'].includes(origin)
    ? origin : constants.BASE_URL;
};
const getAuthKey = base => base === constants.BASE_URL
  ? constants.BASIC_AUTH_TOKEN : `${constants.BASIC_AUTH_TOKEN}:${base}`;

export async function fetchAndStoreBasicAuthToken(requestUrl) {
  const base = getAuthBase(requestUrl);
  const storageKey = getAuthKey(base);
  if (basicAuthPromises.has(base)) return basicAuthPromises.get(base);

  const basicAuthPromise = (async () => {
    try {
      const userAgentHeader = getUserAgentJSON();
      const response = await axios.post(
        `${base}/AccessControl/fetchABAtok`,
        null,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(userAgentHeader ? { userAgent: userAgentHeader } : {}),
          },
          timeout: 15000,
        },
      );

      const rawToken = response?.data?.batoken;
      const basicAuthToken = rawToken ? `Basic ${rawToken}` : '';

      if (basicAuthToken) {
        await AsyncStorage.setItem(storageKey, basicAuthToken);
      } else {
        await AsyncStorage.removeItem(storageKey);
      }

      return basicAuthToken;
    } catch (error) {
      await AsyncStorage.removeItem(storageKey);
      throw error;
    } finally {
      basicAuthPromises.delete(base);
    }
  })();

  basicAuthPromises.set(base, basicAuthPromise);
  return basicAuthPromise;
}

export async function getBasicAuthorizationHeader(requestUrl) {
  const storedToken = await AsyncStorage.getItem(getAuthKey(getAuthBase(requestUrl)));
  if (storedToken) {
    return storedToken;
  }

  return fetchAndStoreBasicAuthToken(requestUrl);
}
