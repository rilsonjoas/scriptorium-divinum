export function normalizeQuote(raw: string): string {
  const collapsed = raw.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= 560) return collapsed;
  const cut = collapsed.slice(0, 557).replace(/[\s,;:.-]+$/, '');
  return `${cut}...`;
}

export function fontSizeForQuote(quote: string): number {
  const len = quote.length;
  if (len <= 120) return 54;
  if (len <= 220) return 46;
  if (len <= 320) return 40;
  if (len <= 440) return 35;
  return 31;
}

export function quoteCardFileName(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return `citacao-${slug || 'scriptorium'}.png`;
}
