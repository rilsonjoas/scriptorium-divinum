import { describe, expect, it } from 'vitest';
import { chaveDeAutor, grafiasDivergentes } from './quote-authors.js';

describe('chaveDeAutor', () => {
  it('ignora caixa, espaços, pontos e hífens', () => {
    const chaves = ['C. S. Lewis', 'C.S. Lewis', 'CS Lewis', ' c.s.  LEWIS '].map(chaveDeAutor);
    expect(new Set(chaves)).toEqual(new Set(['cslewis']));
    expect(chaveDeAutor('Jean-Paul Sartre')).toBe(chaveDeAutor('Jean Paul Sartre'));
  });

  it('mantém acento (não cria falsa igualdade) e letras fora do ASCII', () => {
    expect(chaveDeAutor('Søren Kierkegaard')).not.toBe(chaveDeAutor('Soren Kierkegaard'));
    expect(chaveDeAutor('Tomás de Kempis')).toBe('tomásdekempis');
  });

  it('apelido não é o mesmo autor', () => {
    expect(chaveDeAutor('Lewis')).not.toBe(chaveDeAutor('C. S. Lewis'));
  });

  it('nome só de pontuação vira chave vazia', () => {
    expect(chaveDeAutor('...')).toBe('');
  });
});

describe('grafiasDivergentes', () => {
  it('acusa o mesmo autor escrito de dois jeitos', () => {
    expect(grafiasDivergentes(['C. S. Lewis', 'C. S. Lewis', 'C.S. Lewis', 'G. K. Chesterton'])).toEqual([
      { chave: 'cslewis', grafias: ['C. S. Lewis', 'C.S. Lewis'] },
    ]);
  });

  it('não acusa nada quando cada autor tem uma grafia só, mesmo repetida', () => {
    expect(grafiasDivergentes(['C. S. Lewis', 'C. S. Lewis', 'Tomás de Kempis'])).toEqual([]);
  });

  it('grafias que só diferem por espaço nas pontas contam como uma', () => {
    expect(grafiasDivergentes(['C. S. Lewis', ' C. S. Lewis '])).toEqual([]);
  });

  it('lista vazia e nomes vazios não quebram', () => {
    expect(grafiasDivergentes([])).toEqual([]);
    expect(grafiasDivergentes(['', '...'])).toEqual([]);
  });
});
