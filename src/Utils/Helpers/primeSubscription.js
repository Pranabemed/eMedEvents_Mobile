export const PRIME_NO_ACTIVE_SUBSCRIPTION_MSG = 'No active subscription is there.';

export const isPrimeSubscriptionActive = (response) => {
  if (!response || Object.keys(response).length === 0) return false;
  return response?.msg !== PRIME_NO_ACTIVE_SUBSCRIPTION_MSG && Boolean(response?.subscription);
};

export const isPrimeSubscriptionMissing = (response) => {
  if (!response || Object.keys(response).length === 0) return false;
  return response?.msg === PRIME_NO_ACTIVE_SUBSCRIPTION_MSG;
};
