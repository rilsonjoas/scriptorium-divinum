import { describe, it, expect } from 'vitest';
import { verificarManifesto, type Manifesto } from './acervo-manifesto.js';

const HOJE = new Date('2026-10-30T12:00:00Z');
const m = (arquivos: Manifesto['arquivos']): Manifesto => ({ versao: 1, arquivos });
const pt = { idioma: 'Português' as const };
const en = { idioma: 'Inglês' as const };
const erros = (r: ReturnType<typeof verificarManifesto>) => r.filter((x) => x.nivel === 'ERRO').map((x) => x.mensagem);

describe('verificarManifesto', () => {
  it('manifesto coerente com a pasta não dá achado', () => {
    const r = verificarManifesto(m({ a: { estado: 'publicada' }, b: { estado: 'fonte' } }), { a: pt, b: en }, HOJE);
    expect(r).toEqual([]);
  });

  it('arquivo novo sem entrada no manifesto é ERRO (o freio)', () => {
    const r = verificarManifesto(m({}), { novo: pt }, HOJE);
    expect(erros(r)[0]).toMatch(/sem entrada no manifesto/);
    expect(r[0]!.arquivo).toBe('novo');
  });

  it('entrada do manifesto sem arquivo é ERRO', () => {
    const r = verificarManifesto(m({ fantasma: { estado: 'publicada' } }), {}, HOJE);
    expect(erros(r)[0]).toMatch(/não existe em server\/texts/);
  });

  it('estado desconhecido é ERRO', () => {
    const r = verificarManifesto(m({ a: { estado: 'talvez' as never } }), { a: pt }, HOJE);
    expect(erros(r)[0]).toMatch(/estado inválido/);
  });

  it('oculta exige motivo', () => {
    expect(erros(verificarManifesto(m({ a: { estado: 'oculta' } }), { a: pt }, HOJE))[0]).toMatch(/motivo/);
    expect(erros(verificarManifesto(m({ a: { estado: 'oculta', motivo: 'corrompido' } }), { a: pt }, HOJE))).toEqual([]);
  });

  it('rascunho exige dono e desde', () => {
    expect(erros(verificarManifesto(m({ a: { estado: 'rascunho' } }), { a: pt }, HOJE))[0]).toMatch(/dono e desde/);
  });

  it('rascunho parado há mais de 30 dias vira AVISO (não barra)', () => {
    const r = verificarManifesto(m({ a: { estado: 'rascunho', dono: 'rilson', desde: '2026-08-01' } }), { a: pt }, HOJE);
    expect(erros(r)).toEqual([]);
    expect(r.find((x) => x.nivel === 'AVISO')?.mensagem).toMatch(/dias/);
  });

  it('publicada em inglês é ERRO: o site publica só em português', () => {
    expect(erros(verificarManifesto(m({ a: { estado: 'publicada' } }), { a: en }, HOJE))[0]).toMatch(/português/);
  });

  it('idioma declarado (latim) vale mais que a detecção, que só distingue inglês de português', () => {
    const r = verificarManifesto(m({ a: { estado: 'fonte', idioma: 'Latim' } }), { a: pt }, HOJE);
    expect(erros(r)).toEqual([]);
  });

  it('publicada com idioma declarado diferente de português é ERRO', () => {
    expect(erros(verificarManifesto(m({ a: { estado: 'publicada', idioma: 'Latim' } }), { a: pt }, HOJE))[0]).toMatch(/português/);
  });

  it('fonte em português é ERRO: ou publica, ou declara o motivo de ocultar', () => {
    expect(erros(verificarManifesto(m({ a: { estado: 'fonte' } }), { a: pt }, HOJE))[0]).toMatch(/português/);
  });

  describe('texto que pode ser de outro livro (achado de 21/11/2026)', () => {
    const comConteudo = (densidadeTeologica: number, taxaPortugues = 12, palavras = 20_000) => ({
      ...pt,
      conteudo: { palavras, densidadeTeologica, taxaPortugues },
    });
    const avisos = (r: ReturnType<typeof verificarManifesto>) => r.filter((x) => x.nivel === 'AVISO').map((x) => x.mensagem);

    it('obra publicada sem vocabulário teológico é ERRO (era um romance sob o título de Teresa de Ávila)', () => {
      const r = verificarManifesto(m({ a: { estado: 'publicada' } }), { a: comConteudo(0.4) }, HOJE);
      expect(erros(r)[0]).toMatch(/OUTRO livro/);
    });

    it('os números reais das 8 trocadas (0,4 a 2,8) barram; o menor legítimo medido (3,9) só avisa', () => {
      for (const d of [0.4, 0.6, 0.7, 1.7, 1.9, 2.3, 2.8]) {
        expect(erros(verificarManifesto(m({ a: { estado: 'publicada' } }), { a: comConteudo(d) }, HOJE))).toHaveLength(1);
      }
      const r = verificarManifesto(m({ a: { estado: 'publicada' } }), { a: comConteudo(3.9) }, HOJE);
      expect(erros(r)).toEqual([]);
      expect(avisos(r)).toHaveLength(1);
    });

    it('conteudoConferido silencia (obra legítima pouco teológica)', () => {
      const r = verificarManifesto(m({ a: { estado: 'publicada', conteudoConferido: 'Rilson, 2026-11-21' } }), { a: comConteudo(0.4) }, HOJE);
      expect(r).toEqual([]);
    });

    it('obra oculta não é barrada (é o que fazemos com a trocada)', () => {
      const r = verificarManifesto(m({ a: { estado: 'oculta', motivo: 'texto de outro livro' } }), { a: comConteudo(0.4) }, HOJE);
      expect(r).toEqual([]);
    });

    it('texto curto (< 3.000 palavras) não é medido: poucas palavras dão densidade instável', () => {
      const r = verificarManifesto(m({ a: { estado: 'publicada' } }), { a: comConteudo(0, 12, 2_000) }, HOJE);
      expect(r).toEqual([]);
    });

    it('pouco português com vocabulário normal é só AVISO (outro idioma?)', () => {
      const r = verificarManifesto(m({ a: { estado: 'publicada' } }), { a: comConteudo(20, 4) }, HOJE);
      expect(erros(r)).toEqual([]);
      expect(avisos(r)).toHaveLength(1);
    });

    it('obra normal (densidade 23, mediana medida) não dá achado', () => {
      expect(verificarManifesto(m({ a: { estado: 'publicada' } }), { a: comConteudo(23) }, HOJE)).toEqual([]);
    });
  });
});
