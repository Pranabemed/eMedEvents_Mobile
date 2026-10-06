/**
 * Prime subscription utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: PRIME_NO_ACTIVE_SUBSCRIPTION_MSG, isPrimeSubscriptionActive, isPrimeSubscriptionMissing.
 */

/**
 * Prime no active subscription msg constant.
 * @returns {string}
 */
/**
 * Prime no active subscription msg constant.
 * @returns {string}
 */
export const PRIME_NO_ACTIVE_SUBSCRIPTION_MSG = 'No active subscription is there.';

export /**
 * Is prime subscription active utility helper.
 * @param {*} response - Input value.
 * @returns {*}
 */
const isPrimeSubscriptionActive = (response) => {
  if (!response || Object.keys(response).length === 0) return false;
  return response?.msg !== PRIME_NO_ACTIVE_SUBSCRIPTION_MSG && Boolean(response?.subscription);
};

export /**
 * Is prime subscription missing utility helper.
 * @param {*} response - Input value.
 * @returns {*}
 */
const isPrimeSubscriptionMissing = (response) => {
  if (!response || Object.keys(response).length === 0) return false;
  return response?.msg === PRIME_NO_ACTIVE_SUBSCRIPTION_MSG;
};

// Resolve account country from live profile/auth data, independently of travel/IP.
// A known profile country takes precedence over older auth/storage fallbacks.
export const hasUsaPrimeProfile = (...sources) => {
  for (const source of sources) {
    const user = source?.user || source;
    if (!user) continue;
    const address = user.user_address || user.contact_information || {};
    const country = String(address.country_code || address.country_name || user.country_code || user.country_name || user.countryName || user.country || '').trim().toUpperCase();
    const countryId = String(address.country_id || user.country_id || user.countryId || '').trim();
    if (country) return ['US', 'USA', 'UNITED STATES', 'UNITED STATES OF AMERICA'].includes(country);
    if (countryId && countryId !== '0') return ['1', '233'].includes(countryId);
    if ([true, 1, '1'].includes(user.usa_user)) return true;
    if ([false, 0, '0'].includes(user.usa_user) || [true, 1, '1'].includes(user.is_non_usa)) return false;
  }
  return false;
};

export const isPrimePhysicianProfile = (...sources) => {
  for (const source of sources) {
    const user = source?.user || source;
    const info = user?.professional_information || user;
    const name = String(info?.profession || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const type = String(info?.profession_type || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!name && !type) continue;
    return ['physicianmd', 'physiciando', 'physiciandpm'].includes(name) ||
      (name === 'physician' && ['md', 'do', 'dpm'].includes(type));
  }
  return false;
};
