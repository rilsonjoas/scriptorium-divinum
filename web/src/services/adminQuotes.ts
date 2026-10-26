import { apiClient } from '@/lib/api-client';

/** Espelha `server/src/db/admin-quotes.ts` (API de administração de citações, F2). */
export type QuoteStatus = 'rascunho' | 'ativa' | 'oculta';

export interface AdminQuote {
  id: string;
  author: string;
  text: string;
  source: string | null;
  dominioPublico: boolean;
  scriptoriumUrl: string | null;
  theme: string | null;
  fonteUrl: string | null;
  verificadoEm: string | null;
  status: QuoteStatus;
  motivoOcultacao: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AdminQuoteItem = AdminQuote & { diasFixados: string[] };

export interface QuoteEvent {
  id: string;
  quoteId: string;
  acao: string;
  antes: Record<string, unknown> | null;
  depois: Record<string, unknown> | null;
  motivo: string | null;
  adminId: string | null;
  em: string;
}

export interface QuoteListResponse {
  itens: AdminQuoteItem[];
  total: number;
  pagina: number;
  porPagina: number;
  contadores: {
    porStatus: Record<QuoteStatus, number>;
    porAutor: { autor: string; total: number }[];
    semVerificacao: number;
  };
}

export interface QuoteFormValues {
  author: string;
  text: string;
  source: string;
  dominioPublico: boolean;
  scriptoriumUrl: string;
  theme: string;
  fonteUrl: string;
  verificadoEm: string;
  status: 'rascunho' | 'ativa';
}

export interface QuoteListQuery {
  status?: QuoteStatus;
  author?: string;
  q?: string;
  semVerificacao?: boolean;
  page?: number;
}

type Resultado = { quote: AdminQuote; avisos: string[] };

const BASE = '/api/v1/admin/quotes';
const CAMPOS_NULAVEIS = ['source', 'scriptoriumUrl', 'theme', 'fonteUrl', 'verificadoEm'] as const;

const json = (corpo: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(corpo) });

export const quoteKeys = {
  all: ['admin-quotes'] as const,
  list: (q: object) => ['admin-quotes', 'list', q] as const,
  eventos: (id: string) => ['admin-quotes', 'eventos', id] as const,
};

export const adminQuotes = {
  list(q: QuoteListQuery): Promise<QuoteListResponse> {
    const params = new URLSearchParams();
    if (q.status) params.set('status', q.status);
    if (q.author) params.set('author', q.author);
    if (q.q) params.set('q', q.q);
    if (q.semVerificacao) params.set('semVerificacao', 'true');
    if (q.page) params.set('page', String(q.page));
    const qs = params.toString();
    return apiClient<QuoteListResponse>(qs ? `${BASE}?${qs}` : BASE);
  },

  /** Campos de texto vazios não vão no corpo. */
  create(v: QuoteFormValues): Promise<Resultado> {
    const corpo: Record<string, unknown> = {
      author: v.author,
      text: v.text,
      dominioPublico: v.dominioPublico,
      status: v.status,
    };
    for (const k of CAMPOS_NULAVEIS) if (v[k].trim() !== '') corpo[k] = v[k];
    return apiClient<Resultado>(BASE, json(corpo));
  },

  /** Campo de texto esvaziado vira `null` (a API limpa o valor). */
  update(id: string, v: Partial<QuoteFormValues>, updatedAt: string): Promise<Resultado> {
    const corpo: Record<string, unknown> = { ...v, updatedAt };
    for (const k of CAMPOS_NULAVEIS) if (typeof v[k] === 'string' && v[k]!.trim() === '') corpo[k] = null;
    return apiClient<Resultado>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(corpo) });
  },

  ocultar(id: string, motivo: string): Promise<{ quote: AdminQuote }> {
    return apiClient(`${BASE}/${id}/ocultar`, json({ motivo }));
  },

  /** Envia `{}`: o `apiClient` sempre manda Content-Type JSON e o Fastify recusa corpo vazio nesse caso. */
  reativar(id: string): Promise<{ quote: AdminQuote }> {
    return apiClient(`${BASE}/${id}/reativar`, json({}));
  },

  eventos(id: string): Promise<{ eventos: QuoteEvent[] }> {
    return apiClient(`${BASE}/${id}/eventos`);
  },
};
