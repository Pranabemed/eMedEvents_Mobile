import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import countryCallingCodes from '../Helpers/Callcode.json';

const CALLING_CODE_KEY = '@CALLING_CODE';
const LOCATION_DONE = '@LOCATION_DONE';

export const getCountryDid = async onSuccess => {
  try {
    // Step 1: Check if already stored
    const storedDone = await AsyncStorage.getItem(LOCATION_DONE);
    const storedCode = await AsyncStorage.getItem(CALLING_CODE_KEY);
    if (storedDone && storedCode) {
      console.log('Loaded calling code from storage:', storedCode);
      onSuccess(storedCode);
      return;
    }

    // Step 2: Get device country code
    const locales = RNLocalize.getCountry();
    let countryCode = null;

    if (locales) {
      countryCode = locales; // e.g., "IN"
    }

    if (!countryCode) {
      countryCode = 'US'; // fallback default
    }

    // Step 3: Map ISO code to calling code
    const callingCode = countryCallingCodes[countryCode] || '+1'; // fallback +1

    // Step 4: Store in AsyncStorage
    await AsyncStorage.multiSet([
      [CALLING_CODE_KEY, callingCode],
      [LOCATION_DONE, 'true'],
    ]);

    console.log('Country calling code:', callingCode);
    onSuccess(callingCode);
  } catch (e) {
    console.log('Error in getCountryCallingCodeOnce:', e);
    onSuccess('+1'); // fallback
  }
};
