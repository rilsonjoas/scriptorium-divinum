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

/** O que a cópia teria desta citação; `null` se ela não entra na cópia. O link de compra depende de dominioPublico, obra e
 *  autor (a grafia bruta: corrigir `C.S. Lewis` para `C. S. Lewis` muda o link, mesmo sendo o mesmo autor). */
function naCopia(q: CitacaoDoGerador | null): string | null {
  if (!q || q.status !== 'ativa' || !ehLewis(q.author)) return null;
  return JSON.stringify([q.text, q.source, q.theme, q.dominioPublico, q.author.trim()]);
}

/** Campos da citação que mudam na cópia quando ela continua nela (mudança, não entrada nem saída). Vazio se não muda. */
export function camposDaCopia(antes: CitacaoDoGerador | null, depois: CitacaoDoGerador | null): string[] {
  if (efeitoNoGerador(antes, depois) !== 'mudar' || !antes || !depois) return [];
  const campos: string[] = [];
  if (antes.text !== depois.text) campos.push('texto');
  if ((antes.source ?? null) !== (depois.source ?? null)) campos.push('obra');
  if ((antes.theme ?? null) !== (depois.theme ?? null)) campos.push('tema');
  if (antes.dominioPublico !== depois.dominioPublico) campos.push('domínio público');
  if (antes.author.trim() !== depois.author.trim()) campos.push('autor');
  return campos;
}

export function mudaCopiaDoGerador(antes: CitacaoDoGerador | null, depois: CitacaoDoGerador | null): boolean {
  return efeitoNoGerador(antes, depois) !== null;
}

export type EfeitoNoGerador = 'sair' | 'mudar' | 'entrar';

/** Como a mudança aparece no diff da cópia: a citação entra, sai ou muda; `null` se a cópia não muda. */
export function efeitoNoGerador(antes: CitacaoDoGerador | null, depois: CitacaoDoGerador | null): EfeitoNoGerador | null {
  const a = naCopia(antes);
  const b = naCopia(depois);
  if (a === b) return null;
  if (a === null) return 'entrar';
  if (b === null) return 'sair';
  return 'mudar';
}
