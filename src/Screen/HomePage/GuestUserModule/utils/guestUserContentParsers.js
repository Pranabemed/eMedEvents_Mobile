/**
 * File Name: guestUserContentParsers.js
 * Module: Guest User
 * Purpose: Provides parsing and payload-normalization helpers for Guest User content sections.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: ../../../../Utils/Helpers/Timezone, ./guestUserCore
 */

import { FormatDateZone } from '../../../../Utils/Helpers/Timezone';
import { formatGuestNumber, formatGuestNumericText, getText } from './guestUserCore';

/**
 * Description: Removes HTML tags and entity noise from a string.
 * Purpose: Converts CMS HTML fragments into plain text display values.
 *
 * Params:
 * @param {string} value
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Convert value to string.
 * 2. Strip tags and common HTML entities.
 * 3. Normalize repeated whitespace.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Handles nullish input through safe string conversion.
 */
export const stripHtml = value =>
  String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Description: Returns the first regex capture group after HTML cleanup.
 * Purpose: Simplifies repeated CMS HTML parsing patterns.
 *
 * Params:
 * @param {string} html
 * @param {RegExp} regex
 *
 * Returns:
 * @returns {string|null}
 *
 * Flow:
 * 1. Run regex against the HTML string.
 * 2. Read first capture group when matched.
 * 3. Return cleaned text or null.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns null when regex does not match.
 */
export const matchGroup = (html, regex) => {
  const match = html.match(regex);
  return match ? stripHtml(match[1]) : null;
};

/**
 * Description: Resolves a banner or detail URL from multiple payload fields.
 * Purpose: Supports hero and free-course routing when payload structure varies.
 *
 * Params:
 * @param {Object} item
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Read direct URL fields first.
 * 2. Normalize relative URLs to the production domain.
 * 3. Fall back to parsing anchor tags from HTML content.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns empty string when no valid URL exists.
 */
export const getBannerUrl = item => {
  const rawUrl =
    item?.banner_url ||
    item?.bannerUrl ||
    item?.url ||
    item?.link ||
    item?.conference_url ||
    item?.conferenceUrl;

  if (rawUrl) {
    const url = String(rawUrl).trim();
    if (!url) return '';
    return url.startsWith('/') ? `https://www.emedevents.com${url}` : url;
  }

  const html = String(item?.html_content || '');
  const hrefMatch = html.match(/<a[^>]*href=['"]([^'"]+)['"]/i);
  if (!hrefMatch?.[1]) return '';

  const href = hrefMatch[1].trim();
  if (!href) return '';
  return href.startsWith('/') ? `https://www.emedevents.com${href}` : href;
};

/**
 * Description: Resolves a detail page URL from supported payload fields.
 * Purpose: Keeps course detail routing consistent across sections.
 *
 * Params:
 * @param {Object} item
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Check supported detail-page fields.
 * 2. Fall back to banner or conference URLs.
 * 3. Return the first valid text.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns empty string when no URL is available.
 */
export const getDetailPageUrl = item =>
  getText(
    item?.detailpage_url,
    item?.detailPageUrl,
    item?.detail_page_url,
    item?.banner_url,
    item?.url,
    item?.link,
    item?.conference_url,
  );

/**
 * Description: Builds a display-ready date range for conference data.
 * Purpose: Standardizes date labels across bundle cards and banners.
 *
 * Params:
 * @param {Object} item
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Try timezone-aware formatted date range.
 * 2. Fall back to raw date fields.
 * 3. Return the first valid label.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns empty string when no date data exists.
 */
export const getDateRange = item => {
  const formatted = FormatDateZone(
    item?.startdate || item?.startDate,
    item?.enddate || item?.endDate || item?.endate,
  );
  if (formatted) return formatted;
  return getText(item?.date, item?.event_date, item?.startdate, item?.startDate);
};

