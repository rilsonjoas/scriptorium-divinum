import type { QuoteFormValues } from '@/services/adminQuotes';

/** Mesmo limite de `server/src/schemas/admin-quotes.schema.ts`. */
export const TEXTO_MAX = 2000;

/** Versão em JS de `server/src/lib/quote-authors.ts`: minúsculas e só letras e números. */
export function chaveDeAutor(nome: string): string {
  return nome.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
}

function dataExiste(valor: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!m) return false;
  const [ano, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(Date.UTC(ano, mes - 1, dia));
  return d.getUTCFullYear() === ano && d.getUTCMonth() === mes - 1 && d.getUTCDate() === dia;
}

/** Espelho das regras da API para feedback ao vivo; o servidor continua sendo a autoridade.
 *  Devolve campo → mensagem (vazio quando válido). `novo` é verdadeiro ao criar ou publicar rascunho. */
export function validarCitacao(
  v: QuoteFormValues,
  ctx: { autoresExistentes: string[]; novo: boolean },
): Record<string, string> {
  const erros: Record<string, string> = {};
  const autor = v.author.trim();
  const texto = v.text.trim();
  const ativa = v.status === 'ativa';

  if (!autor) {
    erros.author = 'Informe o autor.';
  } else {
    const chave = chaveDeAutor(autor);
    const igual = ctx.autoresExistentes.find((a) => chaveDeAutor(a) === chave);
    if (igual && ctx.autoresExistentes.every((a) => a !== autor)) {
      erros.author = `Já existe este autor escrito assim: "${igual}". Use essa grafia.`;
    }
  }

  if (!texto) erros.text = 'Informe o texto da citação.';
  else if (texto.length > TEXTO_MAX) erros.text = `O texto passa de ${TEXTO_MAX} caracteres.`;

  if (ativa && !v.source.trim()) erros.source = 'Uma citação ativa precisa de obra ou fonte.';

  const url = v.fonteUrl.trim();
  if (url) {
    if (!/^https?:\/\//i.test(url)) erros.fonteUrl = 'O endereço precisa começar com http:// ou https://.';
  } else if (ativa && ctx.novo) {
    erros.fonteUrl = 'Informe o endereço onde a citação foi conferida.';
  }

  const data = v.verificadoEm.trim();
  if (data) {
    if (!dataExiste(data)) erros.verificadoEm = 'Use uma data existente no formato AAAA-MM-DD.';
  } else if (ativa && ctx.novo) {
    erros.verificadoEm = 'Informe a data da conferência (AAAA-MM-DD).';
  }

  return erros;
}
