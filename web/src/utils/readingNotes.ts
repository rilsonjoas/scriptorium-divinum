export interface UserHighlight {
  id: string;
  bookSlug: string;
  text: string;
  color: 'gold' | 'emerald' | 'bronze' | 'leather';
  note?: string;
  createdAt: string;
}

const STORAGE_KEY = 'scriptorium_highlights_v1';

export function getBookHighlights(bookSlug: string): UserHighlight[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all: UserHighlight[] = JSON.parse(raw);
    return all.filter(h => h.bookSlug === bookSlug);
  } catch {
    return [];
  }
}

export function saveHighlight(highlight: Omit<UserHighlight, 'id' | 'createdAt'>): UserHighlight {
  const newH: UserHighlight = {
    ...highlight,
    id: `hl_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: UserHighlight[] = raw ? JSON.parse(raw) : [];
    all.push(newH);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save highlight', e);
  }

  return newH;
}

export function deleteHighlight(id: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const all: UserHighlight[] = JSON.parse(raw);
    const filtered = all.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete highlight', e);
  }
}
