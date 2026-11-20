test.each(['https://newdev.emedevents.com', 'https://v2api.emedevents.com/'])('checkout follows constants.BASE_URL: %s', baseUrl => {
  jest.resetModules();
  jest.doMock('../src/Utils/Helpers/constants', () => ({__esModule: true, default: {BASE_URL: baseUrl}}));
  const {CONFERENCE_CHECKOUT_API_BASE, conferenceCheckoutEndpoint} = require('../src/Utils/Helpers/ConferenceCheckoutApi');
  const expected = baseUrl.replace(/\/+$/, '');
  expect(CONFERENCE_CHECKOUT_API_BASE).toBe(expected);
  expect(conferenceCheckoutEndpoint('transaction/saveRegistration', expected)).toBe(`${expected}/transaction/saveRegistration`);
  expect(conferenceCheckoutEndpoint('transaction/saveRegistration')).toBe('transaction/saveRegistration');
});
afterEach(() => {
  jest.dontMock('../src/Utils/Helpers/constants');
  jest.resetModules();
});
