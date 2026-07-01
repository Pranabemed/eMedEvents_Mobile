/**
 * Prime subscription utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: PRIME_NO_ACTIVE_SUBSCRIPTION_MSG, isPrimeSubscriptionActive, isPrimeSubscriptionMissing.
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
