export interface ReadingProgressEntry {
  slug: string;
  title: string;
  ratio: number;
  updatedAt: number;
}

const STORAGE_KEY = 'scriptorium:reading-progress';
const MAX_ENTRIES = 20;

function readAll(): Record<string, ReadingProgressEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, ReadingProgressEntry>): void {
  try {
    const entries = Object.values(all)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_ENTRIES);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Object.fromEntries(entries.map(e => [e.slug, e]))),
    );
  } catch {
    return;
  }
}

export function saveReadingProgress(entry: Omit<ReadingProgressEntry, 'updatedAt'>): void {
  if (!entry.slug || !Number.isFinite(entry.ratio)) return;
  const clamped = Math.min(1, Math.max(0, entry.ratio));
  const all = readAll();
  all[entry.slug] = { ...entry, ratio: clamped, updatedAt: Date.now() };
  writeAll(all);
}

export function getReadingProgress(slug: string): ReadingProgressEntry | null {
  return readAll()[slug] ?? null;
}

export function listReadingProgress(): ReadingProgressEntry[] {
  return Object.values(readAll()).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function removeReadingProgress(slug: string): void {
  const all = readAll();
  delete all[slug];
  writeAll(all);
}

export function shouldResume(ratio: number): boolean {
  return ratio >= 0.03 && ratio < 0.95;
}
