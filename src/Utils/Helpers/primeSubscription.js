/**
 * Prime subscription utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: PRIME_NO_ACTIVE_SUBSCRIPTION_MSG, isPrimeSubscriptionActive, isPrimeSubscriptionMissing, computeNonOverlappingSubscriptions.
 */

import moment from 'moment';

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

export const isSameState = (a, b) => {
  if (!a || !b) return false;
  const aStateId = a?.state_id ?? a?.id;
  const bStateId = b?.state_id ?? b?.id;
  if (aStateId != null && bStateId != null && String(aStateId) === String(bStateId) && String(aStateId) !== '0') {
    return true;
  }
  const aName = String(a?.state_name ?? a?.state ?? a?.name ?? '').trim().toLowerCase();
  const bName = String(b?.state_name ?? b?.state ?? b?.name ?? '').trim().toLowerCase();
  if (aName && bName && aName === bName && aName !== 'null' && aName !== 'undefined') {
    return true;
  }
  return false;
};

export const isValidStateLicense = (item) => {
  if (!item || typeof item !== 'object') return false;
  const name = item?.state_name ?? item?.state ?? item?.name;
  if (!name) return false;
  const trimmed = String(name).trim();
  if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') return false;
  const stateId = item?.state_id ?? item?.id;
  if (stateId == null || stateId === 0 || stateId === '0') return false;
  if (item?.is_deleted === 1 || item?.is_deleted === true || item?.status === 'deleted') return false;
  return true;
};

export const filterValidLicensures = (licensures, profileLicensures = null) => {
  if (!Array.isArray(licensures)) return [];
  const valid = licensures.filter(state => {
    if (!isValidStateLicense(state)) return false;
    if (Array.isArray(profileLicensures) && profileLicensures.length > 0) {
      const matchesProfile = profileLicensures.some(p => {
        if (!isValidStateLicense(p)) return false;
        return isSameState(p, state);
      });
      if (!matchesProfile) return false;
    }
    return true;
  });

  // Deduplicate by state (state_id and state_name) so the same state is never shown multiple times
  const deduplicated = [];
  for (const item of valid) {
    const existingIndex = deduplicated.findIndex(existing => isSameState(existing, item));
    if (existingIndex === -1) {
      deduplicated.push(item);
    } else {
      const existing = deduplicated[existingIndex];
      deduplicated[existingIndex] = {
        ...item,
        ...existing,
        license_number: existing?.license_number || item?.license_number,
        expiry_date: existing?.expiry_date || item?.expiry_date,
        credits_data: existing?.credits_data || item?.credits_data,
        board_id: existing?.board_id || item?.board_id,
        board_name: existing?.board_name || item?.board_name,
        licensure_logo: existing?.licensure_logo || item?.licensure_logo,
      };
    }
  }
  return deduplicated;
};

/**
 * Ensures multiple or consecutive Prime subscriptions do not overlap.
 * When a user purchases another Prime subscription while a current subscription is active,
 * the new subscription begins immediately after the existing subscription expires.
 *
 * Example:
 * Existing subscription: 09-Nov-2026 to 10-Nov-2027
 * New subscription:      10-Nov-2027 to 11-Nov-2028
 *
 * @param {Array<Object>} subscriptions
 * @returns {Array<Object>}
 */
export const computeNonOverlappingSubscriptions = (subscriptions) => {
  if (!Array.isArray(subscriptions) || subscriptions.length === 0) return [];

  const parseDate = (val) => {
    if (!val) return null;
    const m = moment(val, [
      'DD-MMM-YYYY',
      'MMM DD, YYYY',
      'MMMM DD, YYYY',
      'YYYY-MM-DD',
      'YYYY-MM-DD HH:mm:ss',
      moment.ISO_8601,
    ]);
    return m.isValid() ? m : null;
  };

  // Sort chronologically ascending by nominal start/created date, then by id
  const sorted = [...subscriptions].sort((a, b) => {
    const dateA = parseDate(a?.start_date || a?.created_date)?.valueOf() || 0;
    const dateB = parseDate(b?.start_date || b?.created_date)?.valueOf() || 0;
    if (dateA !== dateB) return dateA - dateB;
    return (Number(a?.id) || 0) - (Number(b?.id) || 0);
  });

  const result = [];
  let previousEndMoment = null;

  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    const originalStartMoment = parseDate(item?.start_date || item?.created_date);
    const originalEndMoment = parseDate(item?.expiry_date || item?.end_date);

    let startMoment = originalStartMoment ? moment(originalStartMoment) : moment();

    // Default duration: 1 year + 1 day (e.g. 09-Nov-2026 -> 10-Nov-2027)
    let endMoment = originalEndMoment
      ? moment(originalEndMoment)
      : moment(startMoment).add(1, 'year').add(1, 'day');

    // If a previous subscription is already active and ends after this subscription's nominal start,
    // chain this subscription to start on the previous subscription's expiry date.
    if (previousEndMoment && previousEndMoment.isAfter(startMoment)) {
      startMoment = moment(previousEndMoment);
      endMoment = moment(startMoment).add(1, 'year').add(1, 'day');
      if (originalEndMoment && originalEndMoment.isAfter(endMoment)) {
        endMoment = moment(originalEndMoment);
      }
    }

    previousEndMoment = moment(endMoment);

    const displayStartDate = startMoment.format('DD-MMM-YYYY');
    const displayExpiryDate = endMoment.format('DD-MMM-YYYY');

    result.push({
      ...item,
      effectiveStartDate: startMoment.toDate(),
      effectiveExpiryDate: endMoment.toDate(),
      displayStartDate,
      displayExpiryDate,
      periodString: `${displayStartDate} to ${displayExpiryDate}`,
    });
  }

  return result;
};