/**
 * Description: Resolves CME credit label text from bundle payloads.
 * Purpose: Normalizes direct display strings and point popover arrays into one label.
 *
 * Params:
 * @param {Object} item
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Prefer provided `display_cme`.
 * 2. Normalize "Contact Hour" label when needed.
 * 3. Build pipe-separated text from `cme_points_popovar` when direct label is missing.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns empty string when credit details do not exist.
 */
export const getCmeLabel = item => {
  if (item?.display_cme) {
    const normalizedDisplayCme = String(item.display_cme).toLowerCase().includes('contact hour')
      ? String(item.display_cme).replace(/contact hour/i, 'Contact Hour(s)')
      : String(item.display_cme);
    return formatGuestNumericText(normalizedDisplayCme);
  }
  if (Array.isArray(item?.cme_points_popovar) && item.cme_points_popovar.length) {
    return item.cme_points_popovar
      .map(point => {
        const count = formatGuestNumber(Number.parseFloat(point?.points) || 0);
        const name =
          point?.name && point?.name.toLowerCase() === 'contact hour'
            ? 'Contact Hour(s)'
            : point?.name || '';
        return `${count} ${name}`.trim();
      })
      .filter(Boolean)
      .join(' | ');
  }
  return '';
};

/**
 * Description: Resolves visible price text from bundle payloads.
 * Purpose: Standardizes free and paid pricing labels.
 *
 * Params:
 * @param {Object} item
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Return `FREE` for free-priced payloads.
 * 2. Read currency code and amount fields.
 * 3. Return combined display value.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns empty string-compatible text when price parts are missing.
 */
export const getPriceLabel = item => {
  if (String(item?.display_price || '').toUpperCase() === 'FREE') {
    return 'FREE';
  }
  return `${getText(item?.display_currency_code, item?.currency_code, '')}${formatGuestNumericText(getText(
    item?.display_price,
    item?.price,
    item?.amount,
  ))}`.trim();
};

/**
 * Description: Parses banner HTML for date and credits metadata.
 * Purpose: Extracts CMS banner metadata used by hero and live-conference sections.
 *
 * Params:
 * @param {string} html
 *
 * Returns:
 * @returns {Object}
 *
 * Flow:
 * 1. Extract meta and credit blocks from HTML.
 * 2. Parse date and credits from known markup patterns.
 * 3. Return normalized date/credit values.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns empty fields when expected HTML structure is missing.
 */
