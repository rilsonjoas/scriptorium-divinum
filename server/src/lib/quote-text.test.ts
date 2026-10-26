import { describe, it, expect } from 'vitest';
import { chaveDeTexto, slugDaUrlDoScriptorium } from './quote-text.js';

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
