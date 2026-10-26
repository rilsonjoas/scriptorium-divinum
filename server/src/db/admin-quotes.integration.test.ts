import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { ZodError } from 'zod';
import { closeDb } from './client.js';
import { createQuote, listAdminQuotes, listEventos, updateQuote, ocultarQuote, reativarQuote } from './admin-quotes.js';
import { getDailyQuote, gravarEscolhaDoDia } from './quotes.js';
import { dateKeyInTimeZone } from '../lib/date.js';
import { ConflictError, NotFoundError } from '../plugins/error-handler.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, './migrations');
const FUNCTIONS_SQL = path.join(import.meta.dirname, './custom-sql/functions.sql');
const ADMIN = '60000000-0000-0000-0000-000000000001';
const idQuote = (n: number) => `61000000-0000-0000-0000-${String(n).padStart(12, '0')}`;

/** Painel de citações, F2 (docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md, seções 4 e 7). */
describe('Administração de citações: camada de dados', () => {
  let admin: postgres.Sql;

  const contar = async (tabela: string) =>
    ((await admin.unsafe(`SELECT count(*)::int AS n FROM ${tabela}`)) as unknown as [{ n: number }])[0].n;
  const issuesDe = async (p: Promise<unknown>) => {
    try {
      await p;
    } catch (e) {
      expect(e).toBeInstanceOf(ZodError);
      return (e as ZodError).flatten().fieldErrors as Record<string, string[]>;
    }
    throw new Error('esperava ZodError, mas a chamada passou');
  };
  const semar = (n: number) =>
    admin.unsafe(
      `INSERT INTO quotes (id, author, text, source, status)
       VALUES ('${idQuote(n)}', 'Autor ${n}', 'Citação semeada ${n}.', 'Obra', 'ativa')`,
    );
  const livro = async (slug: string, published: boolean) => {
    await admin.unsafe(
      `INSERT INTO authors (id, slug, name) VALUES ('62000000-0000-0000-0000-000000000001', 'autor-livro', 'Autor Livro') ON CONFLICT DO NOTHING`,
    );
    await admin.unsafe(
      `INSERT INTO books (slug, title, author_id, description, published)
       VALUES ('${slug}', 'Livro ${slug}', '62000000-0000-0000-0000-000000000001', 'd', ${published})`,
    );
  };

  beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não definida nos testes de integração');
    admin = postgres(url, { max: 1 });
    await migrate(drizzle(admin), { migrationsFolder: MIGRATIONS_DIR });
    await admin.unsafe(readFileSync(FUNCTIONS_SQL, 'utf-8'));
  });

  beforeEach(async () => {
    await admin.unsafe('TRUNCATE authors, books, quotes, quote_events, daily_quotes RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    if (admin) await admin.end({ timeout: 5 });
    await closeDb();
  });

  describe('createQuote', () => {
    it('cria rascunho com o mínimo e grava o evento criou', async () => {
      const { quote } = await createQuote({ author: 'Autor X', text: 'Frase nova.', dominioPublico: false, status: 'rascunho' }, ADMIN);
      expect(quote.status).toBe('rascunho');
      expect(await contar('quotes')).toBe(1);
      const [ev] = (await admin.unsafe('SELECT * FROM quote_events')) as unknown as Record<string, unknown>[];
      expect(ev!.acao).toBe('criou');
      expect(ev!.quote_id).toBe(quote.id);
      expect(ev!.antes).toBeNull();
      expect((ev!.depois as { text: string }).text).toBe('Frase nova.');
      expect(ev!.admin_id).toBe(ADMIN);
    });

    it('ativa nova exige source, fonteUrl e verificadoEm', async () => {
      const base = { author: 'Autor X', text: 'Frase.', dominioPublico: false, status: 'ativa' as const, source: 'Obra' };
      expect(await issuesDe(createQuote({ ...base, verificadoEm: '2026-10-01' }, ADMIN))).toHaveProperty('fonteUrl');
      expect(await issuesDe(createQuote({ ...base, fonteUrl: 'https://exemplo.org/x' }, ADMIN))).toHaveProperty('verificadoEm');
      expect(await issuesDe(createQuote({ ...base, source: undefined, fonteUrl: 'https://exemplo.org/x', verificadoEm: '2026-10-01' }, ADMIN))).toHaveProperty('source');
      const { quote } = await createQuote({ ...base, fonteUrl: 'https://exemplo.org/x', verificadoEm: '2026-10-01' }, ADMIN);
      expect(quote.status).toBe('ativa');
    });

    it('recusa grafia nova de autor existente e sugere a existente', async () => {
      await semar(1);
      await admin.unsafe(`UPDATE quotes SET author = 'C. S. Lewis' WHERE id = '${idQuote(1)}'`);
      const novo = (author: string) => createQuote({ author, text: `Frase de ${author}.`, dominioPublico: false, status: 'rascunho' }, ADMIN);
      const issues = await issuesDe(novo('C.S. Lewis'));
      expect(issues.author![0]).toContain('"C. S. Lewis"');
      await novo('C. S. Lewis');
      await novo('Autor Inédito');
    });

    it('recusa texto duplicado pela chave e texto só de pontuação', async () => {
      await semar(1);
      const novo = (text: string) => createQuote({ author: 'Autor 9', text, dominioPublico: false, status: 'rascunho' }, ADMIN);
      expect(await issuesDe(novo('CITAÇÃO semeada 1'))).toHaveProperty('text');
      expect(await issuesDe(novo('...'))).toHaveProperty('text');
    });

    it('recusa scriptoriumUrl de obra inexistente ou não publicada e aceita a publicada', async () => {
      await livro('publicada', true);
      await livro('oculta', false);
      const novo = (n: number, url: string) =>
        createQuote({ author: 'Autor L', text: `Frase ${n}.`, dominioPublico: false, status: 'rascunho', scriptoriumUrl: url }, ADMIN);
      expect(await issuesDe(novo(1, 'https://scriptorium.narniano.com/livros/nao-existe'))).toHaveProperty('scriptoriumUrl');
      expect(await issuesDe(novo(2, 'https://scriptorium.narniano.com/livros/oculta'))).toHaveProperty('scriptoriumUrl');
      const { quote } = await novo(3, 'https://scriptorium.narniano.com/livros/publicada/');
      expect(quote.scriptoriumUrl).toBe('https://scriptorium.narniano.com/livros/publicada/');
    });

    it('avisos: obra não curada fora do domínio público; vazio quando curada ou domínio público', async () => {
      const novo = (author: string, source: string, dominioPublico: boolean, n: number) =>
        createQuote({ author, text: `Frase aviso ${n}.`, dominioPublico, status: 'rascunho', source }, ADMIN);
      expect((await novo('C. S. Lewis', 'Obra Que Não Existe', false, 1)).avisos.length).toBeGreaterThan(0);
      expect((await novo('C. S. Lewis', 'Milagres', false, 2)).avisos).toEqual([]);
      expect((await novo('C. S. Lewis', 'Obra Que Não Existe', true, 3)).avisos).toEqual([]);
    });

    it('nada é gravado quando a validação falha', async () => {
      await issuesDe(createQuote({ author: 'A', text: '...', dominioPublico: false, status: 'rascunho' }, ADMIN));
      expect(await contar('quotes')).toBe(0);
      expect(await contar('quote_events')).toBe(0);
    });
  });

  describe('listAdminQuotes', () => {
    beforeEach(async () => {
      await semar(1);
      await semar(2);
      await admin.unsafe(`INSERT INTO quotes (id, author, text, source, status, motivo_ocultacao) VALUES ('${idQuote(3)}', 'Autor 3', 'Citação oculta 100%.', 'Obra', 'oculta', 'teste')`);
      await admin.unsafe(`INSERT INTO quotes (id, author, text, status) VALUES ('${idQuote(4)}', 'Autor 4', 'Rascunho sem fonte.', 'rascunho')`);
    });
    const lista = (q: Partial<Parameters<typeof listAdminQuotes>[0]> = {}) => listAdminQuotes({ page: 1, ...q });

    it('filtra por status e por autor (variante de grafia)', async () => {
      expect((await lista({ status: 'oculta' })).itens.map((i) => i.id)).toEqual([idQuote(3)]);
      expect((await lista({ author: 'autor-1' })).itens.map((i) => i.id)).toEqual([idQuote(1)]);
    });

    it('q procura em texto e fonte; % literal não casa tudo', async () => {
      expect((await lista({ q: 'semeada' })).itens).toHaveLength(2);
      expect((await lista({ q: '%' })).itens.map((i) => i.id)).toEqual([idQuote(3)]);
    });

    it('contadores são do acervo inteiro, mesmo com filtro', async () => {
      const r = await lista({ status: 'oculta' });
      expect(r.contadores.porStatus).toEqual({ rascunho: 1, ativa: 2, oculta: 1 });
      expect(r.contadores.semVerificacao).toBe(2);
      expect(r.contadores.porAutor).toHaveLength(4);
    });

    it('pagina de 50 em 50', async () => {
      await admin.unsafe(`INSERT INTO quotes (author, text, status) SELECT 'Massa', 'Texto em massa ' || g, 'rascunho' FROM generate_series(1, 47) g`);
      const p1 = await lista();
      const p2 = await lista({ page: 2 });
      expect(p1.total).toBe(51);
      expect(p1.itens).toHaveLength(50);
      expect(p2.itens).toHaveLength(1);
      expect(p1.porPagina).toBe(50);
    });
  });

  describe('updateQuote, ocultarQuote, reativarQuote', () => {
    const ID = idQuote(1);
    const ISO = '2026-01-01T10:00:00.123Z';
    const eventos = async () =>
      (await admin.unsafe('SELECT acao, antes, depois, motivo FROM quote_events ORDER BY em, id')) as unknown as {
        acao: string;
        antes: Record<string, unknown> | null;
        depois: Record<string, unknown> | null;
        motivo: string | null;
      }[];
    const estado = async () =>
      ((await admin.unsafe(`SELECT status, motivo_ocultacao, text FROM quotes WHERE id = '${ID}'`)) as unknown as Record<string, string | null>[])[0]!;
    const editar = (campos: Parameters<typeof updateQuote>[1]) => updateQuote(ID, campos, ADMIN);

    beforeEach(async () => {
      await admin.unsafe(
        `INSERT INTO quotes (id, author, text, source, status, updated_at)
         VALUES ('${ID}', 'Autor 1', 'Texto original.', 'Obra', 'ativa', '2026-01-01 10:00:00.123456+00')`,
      );
    });

    it('editar com updatedAt atual funciona mesmo com microssegundos no banco', async () => {
      const { quote } = await editar({ text: 'Texto corrigido.', updatedAt: ISO });
      expect(quote.text).toBe('Texto corrigido.');
    });

    it('updatedAt velho dá ConflictError com a linha atual', async () => {
      await editar({ text: 'Primeira edição.', updatedAt: ISO });
      const erro = await editar({ text: 'Segunda edição.', updatedAt: ISO }).catch((e) => e);
      expect(erro).toBeInstanceOf(ConflictError);
      expect((erro as ConflictError).atual).toMatchObject({ id: ID, text: 'Primeira edição.' });
      expect((await estado()).text).toBe('Primeira edição.');
    });

    it('editar o texto de uma ativa propaga: o dia gravado mostra o texto novo', async () => {
      await admin.unsafe(`INSERT INTO quotes (author, text, source) VALUES ('Autor 2', 'Outra.', 'Obra')`);
      await gravarEscolhaDoDia(dateKeyInTimeZone(new Date()), ID);
      await editar({ text: 'Texto propagado.', updatedAt: ISO });
      expect((await getDailyQuote())?.text).toBe('Texto propagado.');
    });

    it('PATCH sem mudança real: sem evento e updated_at intacto', async () => {
      const { quote } = await editar({ text: 'Texto original.', updatedAt: ISO });
      expect(quote.updatedAt).toBe(ISO);
      expect(await eventos()).toHaveLength(0);
      const [{ igual }] = (await admin.unsafe(
        `SELECT updated_at = '2026-01-01 10:00:00.123456+00' AS igual FROM quotes WHERE id = '${ID}'`,
      )) as unknown as [{ igual: boolean }];
      expect(igual).toBe(true);
    });

    it('só fonteUrl e verificadoEm gera verificou; outro campo gera editou, com antes/depois só do que mudou', async () => {
      const a = await editar({ fonteUrl: 'https://exemplo.org/f', verificadoEm: '2026-10-01', updatedAt: ISO });
      await editar({ theme: 'ceus', text: 'Texto ajustado.', updatedAt: a.quote.updatedAt });
      const [v, e] = await eventos();
      expect(v!.acao).toBe('verificou');
      expect(v!.depois).toEqual({ fonteUrl: 'https://exemplo.org/f', verificadoEm: '2026-10-01' });
      expect(e!.acao).toBe('editou');
      expect(e!.antes).toEqual({ theme: null, text: 'Texto original.' });
      expect(e!.depois).toEqual({ theme: 'ceus', text: 'Texto ajustado.' });
    });

    it('rascunho para ativa exige source, fonteUrl e verificadoEm', async () => {
      await admin.unsafe(
        `INSERT INTO quotes (id, author, text, status, updated_at) VALUES ('${idQuote(2)}', 'Autor 2', 'Rascunho.', 'rascunho', '2026-01-01 10:00:00.123456+00')`,
      );
      const pub = (extra: Parameters<typeof updateQuote>[1]) => updateQuote(idQuote(2), { status: 'ativa', ...extra }, ADMIN);
      expect(await issuesDe(pub({ updatedAt: ISO }))).toHaveProperty('source');
      expect(await issuesDe(pub({ source: 'Obra', updatedAt: ISO }))).toHaveProperty('fonteUrl');
      const { quote } = await pub({ source: 'Obra', fonteUrl: 'https://exemplo.org/f', verificadoEm: '2026-10-01', updatedAt: ISO });
      expect(quote.status).toBe('ativa');
    });

    it('status em PATCH de oculta é recusado', async () => {
      const o = await ocultarQuote(ID, 'motivo de teste', ADMIN);
      expect(await issuesDe(editar({ status: 'ativa', updatedAt: o.updatedAt }))).toHaveProperty('status');
    });

    it('ocultar guarda o motivo, grava ocultou e o dia gravado é substituído na próxima consulta', async () => {
      await admin.unsafe(`INSERT INTO quotes (author, text, source) VALUES ('Autor 2', 'Outra.', 'Obra')`);
      const hoje = dateKeyInTimeZone(new Date());
      await gravarEscolhaDoDia(hoje, ID);
      const o = await ocultarQuote(ID, 'fonte não confere', ADMIN);
      expect(o.status).toBe('oculta');
      expect(o.motivoOcultacao).toBe('fonte não confere');
      expect((await getDailyQuote())?.id).not.toBe(ID);
      expect((await eventos()).map((e) => [e.acao, e.motivo])).toEqual([['ocultou', 'fonte não confere']]);
    });

    it('ocultar duas vezes dá ConflictError', async () => {
      await ocultarQuote(ID, 'primeira vez', ADMIN);
      await expect(ocultarQuote(ID, 'segunda vez', ADMIN)).rejects.toBeInstanceOf(ConflictError);
    });

    it('reativar volta a ativa, limpa o motivo e guarda o motivo antigo em antes', async () => {
      await ocultarQuote(ID, 'fonte não confere', ADMIN);
      const r = await reativarQuote(ID, ADMIN);
      expect(r.status).toBe('ativa');
      expect(r.motivoOcultacao).toBeNull();
      const ev = (await eventos()).at(-1)!;
      expect(ev.acao).toBe('reativou');
      expect(ev.antes).toMatchObject({ status: 'oculta', motivoOcultacao: 'fonte não confere' });
    });

    it('reativar uma ativa dá ConflictError; oculta sem source dá ZodError em source', async () => {
      await expect(reativarQuote(ID, ADMIN)).rejects.toBeInstanceOf(ConflictError);
      await admin.unsafe(`UPDATE quotes SET status = 'oculta', motivo_ocultacao = 't', source = NULL WHERE id = '${ID}'`);
      expect(await issuesDe(reativarQuote(ID, ADMIN))).toHaveProperty('source');
    });

    it('id inexistente dá NotFoundError nas três', async () => {
      const x = idQuote(99);
      await expect(updateQuote(x, { text: 'a', updatedAt: ISO }, ADMIN)).rejects.toBeInstanceOf(NotFoundError);
      await expect(ocultarQuote(x, 'qualquer motivo', ADMIN)).rejects.toBeInstanceOf(NotFoundError);
      await expect(reativarQuote(x, ADMIN)).rejects.toBeInstanceOf(NotFoundError);
    });

    it('atomicidade: se o evento falha, a escrita da citação é desfeita', async () => {
      await admin.unsafe(`CREATE FUNCTION falha_evento() RETURNS trigger AS $$ BEGIN RAISE EXCEPTION 'falha de teste'; END $$ LANGUAGE plpgsql`);
      await admin.unsafe('CREATE TRIGGER t_falha BEFORE INSERT ON quote_events FOR EACH ROW EXECUTE FUNCTION falha_evento()');
      try {
        await expect(ocultarQuote(ID, 'vai falhar', ADMIN)).rejects.toThrow();
        expect((await estado()).status).toBe('ativa');
      } finally {
        await admin.unsafe('DROP TRIGGER t_falha ON quote_events');
        await admin.unsafe('DROP FUNCTION falha_evento()');
      }
    });
  });

  describe('achados da revisão final (Important 1 a 3)', () => {
    const versao = async (id: string) =>
      (
        (await admin.unsafe(
          `SELECT to_char(date_trunc('milliseconds', updated_at) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS u FROM quotes WHERE id = '${id}'`,
        )) as unknown as [{ u: string }]
      )[0].u;
    const completa = (extra: Record<string, unknown> = {}) => ({
      author: 'Autor R',
      text: 'Frase da revisão.',
      dominioPublico: false,
      status: 'ativa' as const,
      source: 'Obra',
      fonteUrl: 'https://exemplo.org/f',
      verificadoEm: '2026-10-01',
      ...extra,
    });

    it('1: corrigir a grafia do próprio autor (mesma chave) funciona', async () => {
      await semar(1);
      await admin.unsafe(`UPDATE quotes SET author = 'C.S. Lewis' WHERE id = '${idQuote(1)}'`);
      const { quote } = await updateQuote(idQuote(1), { author: 'C. S. Lewis', updatedAt: await versao(idQuote(1)) }, ADMIN);
      expect(quote.author).toBe('C. S. Lewis');
    });

    it('1: com duas grafias legadas, criar com uma das que já existem é aceito; uma terceira é recusada', async () => {
      await semar(1);
      await semar(2);
      await admin.unsafe(`UPDATE quotes SET author = 'C.S. Lewis' WHERE id = '${idQuote(1)}'`);
      await admin.unsafe(`UPDATE quotes SET author = 'C. S. Lewis' WHERE id = '${idQuote(2)}'`);
      const novo = (author: string, n: number) =>
        createQuote({ author, text: `Frase legada ${n}.`, dominioPublico: false, status: 'rascunho' }, ADMIN);
      await novo('C.S. Lewis', 1);
      await novo('C. S. Lewis', 2);
      expect(await issuesDe(novo('C S Lewis', 3))).toHaveProperty('author');
    });

    it('2: rascunho oculto e reativado exige a fonte completa; uma ativa de antes continua só com source', async () => {
      const { quote } = await createQuote(completa({ status: 'rascunho', fonteUrl: undefined, verificadoEm: undefined }), ADMIN);
      await ocultarQuote(quote.id, 'não vou usar', ADMIN);
      const issues = await issuesDe(reativarQuote(quote.id, ADMIN));
      expect(issues).toHaveProperty('fonteUrl');
      expect(issues).toHaveProperty('verificadoEm');
      expect((await admin.unsafe(`SELECT status FROM quotes WHERE id = '${quote.id}'`))[0]!.status).toBe('oculta');
    });

    it('3: apagar fonteUrl ou verificadoEm de uma ativa é recusado, e nada é gravado', async () => {
      const { quote } = await createQuote(completa(), ADMIN);
      expect(await issuesDe(updateQuote(quote.id, { fonteUrl: null, updatedAt: quote.updatedAt }, ADMIN))).toHaveProperty('fonteUrl');
      expect(await issuesDe(updateQuote(quote.id, { verificadoEm: null, updatedAt: quote.updatedAt }, ADMIN))).toHaveProperty('verificadoEm');
      expect(await contar('quote_events')).toBe(1);
    });

    it('3: zerar a verificação de um rascunho é permitido, mas o evento é editou, não verificou', async () => {
      const { quote } = await createQuote(completa({ status: 'rascunho' }), ADMIN);
      await updateQuote(quote.id, { fonteUrl: null, verificadoEm: null, updatedAt: quote.updatedAt }, ADMIN);
      const acoes = (await admin.unsafe('SELECT acao FROM quote_events ORDER BY em, id')) as unknown as { acao: string }[];
      expect(acoes.map((a) => a.acao)).toEqual(['criou', 'editou']);
    });
  });

  describe('listEventos', () => {
    it('devolve o histórico de citação excluída, mais recente primeiro', async () => {
      await semar(1);
      await admin.unsafe(`INSERT INTO quote_events (quote_id, acao, em) VALUES ('${idQuote(1)}', 'criou', '2026-01-01T10:00:00Z'), ('${idQuote(1)}', 'ocultou', '2026-01-02T10:00:00Z')`);
      await admin.unsafe(`DELETE FROM quotes WHERE id = '${idQuote(1)}'`);
      expect((await listEventos(idQuote(1))).map((e) => e.acao)).toEqual(['ocultou', 'criou']);
    });
  });
});
