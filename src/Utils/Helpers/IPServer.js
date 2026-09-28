/**
 * Public ip constant.
 * @returns {*}
 */
let PUBLIC_IP = null;
/**
 * Cached country info constant.
 * @returns {*}
 */
let CACHED_COUNTRY_INFO = null;
let countryLookupPromise = null;
let countryLookupTime = 0;
const COUNTRY_CACHE_MS = 15000;

import { getCountries, getCountryCallingCode } from 'libphonenumber-js';

const COUNTRY_DIAL_CODES = {
  IN: '+91',
  US: '+1',
  GB: '+44',
  AU: '+61',
  CA: '+1',
  SG: '+65',
};

const countryAliasMap = {
  UK: 'GB',
  'UNITED KINGDOM': 'GB',
  'GREAT BRITAIN': 'GB',
  ENGLAND: 'GB',
  USA: 'US',
  'UNITED STATES': 'US',
  'UNITED STATES OF AMERICA': 'US',
  IND: 'IN',
  INDIA: 'IN',
  CAN: 'CA',
  CANADA: 'CA',
  AUS: 'AU',
  AUSTRALIA: 'AU',
  UAE: 'AE',
  'UNITED ARAB EMIRATES': 'AE',
};

/**
 * Get dial code utility helper.
 * @param {string} country - Input value.
 * @returns {string}
 */
const getDialCode = (country) => {
  if (!country) return '';
  const upper = String(country).trim().toUpperCase();
  const iso = countryAliasMap[upper] || upper;
  try {
    return `+${getCountryCallingCode(iso)}`;
  } catch (_) {
    if (iso.length > 2) {
      try {
        const names = new Intl.DisplayNames(['en'], { type: 'region' });
        const matched = getCountries().find(c => {
          try { return names.of(c)?.toUpperCase() === iso; } catch (_) { return false; }
        });
        if (matched) return `+${getCountryCallingCode(matched)}`;
      } catch (_) {}
    }
    return COUNTRY_DIAL_CODES[iso] || '';
  }
};

const COUNTRY_NAME_MAP = {
  NL: 'Netherlands',
  GB: 'United Kingdom',
  UK: 'United Kingdom',
  IN: 'India',
  US: 'United States',
  CA: 'Canada',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  ES: 'Spain',
  IT: 'Italy',
  SG: 'Singapore',
  AE: 'United Arab Emirates',
};

/**
 * Get country name utility helper.
 * @param {string} countryCode - Input value.
 * @returns {string}
 */
const getCountryName = countryCode => {
  if (!countryCode) return '';
  const code = String(countryCode).trim().toUpperCase();
  if (COUNTRY_NAME_MAP[code]) return COUNTRY_NAME_MAP[code];
  try {
    if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
      const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return displayNames.of(code) || code;
    }
  } catch (e) {
    console.log('[IPServer] Country name resolution failed:', e.message);
  }
  return code;
};

/**
 * Normalize geo info utility helper.
 * @param {Object} data - Input value.
 * @returns {Object}
 */
const normalizeGeoInfo = (data = {}) => {
  PUBLIC_IP = data.ip || data.ipAddress || PUBLIC_IP;
  const rawCountryCode = String(
    data.country_code ||
      data.countryCode ||
      data.country ||
      '',
  ).trim().toUpperCase();
  const countryCode = countryAliasMap[rawCountryCode] || rawCountryCode;
  const rawCountryName = String(
    data.country_name ||
      data.countryName ||
      data.country_name_en ||
      '',
  ).trim();
  const countryName = (rawCountryName && rawCountryName !== countryCode)
    ? rawCountryName
    : getCountryName(countryCode);
  const cityName = String(data.city || data.city_name || data.cityName || '').trim();
  const stateName = String(
    data.region ||
      data.region_name ||
      data.regionName ||
      data.state ||
      data.state_name ||
      '',
  ).trim();

  const rawCalling = data.country_calling_code || data.calling_code || data.dial_code || data.callingCode;
  const dynamicDialCode = rawCalling
    ? (String(rawCalling).startsWith('+') ? String(rawCalling) : `+${rawCalling}`)
    : getDialCode(countryCode);

  return {
    country: countryCode,
    country_name: countryName,
    city_name: cityName,
    state_name: stateName,
    dialCode: dynamicDialCode,
  };
};

