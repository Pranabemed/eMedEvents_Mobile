/**
 * Html value.
 * @returns {*}
 */
const html = `<div class='raw-html-embed'><a href='/innovations-in-stroke-and-cardiac-care-2026' class='text-decoration-none'>    <div class='homepageslide comprehensivesection w-100 american_neurology'>        <div class='slideleft'>            <h2>Innovations in Stroke and Cardiac Care (ISCC 2026)</h2>            <p class='headingpara'>Optimizing Collaborative Pathways</p>            <div class='gradientbg'></div>            <p class='sliderthreecredits mb-2 pt-3'>                <img width='24px' src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2025-05-13/Calendar.png'> Sep 26-27, 2026&nbsp;<span class='textmogento'> | </span> &nbsp;  <img width='15px' src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2025-05-13/credits.png'> <span>7</span> CME / CE Credits &nbsp;<span class='textmogento'> | </span> &nbsp;<img width='15px' src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2025-05-13/hybrid-icon.png'> Hybrid Event            </p>            <p class='d-flex'>                <img width='20px' height='25px' class='ml-1 pt-1' src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2025-05-13/location.png' alt=''>                <span class='pl-2 fw-600 location'>Renaissance Orlando Resort and Spa, Florida, USA, 32830</span>            </p>        </div>        <div class='slideright'>            <img src='https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2026-03/iscc-emedevents-banner.png' alt='Internal Medicine &amp; Primary care'>            <div class='registerbuttonsection'>                <button class='btn btn-primary registermegento mt-n4'>Register Now </button>            </div>        </div>    </div></a></div>`;

/**
 * Strip html utility.
 * @param {*} value - Input value.
 * @returns {*}
 */
const stripHtml = value =>
  String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Match group utility.
 * @param {*} input - Input value.
 * @param {*} regex - Input value.
 * @returns {*}
 */
const matchGroup = (input, regex) => {
  const match = input.match(regex);
  return match ? stripHtml(match[1]) : null;
};

/**
 * Title match value.
 * @returns {*}
 */
const titleMatch = matchGroup(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i);
/**
 * Subtitle match value.
 * @returns {*}
 */
const subtitleMatch = matchGroup(html, /<p[^>]*class=['"][^'"]*headingpara[^'"]*['"][^>]*>([\s\S]*?)<\/p>/i);
/**
 * Location match value.
 * @returns {*}
 */
const locationMatch = matchGroup(html, /<span[^>]*class=['"][^'"]*location[^'"]*['"][^>]*>([\s\S]*?)<\/span>/i);
/**
 * Image match value.
 * @returns {*}
 */
const imageMatch = html.match(/<div[^>]*class=['"][^'"]*slideright[^'"]*['"][^>]*>[\s\S]*?<img[^>]*src=['"]([^'"]+)['"]/i);
/**
 * Date match value.
 * @returns {*}
 */
const dateMatch =
  matchGroup(html, /<p[^>]*class=['"][^'"]*sliderthreecredits[^'"]*['"][^>]*>([\s\S]*?)<\/p>/i) ||
  matchGroup(html, /Calendar\.png[^>]*>\s*([^<]+)(?:<|&nbsp;|$)/i);

console.log({
  title: titleMatch,
  subtitle: subtitleMatch,
  location: locationMatch,
  image: imageMatch ? imageMatch[1] : null,
  date: dateMatch
});
