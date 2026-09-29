export interface ReadingProgressEntry {
  slug: string;
  title: string;
  ratio: number;
  updatedAt: number;
}

const STORAGE_KEY = 'scriptorium:reading-progress';
/**
 * Versão 2: `ratio` é a posição na obra inteira (capítulo + página).
 * Na versão 1 (sem campo `v`) era só a rolagem do capítulo aberto: abrir o
 * 1º capítulo das Confissões e rolar até o fim gravava 100% (bug real,
 * 2026-09-28). Registros v1 são descartados em vez de reinterpretados.
 */
const VERSION = 2;
const MAX_ENTRIES = 20;

function readAll(): Record<string, ReadingProgressEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, ReadingProgressEntry & { v?: number }>).filter(
        ([, e]) => e?.v === VERSION,
      ),
    );
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
  all[entry.slug] = { ...entry, ratio: clamped, updatedAt: Date.now(), v: VERSION } as ReadingProgressEntry;
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

/** Obra lida até o fim (progresso da obra inteira). */
export function isFinished(ratio: number): boolean {
  return ratio >= 0.999;
}

/**
 * Retomar a leitura? Qualquer posição depois do início, até o fim real. Os
 * limites antigos (3%–95%) eram para a rolagem de um capítulo; na obra
 * inteira de 171 capítulos, o capítulo 4 é 1,8% e os 9 últimos passam de 95%.
 */
export function shouldResume(ratio: number): boolean {
  return ratio > 0.0005 && !isFinished(ratio);
}
