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
      if (data && data.country) {
        const country = data.country.trim().toUpperCase();
        console.log('[IPServer] ipinfo.io success:', country);
        return { country, dialCode: getDialCode(country) };
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
    if (data && data.countryCode) {
      const country = data.countryCode.trim().toUpperCase();
      console.log('[IPServer] freeipapi.com success:', country);
      return { country, dialCode: getDialCode(country) };
    }
  } catch (e) {
    console.log('[IPServer] freeipapi.com lookup failed:', e.message);
  }

  // 3. Try ipapi.co
  try {
    const url = targetIp ? `https://ipapi.co/${targetIp}/json/` : 'https://ipapi.co/json/';
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.country_code) {
      const country = data.country_code.trim().toUpperCase();
      console.log('[IPServer] ipapi.co success:', country);
      return { country, dialCode: getDialCode(country) };
    }
  } catch (e) {
    console.log('[IPServer] ipapi.co lookup failed:', e.message);
  }

  // Fallback default
  console.log('[IPServer] All providers failed, falling back to US/+1');
  return { country: 'US', dialCode: '+1' };
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
    CACHED_COUNTRY_INFO = { country: 'US', dialCode: '+1' };
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
