import { getApi } from './ApiRequest';
import { getCountryAndDialCode, getPublicIP } from './IPServer';

const normalized = value => String(value || '').trim().toLowerCase();

// Resolve backend IDs from master data, never from a provider's numeric IDs.
export const resolveSignupLocation = async (payload = {}) => {
  const result = { ...payload };
  try {
    const geo = await getCountryAndDialCode();
    result.ip = result.ip || getPublicIP() || '';
    if (!result.country_id) {
      if (payload.signup_usa === true) {
        result.country_id = '1';
      } else if (geo?.country) {
        const response = await getApi('master/countries');
        const countries = response?.data?.countries;
        const country = Array.isArray(countries) && countries.find(item =>
          [item.name, item.country_name, item.code, item.iso2, item.country_code]
            .some(value => value && [normalized(geo.country), normalized(geo.country_name)].includes(normalized(value))),
        );
        if (country?.id) result.country_id = country.id;
      }
    }
    // A selected practice state takes precedence over IP geolocation.
    const matchesGeoCountry = payload.signup_usa !== true || ['us', 'usa'].includes(normalized(geo?.country));
    if (!result.state_id && result.country_id && geo?.state_name && matchesGeoCountry) {
      const response = await getApi(`master/states?country_id=${encodeURIComponent(result.country_id)}`);
      const states = response?.data?.states;
      const state = Array.isArray(states) && states.find(item =>
        normalized(item.name || item.state_name) === normalized(geo.state_name),
      );
      if (state?.id) result.state_id = state.id;
    }
  } catch (error) {
    console.warn('[SignupLocation] Location lookup unavailable');
  }
  result.ip = result.ip || getPublicIP() || '';
  return result;
};
