/**
 * Guest signup draft storage helper module.
 *
 * Persists the guest user's specialty, profession, and email so the existing
 * signup flow can restore the same values without changing UI or navigation.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './constants';

/**
 * Normalizes guest signup draft values.
 *
 * @param {Object|null|undefined} draft - Raw draft payload.
 * @returns {{specialty: string, profession: string, email: string}}
 */
/**
 * Normalize guest signup draft utility helper.
 * @param {*} draft - Input value.
 * @returns {Object}
 */
export const normalizeGuestSignupDraft = draft => ({
  specialty: String(draft?.specialty || '').trim(),
  profession: String(draft?.profession || '').trim(),
  email: String(draft?.email || '').trim(),
});

/**
 * Saves guest signup draft locally.
 *
 * @param {Object} draft - Guest draft payload.
 * @returns {Promise<null|{specialty: string, profession: string, email: string}>}
 */
/**
 * Save guest signup draft utility helper.
 *
 * @async
 * @param {*} draft - Input value.
 * @returns {Promise<*>}
 */
export const saveGuestSignupDraft = async draft => {
  const normalizedDraft = normalizeGuestSignupDraft(draft);
  if (!normalizedDraft.specialty && !normalizedDraft.profession && !normalizedDraft.email) {
    await AsyncStorage.removeItem(constants.GUEST_SIGNUP_DRAFT);
    return null;
  }

  await AsyncStorage.setItem(constants.GUEST_SIGNUP_DRAFT, JSON.stringify(normalizedDraft));
  return normalizedDraft;
};

/**
 * Loads the stored guest signup draft.
 *
 * @returns {Promise<null|{specialty: string, profession: string, email: string}>}
 */
/**
 * Load guest signup draft utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
export const loadGuestSignupDraft = async () => {
  try {
    const rawDraft = await AsyncStorage.getItem(constants.GUEST_SIGNUP_DRAFT);
    if (!rawDraft) {
      return null;
    }

    return normalizeGuestSignupDraft(JSON.parse(rawDraft));
  } catch (error) {
    console.log('[GuestSignupDraft] load error', error);
    return null;
  }
};

/**
 * Clears the stored guest signup draft.
 *
 * @returns {Promise<void>}
 */
/**
 * Clear guest signup draft utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
export const clearGuestSignupDraft = async () => {
  try {
    await AsyncStorage.removeItem(constants.GUEST_SIGNUP_DRAFT);
  } catch (error) {
    console.log('[GuestSignupDraft] clear error', error);
  }
};
