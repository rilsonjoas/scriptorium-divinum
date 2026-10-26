const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    message: string,
    public details?: Record<string, unknown>,
    /** JSON inteiro da resposta de erro (`issues`, `atual`, ...), quando houve. */
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let errorData: { error?: string; message?: string; details?: Record<string, unknown> } = {};
    let body: unknown;
    try {
      body = await res.json();
      errorData = body as typeof errorData;
    } catch {
      // Body não era JSON
    }

    throw new ApiError(
      res.status,
      errorData.error || 'api_error',
      errorData.message || `Erro ${res.status} ao conectar à API`,
      errorData.details,
      body,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

function corpoDe(err: unknown): Record<string, unknown> {
  const body = err instanceof ApiError ? err.body : undefined;
  return body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
}

/** Problemas por campo de uma resposta 400 no formato do cluster (`{}` se não houver). */
export function issuesDe(err: unknown): Record<string, string[]> {
  const issues = corpoDe(err).issues;
  return issues && typeof issues === 'object' ? (issues as Record<string, string[]>) : {};
}

/** Versão atual que um 409 devolve em `atual`. */
export function atualDe<T>(err: unknown): T | undefined {
  return corpoDe(err).atual as T | undefined;
}
