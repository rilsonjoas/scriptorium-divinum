import { describe, expect, it } from 'vitest';
import { validarCanonico, type CanonicalQuote } from './quotes-canonical.js';

const uuid = (n: number) => `80000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const ok: CanonicalQuote = {
  id: uuid(1),
  author: 'C. S. Lewis',
  text: 'Texto.',
  source: 'Obra',
  dominioPublico: false,
  scriptoriumUrl: null,
  theme: null,
  fonteUrl: null,
  verificadoEm: null,
  status: 'ativa',
  motivoOcultacao: null,
};
const erroDe = (...itens: unknown[]) => {
  try {
    validarCanonico(itens);
  } catch (e) {
    return (e as Error).message;
  }
  return undefined;
};

/** O que o restore grava no banco é o que passa aqui: um tipo errado não pode virar valor padrão em silêncio. */
describe('validarCanonico: formato de cada campo', () => {
  it('aceita um item completo e um mínimo (campos nulos)', () => {
    expect(validarCanonico([ok])).toHaveLength(1);
    expect(validarCanonico([{ ...ok, source: null, status: 'rascunho' }])).toHaveLength(1);
  });

  it('lista vazia é recusada: apagaria a tabela inteira', () => {
    expect(() => validarCanonico([])).toThrow(/lista vazia/i);
  });

  it('id em maiúsculas vale como o mesmo id: repetido é recusado e o id sai em minúsculas', () => {
    expect(erroDe(ok, { ...ok, id: ok.id.toUpperCase() })).toMatch(/\[1\].*id.*repetido/i);
    const [q] = validarCanonico([{ ...ok, id: ok.id.toUpperCase() }]);
    expect(q!.id).toBe(ok.id);
  });

  it.each([
    ['dominioPublico "true"', { dominioPublico: 'true' }, /\[0\].*dominioPublico/],
    ['dominioPublico 1', { dominioPublico: 1 }, /\[0\].*dominioPublico/],
    ['dominioPublico ausente', { dominioPublico: undefined }, /\[0\].*dominioPublico/],
    ['source número', { source: 5 }, /\[0\].*source/],
    ['source objeto', { source: { a: 1 }, status: 'rascunho' }, /\[0\].*source/],
    ['theme número', { theme: 1 }, /\[0\].*theme/],
    ['scriptoriumUrl número', { scriptoriumUrl: 1 }, /\[0\].*scriptoriumUrl/],
    ['fonteUrl número', { fonteUrl: 1 }, /\[0\].*fonteUrl/],
    ['motivoOcultacao número', { motivoOcultacao: 1 }, /\[0\].*motivoOcultacao/],
    ['verificadoEm 10/11/2026', { verificadoEm: '10/11/2026' }, /\[0\].*verificadoEm/],
    ['verificadoEm 2026-13-40', { verificadoEm: '2026-13-40' }, /\[0\].*verificadoEm/],
    ['verificadoEm 2026-02-30', { verificadoEm: '2026-02-30' }, /\[0\].*verificadoEm/],
    ['verificadoEm texto', { verificadoEm: 'ontem' }, /\[0\].*verificadoEm/],
    ['author com 256 caracteres', { author: 'x'.repeat(256) }, /\[0\].*author.*255/],
    ['source com 501 caracteres', { source: 'x'.repeat(501) }, /\[0\].*source.*500/],
    ['scriptoriumUrl com 501 caracteres', { scriptoriumUrl: 'x'.repeat(501) }, /\[0\].*scriptoriumUrl.*500/],
    ['theme com 51 caracteres', { theme: 'x'.repeat(51) }, /\[0\].*theme.*50/],
    ['campo desconhecido', { createdAt: 'lixo' }, /\[0\] campo desconhecido: createdAt/],
  ])('recusa %s, citando o índice e o campo', (_n, estraga, mensagem) => {
    expect(erroDe({ ...ok, ...estraga })).toMatch(mensagem);
  });

  it('aceita nos limites: author 255, source 500, theme 50, data válida', () => {
    expect(
      validarCanonico([{ ...ok, author: 'x'.repeat(255), source: 'x'.repeat(500), theme: 'x'.repeat(50), scriptoriumUrl: 'x'.repeat(500), verificadoEm: '2026-02-28' }]),
    ).toHaveLength(1);
  });

  it('junta os problemas de itens diferentes, um por linha', () => {
    expect(erroDe({ ...ok, dominioPublico: 'sim' }, { ...ok, id: uuid(2), theme: 5 })).toMatch(/\[0\].*dominioPublico[\s\S]*\[1\].*theme/);
  });
});
