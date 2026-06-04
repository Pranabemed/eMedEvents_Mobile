/**
 * File Name: guestUserCore.js
 * Module: Guest User
 * Purpose: Houses shared non-API utility helpers used by the Guest User home module.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: None
 */

/**
 * Description: Returns the first non-empty array from the provided values.
 * Purpose: Supports API payload fallback chains without repeated inline checks.
 *
 * Params:
 * @param {...Array} values
 *
 * Returns:
 * @returns {Array}
 *
 * Flow:
 * 1. Find the first array that contains items.
 * 2. Fall back to the first array reference when all arrays are empty.
 * 3. Return an empty array if no array exists.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Safely handles undefined and non-array values.
 */
export const firstArray = (...values) =>
  values.find(value => Array.isArray(value) && value.length > 0) ||
  values.find(Array.isArray) ||
  [];

/**
 * Description: Scales a design value using current width.
 * Purpose: Keeps card and text spacing responsive across device widths.
 *
 * Params:
 * @param {number} width
 * @param {number} value
 *
 * Returns:
 * @returns {number}
 *
 * Flow:
 * 1. Clamp width using the design cap.
 * 2. Calculate responsive multiplier.
 * 3. Round the final value.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Assumes numeric inputs from controlled callers.
 */
export const scale = (width, value) =>
  Math.round((Math.min(width, 430) / 390) * value);

/**
 * Description: Returns the first non-empty text value from a list.
 * Purpose: Simplifies fallback label mapping from inconsistent API field names.
 *
 * Params:
 * @param {...any} values
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Iterate candidate values.
 * 2. Trim each value after string conversion.
 * 3. Return the first non-empty string.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Skips null and undefined values safely.
 */
