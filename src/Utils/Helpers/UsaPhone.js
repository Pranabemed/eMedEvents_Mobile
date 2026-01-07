import { parsePhoneNumberFromString } from 'libphonenumber-js';
export const processPhoneNumberUSA = (number) => {
  console.log("phoneNumber-------", number);
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
        const areaCode = nationalNumber.substring(0, 3);
        const centralOfficeCode = nationalNumber.substring(3, 6);
        const lineNumber = nationalNumber.substring(6, 10);
        formattedNumber = `+${countryCode}(${areaCode}) ${centralOfficeCode}-${lineNumber}`;
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