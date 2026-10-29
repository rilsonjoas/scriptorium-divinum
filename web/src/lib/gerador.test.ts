import { describe, expect, it } from 'vitest';
import { ehLewis, GERADOR_COPIA_URL, mudaCopiaDoGerador, type CitacaoDoGerador } from './gerador';

const ativa: CitacaoDoGerador = { author: 'C. S. Lewis', text: 'Texto.', source: 'Obra', theme: null, dominioPublico: false, status: 'ativa' };
const com = (p: Partial<CitacaoDoGerador>): CitacaoDoGerador => ({ ...ativa, ...p });

describe('ehLewis', () => {
  it.each(['C. S. Lewis', 'C.S. Lewis', 'c. s. lewis '])('%j é Lewis', (a) => expect(ehLewis(a)).toBe(true));
  it.each(['Lewis', 'Santo Agostinho', ''])('%j não é Lewis', (a) => expect(ehLewis(a)).toBe(false));
});

describe('mudaCopiaDoGerador', () => {
  it.each<[string, CitacaoDoGerador | null, CitacaoDoGerador | null]>([
    ['criar ativa', null, ativa],
    ['ocultar', ativa, com({ status: 'oculta' })],
    ['reativar', com({ status: 'oculta' }), ativa],
    ['mudar o texto', ativa, com({ text: 'Outro.' })],
    ['mudar a obra', ativa, com({ source: 'Outra' })],
    ['mudar o tema', ativa, com({ theme: 'graça' })],
    ['mudar domínio público', ativa, com({ dominioPublico: true })],
    ['outro autor passa a Lewis', com({ author: 'Outro' }), ativa],
    ['Lewis passa a outro autor', ativa, com({ author: 'Outro' })],
  ])('%s muda a cópia', (_n, antes, depois) => expect(mudaCopiaDoGerador(antes, depois)).toBe(true));

  it.each<[string, CitacaoDoGerador | null, CitacaoDoGerador | null]>([
    ['nada muda', ativa, { ...ativa }],
    ['criar rascunho', null, com({ status: 'rascunho' })],
    ['rascunho com texto novo', com({ status: 'rascunho' }), com({ status: 'rascunho', text: 'Novo.' })],
    ['oculta com texto novo', com({ status: 'oculta' }), com({ status: 'oculta', text: 'Novo.' })],
    ['ativa de outro autor com texto novo', com({ author: 'Outro' }), com({ author: 'Outro', text: 'Novo.' })],
    ['criar ativa de outro autor', null, com({ author: 'Outro' })],
    ['grafia do autor Lewis diferente mas a mesma', ativa, com({ author: 'C.S. Lewis' })],
  ])('%s não muda a cópia', (_n, antes, depois) => expect(mudaCopiaDoGerador(antes, depois)).toBe(false));

  it('o link aponta para o arquivo da cópia no GitHub', () => {
    expect(GERADOR_COPIA_URL).toBe('https://github.com/rilsonjoas/GeradorCSLewis/blob/main/src/data/lewis-quotes.snapshot.json');
  });
});
