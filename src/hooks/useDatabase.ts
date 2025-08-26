import { useQuery } from '@tanstack/react-query'
import { authorsService, booksService, categoriesService, searchService } from '@/services/database'
import { Author, Book } from '@/types'

// Authors hooks
export const useAuthors = () => {
  return useQuery({
    queryKey: ['authors'],
    queryFn: () => authorsService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useAuthor = (slug: string) => {
  return useQuery({
    queryKey: ['author', slug],
    queryFn: () => authorsService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAuthorWithBooks = (slug: string) => {
  return useQuery({
    queryKey: ['author-with-books', slug],
    queryFn: () => authorsService.getWithBooks(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
}

// Books hooks
export const useBooks = (options?: {
  featured?: boolean
  limit?: number
  categories?: string[]
}) => {
  return useQuery({
    queryKey: ['books', options],
    queryFn: () => booksService.getAll(options),
    staleTime: 5 * 60 * 1000,
  })
}

export const useFeaturedBooks = (limit: number = 3) => {
  return useQuery({
    queryKey: ['books', 'featured', limit],
    queryFn: () => booksService.getFeatured(limit),
    staleTime: 5 * 60 * 1000,
  })
}

export const useBook = (id: string) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => booksService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useBooksByCategory = (category: string) => {
  return useQuery({
    queryKey: ['books', 'category', category],
    queryFn: () => booksService.getByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  })
}

// Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCategoriesWithCounts = () => {
  return useQuery({
    queryKey: ['categories', 'with-counts'],
    queryFn: () => categoriesService.getWithCounts(),
    staleTime: 10 * 60 * 1000,
  })
}

// Search hooks
export const useSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchService.fullTextSearch(query),
    enabled: enabled && !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useBookSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['books', 'search', query],
    queryFn: () => booksService.search(query),
    enabled: enabled && !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
  })
}

// Custom hook for testing database connection
export const useDatabaseConnection = () => {
  return useQuery({
    queryKey: ['database', 'connection'],
    queryFn: async () => {
      try {
        const books = await booksService.getAll({ limit: 1 })
        return { connected: true, message: 'Conexão bem-sucedida', data: books }
      } catch (error) {
        console.error('Database connection test failed:', error)
        return { 
          connected: false, 
          message: error instanceof Error ? error.message : 'Erro de conexão',
          data: null 
        }
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
  })
}