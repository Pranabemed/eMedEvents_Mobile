let PUBLIC_IP = null;
let CACHED_COUNTRY_INFO = null;

const COUNTRY_DIAL_CODES = {
  IN: '+91',
  US: '+1',
  GB: '+44',
  AU: '+61',
  CA: '+1',
  SG: '+65',
};

const getDialCode = (country) => {
  if (!country) return '+1';
  const upper = country.trim().toUpperCase();
  return COUNTRY_DIAL_CODES[upper] || '+1';
};

const getCountryName = countryCode => {
  if (!countryCode) return '';
  try {
    if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
      const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return displayNames.of(countryCode.toUpperCase()) || countryCode.toUpperCase();
    }
  } catch (e) {
    console.log('[IPServer] Country name resolution failed:', e.message);
  }
  return countryCode.toUpperCase();
};

const normalizeGeoInfo = (data = {}) => {
  const countryCode = String(
    data.country_code ||
      data.countryCode ||
      data.country ||
      '',
  ).trim().toUpperCase();
  const countryName = String(
    data.country_name ||
      data.countryName ||
      data.country_name_en ||
      getCountryName(countryCode),
  ).trim();
  const cityName = String(data.city || data.city_name || data.cityName || '').trim();
  const stateName = String(
    data.region ||
      data.region_name ||
      data.regionName ||
      data.state ||
      data.state_name ||
      '',
  ).trim();

  return {
    country: countryCode,
    country_name: countryName,
    city_name: cityName,
    state_name: stateName,
    dialCode: getDialCode(countryCode),
  };
};

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

export const initPublicIP = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    PUBLIC_IP = data.ip;
    console.log('[IPServer] Public IP initialized:', PUBLIC_IP);

    // Pre-fetch and cache country info
    CACHED_COUNTRY_INFO = await fetchCountryAndDialCode(PUBLIC_IP);
  } catch (e) {
    console.log('[IPServer] IP init failed:', e);
    PUBLIC_IP = null;
    CACHED_COUNTRY_INFO = { country: '', country_name: '', city_name: '', state_name: '', dialCode: '' };
  }
};

export const getPublicIP = () => PUBLIC_IP;

export const getCountryAndDialCode = async () => {
  if (CACHED_COUNTRY_INFO) {
    return CACHED_COUNTRY_INFO;
  }
  CACHED_COUNTRY_INFO = await fetchCountryAndDialCode(PUBLIC_IP);
  return CACHED_COUNTRY_INFO;
};
