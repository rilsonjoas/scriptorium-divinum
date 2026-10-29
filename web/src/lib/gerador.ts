import type { AdminQuote } from '@/services/adminQuotes';
import { chaveDeAutor } from './validarCitacao';

/**
 * A cópia embutida do Gerador C. S. Lewis (`lewis-quotes.snapshot.json`, gerada por
 * `npm run quotes:sync`) guarda só as citações ativas de Lewis, com id, texto, obra, tema e o
 * link de compra. Este módulo diz quando uma mudança altera esse conteúdo, para a tela avisar
 * apenas quando a cópia realmente ficará atrás da API.
 */
export type CitacaoDoGerador = Pick<AdminQuote, 'author' | 'text' | 'source' | 'theme' | 'dominioPublico' | 'status'>;

export const GERADOR_COPIA_URL = 'https://github.com/rilsonjoas/GeradorCSLewis/blob/main/src/data/lewis-quotes.snapshot.json';

export function ehLewis(autor: string): boolean {
  return chaveDeAutor(autor) === 'cslewis';
}

/** O que a cópia teria desta citação; `null` se ela não entra na cópia. O link de compra depende de dominioPublico, obra e autor. */
function naCopia(q: CitacaoDoGerador | null): string | null {
  if (!q || q.status !== 'ativa' || !ehLewis(q.author)) return null;
  return JSON.stringify([q.text, q.source, q.theme, q.dominioPublico]);
}

export function mudaCopiaDoGerador(antes: CitacaoDoGerador | null, depois: CitacaoDoGerador | null): boolean {
  return naCopia(antes) !== naCopia(depois);
}
