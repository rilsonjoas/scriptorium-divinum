import { and, count, desc, eq, sql, type SQL } from 'drizzle-orm';
import { ZodError } from 'zod';
import { db } from './client.js';
import { books, quoteEvents, quotes } from './schema.js';
import { chaveDeAutor } from '../lib/quote-authors.js';
import { chaveDeTexto, slugDaUrlDoScriptorium } from '../lib/quote-text.js';
import { isCuratedSource } from '../lib/quote-sources.js';
import { whereByAuthor } from './quotes.js';
import { ConflictError, NotFoundError } from '../plugins/error-handler.js';
import type { CreateQuoteInput, ListAdminQuotesQuery, UpdateQuoteInput } from '../schemas/admin-quotes.schema.js';

/** Painel de citações, F2 (docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md, seção 7).
 *  Toda escrita acontece numa transação que também grava o `quote_events` (R8). Regras que recusam lançam
 *  `ZodError`, para o `400` sair no formato do cluster pelo handler de erros, sem código novo lá. */

export type QuoteStatus = 'rascunho' | 'ativa' | 'oculta';
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
type QuoteRow = typeof quotes.$inferSelect;

export interface AdminQuote {
  id: string;
  author: string;
  text: string;
  source: string | null;
  dominioPublico: boolean;
  scriptoriumUrl: string | null;
  theme: string | null;
  fonteUrl: string | null;
  verificadoEm: string | null;
  status: QuoteStatus;
  motivoOcultacao: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteEventDto {
  id: string;
  quoteId: string;
  acao: string;
  antes: unknown;
  depois: unknown;
  motivo: string | null;
  adminId: string | null;
  em: string;
}

export const POR_PAGINA = 50;

export function paraAdminQuote(row: QuoteRow): AdminQuote {
  return {
    id: row.id,
    author: row.author,
    text: row.text,
    source: row.source,
    dominioPublico: row.dominioPublico,
    scriptoriumUrl: row.scriptoriumUrl,
    theme: row.theme,
    fonteUrl: row.fonteUrl,
    verificadoEm: row.verificadoEm,
    status: row.status as QuoteStatus,
    motivoOcultacao: row.motivoOcultacao,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** Recusa a escrita com um `ZodError` de um ou mais campos. */
export function recusar(...problemas: [campo: string, mensagem: string][]): never {
  throw new ZodError(problemas.map(([campo, message]) => ({ code: 'custom' as const, path: [campo], message })));
}

export const vazioParaNull = (v: string | null | undefined): string | null => (v?.trim() ? v.trim() : null);

/** Autor novo é aceito; grafia diferente de um autor que já existe com a mesma chave é recusada, com a existente na mensagem. */
export async function validarAutor(tx: Tx, author: string): Promise<void> {
  const chave = chaveDeAutor(author);
  if (!chave) recusar(['author', 'Autor sem letras nem números']);
  const existentes = await tx.selectDistinct({ author: quotes.author }).from(quotes);
  const outra = existentes.find((r) => chaveDeAutor(r.author) === chave && r.author !== author);
  if (outra) recusar(['author', `Já existe este autor escrito assim: "${outra.author}". Use essa grafia.`]);
}

/** Texto não pode ser vazio de conteúdo nem repetir outra citação (qualquer status) pela chave do texto. */
export async function validarTexto(tx: Tx, text: string, ignorarId?: string): Promise<void> {
  const chave = chaveDeTexto(text);
  if (!chave) recusar(['text', 'O texto precisa ter letras ou números']);
  const condicoes = [sql`regexp_replace(lower(${quotes.text}), '[^[:alnum:]]+', '', 'g') = ${chave}`];
  if (ignorarId) condicoes.push(sql`${quotes.id} <> ${ignorarId}`);
  const [dup] = await tx.select({ id: quotes.id }).from(quotes).where(and(...condicoes)).limit(1);
  if (dup) recusar(['text', `Já existe uma citação com este texto (id ${dup.id})`]);
}

/** `scriptoriumUrl` precisa apontar para obra publicada (a regra de `scripts/verificar-acervo.ts`). */
export async function validarScriptoriumUrl(tx: Tx, url: string): Promise<void> {
  const slug = slugDaUrlDoScriptorium(url);
  const [livro] = slug
    ? await tx.select({ id: books.id }).from(books).where(and(eq(books.slug, slug), eq(books.published, true))).limit(1)
    : [];
  if (!livro) recusar(['scriptoriumUrl', 'O link não aponta para uma obra publicada no Scriptorium']);
}

/** R6. Para ficar ativa: `source`. Item novo (criado ativo, ou rascunho que se publica) também `fonteUrl` e `verificadoEm`. */
export function exigirFonteParaAtiva(
  q: { source: string | null; fonteUrl: string | null; verificadoEm: string | null },
  { novo }: { novo: boolean },
): void {
  const faltando: [string, string][] = [];
  if (!q.source?.trim()) faltando.push(['source', 'Citação ativa exige a obra (fonte)']);
  if (novo && !q.fonteUrl) faltando.push(['fonteUrl', 'Citação nova e ativa exige o link da fonte checada']);
  if (novo && !q.verificadoEm) faltando.push(['verificadoEm', 'Citação nova e ativa exige a data da verificação']);
  if (faltando.length) recusar(...faltando);
}

/** Avisos, nunca bloqueio: obra fora da curadoria e sem domínio público fica sem link de compra. */
export function avisosDe(q: { author: string; source: string | null; dominioPublico: boolean }): string[] {
  if (!q.dominioPublico && q.source && !isCuratedSource(q.author, q.source)) {
    return [`A obra "${q.source}" não está na curadoria de ${q.author}: a citação aparece sem link de compra.`];
  }
  return [];
}

export async function gravarEvento(
  tx: Tx,
  e: { quoteId: string; acao: 'criou' | 'editou' | 'ocultou' | 'reativou' | 'verificou'; antes: unknown; depois: unknown; motivo?: string; adminId: string },
): Promise<void> {
  await tx.insert(quoteEvents).values({
    quoteId: e.quoteId,
    acao: e.acao,
    antes: e.antes ?? null,
    depois: e.depois ?? null,
    motivo: e.motivo ?? null,
    adminId: e.adminId,
  });
}

export async function createQuote(
  input: CreateQuoteInput,
  adminId: string,
): Promise<{ quote: AdminQuote; avisos: string[] }> {
  const valores = {
    author: input.author,
    text: input.text,
    source: vazioParaNull(input.source),
    dominioPublico: input.dominioPublico,
    scriptoriumUrl: vazioParaNull(input.scriptoriumUrl),
    theme: vazioParaNull(input.theme),
    fonteUrl: input.fonteUrl ?? null,
    verificadoEm: input.verificadoEm ?? null,
    status: input.status,
  };
  return db.transaction(async (tx) => {
    await validarAutor(tx, valores.author);
    await validarTexto(tx, valores.text);
    if (valores.scriptoriumUrl) await validarScriptoriumUrl(tx, valores.scriptoriumUrl);
    if (valores.status === 'ativa') exigirFonteParaAtiva(valores, { novo: true });
    const [row] = await tx.insert(quotes).values(valores).returning();
    const quote = paraAdminQuote(row!);
    await gravarEvento(tx, { quoteId: quote.id, acao: 'criou', antes: null, depois: quote, adminId });
    return { quote, avisos: avisosDe(quote) };
  });
}

/** Lê a linha trancando-a até o fim da transação, para duas edições simultâneas não se atropelarem. */
async function travar(tx: Tx, id: string): Promise<QuoteRow> {
  const [row] = await tx.select().from(quotes).where(eq(quotes.id, id)).for('update');
  if (!row) throw new NotFoundError('Citação');
  return row;
}

const CAMPOS_EDITAVEIS = ['author', 'text', 'source', 'dominioPublico', 'scriptoriumUrl', 'theme', 'fonteUrl', 'verificadoEm', 'status'] as const;
type CampoEditavel = (typeof CAMPOS_EDITAVEIS)[number];
const CAMPOS_DE_VERIFICACAO: readonly CampoEditavel[] = ['fonteUrl', 'verificadoEm'];

/** Edita. `updatedAt` é a versão que quem edita viu: se a linha mudou depois, `ConflictError` com a atual. A
 *  comparação é em SQL, em milissegundos: o Postgres guarda microssegundos e o JS só milissegundos, e comparar
 *  em JS faria todo `PATCH` legítimo dar 409. Sem mudança real devolve a linha como está, sem evento. */
export async function updateQuote(
  id: string,
  input: UpdateQuoteInput,
  adminId: string,
): Promise<{ quote: AdminQuote; avisos: string[] }> {
  return db.transaction(async (tx) => {
    const atual = await travar(tx, id);
    const [{ ok }] = (await tx.execute(
      sql`SELECT date_trunc('milliseconds', updated_at) = ${input.updatedAt}::timestamptz AS ok FROM quotes WHERE id = ${id}`,
    )) as unknown as [{ ok: boolean }];
    if (!ok) throw new ConflictError('A citação mudou desde que você a abriu', paraAdminQuote(atual));
    if (atual.status === 'oculta' && input.status !== undefined) {
      recusar(['status', 'Citação oculta só volta pela rota de reativar']);
    }

    const textoVazioParaNull = new Set<CampoEditavel>(['source', 'scriptoriumUrl', 'theme']);
    const antes: Record<string, unknown> = {};
    const depois: Record<string, unknown> = {};
    for (const campo of CAMPOS_EDITAVEIS) {
      const enviado = input[campo];
      if (enviado === undefined) continue;
      const novo = textoVazioParaNull.has(campo) ? vazioParaNull(enviado as string | null) : enviado;
      if (novo !== atual[campo]) {
        antes[campo] = atual[campo];
        depois[campo] = novo;
      }
    }
    const alterados = Object.keys(depois) as CampoEditavel[];
    if (alterados.length === 0) return { quote: paraAdminQuote(atual), avisos: avisosDe(atual) };

    const final = { ...atual, ...depois } as QuoteRow;
    if ('author' in depois) await validarAutor(tx, final.author);
    if ('text' in depois) await validarTexto(tx, final.text, id);
    if ('scriptoriumUrl' in depois && final.scriptoriumUrl) await validarScriptoriumUrl(tx, final.scriptoriumUrl);
    if (final.status === 'ativa') exigirFonteParaAtiva(final, { novo: atual.status === 'rascunho' });

    const [row] = await tx
      .update(quotes)
      .set({ ...depois, updatedAt: sql`now()` })
      .where(eq(quotes.id, id))
      .returning();
    const quote = paraAdminQuote(row!);
    const acao = alterados.every((c) => CAMPOS_DE_VERIFICACAO.includes(c)) ? 'verificou' : 'editou';
    await gravarEvento(tx, { quoteId: id, acao, antes, depois, adminId });
    return { quote, avisos: avisosDe(quote) };
  });
}

/** Retirar é ocultar (R3): a linha fica, com status e motivo. De `ativa` ou `rascunho` para `oculta`. */
export async function ocultarQuote(id: string, motivo: string, adminId: string): Promise<AdminQuote> {
  return db.transaction(async (tx) => {
    const atual = await travar(tx, id);
    if (atual.status === 'oculta') throw new ConflictError('A citação já está oculta', paraAdminQuote(atual));
    const [row] = await tx
      .update(quotes)
      .set({ status: 'oculta', motivoOcultacao: motivo, updatedAt: sql`now()` })
      .where(eq(quotes.id, id))
      .returning();
    await gravarEvento(tx, {
      quoteId: id,
      acao: 'ocultou',
      antes: { status: atual.status, motivoOcultacao: atual.motivoOcultacao },
      depois: { status: 'oculta', motivoOcultacao: motivo },
      motivo,
      adminId,
    });
    return paraAdminQuote(row!);
  });
}

/** De `oculta` para `ativa`. Exige `source` (R6); o motivo antigo fica no evento, em `antes`. */
export async function reativarQuote(id: string, adminId: string): Promise<AdminQuote> {
  return db.transaction(async (tx) => {
    const atual = await travar(tx, id);
    if (atual.status !== 'oculta') throw new ConflictError('A citação não está oculta', paraAdminQuote(atual));
    exigirFonteParaAtiva(atual, { novo: false });
    const [row] = await tx
      .update(quotes)
      .set({ status: 'ativa', motivoOcultacao: null, updatedAt: sql`now()` })
      .where(eq(quotes.id, id))
      .returning();
    await gravarEvento(tx, {
      quoteId: id,
      acao: 'reativou',
      antes: { status: 'oculta', motivoOcultacao: atual.motivoOcultacao },
      depois: { status: 'ativa', motivoOcultacao: null },
      adminId,
    });
    return paraAdminQuote(row!);
  });
}

export async function listAdminQuotes(query: ListAdminQuotesQuery) {
  const condicoes: SQL[] = [...whereByAuthor(query.author)];
  if (query.status) condicoes.push(eq(quotes.status, query.status));
  if (query.q) {
    const padrao = `%${query.q.replace(/[\\%_]/g, '\\$&')}%`;
    condicoes.push(sql`(${quotes.text} ILIKE ${padrao} ESCAPE '\\' OR ${quotes.source} ILIKE ${padrao} ESCAPE '\\')`);
  }
  const where = condicoes.length ? and(...condicoes) : undefined;

  const total = (await db.select({ total: count() }).from(quotes).where(where))[0]!.total;
  const rows = await db
    .select()
    .from(quotes)
    .where(where)
    .orderBy(desc(quotes.createdAt), quotes.id)
    .limit(POR_PAGINA)
    .offset((query.page - 1) * POR_PAGINA);

  const porStatus: Record<QuoteStatus, number> = { rascunho: 0, ativa: 0, oculta: 0 };
  for (const r of await db.select({ status: quotes.status, n: count() }).from(quotes).groupBy(quotes.status)) {
    porStatus[r.status as QuoteStatus] = r.n;
  }
  const porAutor = await db
    .select({ autor: quotes.author, total: count() })
    .from(quotes)
    .groupBy(quotes.author)
    .orderBy(desc(count()), quotes.author);
  const semVerificacao = (
    await db
      .select({ n: count() })
      .from(quotes)
      .where(and(eq(quotes.status, 'ativa'), sql`${quotes.verificadoEm} IS NULL`))
  )[0]!.n;

  return {
    itens: rows.map(paraAdminQuote),
    total,
    pagina: query.page,
    porPagina: POR_PAGINA,
    contadores: { porStatus, porAutor, semVerificacao },
  };
}

/** Histórico de uma citação, mais recente primeiro. Não exige que a citação exista: `quote_events` sobrevive à exclusão por migration. */
export async function listEventos(quoteId: string): Promise<QuoteEventDto[]> {
  const rows = await db.select().from(quoteEvents).where(eq(quoteEvents.quoteId, quoteId)).orderBy(desc(quoteEvents.em), desc(quoteEvents.id));
  return rows.map((e) => ({
    id: e.id,
    quoteId: e.quoteId,
    acao: e.acao,
    antes: e.antes,
    depois: e.depois,
    motivo: e.motivo,
    adminId: e.adminId,
    em: e.em.toISOString(),
  }));
}
