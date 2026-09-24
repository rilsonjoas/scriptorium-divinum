const API_BASE = 'https://api-biblianaarte.narniano.com/api/v1';
const BIBLE_ART_WEB_BASE = 'https://biblianaarte.narniano.com';

export interface PinturaReference {
  book: string;
  chapter: number;
  verses: string | null;
}

export interface PinturaDoDia {
  id: string;
  title: string;
  artistOrDirector: string;
  year: string | null;
  imageUrl: string | null;
  description: string;
  sourceUrl: string | null;
  references: PinturaReference[];
}

function normalizeArtist(raw: string): string {
  const sep = '/';
  const idx = raw.indexOf(sep);
  return idx > -1 ? raw.slice(idx + sep.length).trim() : raw;
}

export function pinturaImageUrl(artwork: PinturaDoDia): string | null {
  return artwork.imageUrl ? `${BIBLE_ART_WEB_BASE}${artwork.imageUrl}` : null;
}

export function pinturaInfoUrl(artwork: PinturaDoDia): string {
  return `${BIBLE_ART_WEB_BASE}/obra/${artwork.id}`;
}

export function formatPinturaReference(ref: PinturaReference): string {
  return ref.verses ? `${ref.book} ${ref.chapter}:${ref.verses}` : `${ref.book} ${ref.chapter}`;
}

/** "Pintura do Dia" — mesma fonte única do resto do cluster "A Biblioteca":
 *  GET /artworks/daily do Bíblia na Arte, que resolve a leitura litúrgica
 *  de "hoje" (fuso de São Paulo) e serve a MESMA obra para Lecionário,
 *  Bíblia na Arte e Scriptorium. Sem `?date=` de propósito: o endpoint é
 *  o relógio do dia (decisão do cluster, mesmo contrato do
 *  /api/versiculo-do-dia). Código e imagem moram em domínios diferentes
 *  (a API devolve caminho relativo da imagem). Não-ok vira `null` — o
 *  card "some com graça", como no Lecionário. */
export async function fetchPinturaDoDia(signal?: AbortSignal): Promise<PinturaDoDia | null> {
  try {
    const res = await fetch(`${API_BASE}/artworks/daily`, { signal });
    if (!res.ok) return null;
    const artwork: PinturaDoDia = await res.json();
    return { ...artwork, artistOrDirector: normalizeArtist(artwork.artistOrDirector) };
  } catch {
    return null;
  }
}