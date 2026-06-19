import { Platform } from 'react-native';

// 🔹 Dynamic Base URL
// __DEV__ = true  → Development/Staging build (metro bundler running)
// __DEV__ = false → Production/Release build (AAB/APK)
const BASE_URL = __DEV__
  ? 'https://v2api.emedevents.com'   // Staging
  : 'https://newdev.emedevents.com'; // Production
const BASIC_AUTH_TOKEN = 'BASIC_AUTH_TOKEN';

console.log(`[Config] Environment: ${__DEV__ ? 'STAGING' : 'PRODUCTION'}`);
console.log(`[Config] BASE_URL: ${BASE_URL}`);

// const BASE_URL = 'https://newdev.emedevents.com'; // Production
// const BASE_URL = 'https://v2api.emedevents.com'; // Staging


export default {
  BASE_URL,
  BASIC_AUTH_TOKEN,
  TOKEN: 'TOKEN',
  EMAILOTP: 'EMAILOTP',
  PHONEOTP: 'PHONEOTP',
  STATECOUNT: 'STATECOUNT',
  BOARDCOUNT: 'BOARDCOUNT',
  EMAIL: "EMAIL",
  PHONE: "PHONE",
  EMAILSIGNUP: "EMAILSIGNUP",
  PHONESIGNUP: "PHONESIGNUP",
  VERIFYSTATEDATA: "VERIFYSTATEDATA",
  PROFESSION: "PROFESSION",
  WHOLEDATA: "WHOLEDATA",
  PRODATA: "PRODATA",
  DASHBOARD_CACHE: "DASHBOARD_CACHE",
  EMAVER: "EMAVER",
  MOBVER: "MOBVER",
  COUNTRYCODE: "COUNTRYCODE",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  REFID: "REFID",
  NON_USA_FLOW_STATE: "NON_USA_FLOW_STATE"
};