/**
 * Fetch country and dial code utility helper.
 *
 * @async
 * @param {*} ip - Input value.
 * @returns {Promise<*>}
 */
const fetchCountryAndDialCode = async (ip) => {
  const targetIp = ip || '';
  console.log('[IPServer] Fetching country details for IP:', targetIp || 'self');

  // 1. Try ipinfo.io
  try {
    const url = targetIp ? `https://ipinfo.io/${targetIp}/json` : 'https://ipinfo.io/json';
    const res = await fetch(url);
    const text = await res.text();
    if (text && !text.startsWith('<')) {
      const data = JSON.parse(text);
      const geoInfo = normalizeGeoInfo(data);
      if (geoInfo.country) {
        console.log('[IPServer] ipinfo.io success:', geoInfo.country);
        return geoInfo;
      }
    }
  } catch (e) {
    console.log('[IPServer] ipinfo.io lookup failed:', e.message);
  }

  // 2. Try freeipapi.com
  try {
    const url = targetIp ? `https://freeipapi.com/api/json/${targetIp}` : 'https://freeipapi.com/api/json';
    const res = await fetch(url);
    const data = await res.json();
    const geoInfo = normalizeGeoInfo(data);
    if (geoInfo.country) {
      console.log('[IPServer] freeipapi.com success:', geoInfo.country);
      return geoInfo;
    }
  } catch (e) {
    console.log('[IPServer] freeipapi.com lookup failed:', e.message);
  }

  // 3. Try ipapi.co
  try {
    const url = targetIp ? `https://ipapi.co/${targetIp}/json/` : 'https://ipapi.co/json/';
    const res = await fetch(url);
    const data = await res.json();
    const geoInfo = normalizeGeoInfo(data);
    if (geoInfo.country) {
      console.log('[IPServer] ipapi.co success:', geoInfo.country);
      return geoInfo;
    }
  } catch (e) {
    console.log('[IPServer] ipapi.co lookup failed:', e.message);
  }

  // Fallback default
  console.log('[IPServer] All providers failed, returning empty geo info');
  return { country: '', country_name: '', city_name: '', state_name: '', dialCode: '' };
};

export /**
 * Init public ip utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
const initPublicIP = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    PUBLIC_IP = data.ip;
    console.log('[IPServer] Public IP initialized:', PUBLIC_IP);

    // Pre-fetch and cache country info
    CACHED_COUNTRY_INFO = await fetchCountryAndDialCode(PUBLIC_IP);
    countryLookupTime = Date.now();
  } catch (e) {
    console.log('[IPServer] IP init failed:', e);
    PUBLIC_IP = null;
    CACHED_COUNTRY_INFO = { country: '', country_name: '', city_name: '', state_name: '', dialCode: '' };
  }
};

export /**
 * Get public ip utility helper.
 * @returns {*}
 */
const getPublicIP = () => PUBLIC_IP;

export /**
 * Get country and dial code utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
const getCountryAndDialCode = async ({ forceRefresh = false } = {}) => {
  if (!forceRefresh && CACHED_COUNTRY_INFO?.dialCode && Date.now() - countryLookupTime < COUNTRY_CACHE_MS) {
    return CACHED_COUNTRY_INFO;
  }
  if (!countryLookupPromise) {
    // Query the current connection, not the IP saved before a VPN change.
    countryLookupPromise = fetchCountryAndDialCode().then(info => {
      if (info?.country && info?.dialCode) {
        CACHED_COUNTRY_INFO = info;
        countryLookupTime = Date.now();
      }
      return CACHED_COUNTRY_INFO || info;
    }).finally(() => { countryLookupPromise = null; });
  }
  return countryLookupPromise;
};

// Synchronous fallback for screens that have already requested geolocation.
export const getCachedCountryInfo = () => CACHED_COUNTRY_INFO;
