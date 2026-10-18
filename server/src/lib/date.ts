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
/** 'YYYY-MM-DD' que existe no calendário (rejeita 2026-13-45 e 2026-02-30). O formato sozinho
 *  não basta: `?date=2026-13-45` passava na regex e devolvia uma citação para um dia que não existe
 *  (o Lecionário já respondia 400 nesse caso; ver hetzner-infra/CONTRATOS-ENTRE-PROJETOS.md, 5.1). */
export function isValidDateKey(dateKey: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!m) return false;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}
