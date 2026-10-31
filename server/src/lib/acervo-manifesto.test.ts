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
});
