export const QUOTES_TIME_ZONE = 'America/Sao_Paulo';

/** Data local 'YYYY-MM-DD' hoje num fuso específico (padrão São Paulo) —
 *  mesmo contrato do lecionario-web/src/lib/versiculo-do-dia.ts. */
export function dateKeyInTimeZone(date: Date, timeZone: string = QUOTES_TIME_ZONE): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Dias desde 1970-01-01 de uma chain 'YYYY-MM-DD' — seed determinístico da
 *  "citação do dia" (mesma data → mesmo índice, estável ao longo do tempo). */
export function daySeed(dateKey: string): number {
  const [year, month, day] = dateKey.split('-').map(Number);
  if (!year || !month || !day) return 0;
  return Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(1970, 0, 1)) / 86_400_000);
}