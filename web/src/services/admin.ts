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

export const adminService = {
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
