/** "Citação do Dia" — fonte única do cluster "A Biblioteca" (ADR 001): a
 *  tabela `quotes` da própria API do Scriptorium (api-scriptorium.narniano.com),
 *  com seleção determinística por data. Chamada SEM `?date` — o endpoint
 *  resolve "hoje" em America/Sao_Paulo (mesmo contrato do versículo/pintura).
 *  O CTA de afiliado é centralizado na API (`affiliateUrl`) — o consumidor
 *  NÃO monta link Amazon. Não-ok vira `null`: o card "some com graça". */
const API_BASE =
  (import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ?? 'https://api-scriptorium.narniano.com') +
  '/api/v1';

export interface CitacaoDoDia {
  id: string;
  /** Dia de referência em America/Sao_Paulo (YYYY-MM-DD). */
  date: string;
  author: string;
  text: string;
  source: string | null;
  dominioPublico: boolean;
  scriptoriumUrl: string | null;
  theme: string | null;
  /** CTA Amazon — presente só para citações não-públicas (hoje, Lewis). */
  affiliateUrl: string | null;
}

export async function fetchCitacaoDoDia(signal?: AbortSignal): Promise<CitacaoDoDia | null> {
  try {
    const res = await fetch(`${API_BASE}/quotes/daily`, { signal });
    if (!res.ok) return null;
    return (await res.json()) as CitacaoDoDia;
  } catch {
    return null;
  }
}