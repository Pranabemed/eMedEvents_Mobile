// Assessment API content is HTML, but these screens render native Text.
export default function cleanAssessmentText(value) {
  return String(value ?? '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&(?:amp;)+/gi, '&')
    .replace(/&(?:nbsp;?|#0*160;|#x0*a0;)|\u00a0/gi, ' ')
    .replace(/&gt;/gi, '>')
    .replace(/&lt;/gi, '<')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;|&apos;/gi, "'")
    .replace(/[ \t]+/g, ' ')
    .trim();
}
