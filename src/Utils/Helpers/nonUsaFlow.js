/**
 * Non usa flow utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: NON_USA_USER_TYPE, NON_USA_PROFESSION_UPDATE_REQUIRED_KEY, NON_USA_STATE_LICENSE_FLOW_COMPLETED_KEY, normalizeText, isUsaCountryCode, isNonUsaAccount, readNonUsaFlowState, writeNonUsaFlowState, clearNonUsaFlowState, readNonUsaPermanentFlags, markNonUsaProfessionUpdateRequired, markNonUsaStateLicenseFlowCompleted, clearNonUsaStateLicenseFlowCompleted.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './constants';

/**
 * Non usa user type constant.
 * @returns {string}
 */
export const NON_USA_USER_TYPE = 'non_usa';
/**
 * Non usa profession update required key constant.
 * @returns {string}
 */
export const NON_USA_PROFESSION_UPDATE_REQUIRED_KEY = 'nonUSAProfessionUpdateRequired';
/**
 * Non usa state license flow completed key constant.
 * @returns {string}
 */
export const NON_USA_STATE_LICENSE_FLOW_COMPLETED_KEY = 'nonUSAStateLicenseFlowCompleted';

/**
 * Normalize text utility helper.
 * @param {*} value - Input value.
 * @returns {*}
 */
const normalizeText = (value) => String(value || '').trim().toLowerCase();

export /**
 * Is usa country code utility helper.
 * @param {*} value - Input value.
 * @returns {*}
 */
const isUsaCountryCode = (value) => {
  const code = normalizeText(value).replace(/\s+/g, '');
  return (
    code === 'us' ||
    code === 'usa' ||
    code === 'unitedstates' ||
    code === 'unitedstatesofamerica' ||
    code === '+1' ||
    code === '1'
  );
};

export /**
 * Is non usa account utility helper.
 * @param {Object} user - Input value.
 * @param {*} fallbackFlowState - Input value.
 * @returns {boolean}
 */
const isNonUsaAccount = (user = {}, fallbackFlowState = null) => {
  if (
    user?.usa_user === true ||
    user?.usa_user === 1 ||
    user?.usa_user === '1' ||
    user?.is_non_usa === false ||
    user?.is_non_usa === 0 ||
    user?.is_non_usa === '0'
  ) {
    return false;
  }

  if (fallbackFlowState?.isNonUsa === true) return true;
  if (user?.is_non_usa === true || user?.is_non_usa === 1 || user?.is_non_usa === '1') return true;
  if (user?.usa_user === false || user?.usa_user === 0 || user?.usa_user === '0') return true;

  const countryId = String(user?.country_id || user?.countryId || '').trim();
  const countryName = normalizeText(
    user?.country_name ||
    user?.countryName ||
    user?.country ||
    user?.nationality
  );
  const countryCode = normalizeText(
    user?.country_code ||
    user?.countryCode ||
    user?.callingCode ||
    user?.calling_code
  );

  if (countryId && !['1', '233', '0'].includes(countryId)) {
    return true;
  }

  if (countryName && !countryName.includes('usa') && !countryName.includes('united states') && !countryName.includes('us')) {
    return true;
  }

  if (countryCode && !isUsaCountryCode(countryCode)) {
    return true;
  }

  return false;
};

export /**
 * Read non usa flow state utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
const readNonUsaFlowState = async () => {
  try {
    const raw = await AsyncStorage.getItem(constants.NON_USA_FLOW_STATE);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export /**
 * Write non usa flow state utility helper.
 *
 * @async
 * @param {Object} patch - Input value.
 * @returns {Promise<*>}
 */
const writeNonUsaFlowState = async (patch = {}) => {
  try {
    const existingRaw = await AsyncStorage.getItem(constants.NON_USA_FLOW_STATE);
    const existing = existingRaw ? JSON.parse(existingRaw) : {};
    const nextState = {
      userType: NON_USA_USER_TYPE,
      isNonUsa: true,
      professionCompleted: false,
      emailVerified: false,
      ...existing,
      ...patch,
    };
    await AsyncStorage.setItem(constants.NON_USA_FLOW_STATE, JSON.stringify(nextState));
    return nextState;
  } catch (error) {
    return null;
  }
};

export /**
 * Clear non usa flow state utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
const clearNonUsaFlowState = async () => {
  try {
    await AsyncStorage.removeItem(constants.NON_USA_FLOW_STATE);
  } catch (error) {
    return null;
  }
};

export /**
 * Read non usa permanent flags utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
const readNonUsaPermanentFlags = async () => {
  try {
    const [professionUpdateRequired, stateLicenseFlowCompleted] = await Promise.all([
      AsyncStorage.getItem(NON_USA_PROFESSION_UPDATE_REQUIRED_KEY),
      AsyncStorage.getItem(NON_USA_STATE_LICENSE_FLOW_COMPLETED_KEY),
    ]);

    return {
      professionUpdateRequired: professionUpdateRequired === 'true',
      stateLicenseFlowCompleted: stateLicenseFlowCompleted === 'true',
    };
  } catch (error) {
    return {
      professionUpdateRequired: false,
      stateLicenseFlowCompleted: false,
    };
  }
};

export /**
 * Mark non usa profession update required utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
const markNonUsaProfessionUpdateRequired = async () => {
  try {
    await AsyncStorage.setItem(NON_USA_PROFESSION_UPDATE_REQUIRED_KEY, 'true');
    return true;
  } catch (error) {
    return false;
  }
};

export /**
 * Mark non usa state license flow completed utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
const markNonUsaStateLicenseFlowCompleted = async () => {
  try {
    await AsyncStorage.setItem(NON_USA_STATE_LICENSE_FLOW_COMPLETED_KEY, 'true');
    return true;
  } catch (error) {
    return false;
  }
};

export /**
 * Clear non usa state license flow completed utility helper.
 *
 * @async
 * @returns {Promise<*>}
 */
const clearNonUsaStateLicenseFlowCompleted = async () => {
  try {
    await AsyncStorage.removeItem(NON_USA_STATE_LICENSE_FLOW_COMPLETED_KEY);
    return true;
  } catch (error) {
    return false;
  }
};
