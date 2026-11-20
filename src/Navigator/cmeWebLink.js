export const getCmeWebLink = value => {
  if (typeof value !== 'string') return null;
  const url = value.trim();
  if (!/^https?:\/\/(?:www\.)?emedevents\.com(?::443)?\/cme(?:[/?#]|$)/i.test(url)) return null;
  return url.replace(/^http:/i, 'https:');
};
