import { Platform } from 'react-native';

// 🔹 Dynamic Base URL
// __DEV__ = true  → Development/Staging build (metro bundler running)
// __DEV__ = false → Production/Release build (AAB/APK)
const BASE_URL = __DEV__
  ? 'https://v2.emedevents.com'   // Staging
  : 'https://newdev.emedevents.com'; // Production

console.log(`[Config] Environment: ${__DEV__ ? 'STAGING' : 'PRODUCTION'}`);
console.log(`[Config] BASE_URL: ${BASE_URL}`);



export default {
  BASE_URL,
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
  EMAVER: "EMAVER",
  MOBVER: "MOBVER",
  COUNTRYCODE: "COUNTRYCODE"
};
