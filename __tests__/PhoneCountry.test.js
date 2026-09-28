import { getCountryDialCode, formatPhoneWithCountry } from '../src/Utils/Helpers/PhoneCountry';

test.each([
  [{Newphone: {phoneCode: '+91'}}, '+91'],
  [{validPh: {phonecode: '1'}}, '+1'],
  [{user: {country_id: 1}}, '+1'],
  [{user_address: {calling_code: '44'}}, '+44'],
  [{country_code: 'CA'}, '+1'],
  [{country: 'IN'}, '+91'],
  [{phone: '+919876543210'}, '+91'],
  [{id: 1}, ''],
  [{country_id: 44}, ''],
  [{countryCode: 'null'}, ''],
])('resolves navigation/account country metadata %j', (source, expected) => {
  expect(getCountryDialCode(source)).toBe(expected);
});

test('selected country has priority over account/geo defaults', () => {
  expect(getCountryDialCode({phoneCode: '+44'}, {user: {country_id: 1}}, {dialCode: '+91'})).toBe('+44');
});

test.each([
  ['1234567890', '+1', '+1 (123) 456-7890'],
  ['+1 (123) 456-7890', '+1', '+1 (123) 456-7890'],
  ['(123) 456-7890', '1', '+1 (123) 456-7890'],
  ['9876543210', '+91', '+91 9876543210'],
  ['+919876543210', '+91', '+919876543210'],
  ['02079460018', '+44', '+44 02079460018'],
  ['', '+1', ''],
])('verification display preserves the prefix for %s', (phone, code, expected) => {
  expect(formatPhoneWithCountry(phone, code)).toBe(expected);
});

test('login response normalization retains the country for verification and saved sessions', () => {
  const {normalizePhoneState} = require('../src/Utils/Helpers/UsPhone');
  const response = normalizePhoneState({user: {id: 99, phone: '+15779001234'}});
  expect(response.user.phone).toBe('(577) 900-1234');
  expect(getCountryDialCode(response)).toBe('+1');
  expect(formatPhoneWithCountry(response.user.phone, getCountryDialCode(response))).toBe('+1 (577) 900-1234');
});

test('Canadian auth and verification preserve national formatting despite +1', () => {
  const {isUsPhoneContext} = require('../src/Utils/Helpers/PhoneCountry');
  expect(isUsPhoneContext('+1', {user: {country_code: 'CA'}})).toBe(false);
  expect(formatPhoneWithCountry('4165551234', '+1', {user: {country_code: 'CA'}})).toBe('+1 4165551234');
});