export const parseBannerMeta = html => {
  const metaHtmlMatch = html.match(
    /<p[^>]*class=['"][^'"]*sliderthreecredits[^'"]*['"][^>]*>([\s\S]*?)<\/p>/i,
  );
  const metaHtml = metaHtmlMatch ? metaHtmlMatch[1] : '';
  const creditsBlockMatch = html.match(
    /<p[^>]*class=['"][^'"]*\bcredits\b[^'"]*['"][^>]*>([\s\S]*?)<\/p>/i,
  );
  const creditsBlock = creditsBlockMatch ? creditsBlockMatch[1] : '';

  if (!metaHtml && !creditsBlock) {
    return { date: '', credits: '' };
  }

  const dateMatch =
    metaHtml.match(
      /<img[^>]*alt=['"](?:Calendar|calendar)['"][^>]*>\s*([\s\S]*?)(?=<img[^>]*alt=['"](?:Credits|credits)['"]|<span[^>]*class=['"]textmogento['"]|$)/i,
    ) ||
    metaHtml.match(
      /Calendar\.png[^>]*>\s*([\s\S]*?)(?=<img[^>]*alt=['"](?:Credits|credits)['"]|<span[^>]*class=['"]textmogento['"]|$)/i,
    );

  const creditsMatch =
    metaHtml.match(
      /<img[^>]*alt=['"](?:Credits|credits)['"][^>]*>\s*<span[^>]*>\s*([\d.]+)\s*<\/span>\s*([\s\S]*?)(?=<img[^>]*alt=['"][^>]*Hybrid|<span[^>]*class=['"]textmogento['"]|$)/i,
    ) ||
    metaHtml.match(
      /<img[^>]*alt=['"](?:Credits|credits)['"][^>]*>\s*([\s\S]*?)(?=<img[^>]*alt=['"][^>]*Hybrid|<span[^>]*class=['"]textmogento['"]|$)/i,
    ) ||
    metaHtml.match(
      /credits\.png[^>]*>\s*([\s\S]*?)(?=<img[^>]*alt=['"][^>]*Hybrid|<span[^>]*class=['"]textmogento['"]|$)/i,
    ) ||
    creditsBlock.match(
      /<span[^>]*>\s*([\d.]+)\s*<\/span>\s*([\s\S]*?)(?=<\/p>|$)/i,
    );

  const date = stripHtml(dateMatch?.[1]);
  const credits = creditsMatch
    ? creditsMatch[2]
      ? `${stripHtml(creditsMatch[1])} ${stripHtml(creditsMatch[2])}`.trim()
      : stripHtml(creditsMatch[1])
    : '';

  return {
    date: date || '',
    credits: formatGuestNumericText(credits || ''),
  };
};

/**
 * Description: Splits a pipe-separated meta string into date and credit parts.
 * Purpose: Supports hero banner fallback rendering when API sends combined metadata text.
 *
 * Params:
 * @param {string} value
 *
 * Returns:
 * @returns {Object}
 *
 * Flow:
 * 1. Split the incoming text by pipe delimiters.
 * 2. Normalize each segment.
 * 3. Return the first segment as date and the remainder as credits.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns empty parts when value is missing.
 */
export const splitMetaLine = value => {
  const parts = String(value || '')
    .split('|')
    .map(part => part.trim())
    .filter(Boolean);

  return {
    date: parts[0] || '',
    credits: formatGuestNumericText(parts.slice(1).join(' | ') || ''),
  };
};

/**
 * Description: Extracts banner title from CMS HTML.
 * Purpose: Supports hero and webinar cards when direct title fields are absent.
 *
 * Params:
 * @param {Object} item
 *
 * Returns:
 * @returns {string|null}
 *
 * Flow:
 * 1. Read HTML content.
 * 2. Match the heading tag.
 * 3. Return cleaned text or null.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns null when heading is not found.
 */
export const getHtmlTitle = item =>
  matchGroup(String(item?.html_content || ''), /<h2[^>]*>([\s\S]*?)<\/h2>/i);

/**
 * Description: Extracts location text from CMS HTML.
 * Purpose: Supplies live webinar location fallback data when API fields are empty.
 *
 * Params:
 * @param {Object} item
 *
 * Returns:
 * @returns {string|null}
 *
 * Flow:
 * 1. Read HTML content.
 * 2. Match the known location pattern.
 * 3. Return cleaned location text.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns null when the location pattern is not present.
 */
export const getHtmlLocation = item => {
  const html = String(item?.html_content || '');
  return matchGroup(
    html,
    /<p[^>]*class=['"][^'"]*\bcredits\b[^'"]*['"][^>]*>[\s\S]*?(?:location|loc)[^>]*>\s*([\s\S]*?)<\/p>/i,
  );
};

/**
 * Description: Extracts banner button text from CMS HTML.
 * Purpose: Supplies CTA fallback labels for hero and live webinar items.
 *
 * Params:
 * @param {Object} item
 *
 * Returns:
 * @returns {string|null}
 *
 * Flow:
 * 1. Read HTML content.
 * 2. Match button text.
 * 3. Return cleaned CTA label.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns null when button markup is not available.
 */
export const getHtmlButtonText = item =>
  matchGroup(String(item?.html_content || ''), /<button[^>]*>([\s\S]*?)<\/button>/i);

export const SHIMMER_BG = '#EAF4FB';
export const SHIMMER_HL = '#FFFFFF';
