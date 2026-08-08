import { apiClient } from '@/lib/api-client';
import type { Author, Book, Category } from '@/types';

export const authorsService = {
  async getAll(params?: { tradition?: string; search?: string }): Promise<Author[]> {
    const query = new URLSearchParams();
    if (params?.tradition) query.set('tradition', params.tradition);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiClient<Author[]>(`/api/v1/authors${qs}`);
  },

  async getBySlug(slug: string): Promise<Author | null> {
    try {
      return await apiClient<Author>(`/api/v1/authors/${slug}`);
    } catch {
      return null;
    }
  },

  async getWithBooks(slug: string): Promise<(Author & { books: Book[] }) | null> {
    try {
      return await apiClient<Author & { books: Book[] }>(`/api/v1/authors/${slug}`);
    } catch {
      return null;
    }
  },
};

export const booksService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    authorSlug?: string;
    category?: string;
    tag?: string;
    featured?: boolean;
    search?: string;
  }): Promise<{ items: Book[]; total: number; page: number; limit: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.authorSlug) query.set('authorSlug', params.authorSlug);
    if (params?.category) query.set('category', params.category);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.featured !== undefined) query.set('featured', String(params.featured));
    if (params?.search) query.set('search', params.search);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiClient<{ items: Book[]; total: number; page: number; limit: number; totalPages: number }>(
      `/api/v1/books${qs}`,
    );
  },

  async getById(idOrSlug: string): Promise<Book | null> {
    try {
      return await apiClient<Book>(`/api/v1/books/${idOrSlug}`);
    } catch {
      return null;
    }
  },

  async getFeatured(limit = 6): Promise<Book[]> {
    const res = await this.getAll({ featured: true, limit });
    return res.items;
  },

  async getByCategory(category: string): Promise<Book[]> {
    const res = await this.getAll({ category });
    return res.items;
  },

  async search(q: string, limit = 20): Promise<Book[]> {
    if (!q.trim()) return [];
    return apiClient<Book[]>(`/api/v1/search?q=${encodeURIComponent(q)}&limit=${limit}`);
  },
};

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    return apiClient<Category[]>('/api/v1/categories');
  },

  async getWithCounts(): Promise<Category[]> {
    return this.getAll();
  },
};

export const searchService = {
  async fullTextSearch(query: string): Promise<{ books: Book[]; authors: Author[] }> {
    if (!query.trim()) return { books: [], authors: [] };
    const [books, authors] = await Promise.all([
      booksService.search(query),
      authorsService.getAll({ search: query }).catch(() => [] as Author[]),
    ]);
    return { books, authors };
  },
};