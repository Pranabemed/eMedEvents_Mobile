// Display only: leave the ticket name and API payload unchanged.
export const checkoutLabel = value => {
  let text = String(value ?? '');
  for (let pass = 0; pass < 5; pass++) {
    const decoded = text
      .replace(/&amp;/gi, '&')
      .replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (entity, code) => {
        const point = code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code);
        return point <= 0x10ffff ? String.fromCodePoint(point) : entity;
      })
      .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
      .replace(/&nbsp;/gi, ' ').replace(/&quot;/gi, '"').replace(/&apos;/gi, "'");
    if (decoded === text) break;
    text = decoded;
  }
  return text.replace(/\\(?=[<>/])/g, '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};
