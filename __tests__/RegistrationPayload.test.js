import {normalizeRegistrationPayload} from '../src/Utils/Helpers/RegistrationPayload';

const payload = {
  invoice: 'TMDC-test-invoice',
  attendee: [{ticket_id: '1659183', payment_ticket_id: 394238, firstname: 'Test', speciality: ['777', '518'], license_expiry_date: '', dob: '', npi_number: '', playerSessionID: 'native-session'}],
  billing: {firstname: 'Test', country_id: '104'},
  playerSessionID: 'native-session',
};

test('matches web registration identity fields without attaching an unrelated native signup session', () => {
  const result = normalizeRegistrationPayload(payload, {webCheckout: true, deviceType: 'Android', deviceToken: 'test-device-token'});
  expect(result).toEqual({
    invoice: payload.invoice,
    attendee: [{ticket_id: '1659183', payment_ticket_id: '394238', firstname: 'Test', speciality: ['777', '518'], license_expiry_date: '', dob: ''}],
    billing: payload.billing,
    deviceType: 'Android', deviceToken: 'test-device-token',
  });
  expect(payload.playerSessionID).toBe('native-session');
  expect(payload.attendee[0].payment_ticket_id).toBe(394238);
});

test('keeps native signup session fields for existing native registration', () => {
  const result = normalizeRegistrationPayload(payload, {deviceType: 'iOS'});
  expect(result.playerSessionID).toBe('native-session');
  expect(result.attendee[0].playerSessionID).toBe('native-session');
  expect(result.deviceToken).toBe('');
});

test('keeps each saved payment ticket paired with its attendee and preserves optional registration fields', () => {
  const result = normalizeRegistrationPayload({...payload, attendee: [...payload.attendee, {ticket_id: 'other-ticket', payment_ticket_id: 42, npi_number: '123'}], jsonWithoutBraces: 'custom-fields'}, {webCheckout: true, deviceType: 'iOS'});
  expect(result.attendee.map(({ticket_id, payment_ticket_id}) => ({ticket_id, payment_ticket_id}))).toEqual([
    {ticket_id: '1659183', payment_ticket_id: '394238'},
    {ticket_id: 'other-ticket', payment_ticket_id: '42'},
  ]);
  expect(result.attendee[1].npi_number).toBe('123');
  expect(result.jsonWithoutBraces).toBe('custom-fields');
});
