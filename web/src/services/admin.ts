import { apiClient } from '@/lib/api-client';
import type { Author, Book, Category, SiteSettings } from '@/types';

function pick(obj: Record<string, unknown>, keys: readonly string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== '') out[key] = value;
  }
  return out;
}

const AUTHOR_KEYS = ['name', 'birthYear', 'deathYear', 'bioSummary', 'portraitImageUrl', 'denominationOrTradition'] as const;
const BOOK_KEYS = [
  'title',
  'originalTitle',
  'authorId',
  'description',
  'publicationYearOriginal',
  'publicationYearTranslation',
  'translator',
  'language',
  'originalLanguages',
  'categories',
  'tags',
  'coverImageUrl',
  'onlineReadPath',
  'featured',
  'downloadLinks',
] as const;

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:3001';

export const adminService = {
  async uploadCover(file: File): Promise<{ url: string }> {
    const body = new FormData();
    body.append('file', file);
    const res = await fetch(`${API_BASE}/api/v1/admin/uploads`, {
      method: 'POST',
      credentials: 'include',
      body,
    });
    if (!res.ok) {
      let msg = `Erro ${res.status} no upload`;
      try {
        const j = await res.json();
        msg = j.message ?? msg;
      } catch {
        // resposta sem JSON
      }
      throw new Error(msg);
    }
    return res.json() as Promise<{ url: string }>;
  },

  // Autores
  createAuthor(data: Partial<Author>) {
    return apiClient<Author>('/api/v1/admin/authors', {
      method: 'POST',
      body: JSON.stringify(pick(data, AUTHOR_KEYS)),
    });
  },

  updateAuthor(id: string, data: Partial<Author>) {
    return apiClient<Author>(`/api/v1/admin/authors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(pick(data, AUTHOR_KEYS)),
    });
  },

  deleteAuthor(id: string) {
    return apiClient<void>(`/api/v1/admin/authors/${id}`, { method: 'DELETE' });
  },

  // Livros
  createBook(data: Partial<Book>) {
    return apiClient<Book>('/api/v1/admin/books', {
      method: 'POST',
      body: JSON.stringify(pick(data, BOOK_KEYS)),
    });
  },

  updateBook(id: string, data: Partial<Book>) {
    return apiClient<Book>(`/api/v1/admin/books/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(pick(data, BOOK_KEYS)),
    });
  },

  deleteBook(id: string) {
    return apiClient<void>(`/api/v1/admin/books/${id}`, { method: 'DELETE' });
  },

  // Categorias
  createCategory(data: { name: string; slug?: string; description?: string }) {
    return apiClient<Category>('/api/v1/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  renameCategory(data: { oldName: string; newName: string; description?: string }) {
    return apiClient<{ name: string }>('/api/v1/admin/categories', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteCategory(name: string) {
    return apiClient<void>(`/api/v1/admin/categories/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
  },

  // Configurações do site
  updateSettings(data: Partial<SiteSettings>) {
    return apiClient<SiteSettings>('/api/v1/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
