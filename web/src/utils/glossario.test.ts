import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  normalizeWord,
  lookupCurated,
  detectMesoclise,
  parseWiktionaryWikitext,
  lookupWord,
} from './glossario';

const DEBALDE_WIKITEXT = `={{-pt-}}=
==Advérbio==
{{paroxítona|de|bal|de}}

# [[em]] [[vão]]
# [[inutilmente]]
# [[escusadamente]]
# [[sem]] [[necessidade]]

=={{pronúncia|pt}}==
===Portugal===
* AFI: {{AFI|/dɨ.ˈbaɫ.dɨ/}}

[[Categoria:Advérbio (Português)]]`;

describe('normalizeWord', () => {
  it('minúsculas e remove pontuação das bordas', () => {
    expect(normalizeWord('Debalde,')).toBe('debalde');
    expect(normalizeWord('  SOIS! ')).toBe('sois');
    expect(normalizeWord('"mui"')).toBe('mui');
  });

  it('mantém hifens internos (mesóclise)', () => {
    expect(normalizeWord('mentir-vos-ão')).toBe('mentir-vos-ão');
  });
});

describe('lookupCurated', () => {
  it('encontra entrada direta', () => {
    expect(lookupCurated('mui')?.def).toContain('Muito');
    expect(lookupCurated('Debalde')?.def).toContain('Em vão');
  });

  it('é tolerante a acentos', () => {
    expect(lookupCurated('mesoclise')?.def).toContain('Pronome colocado');
  });

  it('devolve null para palavra fora do dicionário', () => {
    expect(lookupCurated('computador')).toBeNull();
  });
});

describe('detectMesoclise', () => {
  it('reconhece futuro com pronome no meio', () => {
    const r = detectMesoclise('mentir-vos-ão');
    expect(r).not.toBeNull();
    expect(r?.def).toContain('Mentir-vos-ão'.toLowerCase());
  });

  it('reconhece -lo-ei', () => {
    const r = detectMesoclise('amá-lo-ei');
    expect(r?.def).toContain('Mesóclise');
  });

  it('ignora palavra comum', () => {
    expect(detectMesoclise('casa')).toBeNull();
  });
});

describe('parseWiktionaryWikitext', () => {
  it('extrai classe gramatical e definições do bloco português', () => {
    const r = parseWiktionaryWikitext(DEBALDE_WIKITEXT);
    expect(r?.pos).toBe('Advérbio');
    expect(r?.defs[0]).toBe('em vão');
    expect(r?.defs[1]).toBe('inutilmente');
    expect(r?.defs.length).toBeLessThanOrEqual(3);
  });

  it('limpa predefinições e links wiki', () => {
    const r = parseWiktionaryWikitext(DEBALDE_WIKITEXT);
    expect(r?.defs.join(' ')).not.toContain('[[');
    expect(r?.defs.join(' ')).not.toContain('{{');
  });

  it('devolve null quando não há definição em português', () => {
    expect(parseWiktionaryWikitext('= {{-en-}} =\n\n==Noun==\n# a house')).toBeNull();
  });
});

describe('lookupWord', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('responde do glossário curado sem rede', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const r = await lookupWord('tendes');
    expect(r?.source).toBe('curado');
    expect(r?.def).toContain('verbo ter');
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('cai no Wikcionário quando não é curado', async () => {
    const EFEMERO_WIKITEXT = `={{-pt-}}=
==Adjetivo==
{{paroxítona|e|fé|me|ro}}

# [[curto]], [[passageiro]], de pouca duração.`;
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ parse: { title: 'efêmero', wikitext: EFEMERO_WIKITEXT } }), {
          status: 200,
        }),
      ) as unknown as typeof fetch,
    );
    const r = await lookupWord('Efêmero');
    expect(r?.source).toBe('wikcionario');
    expect(r?.def).toContain('passageiro');
    expect(r?.pos).toBe('Adjetivo');
    vi.unstubAllGlobals();
  });

  it('devolve null para seleção vazia ou só pontuação', async () => {
    expect(await lookupWord('...')).toBeNull();
    expect(await lookupWord('')).toBeNull();
  });
});
