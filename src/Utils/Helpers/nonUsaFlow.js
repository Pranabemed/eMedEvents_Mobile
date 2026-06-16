import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from './constants';

export const NON_USA_USER_TYPE = 'non_usa';

const normalizeText = (value) => String(value || '').trim().toLowerCase();

export const isUsaCountryCode = (value) => {
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

export const isNonUsaAccount = (user = {}, fallbackFlowState = null) => {
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

export const readNonUsaFlowState = async () => {
  try {
    const raw = await AsyncStorage.getItem(constants.NON_USA_FLOW_STATE);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const writeNonUsaFlowState = async (patch = {}) => {
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

export const clearNonUsaFlowState = async () => {
  try {
    await AsyncStorage.removeItem(constants.NON_USA_FLOW_STATE);
  } catch (error) {
    return null;
  }
};
