import { env } from '../config.js';

/** CTA de afiliado centralizado (ADR 001): a API monta o link Amazon para
 *  citações que NÃO são domínio público (hoje, só as de C.S. Lewis) — o
 *  consumidor não reimplementa isso. Mesma tag usada pelo Lecionário.
 *  `source` nulo não é esperado na prática; o fallback busca só o autor. */
export function buildAmazonUrl(source: string | null, author: string): string {
  const query = source ? `${source} ${author}` : author;
  return `https://www.amazon.com.br/s?k=${encodeURIComponent(query)}&tag=${env.AMAZON_AFFILIATE_TAG}`;
}