export const getText = (...values) => {
  for (const value of values) {
    if (value == null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
};

/**
 * Description: Formats a numeric string using Indian-style comma grouping.
 * Purpose: Keeps guest-home counts and amount-like values readable without affecting non-numeric text.
 *
 * Params:
 * @param {string|number} value
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Normalize the input into text.
 * 2. Preserve decimal precision from the original string.
 * 3. Apply `en-IN` grouping to the integer portion.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Falls back to the original value when parsing is not possible.
 */
export const formatGuestNumber = value => {
  const raw = String(value ?? '').trim();
  if (!raw || !/^-?\d+(?:\.\d+)?$/.test(raw)) return raw;

  const isNegative = raw.startsWith('-');
  const numericText = isNegative ? raw.slice(1) : raw;
  const [integerPart, decimalPart] = numericText.split('.');
  const formattedInteger = Number(integerPart || 0).toLocaleString('en-IN');

  return `${isNegative ? '-' : ''}${formattedInteger}${decimalPart != null ? `.${decimalPart}` : ''}`;
};

/**
 * Description: Formats number-like fragments inside guest-home display text.
 * Purpose: Adds commas to visible guest-home counts, prices, and credit labels while preserving surrounding text.
 *
 * Params:
 * @param {string|number} value
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Convert the value into a string.
 * 2. Find standalone numeric fragments.
 * 3. Replace each fragment with Indian-style grouped output.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns an empty string for nullish inputs.
 */
export const formatGuestNumericText = value =>
  String(value ?? '').replace(/-?\d+(?:\.\d+)?/g, match => formatGuestNumber(match));

/**
 * Description: Resolves a specialty label from string or object inputs.
 * Purpose: Normalizes specialty payload variations into one label format.
 *
 * Params:
 * @param {string|Object} item
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Return string values directly.
 * 2. Read supported specialty name fields for objects.
 * 3. Return normalized text.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns empty string when label cannot be resolved.
 */
export const getSpecialityLabel = item =>
  typeof item === 'string'
    ? item
    : getText(item?.name, item?.specialty_name, item?.speciality_name, item?.title);

/**
 * Description: Converts specialty payloads into a clean string array.
 * Purpose: Supports specialty chips and specialty badges across multiple API shapes.
 *
 * Params:
 * @param {Array|string} value
 *
 * Returns:
 * @returns {Array}
 *
 * Flow:
 * 1. Handle array values through label mapping.
 * 2. Handle string values through comma splitting.
 * 3. Trim and remove falsy entries.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Falls back to an empty array for unsupported values.
 */
export const normalizeSpecialities = value => {
  if (Array.isArray(value)) {
    return value.map(getSpecialityLabel).filter(Boolean);
  }
  return String(value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
};

/**
 * Description: Splits an array into fixed-size chunk groups.
 * Purpose: Builds two-row specialty chip columns from a flat list.
 *
 * Params:
 * @param {Array} items
 * @param {number} size
 *
 * Returns:
 * @returns {Array}
 *
 * Flow:
 * 1. Iterate items in order.
 * 2. Start a new chunk at each size boundary.
 * 3. Push items into the current chunk.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Assumes a positive chunk size from controlled callers.
 */
export const chunkArray = (items, size) =>
  items.reduce((chunks, item, index) => {
    if (index % size === 0) {
      chunks.push([]);
    }
    chunks[chunks.length - 1].push(item);
    return chunks;
  }, []);

/**
 * Description: Converts image-like values into a React Native image source.
 * Purpose: Normalizes API image strings and local image objects for card rendering.
 *
 * Params:
 * @param {string|Object} value
 *
 * Returns:
 * @returns {Object|undefined}
 *
 * Flow:
 * 1. Guard missing values.
 * 2. Return objects as-is.
 * 3. Convert URI strings into `{ uri }`.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns undefined when the value is empty.
 */
export const getImageSource = value => {
  if (!value) return undefined;
  if (typeof value === 'object') return value;
  const uri = String(value).trim();
  return uri ? { uri } : undefined;
};

/**
 * Description: Generates initials from a text value.
 * Purpose: Displays fallback organization avatars when no logo image exists.
 *
 * Params:
 * @param {string} value
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Split the string into words.
 * 2. Keep the first two words.
 * 3. Join their uppercase initials.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns an empty string for invalid input.
 */
export const getInitials = value =>
  String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase())
    .join('');

/**
 * Description: Returns the first non-empty count-like value.
 * Purpose: Simplifies marketplace stat fallback handling.
 *
 * Params:
 * @param {...any} values
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Iterate candidate values.
 * 2. Trim string output.
 * 3. Return the first valid count text.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Safely skips nullish values.
 */
export const getCountValue = (...values) => {
  for (const value of values) {
    if (value == null) continue;
    const text = String(value).trim();
    if (text) return formatGuestNumericText(text);
  }
  return '';
};

/**
 * Description: Extracts the final usable slug from a detail URL.
 * Purpose: Supports guest course navigation and speaker profile routing.
 *
 * Params:
 * @param {string} value
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Remove hash fragments.
 * 2. Split the URL into path segments.
 * 3. Return the registration parent slug when needed.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns empty string for invalid URLs.
 */
export const getDetailSlug = value => {
  const cleanUrl = String(value || '').split('#')[0];
  const segments = cleanUrl.split('/').filter(Boolean);
  if (!segments.length) return '';
  return segments[segments.length - 1] === 'registration'
    ? segments[segments.length - 2] || ''
    : segments[segments.length - 1];
};

/**
 * Description: Resolves state name text from multiple object shapes.
 * Purpose: Keeps state-related UI and navigation labels consistent.
 *
 * Params:
 * @param {Object} stateObj
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Read supported state-name fields.
 * 2. Use shared text fallback resolution.
 * 3. Return a user-facing state name.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns empty string when state name is unavailable.
 */
export const getStateName = stateObj =>
  getText(stateObj?.name, stateObj?.state_name, stateObj?.title);

/**
 * Description: Resolves state code text from multiple object shapes.
 * Purpose: Supports compact top-bar state pill rendering.
 *
 * Params:
 * @param {Object} stateObj
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Read supported code fields.
 * 2. Resolve first non-empty value.
 * 3. Return short display code.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns empty string when state code is unavailable.
 */
export const getStateCode = stateObj =>
  getText(stateObj?.state_code, stateObj?.code, stateObj?.abbr, stateObj?.short_name);

/**
 * Description: Resolves a state URL/slug.
 * Purpose: Supports guest listing navigation based on state selection.
 *
 * Params:
 * @param {Object} stateObj
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Prefer explicit URL fields.
 * 2. Fall back to slugified state name.
 * 3. Return resolved slug string.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns an empty string when no state info exists.
 */
export const getStateSlug = stateObj => {
  const rawUrl = getText(stateObj?.url, stateObj?.state_url);
  if (rawUrl) return rawUrl;
  return getStateName(stateObj).toLowerCase().replace(/\s+/g, '-');
};
