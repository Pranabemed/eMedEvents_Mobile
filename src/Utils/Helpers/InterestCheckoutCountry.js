import {countryIdentity, isUsCountry} from './ApplicableCountry';

// Only explicit country fields qualify: a user's `id` and phone code are not country IDs.
export const resolveInterestCountry = (...sources) => {
  for (const source of sources) {
    for (const value of [source?.user_address, source?.user, source]) {
      if (!value) continue;
      const country = {
        country: value.country_name || value.country,
        country_code: value.country_code || value.sortname,
        country_id: value.country_id,
      };
      if (countryIdentity(country)) return country;
    }
  }
  return {};
};

export const interestLicenseFields = (country, licenseStateId) =>
  isUsCountry(country) ? {license_state_id: licenseStateId || ''} : {};

export const hasRequiredInterestLicense = (country, hasStates, state, number, expiry) =>
  !isUsCountry(country) || Boolean((!hasStates || state) && number && expiry);
