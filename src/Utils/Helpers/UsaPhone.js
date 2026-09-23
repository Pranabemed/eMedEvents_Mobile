import { formatUsPhone, isValidUsPhone, usPhoneDigits } from './UsPhone';
/**
 * Usa phone utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: processPhoneNumberUSA.
 */

import { parsePhoneNumberFromString } from 'libphonenumber-js';
export /**
 * Process phone number usa utility helper.
 * @param {number} number - Input value.
 * @returns {void}
 */
const processPhoneNumberUSA = (number) => {
  if (isValidUsPhone(number)) {
    return { isValid: true, countryCode: '+1', nationalNumber: usPhoneDigits(number),
      country: 'US', formattedNumber: formatUsPhone(number), rawInput: number };
  }
  try {
    let phoneNumber = parsePhoneNumberFromString(number);
    if (!phoneNumber || !phoneNumber.isValid()) {
      phoneNumber = parsePhoneNumberFromString(number, 'US');
    }
    if (!phoneNumber || !phoneNumber.isValid()) {
      return { error: 'Invalid phone number' };
    }
    const countryCode = phoneNumber.countryCallingCode;
    const nationalNumber = phoneNumber.nationalNumber;
    const country = phoneNumber.country; 
    let formattedNumber;
    if (country == 'US') {
      if (nationalNumber.length >= 10) {
        formattedNumber = formatUsPhone(nationalNumber);
      } else {
        formattedNumber = phoneNumber.formatInternational();
      }
    } else {
      formattedNumber = phoneNumber.formatInternational();
    }
    
    return {
      isValid: true,
      countryCode: `+${countryCode}`,
      nationalNumber,
      country, 
      formattedNumber,
      rawInput: number,
    };
  } catch (error) {
    return { error: error.message || 'Unknown error processing phone number' };
  }
};