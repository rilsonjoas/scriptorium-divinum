import { describe, expect, it } from 'vitest';
import { diferencasCanonico, resumirDiferencas, type CanonicalQuote } from './quotes-canonical.js';

const q = (n: number, extra: Partial<CanonicalQuote> = {}): CanonicalQuote => ({
  id: `80000000-0000-4000-8000-${String(n).padStart(12, '0')}`,
  author: 'Autor',
  text: `Texto ${n}.`,
  source: 'Obra',
  dominioPublico: false,
  scriptoriumUrl: null,
  theme: null,
  fonteUrl: null,
  verificadoEm: null,
  status: 'ativa',
  motivoOcultacao: null,
  ...extra,
});

describe('diferencasCanonico', () => {
  it('listas iguais não têm diferença', () => {
    const d = diferencasCanonico([q(1), q(2)], [q(1), q(2)]);
    expect(d).toEqual({ novas: [], removidas: [], mudadas: [] });
  });

  it('a ordem das listas não importa (compara por id)', () => {
    expect(diferencasCanonico([q(1), q(2)], [q(2), q(1)])).toEqual({ novas: [], removidas: [], mudadas: [] });
  });

  it('citação só no depois é nova; só no antes foi removida', () => {
    const d = diferencasCanonico([q(1), q(2)], [q(2), q(3)]);
    expect(d.novas.map((x) => x.id)).toEqual([q(3).id]);
    expect(d.removidas.map((x) => x.id)).toEqual([q(1).id]);
    expect(d.mudadas).toEqual([]);
  });

  it('mudança de campo aponta o id e os campos que mudaram', () => {
    const d = diferencasCanonico([q(1)], [q(1, { text: 'Corrigido.', status: 'oculta', motivoOcultacao: 'x' })]);
    expect(d.mudadas).toEqual([{ id: q(1).id, campos: ['text', 'status', 'motivoOcultacao'] }]);
  });

  it('id em maiúsculas e minúsculas é a mesma citação', () => {
    const d = diferencasCanonico([q(1, { id: q(1).id.toUpperCase() })], [q(1)]);
    expect(d).toEqual({ novas: [], removidas: [], mudadas: [] });
  });

  it('null e ausência são iguais (campo opcional)', () => {
    const semFonte = { ...q(1) } as Partial<CanonicalQuote>;
    delete semFonte.fonteUrl;
    const d = diferencasCanonico([semFonte as CanonicalQuote], [q(1)]);
    expect(d.mudadas).toEqual([]);
  });
});

describe('resumirDiferencas', () => {
  it('sem diferença diz que está em dia', () => {
    expect(resumirDiferencas({ novas: [], removidas: [], mudadas: [] })).toBe('O canônico já está em dia com o banco.');
  });

  it('conta novas, removidas e mudadas e nomeia as mudanças', () => {
    const texto = resumirDiferencas({
      novas: [q(3)],
      removidas: [q(4), q(5)],
      mudadas: [{ id: q(1).id, campos: ['text'] }],
    });
    expect(texto).toContain('1 nova');
    expect(texto).toContain('2 removidas');
    expect(texto).toContain('1 alterada');
    expect(texto).toContain(`${q(1).id}: text`);
    expect(texto).toContain('Texto 3.');
  });
});
