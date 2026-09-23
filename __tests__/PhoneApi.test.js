import axios from 'axios';
import { postApi } from '../src/Utils/Helpers/ApiRequest';

jest.mock('axios', () => {
  const actual = jest.requireActual('axios');
  actual.defaults.adapter = jest.fn(async config => ({ data: { success: true }, status: 200, statusText: 'OK', headers: {}, config }));
  return actual;
});
jest.mock('../src/Utils/Helpers/TokenManager', () => ({}));
jest.mock('../src/Utils/Helpers/UserAgent', () => () => 'test');
jest.mock('../src/Utils/Helpers/BasicAuth', () => ({ getBasicAuthorizationHeader: jest.fn(async () => ''), fetchAndStoreBasicAuthToken: jest.fn() }));

test.each([{ phone: '+1 5779001234' }, { country_id: 1, phone: '5779001234' }])('API transport sends the +1 prefix and all national digits as a string', async payload => {
  await postApi('user/test', payload);
  const config = axios.defaults.adapter.mock.calls[0][0];
  expect(JSON.parse(config.data).phone).toBe('+1 (577) 900-1234');
});

test.each(['(577) - 900', '(577) 900-', '577900', '(577) 900-12'])('API transport rejects %s before sending', async phone => {
  await expect(postApi('user/test', { attendee: [{ country_id: 1, phone }] })).rejects.toThrow('10-digit');
  expect(axios.defaults.adapter).not.toHaveBeenCalled();
});

test('serialized retries keep the +1 prefix exactly once', async () => {
  await postApi('user/test', JSON.stringify({ country_id: 1, phone: '+1 5779001234' }));
  expect(JSON.parse(axios.defaults.adapter.mock.calls[0][0].data).phone).toBe('+1 (577) 900-1234');
});

test('response values are normalized before callers populate Redux and storage', async () => {
  axios.defaults.adapter.mockImplementationOnce(async config => ({ data: { user: { phone: '+1 5779001234' } }, status: 200, headers: {}, config }));
  const response = await postApi('user/test', {});
  expect(response.data.user.phone).toBe('(577) 900-1234');
});

test.each([
  ['user/signup', {signup_usa: true, phone: '(415) 555-2671'}, data => data.phone],
  ['user/contactInformation', {country_id: '1', contact_number: '(415) 555-2671'}, data => data.contact_number],
  ['user/testCheckout', {attendee: [{country_id: '1', phone: '(415) 555-2671'}], billing: {country_id: '1', phone: '(415) 555-2671'}}, data => data.attendee[0].phone],
  ['user/testMobile', {countryCode: '+1', mobileNumber: '(415) 555-2671'}, data => data.mobileNumber],
])('%s serializes all ten digits into the actual HTTP body', async (endpoint, payload, phoneFrom) => {
  await postApi(endpoint, payload);
  const body = JSON.parse(axios.defaults.adapter.mock.calls[0][0].data);
  expect(phoneFrom(body)).toBe('+1 (415) 555-2671');
  expect(typeof phoneFrom(body)).toBe('string');
  if (body.billing) expect(body.billing.phone).toBe('+1 (415) 555-2671');
});

test('simulated backend round-trip preserves digits and restores profile display formatting', async () => {
  axios.defaults.adapter.mockImplementationOnce(async config => {
    const body = JSON.parse(config.data);
    expect(body.mobileNumber).toBe('+1 (415) 555-2671');
    return {data: {user: {country_id: '1', mobileNumber: body.mobileNumber}}, status: 200, headers: {}, config};
  });
  const response = await postApi('user/testMobile', {country_id: '1', mobileNumber: '(415) 555-2671'});
  expect(response.data.user.mobileNumber).toBe('(415) 555-2671');
});

test('signup example sends +1 while retaining all ten digits', async () => {
  await postApi('user/signup', {signup_usa: true, phone: '(646) 656-6666'});
  expect(JSON.parse(axios.defaults.adapter.mock.calls[0][0].data).phone).toBe('+1 (646) 656-6666');
});

test.each(['5959659595', '(595) 965-9595', '+15959659595', '+1 (595) 965-9595'])('matches the web signup format for %s without duplicating +1', async phone => {
  await postApi('user/signup', {signup_usa: true, phone});
  expect(JSON.parse(axios.defaults.adapter.mock.calls[0][0].data).phone).toBe('+1 (595) 965-9595');
});
