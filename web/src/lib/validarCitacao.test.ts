import { describe, expect, it } from 'vitest';
import type { QuoteFormValues } from '@/services/adminQuotes';
import { TEXTO_MAX, chaveDeAutor, validarCitacao } from './validarCitacao';

const completo: QuoteFormValues = {
  author: 'C. S. Lewis',
  text: 'Texto da citação.',
  source: 'Cristianismo Puro e Simples',
  dominioPublico: false,
  scriptoriumUrl: '',
  theme: '',
  fonteUrl: 'https://exemplo.org/p/12',
  verificadoEm: '2026-10-01',
  status: 'ativa',
};
const ctx = { autoresExistentes: ['C. S. Lewis', 'Santo Agostinho'], novo: true };

describe('chaveDeAutor', () => {
  it('ignora caixa e pontuação, mas não acento', () => {
    expect(chaveDeAutor('C.S. Lewis')).toBe(chaveDeAutor('c s lewis'));
    expect(chaveDeAutor('Agostinho')).not.toBe(chaveDeAutor('Agostínho'));
  });
});

describe('validarCitacao', () => {
  it('formulário completo é válido', () => {
    expect(validarCitacao(completo, ctx)).toEqual({});
  });

  it('autor vazio e texto vazio dão erro', () => {
    const e = validarCitacao({ ...completo, author: '  ', text: '' }, ctx);
    expect(e.author).toBeTruthy();
    expect(e.text).toBeTruthy();
  });

  it('texto acima do limite dá erro', () => {
    expect(validarCitacao({ ...completo, text: 'a'.repeat(TEXTO_MAX + 1) }, ctx).text).toBeTruthy();
    expect(validarCitacao({ ...completo, text: 'a'.repeat(TEXTO_MAX) }, ctx).text).toBeUndefined();
  });

  it('grafia de autor diferente da existente sugere a existente', () => {
    const e = validarCitacao({ ...completo, author: 'C.S. Lewis' }, ctx);
    expect(e.author).toBe('Já existe este autor escrito assim: "C. S. Lewis". Use essa grafia.');
  });

  it('grafia idêntica a uma existente e autor novo são aceitos', () => {
    expect(validarCitacao({ ...completo, author: 'C. S. Lewis' }, ctx).author).toBeUndefined();
    expect(validarCitacao({ ...completo, author: 'Autor Inédito' }, ctx).author).toBeUndefined();
  });

  it('ativa sem fonte dá erro em source', () => {
    expect(validarCitacao({ ...completo, source: '' }, ctx).source).toBeTruthy();
  });

  it('ativa nova sem fonteUrl ou verificadoEm dá erro em cada um', () => {
    const e = validarCitacao({ ...completo, fonteUrl: '', verificadoEm: '' }, ctx);
    expect(e.fonteUrl).toBeTruthy();
    expect(e.verificadoEm).toBeTruthy();
  });

  it('rascunho não exige fonte nem verificação', () => {
    expect(validarCitacao({ ...completo, status: 'rascunho', source: '', fonteUrl: '', verificadoEm: '' }, ctx)).toEqual({});
  });

  it('edição de ativa (novo=false) não exige fonteUrl nem verificadoEm', () => {
    const e = validarCitacao({ ...completo, fonteUrl: '', verificadoEm: '' }, { ...ctx, novo: false });
    expect(e.fonteUrl).toBeUndefined();
    expect(e.verificadoEm).toBeUndefined();
  });

  it('fonteUrl precisa ser http ou https', () => {
    expect(validarCitacao({ ...completo, fonteUrl: 'ftp://x.org' }, ctx).fonteUrl).toBeTruthy();
    expect(validarCitacao({ ...completo, fonteUrl: 'exemplo.org' }, ctx).fonteUrl).toBeTruthy();
    expect(validarCitacao({ ...completo, fonteUrl: 'http://x.org' }, ctx).fonteUrl).toBeUndefined();
  });

  it('verificadoEm precisa ser data AAAA-MM-DD existente', () => {
    expect(validarCitacao({ ...completo, verificadoEm: '01/10/2026' }, ctx).verificadoEm).toBeTruthy();
    expect(validarCitacao({ ...completo, verificadoEm: '2026-02-30' }, ctx).verificadoEm).toBeTruthy();
    expect(validarCitacao({ ...completo, verificadoEm: '2026-02-28' }, ctx).verificadoEm).toBeUndefined();
  });
});
