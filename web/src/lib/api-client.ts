const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    message: string,
    public details?: Record<string, unknown>,
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
    try {
      errorData = await res.json();
    } catch {
      // Body não era JSON
    }

    throw new ApiError(
      res.status,
      errorData.error || 'api_error',
      errorData.message || `Erro ${res.status} ao conectar à API`,
      errorData.details,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
