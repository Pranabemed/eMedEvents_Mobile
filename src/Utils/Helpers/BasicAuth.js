import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './constants';
import getUserAgentJSON from './UserAgent';

let basicAuthPromise = null;

export async function fetchAndStoreBasicAuthToken() {
  if (basicAuthPromise) {
    return basicAuthPromise;
  }

  basicAuthPromise = (async () => {
    try {
      const userAgentHeader = getUserAgentJSON();
      const response = await axios.post(
        `${constants.BASE_URL}/AccessControl/fetchABAtok`,
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
        await AsyncStorage.setItem(constants.BASIC_AUTH_TOKEN, basicAuthToken);
      } else {
        await AsyncStorage.removeItem(constants.BASIC_AUTH_TOKEN);
      }

      return basicAuthToken;
    } catch (error) {
      await AsyncStorage.removeItem(constants.BASIC_AUTH_TOKEN);
      throw error;
    } finally {
      basicAuthPromise = null;
    }
  })();

  return basicAuthPromise;
}

export async function getBasicAuthorizationHeader() {
  const storedToken = await AsyncStorage.getItem(constants.BASIC_AUTH_TOKEN);
  if (storedToken) {
    return storedToken;
  }

  return fetchAndStoreBasicAuthToken();
}
