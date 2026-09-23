import { formatUsPhone, isValidUsPhone, normalizePhonePayload, requireUsPhone } from '../src/Utils/Helpers/UsPhone';

const canonical = '(577) 900-1234';

test.each(['5779001234', '577-900-1234', '577 900 1234', '+1 577 900 1234', '+1 (577) 900-1234', '15779001234', canonical, 5779001234])('normalizes %s without digit loss', input => {
  expect(requireUsPhone(input)).toBe(canonical);
  expect(formatUsPhone(formatUsPhone(input))).toBe(canonical);
});

test.each(['(577) - 900', '(577) 900-', '577900', '(577) 900-12', '+1 577900123', '57790012345', '+44 5779001234', '5779001234 ext 2', '', null])('blocks incomplete/invalid input %s', input => {
  expect(isValidUsPhone(input)).toBe(false);
  expect(() => requireUsPhone(input)).toThrow('10-digit');
});

test('typing, deleting and pasting preserve all digits', () => {
  let value = '';
  for (const digit of '5779001234') value = formatUsPhone(value + digit);
  expect(value).toBe(canonical);
  expect(formatUsPhone(value.slice(0, -1))).toBe('(577) 900-123');
  expect(formatUsPhone('+1 (577) 900-1234')).toBe(canonical);
  expect(formatUsPhone('577900123456')).toBe('577900123456');
});

test('signup, checkout, billing and profile payloads retain the same value', () => {
  const signup = normalizePhonePayload({ signup_usa: true, phone: '+1 5779001234' });
  const checkout = normalizePhonePayload({ attendee: [{ country_id: '1', phone: signup.phone }], billing: { country_id: 1, phone: signup.phone } });
  const profile = normalizePhonePayload({ country_id: 1, contact_number: checkout.attendee[0].phone });
  expect([signup.phone, checkout.attendee[0].phone, checkout.billing.phone, profile.contact_number]).toEqual(Array(4).fill('+1 (577) 900-1234'));
});

test('blocks nested invalid phone payloads and leaves source state untouched', () => {
  const input = { attendee: [{ country_id: 1, phone: '577900' }] };
  expect(() => normalizePhonePayload(input)).toThrow('10-digit');
  expect(input.attendee[0].phone).toBe('577900');
});

test('supports aliases and calling-code metadata while preserving non-USA numbers', () => {
  expect(normalizePhonePayload({ calling_code: '+1', cellNumber: '5779001234', mobileNumber: canonical })).toEqual({ calling_code: '+1', cellNumber: '+1 (577) 900-1234', mobileNumber: '+1 (577) 900-1234' });
  const foreign = { country_id: 99, calling_code: '91', phone: '+91 98765 43210' };
  expect(normalizePhonePayload(foreign)).toEqual(foreign);
  expect(normalizePhonePayload({ phone: '+15779001234' }).phone).toBe('+1 (577) 900-1234');
  expect(normalizePhonePayload({ phone: '', email: 'someone@example.com', phone_otp: '123456' })).toEqual({ phone: '', email: 'someone@example.com', phone_otp: '123456' });
});

test('complete returned values normalize before state population; damaged records remain visible', () => {
  const { normalizePhoneState } = require('../src/Utils/Helpers/UsPhone');
  expect(normalizePhoneState({ user_address: { country_id: 1, contact_no: '+1 5779001234' } }).user_address.contact_no).toBe(canonical);
  expect(normalizePhoneState({ user_address: { country_id: 1, contact_no: '(577) - 900' } }).user_address.contact_no).toBe('(577) - 900');
});

test('authentication parsers accept the canonical navigation value without a country prefix', () => {
  const { processPhoneNumber } = require('../src/Utils/Helpers/PhoneNormalize');
  const { processPhoneNumberUSA } = require('../src/Utils/Helpers/UsaPhone');
  for (const parse of [processPhoneNumber, processPhoneNumberUSA]) {
    expect(parse(canonical)).toMatchObject({ isValid: true, countryCode: '+1', nationalNumber: '5779001234', formattedNumber: canonical });
  }
});

test.each(['phone', 'mobile', 'mobileNumber', 'cellNumber', 'contact_number', 'contact_no', 'mobile_number'])('USA %s is serialized in the web format without digit loss', field => {
  const payload = normalizePhonePayload({country_id: '1', [field]: '(415) 555-2671'});
  expect(payload[field]).toBe('+1 (415) 555-2671');
  expect(typeof payload[field]).toBe('string');
});

test('legacy numeric phone values are stringified; non-US leading zeros are retained', () => {
  expect(normalizePhonePayload({mobile: 4155552671}).mobile).toBe('4155552671');
  expect(normalizePhonePayload({country_code: 'GB', mobile: '02079460018'}).mobile).toBe('02079460018');
});
