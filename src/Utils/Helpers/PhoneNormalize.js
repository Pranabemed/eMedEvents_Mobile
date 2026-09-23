import { formatUsPhone, isValidUsPhone, usPhoneDigits } from './UsPhone';
/**
 * Phone normalize utility module. Collects reusable helper functions and constants for shared application behavior. Exported members: processPhoneNumber.
 */

import { parsePhoneNumber } from 'libphonenumber-js';
export /**
 * Process phone number utility helper.
 * @param {number} number - Input value.
 * @returns {void}
 */
const processPhoneNumber = (number) => {
  try {
    if (isValidUsPhone(number)) {
      return { isValid: true, countryCode: '+1', nationalNumber: usPhoneDigits(number),
        country: 'US', formattedNumber: formatUsPhone(number), rawInput: number };
    }
    const phoneNumber = parsePhoneNumber(number);
    const countryCode = phoneNumber.countryCallingCode;
    const nationalNumber = phoneNumber.nationalNumber;
    const country = phoneNumber.country; 
    const formattedNumber = countryCode === '1' ? formatUsPhone(nationalNumber) : phoneNumber.formatInternational();
    return {
      isValid: true,
      countryCode: `+${countryCode}`,
      nationalNumber,
      country, 
      formattedNumber,
      rawInput: number,
    };
  } catch (error) {
    return { error: error.message };
  }
};