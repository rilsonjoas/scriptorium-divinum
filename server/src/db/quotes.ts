import { and, eq, sql, type SQL } from 'drizzle-orm';
import { db } from './client.js';
import { dailyQuotes, quotes } from './schema.js';
import { buildAmazonUrl } from '../lib/affiliate.js';
import { isCuratedSource } from '../lib/quote-sources.js';
import { dateKeyInTimeZone, daySeed } from '../lib/date.js';
import type { Quote } from '../schemas/quote.schema.js';

export type QuoteRow = typeof quotes.$inferSelect;

/** Converte a linha do banco pro DTO da API, montando o CTA centralizado de
 *  afiliado para citações que não são domínio público (ADR 001).
 *
 *  O CTA só é emitido quando a obra em `source` é conhecida
 *  (`isCuratedSource`). Antes, qualquer texto livre virava link de compra — foi
 *  assim que "Cheque-Livro do Banco da Fé" (obra inexistente) chegou ao
 *  público. Sem curadoria, a citação aparece sem link: buraco de dado em vez de
 *  link inventado. */
export function toQuoteDto(row: QuoteRow): Quote {
  const hasCta =
    !row.dominioPublico && isCuratedSource(row.author, row.source) && row.source !== null;
  return {
    id: row.id,
    author: row.author,
    text: row.text,
    source: row.source,
    dominioPublico: row.dominioPublico,
    scriptoriumUrl: row.scriptoriumUrl,
    theme: row.theme ?? null,
    affiliateUrl: hasCta ? buildAmazonUrl(row.source, row.author) : null,
  };
}

/**
 * Filtro de autor tolerante a variação de escrita.
 *
 * `quotes.author` é texto livre (sem chave estrangeira para `authors`) e a comparação era `eq()`,
 * exata. O Gerador C. S. Lewis depende desse filtro para as citações dele, e as variantes que
 * erravam em silêncio, sem erro, sem log, site vazio e sitemap sem URLs: `C.S. Lewis`, `c. s. lewis`,
 * espaço no fim e `author=Lewis` retornavam `[]`.
 *
 * Comparação por chave: minúsculas e **só letras e números** (ver `chaveDeAutor`). Assim caixa,
 * espaços, pontos e hífens deixam de importar: `C. S. Lewis`, `C.S. Lewis` e `CS Lewis` são o mesmo
 * autor. Acento continua distinguindo (`Søren` não vira `Soren`), e a regra vale dos dois lados da
 * comparação, então acento nunca cria falsa igualdade.
 *
 * `author=Lewis` segue de fora por decisão: apelido não é o mesmo que autor, e adivinhar equivalência
 * entre nomes é exatamente o tipo de suposição que a curadoria proíbe. O Gerador envia o nome completo
 * e bate. A mesma regra, em JS, está em `lib/quote-authors.ts` (usada pelo verificador do acervo para
 * apontar duas grafias do mesmo autor antes de uma delas sumir de algum consumidor).
 */
export function whereByAuthor(author?: string) {
  if (!author) return [];
  return [
    sql`regexp_replace(lower(${quotes.author}), '[^[:alnum:]]+', '', 'g') = regexp_replace(lower(${author}), '[^[:alnum:]]+', '', 'g')`,
  ];
}

/** R5 (docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md): elegibilidade num lugar só.
 *  Só `ativa` é pública; `oculta` e `rascunho` não aparecem na lista, no sorteio nem no dia. Toda leitura
 *  pública de `quotes` combina esta condição, para os três nunca divergirem. */
export function quotesAtivas(): SQL {
  return eq(quotes.status, 'ativa');
}

/** Seleção determinística pura: mesmo conjunto + mesma data → mesma citação
 *  (seed = dias desde a epoch mod o tamanho). Ordem estável por id. */
export function pickQuoteBySeed(rows: readonly Quote[], dateKey: string): Quote | undefined {
  if (rows.length === 0) return undefined;
  // módulo que nunca fica negativo: antes de 1970 a semente é negativa e `rows[-n]` era
  // undefined, o que virava 404 para `?date=1900-01-01`
  const n = rows.length;
  return rows[((daySeed(dateKey) % n) + n) % n];
}

