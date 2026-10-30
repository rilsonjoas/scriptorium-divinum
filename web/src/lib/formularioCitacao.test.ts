import { describe, expect, it } from 'vitest';
import { hojeISO, normalizarUrl, slugDaObra, urlDaObra } from './formularioCitacao';

describe('normalizarUrl', () => {
  it('vazio, espaços ou só o esquema viram vazio', () => {
    expect(normalizarUrl('')).toBe('');
    expect(normalizarUrl('   ')).toBe('');
    expect(normalizarUrl('https://')).toBe('');
    expect(normalizarUrl('http://')).toBe('');
  });

  it('sem esquema ganha https://', () => {
    expect(normalizarUrl('exemplo.org/p/1')).toBe('https://exemplo.org/p/1');
    expect(normalizarUrl('  exemplo.org  ')).toBe('https://exemplo.org');
  });

  it('com esquema fica como está (http respeitado, caixa do esquema aceita)', () => {
    expect(normalizarUrl('https://exemplo.org/p')).toBe('https://exemplo.org/p');
    expect(normalizarUrl('http://exemplo.org')).toBe('http://exemplo.org');
    expect(normalizarUrl('HTTP://X.org')).toBe('HTTP://X.org');
  });

  it('outro esquema não é reescrito (a validação do servidor decide)', () => {
    expect(normalizarUrl('ftp://x.org')).toBe('ftp://x.org');
  });
});

describe('hojeISO', () => {
  it('usa o dia de São Paulo, não o de UTC', () => {
    expect(hojeISO(new Date('2026-10-30T02:59:59Z'))).toBe('2026-10-29');
    expect(hojeISO(new Date('2026-10-30T03:00:00Z'))).toBe('2026-10-30');
  });
});

describe('urlDaObra e slugDaObra', () => {
  it('montam e leem o endereço da obra no Scriptorium', () => {
    expect(urlDaObra('o-peregrino')).toBe('https://scriptorium.narniano.com/livros/o-peregrino');
    expect(slugDaObra('https://scriptorium.narniano.com/livros/o-peregrino')).toBe('o-peregrino');
    expect(slugDaObra('https://scriptorium.narniano.com/livros/o-peregrino/')).toBe('o-peregrino');
    expect(slugDaObra('')).toBe('');
  });
});
