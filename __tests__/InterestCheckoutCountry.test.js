import {resolveInterestCountry, interestLicenseFields, hasRequiredInterestLicense} from '../src/Utils/Helpers/InterestCheckoutCountry';
import {isUsCountry} from '../src/Utils/Helpers/ApplicableCountry';

describe('Interested checkout country policy', () => {
  test.each([
    [{country_id: '1'}, true],
    [{country_name: 'United States'}, true],
    [{country_code: 'US'}, true],
    [{country_name: 'United Kingdom', country_id: '232'}, false],
    [{country_code: 'GB'}, false],
    [{country_name: 'Canada', calling_code: '+1'}, false],
    [{country_name: 'India'}, false],
    [{}, false],
  ])('profile country %j controls display, validation and payload', (address, usa) => {
    const country = resolveInterestCountry({user_address: address});
    expect(isUsCountry(country)).toBe(usa);
    expect(hasRequiredInterestLicense(country, true, '', '', '')).toBe(!usa);
    expect(interestLicenseFields(country, '42')).toEqual(usa ? {license_state_id: '42'} : {});
  });
  test('fresh contact address wins over stale login country', () => {
    expect(isUsCountry(resolveInterestCountry({user_address: {country_code: 'GB'}}, {country_id: '1'}))).toBe(false);
  });
  test('user ID and telephone calling code cannot establish US identity', () => {
    expect(resolveInterestCountry({id: 1, calling_code: '+1'})).toEqual({});
  });
  test('unknown, US, then updated UK profile never retains US license policy', () => {
    const countries = [{}, {user_address: {country_id: 1}}, {user_address: {country_code: 'GB'}}];
    expect(countries.map(profile => isUsCountry(resolveInterestCountry(profile)))).toEqual([false, true, false]);
  });
});
