import { apiClient } from '@/lib/api-client';
import type { Author, Book, Category } from '@/types';

function toSnake(value: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value)) {
    if (val === undefined || val === '') continue;
    out[key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)] = val;
  }
  return out;
}

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
] as const;

export const adminService = {
  // Autores
  createAuthor(data: Partial<Author>) {
    return apiClient<Author>('/api/v1/admin/authors', {
      method: 'POST',
      body: JSON.stringify(toSnake(pick(data, AUTHOR_KEYS))),
    });
  },

  updateAuthor(id: string, data: Partial<Author>) {
    return apiClient<Author>(`/api/v1/admin/authors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toSnake(pick(data, AUTHOR_KEYS))),
    });
  },

  deleteAuthor(id: string) {
    return apiClient<void>(`/api/v1/admin/authors/${id}`, { method: 'DELETE' });
  },

  // Livros
  createBook(data: Partial<Book>) {
    return apiClient<Book>('/api/v1/admin/books', {
      method: 'POST',
      body: JSON.stringify(toSnake(pick(data, BOOK_KEYS))),
    });
  },

  updateBook(id: string, data: Partial<Book>) {
    return apiClient<Book>(`/api/v1/admin/books/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toSnake(pick(data, BOOK_KEYS))),
    });
  },

  deleteBook(id: string) {
    return apiClient<void>(`/api/v1/admin/books/${id}`, { method: 'DELETE' });
  },

  // Categorias
  createCategory(data: { name: string; slug?: string; description?: string }) {
    return apiClient<Category>('/api/v1/admin/categories', {
      method: 'POST',
      body: JSON.stringify(toSnake(data)),
    });
  },

  renameCategory(data: { oldName: string; newName: string; description?: string }) {
    return apiClient<{ name: string }>('/api/v1/admin/categories', {
      method: 'PATCH',
      body: JSON.stringify(toSnake(data)),
    });
  },

  deleteCategory(name: string) {
    return apiClient<void>(`/api/v1/admin/categories/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
  },
};
