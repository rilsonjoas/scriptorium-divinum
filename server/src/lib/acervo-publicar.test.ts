import { describe, it, expect } from 'vitest';
import { gerarSeed, marcarPublicada, nomeDoSeed, validarPedido, type PedidoPublicar } from './acervo-publicar.js';
import type { Manifesto } from './acervo-manifesto.js';

const pedido: PedidoPublicar = {
  arquivo: 'obra-x',
  titulo: 'A Obra X',
  tituloOriginal: 'Opus X',
  autorSlug: 'fulano-de-tal',
  autorNome: 'Fulano de Tal',
  anoOriginal: '1250',
  categorias: ['Teologia Moral e Escolástica'],
  tags: ['fulano', 'obra-x'],
};
const manifesto = (estado: 'fonte' | 'oculta' | 'rascunho' | 'publicada'): Manifesto => ({
  versao: 1,
  arquivos: { 'obra-x': estado === 'oculta' ? { estado, motivo: 'por ora' } : estado === 'rascunho' ? { estado, dono: 'r', desde: '2026-10-01' } : { estado } },
});

describe('validarPedido', () => {
  it('pedido completo, de arquivo em português que ainda não está publicado, passa', () => {
    expect(validarPedido(pedido, { manifesto: manifesto('oculta'), idioma: 'Português' })).toEqual([]);
  });

  it('arquivo que não existe em server/texts', () => {
    expect(validarPedido(pedido, { manifesto: manifesto('oculta'), idioma: null })[0]).toMatch(/não existe/);
  });

  it('arquivo sem entrada no manifesto', () => {
    expect(validarPedido(pedido, { manifesto: { versao: 1, arquivos: {} }, idioma: 'Português' })[0]).toMatch(/manifesto/);
  });

  it('arquivo já publicado', () => {
    expect(validarPedido(pedido, { manifesto: manifesto('publicada'), idioma: 'Português' })[0]).toMatch(/já está 'publicada'/);
  });

  it('texto em inglês não publica: o site é só em português', () => {
    expect(validarPedido(pedido, { manifesto: manifesto('fonte'), idioma: 'Inglês' })[0]).toMatch(/português/);
  });

  it('campos obrigatórios: título, autor (slug e nome) e ao menos uma categoria', () => {
    const erros = validarPedido({ ...pedido, titulo: '', autorSlug: '', autorNome: '', categorias: [] }, { manifesto: manifesto('oculta'), idioma: 'Português' });
    expect(erros.join(' ')).toMatch(/título/);
    expect(erros.join(' ')).toMatch(/autor/);
    expect(erros.join(' ')).toMatch(/categoria/);
  });

  it('slug com caractere inválido', () => {
    expect(validarPedido({ ...pedido, slug: 'Slug Ruim!' }, { manifesto: manifesto('oculta'), idioma: 'Português' })[0]).toMatch(/slug/);
  });
});

describe('gerarSeed', () => {
  const seed = gerarSeed(pedido, '2026-10-31');

  it('segue o padrão do projeto: transação, autor idempotente e livro idempotente', () => {
    expect(seed).toMatch(/^[\s\S]*BEGIN;[\s\S]*COMMIT;\s*$/);
    expect(seed).toMatch(/INSERT INTO authors \(slug, name\)[\s\S]*'fulano-de-tal', 'Fulano de Tal'[\s\S]*ON CONFLICT \(slug\) DO NOTHING/);
    expect(seed).toMatch(/INSERT INTO books[\s\S]*FROM authors a[\s\S]*WHERE a\.slug = 'fulano-de-tal'[\s\S]*ON CONFLICT \(slug\) DO NOTHING/);
  });

  it('aponta para o arquivo certo e publica', () => {
    expect(seed).toContain("'/texts/obra-x.md'");
    expect(seed).toMatch(/'obra-x',\s*\n\s*'Opus X'/);
  });

  it('tradução por IA e licença do projeto por padrão; sem revisão humana atestada', () => {
    expect(seed).toContain("'cc-by-sa-4.0'");
    expect(seed).toContain('Scriptorium Divinum (tradução por IA)');
    expect(seed).not.toMatch(/NOW\(\)/);
  });

  it('--revisado grava human_review_approved_at = NOW()', () => {
    expect(gerarSeed({ ...pedido, revisado: true }, '2026-10-31')).toMatch(/human_review_approved_at[\s\S]*NOW\(\)/);
  });

  it('escapa aspas simples (Sant\'Anna) em títulos, autor e descrição', () => {
    const s = gerarSeed({ ...pedido, titulo: "Vida de Sant'Anna", autorNome: "D'Ávila", descricao: "Obra d'ele." }, '2026-10-31');
    expect(s).toContain("'Vida de Sant''Anna'");
    expect(s).toContain("'D''Ávila'");
    expect(s).toContain("'Obra d''ele.'");
  });

  it('listas viram ARRAY[...] escapado', () => {
    expect(seed).toContain("ARRAY['Teologia Moral e Escolástica']");
    expect(seed).toContain("ARRAY['fulano', 'obra-x']");
  });

  it('sem ano nem título original, grava NULL e usa o título', () => {
    const s = gerarSeed({ ...pedido, anoOriginal: undefined, tituloOriginal: undefined }, '2026-10-31');
    expect(s).toMatch(/NULL,\s*\n\s*2026/);
  });
});

describe('marcarPublicada / nomeDoSeed', () => {
  it('muda o estado e descarta motivo, dono e desde', () => {
    const novo = marcarPublicada(manifesto('oculta'), 'obra-x');
    expect(novo.arquivos['obra-x']).toEqual({ estado: 'publicada' });
  });

  it('mantém as outras entradas e não muta o original', () => {
    const m: Manifesto = { versao: 1, arquivos: { 'obra-x': { estado: 'fonte' }, outra: { estado: 'publicada' } } };
    const novo = marcarPublicada(m, 'obra-x');
    expect(novo.arquivos.outra).toEqual({ estado: 'publicada' });
    expect(m.arquivos['obra-x']).toEqual({ estado: 'fonte' });
  });

  it('nome do seed: add_<slug>_<data>.sql', () => {
    expect(nomeDoSeed(pedido, '2026-10-31')).toBe('add_obra-x_2026-10-31.sql');
    expect(nomeDoSeed({ ...pedido, slug: 'outro-slug' }, '2026-10-31')).toBe('add_outro-slug_2026-10-31.sql');
  });
});
