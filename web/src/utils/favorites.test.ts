import { describe, it, expect, beforeEach } from 'vitest';
import { listFavorites, isFavorite, toggleFavorite } from './favorites';

describe('favorites', () => {
  beforeEach(() => localStorage.clear());

  it('começa vazio', () => {
    expect(listFavorites()).toEqual([]);
    expect(isFavorite('a')).toBe(false);
  });

  it('toggle adiciona e remove', () => {
    expect(toggleFavorite('confissoes')).toBe(true);
    expect(isFavorite('confissoes')).toBe(true);
    expect(toggleFavorite('confissoes')).toBe(false);
    expect(listFavorites()).toEqual([]);
  });

  it('mais recentes primeiro', () => {
    toggleFavorite('a');
    toggleFavorite('b');
    expect(listFavorites()).toEqual(['b', 'a']);
  });

  it('ignora slug vazio', () => {
    expect(toggleFavorite('')).toBe(false);
    expect(listFavorites()).toEqual([]);
  });

  it('tolera JSON corrompido', () => {
    localStorage.setItem('scriptorium:favorites', '{lixo');
    expect(listFavorites()).toEqual([]);
    toggleFavorite('a');
    expect(listFavorites()).toEqual(['a']);
  });
});
