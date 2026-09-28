import { getCachedCountryInfo } from './IPServer';
import { getCountries, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import { countryIdentity } from './ApplicableCountry';
import { formatUsPhone, isValidUsPhone, isUsCallingCode } from './UsPhone';

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

const countryIdMap = {
  '1': 'US',
  '233': 'US',
  '101': 'IN',
  '230': 'GB',
  '38': 'CA',
  '13': 'AU',
};

export const normalizeDialCode = value => {
  const text = String(value ?? '').trim();
  if (!text) return '';
  if (/^\+\d{1,4}$/.test(text)) return text;
  if (/^\d{1,4}$/.test(text)) {
    // Distinguish calling code from backend country ID
    const isCallingCode = getCountries().some(c => {
      try { return getCountryCallingCode(c) === text; } catch (_) { return false; }
    });
    if (isCallingCode) return `+${text}`;
    if (countryIdMap[text]) {
      try { return `+${getCountryCallingCode(countryIdMap[text])}`; } catch (_) {}
    }
    return '';
  }

  const upper = text.toUpperCase();
  let iso = countryAliasMap[upper] || upper;

  if (iso.startsWith('ID:')) {
    const rawId = iso.replace('ID:', '');
    if (countryIdMap[rawId]) iso = countryIdMap[rawId];
  }

  if (iso.length > 2) {
    try {
      const names = new Intl.DisplayNames(['en'], {type: 'region'});
      iso = getCountries().find(country => {
        try {
          return names.of(country)?.toUpperCase() === iso;
        } catch (_) { return false; }
      }) || iso;
    } catch (_) { /* Fallback for runtimes without Intl.DisplayNames */ }
  }

  try { return `+${getCountryCallingCode(iso)}`; } catch (_) { return ''; }
};

// Sources are ordered by priority: selected/navigation data, account, then geo.
// Backend country IDs are never interpreted as calling codes.
const resolveCountryDialCode = (...sources) => {
  for (const source of sources) {
    if (!source) continue;
    if (typeof source !== 'object') {
      const code = normalizeDialCode(source);
      if (code) return code;
      continue;
    }
    for (const key of ['phoneCode', 'phonecode', 'PhoneCdO', 'calling_code', 'callingCode', 'callingcode', 'dialCode', 'dialcode', 'countryCode', 'phoneCd', 'country_calling_code', 'dial_code']) {
      const code = normalizeDialCode(source[key]);
      if (code) return code;
    }
    for (const key of ['country_name', 'country', 'name', 'country_code', 'sortname']) {
      const code = normalizeDialCode(source[key]);
      if (code) return code;
    }
    for (const key of ['user_address', 'user', 'personal_information', 'phonoCd', 'Newphone', 'validPh', 'mobileNo', 'returnDat', 'phoneCd', 'verifyemail', 'billing_address', 'user_billing_address']) {
      if (source[key] && typeof source[key] === 'object') {
        const code = resolveCountryDialCode(source[key]);
        if (code) return code;
      }
    }
    const identity = countryIdentity({country: source.country_name || source.country,
      country_code: source.country_code || source.sortname, country_id: source.country_id});
    const code = normalizeDialCode(identity) || normalizeDialCode(source.country);
    if (code) return code;
    for (const key of ['phone', 'mobile', 'phone_number', 'contact_no']) {
      const text = String(source[key] ?? '');
      if (text.startsWith('+')) {
        const parsed = parsePhoneNumberFromString(text);
        if (parsed) return `+${parsed.countryCallingCode}`;
      }
    }
  }
  return '';
};

// Geolocation is only a fallback after every explicit source has been checked.
export const getCountryDialCode = (...sources) =>
  resolveCountryDialCode(...sources) || resolveCountryDialCode(getCachedCountryInfo?.());

// Prefer explicit account/selected country over a shared calling code (e.g. Canada).
const phoneCountryIdentity = source => {
  if (!source || typeof source !== 'object') return '';
  for (const key of ['Newphone', 'validPh', 'mobileNo', 'user_address', 'user']) {
    const identity = phoneCountryIdentity(source[key]);
    if (identity) return identity;
  }
  return countryIdentity({country: source.country_name || source.country,
    country_code: source.country_code || source.sortname, country_id: source.country_id});
};

export const isUsPhoneContext = (callingCode, ...sources) => {
  const identity = sources.map(phoneCountryIdentity).find(Boolean);
  return identity ? identity === 'us' : isUsCallingCode(callingCode);
};

export const formatPhoneWithCountry = (value, callingCode, ...sources) => {
  const text = String(value ?? '').trim();
  if (!text) return '';
  const parsed = text.startsWith('+') ? parsePhoneNumberFromString(text) : null;
  const code = normalizeDialCode(callingCode) || (parsed ? `+${parsed.countryCallingCode}` : '');
  if (isUsPhoneContext(code, ...sources) && isValidUsPhone(text)) return `+1 ${formatUsPhone(text)}`;
  return code && !text.startsWith('+') ? `${code} ${text}` : text;
};
