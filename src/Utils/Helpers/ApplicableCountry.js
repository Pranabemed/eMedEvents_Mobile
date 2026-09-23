// Country identity must never be inferred from a telephone calling code.
const text = value => String(value ?? '').trim().toLowerCase();
const usaNames = ['us', 'usa', 'united states', 'united states of america'];

export const countryIdentity = (country = {}) => {
  const name = text(country.country_name || country.country || country.name);
  const code = text(country.sortname || country.country_code);
  if (name) return usaNames.includes(name) ? 'us' : name;
  if (code && /^[a-z]{2,3}$/.test(code)) return usaNames.includes(code) ? 'us' : code;
  const id = text(country.country_id || country.id);
  // The application's countries API uses ID 1 for USA (not the phone code).
  return id && id !== '0' ? (id === '1' ? 'us' : `id:${id}`) : '';
};

export const isUsCountry = country => countryIdentity(country) === 'us';
export const professionCountryParams = country => isUsCountry(country) ? {} : {other_country: 1};
