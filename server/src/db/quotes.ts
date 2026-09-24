import { and, eq, sql } from 'drizzle-orm';
import { db } from './client.js';
import { quotes } from './schema.js';
import { buildAmazonUrl } from '../lib/affiliate.js';
import { dateKeyInTimeZone, daySeed } from '../lib/date.js';
import type { Quote } from '../schemas/quote.schema.js';

export type QuoteRow = typeof quotes.$inferSelect;

/** Converte a linha do banco pro DTO da API, montando o CTA centralizado
 *  de afiliado para citações que não são domínio público (ADR 001). */
export function toQuoteDto(row: QuoteRow): Quote {
  return {
    id: row.id,
    author: row.author,
    text: row.text,
    source: row.source,
    dominioPublico: row.dominioPublico,
    scriptoriumUrl: row.scriptoriumUrl,
    theme: row.theme ?? null,
    affiliateUrl: row.dominioPublico ? null : buildAmazonUrl(row.source, row.author),
  };
}

export function whereByAuthor(author?: string) {
  return author ? [eq(quotes.author, author)] : [];
}

/** Seleção determinística pura: mesmo conjunto + mesma data → mesma citação
 *  (seed = dias desde a epoch mod o tamanho). Ordem estável por id. */
export function pickQuoteBySeed(rows: readonly Quote[], dateKey: string): Quote | undefined {
  if (rows.length === 0) return undefined;
  return rows[daySeed(dateKey) % rows.length];
}

export async function listQuotes(author?: string): Promise<Quote[]> {
  const conditions = whereByAuthor(author);
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const rows = await db
    .select()
    .from(quotes)
    .where(where)
    .orderBy(quotes.id);
  return rows.map(toQuoteDto);
}

/** "Citação do dia" — determinística por data (seed = dias desde a epoch,
 *  mod o tamanho do conjunto, sobre ordem estável por id). Sem `date`,
 *  resolve "hoje" em America/Sao_Paulo (mesmo relógio do cluster). */
export async function getDailyQuote(
  date?: string,
  author?: string,
): Promise<Quote | undefined> {
  const rows = await listQuotes(author);
  if (rows.length === 0) return undefined;
  const dateKey = date ?? dateKeyInTimeZone(new Date());
  return pickQuoteBySeed(rows, dateKey);
}

export async function getRandomQuote(author?: string): Promise<Quote | undefined> {
  const conditions = whereByAuthor(author);
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const [row] = await db
    .select()
    .from(quotes)
    .where(where)
    .orderBy(sql`random()`)
    .limit(1);
  return row ? toQuoteDto(row) : undefined;
}