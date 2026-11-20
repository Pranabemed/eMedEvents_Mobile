import constants from './constants';

// Keep conference details, ticket invoices and checkout on the app's selected API.
export const CONFERENCE_CHECKOUT_API_BASE = constants.BASE_URL.replace(/\/+$/, '');

export const conferenceCheckoutEndpoint = (path, apiBase) =>
  apiBase === CONFERENCE_CHECKOUT_API_BASE ? `${apiBase}/${path}` : path;

export const getConferenceSlug = value => String(value || '').trim()
  .replace(/^https?:\/\/[^/]+/i, '')
  .split(/[?#]/)[0]
  .split('/').filter(Boolean).pop() || '';
