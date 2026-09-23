import { resolveSignupLocation } from '../src/Utils/Helpers/SignupLocation';
import { getApi } from '../src/Utils/Helpers/ApiRequest';
import { getCountryAndDialCode, getPublicIP } from '../src/Utils/Helpers/IPServer';

jest.mock('../src/Utils/Helpers/ApiRequest', () => ({ getApi: jest.fn() }));
jest.mock('../src/Utils/Helpers/IPServer', () => ({
  getCountryAndDialCode: jest.fn(), getPublicIP: jest.fn(),
}));

beforeEach(() => {
  getPublicIP.mockReturnValue('203.0.113.5');
  getCountryAndDialCode.mockResolvedValue({ country: 'IN', country_name: 'India', state_name: 'Telangana' });
});

test('skipped guest draft is not required to resolve signup location', async () => {
  getApi.mockResolvedValueOnce({ data: { countries: [{ id: 99, name: 'India' }] } })
    .mockResolvedValueOnce({ data: { states: [{ id: 88, name: 'Telangana' }] } });
  const payload = { signup_usa: false, state_id: '', email: 'test@example.com' };
  expect(await resolveSignupLocation(payload)).toEqual({ ...payload, country_id: 99, state_id: 88, ip: '203.0.113.5' });
  expect(payload.state_id).toBe('');
  expect(getApi).toHaveBeenLastCalledWith('master/states?country_id=99');
});

test('preserves selected US practice state even when abroad', async () => {
  expect(await resolveSignupLocation({ signup_usa: true, state_id: 7 })).toEqual({
    signup_usa: true, country_id: '1', state_id: 7, ip: '203.0.113.5',
  });
  expect(getApi).not.toHaveBeenCalled();
});

test('does not assign a foreign IP state to a US account', async () => {
  const result = await resolveSignupLocation({ signup_usa: true, state_id: '' });
  expect(result.state_id).toBe('');
  expect(getApi).not.toHaveBeenCalled();
});

test('lookup failure preserves signup values and available IP', async () => {
  getCountryAndDialCode.mockRejectedValue(new Error('offline'));
  const result = await resolveSignupLocation({ country_id: 2, state_id: 3 });
  expect(result).toEqual({ country_id: 2, state_id: 3, ip: '203.0.113.5' });
});
