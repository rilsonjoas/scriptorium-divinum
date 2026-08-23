import glossarioData from '../data/glossario.json';

export interface GlossaryEntry {
  def: string;
}

export interface WiktionaryResult {
  pos: string | null;
  defs: string[];
}

type GlossaryDict = Record<string, GlossaryEntry>;

const dict = glossarioData as GlossaryDict;

export const normalizeWord = (word: string): string =>
  word
    .toLowerCase()
    .trim()
    .replace(/^[^\p{L}\p{N}-]+|[^\p{L}\p{N}-]+$/gu, '');

const stripAccents = (s: string): string =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const dictByAccentless = new Map(
  Object.keys(dict).map(k => [stripAccents(k), k]),
);

export function lookupCurated(word: string): GlossaryEntry | null {
  const w = normalizeWord(word);
  if (!w) return null;
  if (dict[w]) return dict[w];
  const key = dictByAccentless.get(stripAccents(w));
  return key ? dict[key] : null;
}

const FUTURE_ENDINGS = ['ei', 'ás', 'á', 'emos', 'eis', 'ão'];
const MESOCLISE_RE =
  /^[\p{L}]+-(lo|la|los|las|no|na|nos|nas|vos|me|te|se)-(ei|ás|á|emos|eis|ão)$/u;

export function detectMesoclise(word: string): GlossaryEntry | null {
  const m = MESOCLISE_RE.exec(normalizeWord(word));
  if (!m) return null;
  const pronoun = m[1];
  const ending = m[2];
  const stem = normalizeWord(word).slice(0, normalizeWord(word).lastIndexOf(`-${pronoun}`));
  const future = `${stem}${ending === 'ão' ? 'ão' : ending}`;
  return {
    def: `Mesóclise: pronome no meio do futuro. "${normalizeWord(word)}" = "${pronoun === 'vos' ? 'vos' : pronoun} ${future}" — leia separando: ${stem} + ${pronoun} + ${ending}.`,
  };
}

function stripWikitext(s: string): string {
  let out = s.replace(/\{\{[^{}]*\}\}/g, '');
  out = out.replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1');
  out = out.replace(/\[\[([^\]]*)\]\]/g, '$1');
  return out.replace(/'''?/g, '').trim();
}

export function parseWiktionaryWikitext(wikitext: string): WiktionaryResult | null {
  const ptMatch = wikitext.split(/=\{\{-pt-\}\}=|==\{\{pt\}\}==|=\s*Português\s*=/i)[1];
  if (!ptMatch) return null;
  const block = ptMatch.split(/^=\{\{-[a-z-]+-\}\}=/m)[0] ?? '';

  const lines = block.split('\n');
  let pos: string | null = null;
  const defs: string[] = [];
  for (let i = 0; i < lines.length && defs.length < 3; i++) {
    const line = lines[i];
    const posMatch = /^==([^=]+)==/.exec(line);
    if (posMatch) {
      pos = posMatch[1].trim();
      continue;
    }
    const defMatch = /^#\s+(?![:*])(.+)/.exec(line);
    if (defMatch && pos) {
      const clean = stripWikitext(defMatch[1]);
      if (clean) defs.push(clean);
    }
  }
  if (!pos || defs.length === 0) return null;
  return { pos, defs };
}

export interface GlossaryAnswer {
  source: 'curado' | 'wikcionario';
  def: string;
  pos?: string | null;
  url?: string;
}

const wikCache = new Map<string, WiktionaryResult | null>();

export async function lookupWord(raw: string): Promise<GlossaryAnswer | null> {
  const word = normalizeWord(raw);
  if (!word) return null;

  const curated = lookupCurated(word) ?? detectMesoclise(word);
  if (curated) return { source: 'curado', def: curated.def };

  if (wikCache.has(word)) {
    const cached = wikCache.get(word) ?? null;
    return cached ? { source: 'wikcionario', def: cached.defs[0], pos: cached.pos } : null;
  }

  try {
    const url = `https://pt.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word)}&prop=wikitext&format=json&formatversion=2&origin=*`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { parse?: { wikitext?: string }; error?: unknown };
    const parsed = json.parse?.wikitext ? parseWiktionaryWikitext(json.parse.wikitext) : null;
    wikCache.set(word, parsed);
    return parsed
      ? { source: 'wikcionario', def: parsed.defs[0], pos: parsed.pos }
      : null;
  } catch {
    wikCache.set(word, null);
    return null;
  }
}