export async function listQuotes(author?: string): Promise<Quote[]> {
  const where = and(quotesAtivas(), ...whereByAuthor(author));
  const rows = await db
    .select()
    .from(quotes)
    .where(where)
    .orderBy(quotes.id);
  return rows.map(toQuoteDto);
}

/** Dias, para cada lado de "hoje", em que a escolha do dia é gravada. Fora disso a escolha é só
 *  calculada: gravar qualquer data pedida deixaria qualquer um encher a tabela com datas
 *  arbitrárias. Quem navega o calendário do Lecionário dentro de ±30 dias tem estabilidade;
 *  além disso a escolha ainda é determinística, só não sobrevive a mudanças no acervo. */
export const JANELA_GRAVACAO_DIAS = 30;

export function dentroDaJanelaDeGravacao(dateKey: string, hoje: string): boolean {
  return Math.abs(daySeed(dateKey) - daySeed(hoje)) <= JANELA_GRAVACAO_DIAS;
}

/** "Citação do dia" — mesma para todo o cluster. Sem `date`, resolve "hoje" em America/Sao_Paulo.
 *
 *  Sem filtro de autor e dentro da janela, a escolha é GRAVADA em `daily_quotes` na primeira
 *  consulta do dia e depois só lida: adicionar ou remover citações não muda o que já foi mostrado.
 *  A gravação é segura contra consultas simultâneas (ON CONFLICT e releitura: todas as consultas
 *  devolvem a mesma vencedora). Se a citação gravada foi ocultada, o dia escolhe outra e regrava (R4). Com filtro de autor, ou fora da janela, a escolha é
 *  calculada (semente de dias desde a epoch, módulo o tamanho do conjunto, ordem estável por id). */
export async function getDailyQuote(
  date?: string,
  author?: string,
): Promise<Quote | undefined> {
  const hoje = dateKeyInTimeZone(new Date());
  const dateKey = date ?? hoje;
  const gravar = !author && dentroDaJanelaDeGravacao(dateKey, hoje);

  if (gravar) {
    const gravada = await lerEscolhaGravada(dateKey);
    if (gravada) return gravada;
  }

  const rows = await listQuotes(author);
  if (rows.length === 0) return undefined;
  const escolhida = pickQuoteBySeed(rows, dateKey);
  if (!escolhida || !gravar) return escolhida;

  await gravarEscolhaDoDia(dateKey, escolhida.id);
  // releitura: se outra consulta gravou primeiro, devolve a dela (e não a nossa)
  return (await lerEscolhaGravada(dateKey)) ?? escolhida;
}

/** R4: grava a escolha do dia. Se já existe linha do dia e a citação dela deixou de ser ativa (foi
 *  ocultada), a nova escolha a SUBSTITUI. O `setWhere` só deixa substituir linha cuja citação não é
 *  ativa: uma gravada ativa nunca é sobrescrita, nem por consultas simultâneas. Sem linha, é o INSERT de sempre. */
export async function gravarEscolhaDoDia(dateKey: string, quoteId: string): Promise<void> {
  await db
    .insert(dailyQuotes)
    .values({ dateKey, quoteId })
    .onConflictDoUpdate({
      target: dailyQuotes.dateKey,
      set: { quoteId },
      setWhere: sql`NOT EXISTS (SELECT 1 FROM ${quotes} WHERE ${quotes.id} = ${dailyQuotes.quoteId} AND ${quotesAtivas()})`,
    });
}

async function lerEscolhaGravada(dateKey: string): Promise<Quote | undefined> {
  const [row] = await db
    .select({ quote: quotes })
    .from(dailyQuotes)
    .innerJoin(quotes, eq(quotes.id, dailyQuotes.quoteId))
    .where(and(eq(dailyQuotes.dateKey, dateKey), quotesAtivas()))
    .limit(1);
  return row ? toQuoteDto(row.quote) : undefined;
}

export async function getRandomQuote(author?: string): Promise<Quote | undefined> {
  const where = and(quotesAtivas(), ...whereByAuthor(author));
  const [row] = await db
    .select()
    .from(quotes)
    .where(where)
    .orderBy(sql`random()`)
    .limit(1);
  return row ? toQuoteDto(row) : undefined;
}