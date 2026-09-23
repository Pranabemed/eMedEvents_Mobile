import {countryIdentity, isUsCountry, professionCountryParams} from '../src/Utils/Helpers/ApplicableCountry';
import reducer, {professionRequest} from '../src/Redux/Reducers/AuthReducer';

describe('Applicable country for professions and medical licenses', () => {
  test.each(['US', 'USA', 'United States', 'United States of America'])('US alias %s', country => {
    expect(isUsCountry({country})).toBe(true);
    expect(professionCountryParams({country})).toEqual({});
  });
  test.each(['UK', 'GB', 'United Kingdom', 'Canada', 'India', 'Australia', 'Austria', 'Russia'])('non-US %s overrides stale ID and phone code', country => {
    const attendee = {country, country_id: 1, dialcode: '+1'};
    expect(isUsCountry(attendee)).toBe(false);
    expect(professionCountryParams(attendee)).toEqual({other_country: 1});
  });
  test('only country ID 1 is US; telephone codes and missing countries are not US', () => {
    expect(isUsCountry({country_id: 1})).toBe(true);
    expect(isUsCountry({country_id: 233})).toBe(false);
    expect(isUsCountry({dialcode: '+1'})).toBe(false);
    expect(countryIdentity({})).toBe('');
    expect(professionCountryParams({})).toEqual({other_country: 1});
  });
  test('country request clears cached professions and specialties', () => {
    const state = reducer(undefined, {type: 'init'});
    const updated = reducer({...state, professionResponse: {profession_credentials: ['USA']}, specializationResponse: {specialities: ['USA']}}, professionRequest({other_country: 1}));
    expect(updated.professionResponse).toBeNull();
    expect(updated.specializationResponse).toBeNull();
  });
});
