import { describe, expect, it } from 'vitest';
import { camposDaCopia, efeitoNoGerador, ehLewis, GERADOR_COPIA_URL, mudaCopiaDoGerador, type CitacaoDoGerador } from './gerador';

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
    ['corrigir a grafia do autor Lewis (entra no link de compra)', ativa, com({ author: 'C.S. Lewis' })],
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
    ['mesma grafia do autor com espaços nas pontas', ativa, com({ author: ' C. S. Lewis ' })],
  ])('%s não muda a cópia', (_n, antes, depois) => expect(mudaCopiaDoGerador(antes, depois)).toBe(false));

  it('o link aponta para o arquivo da cópia no GitHub', () => {
    expect(GERADOR_COPIA_URL).toBe('https://github.com/rilsonjoas/GeradorCSLewis/blob/main/src/data/lewis-quotes.snapshot.json');
  });
});

describe('efeitoNoGerador', () => {
  it('entrar: criar ativa, reativar, ou outro autor passa a Lewis', () => {
    expect(efeitoNoGerador(null, ativa)).toBe('entrar');
    expect(efeitoNoGerador(com({ status: 'oculta' }), ativa)).toBe('entrar');
    expect(efeitoNoGerador(com({ author: 'Outro' }), ativa)).toBe('entrar');
  });
  it('sair: ocultar, ou Lewis passa a outro autor', () => {
    expect(efeitoNoGerador(ativa, com({ status: 'oculta' }))).toBe('sair');
    expect(efeitoNoGerador(ativa, com({ author: 'Outro' }))).toBe('sair');
  });
  it('mudar: texto, obra, tema ou domínio público de uma ativa de Lewis', () => {
    expect(efeitoNoGerador(ativa, com({ text: 'Outro.' }))).toBe('mudar');
    expect(efeitoNoGerador(ativa, com({ dominioPublico: true }))).toBe('mudar');
  });
  it('null quando a cópia não muda', () => {
    expect(efeitoNoGerador(ativa, { ...ativa })).toBeNull();
    expect(efeitoNoGerador(null, com({ status: 'rascunho' }))).toBeNull();
  });
});

describe('camposDaCopia (o que a mudança altera na cópia)', () => {
  it('lista só os campos que mudaram, na ordem texto, obra, tema, domínio público, autor', () => {
    expect(camposDaCopia(ativa, com({ text: 'Outro.', source: 'Outra', theme: 'graça' }))).toEqual(['texto', 'obra', 'tema']);
    expect(camposDaCopia(ativa, com({ dominioPublico: true }))).toEqual(['domínio público']);
  });

  it('corrigir a grafia do autor muda a cópia (o autor entra no link de compra) e aparece como "autor"', () => {
    const antes = com({ author: 'C.S. Lewis' });
    const depois = com({ author: 'C. S. Lewis' });
    expect(mudaCopiaDoGerador(antes, depois)).toBe(true);
    expect(efeitoNoGerador(antes, depois)).toBe('mudar');
    expect(camposDaCopia(antes, depois)).toEqual(['autor']);
  });

  it('entrar e sair não detalham campos (a citação inteira entra ou sai)', () => {
    expect(camposDaCopia(null, ativa)).toEqual([]);
    expect(camposDaCopia(ativa, com({ status: 'oculta' }))).toEqual([]);
  });

  it('sem mudança, vazio', () => {
    expect(camposDaCopia(ativa, { ...ativa })).toEqual([]);
  });
});
