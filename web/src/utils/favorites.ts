const STORAGE_KEY = 'scriptorium:favorites';
const MAX = 50;

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(s => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

function write(slugs: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs.slice(0, MAX)));
  } catch {
    return;
  }
}

export function listFavorites(): string[] {
  return read();
}

export function isFavorite(slug: string): boolean {
  return read().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  if (!slug) return false;
  const current = read();
  const has = current.includes(slug);
  write(has ? current.filter(s => s !== slug) : [slug, ...current]);
  return !has;
}
