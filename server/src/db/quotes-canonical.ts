import type postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql as raw } from 'drizzle-orm';
import { quotes } from './schema.js';

/**
 * Canônico de citações (`scripts/data/quotes-canonical.json`): espelho legível da tabela `quotes` e
 * semente de ambiente novo. Leva o `id` (R2): é por ele que `quote_events`, o Gerador C. S. Lewis, o canário
 * e `daily_quotes` se ligam à citação, então um restore que troque o id corta todos esses vínculos.
 * Não leva `createdAt`/`updatedAt` (nascem de novo no restore) nem `daily_quotes`.
 * A recuperação de desastre de verdade é o backup do banco; o restore daqui é para ambiente do zero.
 */
export interface CanonicalQuote {
  id: string;
  author: string;
  text: string;
  source: string | null;
  dominioPublico: boolean;
  scriptoriumUrl: string | null;
  theme: string | null;
  fonteUrl: string | null;
  verificadoEm: string | null;
  status: 'rascunho' | 'ativa' | 'oculta';
  motivoOcultacao: string | null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STATUS = ['rascunho', 'ativa', 'oculta'];
const CAMPOS = ['id', 'author', 'text', 'source', 'dominioPublico', 'scriptoriumUrl', 'theme', 'fonteUrl', 'verificadoEm', 'status', 'motivoOcultacao'];
/** Limites de `varchar` da tabela `quotes` (schema.ts): estourar só falharia no INSERT, sem dizer qual item. */
const LIMITE: Record<string, number> = { author: 255, source: 500, scriptoriumUrl: 500, theme: 50 };

function dataValida(v: unknown): boolean {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

/**
 * Valida o arquivo inteiro e lança um erro com TODOS os problemas, um por linha (índice e campo). O que passa aqui
 * é o que o restore grava: nenhum tipo errado pode virar valor padrão em silêncio (`dominioPublico: "true"` seria
 * gravado como `false`, e a data `10/11/2026` como outra data). Devolve cópias com o `id` em minúsculas.
 */
export function validarCanonico(dados: unknown): CanonicalQuote[] {
  if (!Array.isArray(dados)) throw new Error('O canônico precisa ser uma lista de citações.');
  if (dados.length === 0) throw new Error('Canônico inválido: lista vazia (restaurar apagaria a tabela inteira).');
  const problemas: string[] = [];
  const vistos = new Map<string, number>();
  const saida = dados.map((q: Record<string, unknown> | null, i) => {
    if (typeof q !== 'object' || q === null || Array.isArray(q)) {
      problemas.push(`[${i}] não é um objeto`);
      return q;
    }
    for (const k of Object.keys(q)) if (!CAMPOS.includes(k)) problemas.push(`[${i}] campo desconhecido: ${k}`);
    const id = typeof q.id === 'string' ? q.id.toLowerCase() : q.id;
    if (typeof id !== 'string' || !UUID.test(id)) problemas.push(`[${i}] id ausente ou fora do formato uuid`);
    else if (vistos.has(id)) problemas.push(`[${i}] id repetido (igual ao de [${vistos.get(id)}])`);
    else vistos.set(id, i);
    for (const k of ['author', 'text'] as const) {
      if (typeof q[k] !== 'string' || (q[k] as string).trim() === '') problemas.push(`[${i}] ${k} vazio ou não é texto`);
    }
    for (const k of ['source', 'scriptoriumUrl', 'theme', 'fonteUrl', 'motivoOcultacao'] as const) {
      if (q[k] !== null && typeof q[k] !== 'string') problemas.push(`[${i}] ${k} precisa ser texto ou nulo`);
    }
    for (const [k, max] of Object.entries(LIMITE)) {
      if (typeof q[k] === 'string' && (q[k] as string).length > max) problemas.push(`[${i}] ${k} passa de ${max} caracteres`);
    }
    if (typeof q.dominioPublico !== 'boolean') problemas.push(`[${i}] dominioPublico precisa ser verdadeiro ou falso`);
    if (q.verificadoEm !== null && !dataValida(q.verificadoEm)) problemas.push(`[${i}] verificadoEm precisa ser nulo ou uma data AAAA-MM-DD válida`);
    if (typeof q.status !== 'string' || !STATUS.includes(q.status)) problemas.push(`[${i}] status desconhecido: ${String(q.status)}`);
    else if (q.status === 'ativa' && (typeof q.source !== 'string' || q.source.trim() === '')) {
      problemas.push(`[${i}] source vazio numa citação ativa`);
    }
    return { ...q, id };
  });
  if (problemas.length > 0) throw new Error(`Canônico inválido:\n${problemas.join('\n')}`);
  return saida as CanonicalQuote[];
}

const porCodigo = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** Autor e depois texto, por ponto de código: a mesma ordem em qualquer banco (a collation do Postgres muda de um
 *  ambiente para outro e faria o arquivo mudar à toa). A consulta `export-quotes-canonical.sql` usa `COLLATE "C"`. */
export function ordenarCanonico<T extends Pick<CanonicalQuote, 'author' | 'text'>>(lista: readonly T[]): T[] {
  return [...lista].sort((a, b) => porCodigo(a.author, b.author) || porCodigo(a.text, b.text));
}

/** Todas as citações, inclusive as não ativas (R3: um restore nunca ressuscita o que foi retirado). */
/** Resultado de comparar dois canônicos: o que o `depois` tem a mais, a menos e de diferente. */
export interface DiferencasCanonico {
  novas: CanonicalQuote[];
  removidas: CanonicalQuote[];
  mudadas: { id: string; campos: string[] }[];
}

/** Compara dois canônicos por `id` (sem distinguir caixa; a ordem das listas não importa). `null` e campo ausente são iguais. */
export function diferencasCanonico(antes: readonly CanonicalQuote[], depois: readonly CanonicalQuote[]): DiferencasCanonico {
  const porId = (lista: readonly CanonicalQuote[]) => new Map(lista.map((q) => [q.id.toLowerCase(), q]));
  const a = porId(antes);
  const d = porId(depois);
  const valor = (q: CanonicalQuote, campo: string) => (q as unknown as Record<string, unknown>)[campo] ?? null;
  const mudadas: DiferencasCanonico['mudadas'] = [];
  for (const [id, novo] of d) {
    const velho = a.get(id);
    if (!velho) continue;
    const campos = CAMPOS.filter((c) => c !== 'id' && valor(velho, c) !== valor(novo, c));
    if (campos.length > 0) mudadas.push({ id, campos });
  }
  return {
    novas: [...d].filter(([id]) => !a.has(id)).map(([, q]) => q),
    removidas: [...a].filter(([id]) => !d.has(id)).map(([, q]) => q),
    mudadas,
  };
}

/** Texto curto, para o terminal, do que `diferencasCanonico` achou. */
export function resumirDiferencas(dif: DiferencasCanonico): string {
  const { novas, removidas, mudadas } = dif;
  if (novas.length + removidas.length + mudadas.length === 0) return 'O canônico já está em dia com o banco.';
  const trecho = (t: string) => (t.length > 70 ? `${t.slice(0, 70)}…` : t);
  const linhas = [
    `${novas.length} nova${novas.length === 1 ? '' : 's'}, ${removidas.length} removida${removidas.length === 1 ? '' : 's'}, ${mudadas.length} alterada${mudadas.length === 1 ? '' : 's'}.`,
  ];
  for (const q of novas) linhas.push(`  + ${q.id} [${q.status}] ${q.author}: ${trecho(q.text)}`);
  for (const q of removidas) linhas.push(`  - ${q.id} [${q.status}] ${q.author}: ${trecho(q.text)}`);
  for (const m of mudadas) linhas.push(`  ~ ${m.id}: ${m.campos.join(', ')}`);
  return linhas.join('\n');
}

export async function exportarCanonico(sql: postgres.Sql): Promise<CanonicalQuote[]> {
  const rows = await drizzle(sql).select().from(quotes);
  return ordenarCanonico(rows).map((r) => ({
    id: r.id,
    author: r.author,
    text: r.text,
    source: r.source,
    dominioPublico: r.dominioPublico,
    scriptoriumUrl: r.scriptoriumUrl,
    theme: r.theme,
    fonteUrl: r.fonteUrl,
    verificadoEm: r.verificadoEm,
    status: r.status as CanonicalQuote['status'],
    motivoOcultacao: r.motivoOcultacao,
  }));
}

/**
 * Apaga `quotes` (e, em cascata, `daily_quotes`) e insere o canônico COM os ids. Valida antes de apagar
 * e roda numa transação: um arquivo ruim, ou um erro no meio, deixa a tabela como estava.
 * Só para ambiente do zero; nunca em produção.
 */
export async function restaurarCanonico(sql: postgres.Sql, dados: unknown): Promise<number> {
  const lista = validarCanonico(dados);
  await drizzle(sql).transaction(async (tx) => {
    await tx.execute(raw`TRUNCATE quotes CASCADE`);
    if (lista.length > 0) await tx.insert(quotes).values(lista);
  });
  return lista.length;
}
