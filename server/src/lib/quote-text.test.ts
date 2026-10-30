import { describe, it, expect } from 'vitest';
import { chaveDeTexto, slugDaUrlDoScriptorium, slugDoEnderecoDaObra } from './quote-text.js';

describe('chaveDeTexto', () => {
  it('ignora caixa, espaços e pontuação', () => {
    expect(chaveDeTexto('Olá,  Mundo!')).toBe(chaveDeTexto('olá mundo'));
  });
  it('acento distingue', () => {
    expect(chaveDeTexto('Sao')).not.toBe(chaveDeTexto('São'));
  });
  it('só pontuação dá chave vazia', () => {
    expect(chaveDeTexto('...  ')).toBe('');
  });
});

describe('slugDaUrlDoScriptorium', () => {
  it('pega o último segmento, sem barra final', () => {
    expect(slugDaUrlDoScriptorium('https://scriptorium.narniano.com/livros/confissoes/')).toBe('confissoes');
    expect(slugDaUrlDoScriptorium('https://scriptorium.narniano.com/livros/confissoes')).toBe('confissoes');
  });
  it('vazio dá vazio', () => {
    expect(slugDaUrlDoScriptorium('')).toBe('');
  });
});

describe('slugDoEnderecoDaObra', () => {
  it('devolve o slug do endereço certo, com ou sem barra no fim', () => {
    expect(slugDoEnderecoDaObra('https://scriptorium.narniano.com/livros/o-peregrino')).toBe('o-peregrino');
    expect(slugDoEnderecoDaObra('https://scriptorium.narniano.com/livros/o-peregrino/')).toBe('o-peregrino');
  });

  it.each([
    'http://scriptorium.narniano.com/livros/x',
    'https://evil.example/livros/x',
    'https://scriptorium.narniano.com.evil.example/livros/x',
    'https://scriptorium.narniano.com/autores/x',
    'https://scriptorium.narniano.com/livros/x/y',
    'https://scriptorium.narniano.com/livros/',
    'livros/x',
    '',
  ])('recusa %s', (url) => {
    expect(slugDoEnderecoDaObra(url)).toBeNull();
  });
});
