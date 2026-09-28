import { countryIdentity } from './ApplicableCountry';
/** USA display formatting is separate from the international API representation. */
export const US_PHONE_PATTERN = /^\(\d{3}\) \d{3}-\d{4}$/;

export const usPhoneDigits = value => {
  const text = String(value ?? '').trim();
  // Do not silently accept extensions, letters, or another country's prefix.
  if (!/^[\d\s()+.-]*$/.test(text)) return null;
  let digits = text.replace(/\D/g, '');
  if (text.startsWith('+1') || (/^\d{11}$/.test(text) && digits.startsWith('1'))) digits = digits.slice(1);
  if (text.startsWith('+') && !text.startsWith('+1')) return null;
  return digits;
};

export const sanitizeMobileNumber = value => {
  return String(value ?? '').replace(/\D/g, '').slice(0, 10);
};

// Input normalization is deliberately separate from strict submission validation.
export const sanitizeUsPhoneDigits = value => {
  const text = String(value ?? '').trim();
  let digits = text.replace(/\D/g, '');
  if (/^\+\s*1/.test(text) || (/^\d{11}$/.test(text) && digits.startsWith('1'))) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
};

export const formatUsPhone = value => {
  const digits = sanitizeUsPhoneDigits(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export const isValidUsPhone = value => {
  const digits = usPhoneDigits(value);
  return digits !== null && digits.length === 10;
};
export const isUsCallingCode = value => /^(?:\+?1|US|USA|United States(?: of America)?)$/i.test(String(value ?? '').trim());
export const requireUsPhone = value => {
  if (!isValidUsPhone(value)) throw new Error('Enter a complete 10-digit USA cell number.');
  return formatUsPhone(value);
};

// Match the web API contract: +1 followed by the complete formatted US number.
// Phone numbers remain strings, including the leading +.
export const serializeUsPhone = value => {
  return `+1 ${requireUsPhone(value)}`;
};

const PHONE_FIELDS = new Set([
  'phone', 'cellNumber', 'mobileNumber', 'cellno', 'cellnumber', 'mobile',
  'phone_number', 'mobile_number', 'mobile_no', 'cell_no',
  'contact_number', 'contact_no', 'whatapp_number', 'whatsapp_number',
]);

/** Final safeguard for JSON API payloads, including nested attendee/billing data. */
const transformPhoneFields = (payload, inheritedUs = false, validate = true) => {
  if (Array.isArray(payload)) return payload.map(item => transformPhoneFields(item, inheritedUs, validate));
  if (!payload || Object.getPrototypeOf(payload) !== Object.prototype) return payload;
  const country = payload.country_code ?? payload.countryCode ?? payload.country_name ?? payload.country;
  const callingCode = payload.calling_code ?? payload.callingCode ?? payload.dialcode ?? payload.phoneCode;
  const explicitCountry = callingCode ?? country;
  const identity = countryIdentity({country: payload.country_name || payload.country,
    country_code: payload.country_code, country_id: payload.country_id});
  const us = identity ? identity === 'us' : payload.signup_usa === false ? false :
    payload.signup_usa === true ||
    (explicitCountry != null ? isUsCallingCode(explicitCountry) || /^US(?:A)?\(\+?1\)$/i.test(String(explicitCountry)) : inheritedUs);
  let normalizedUsPhone = false;
  const result = Object.fromEntries(Object.entries(payload).map(([key, value]) => {
    if (PHONE_FIELDS.has(key) && value !== '' && value != null && ['string', 'number'].includes(typeof value)) {
      const text = String(value).trim();
      const recognizableUs = payload.signup_usa !== false && !identity && explicitCountry == null && (/^\+1(?:\D|\d)/.test(text) || /^\(\d{0,3}(?:\)|$)/.test(text));
      const useUsFormat = us || recognizableUs;
      if (useUsFormat && (validate || isValidUsPhone(value))) {
        normalizedUsPhone = true;
        return [key, validate ? serializeUsPhone(value) : formatUsPhone(value)];
      }
      return [key, String(value)];
    }
    return [key, transformPhoneFields(value, us, validate)];
  }));
  // Keep the prefix as metadata when response normalization removes it from display text.
  if (!validate && normalizedUsPhone && !callingCode) result.callingCode = '+1';
  return result;
};

export const normalizePhonePayload = payload => transformPhoneFields(payload);

// Normalize complete legacy values before Redux/AsyncStorage population. Keep
// incomplete legacy values visible for correction instead of inventing digits.
export const normalizePhoneState = payload => transformPhoneFields(payload, false, false);
