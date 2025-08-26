import { supabase, handleSupabaseError } from '@/lib/supabase'
import { Author, Book, AuthorDB, BookDB, DownloadLink } from '@/types'

// Helper functions to convert between DB and frontend formats
export const convertAuthorFromDB = (authorDB: AuthorDB): Author => ({
  id: authorDB.id,
  slug: authorDB.slug,
  name: authorDB.name,
  birthYear: authorDB.birth_year || undefined,
  deathYear: authorDB.death_year || undefined,
  bioSummary: authorDB.bio_summary || undefined,
  portraitImageUrl: authorDB.portrait_image_url || undefined,
  denominationOrTradition: authorDB.denomination_or_tradition || undefined,
})

export const convertBookFromDB = (bookDB: BookDB & { authors?: AuthorDB, download_links?: any[] }): Book => ({
  id: bookDB.id,
  title: bookDB.title,
  originalTitle: bookDB.original_title || undefined,
  author: bookDB.authors ? convertAuthorFromDB(bookDB.authors) : {
    id: bookDB.author_id,
    slug: '',
    name: 'Autor Desconhecido'
  },
  publicationYearOriginal: bookDB.publication_year_original || undefined,
  publicationYearTranslation: bookDB.publication_year_translation || undefined,
  translator: bookDB.translator || undefined,
  language: bookDB.language,
  originalLanguages: bookDB.original_languages || undefined,
  description: bookDB.description,
  categories: bookDB.categories || undefined,
  tags: bookDB.tags || undefined,
  coverImageUrl: bookDB.cover_image_url || undefined,
  onlineReadPath: bookDB.online_read_path || undefined,
  downloadLinks: bookDB.download_links?.map(link => ({
    id: link.id,
    format: link.format,
    url: link.url,
    source: link.source,
    file_size: link.file_size
  })) || undefined,
  featured: bookDB.featured,
})

// Authors service functions
export const authorsService = {
  // Get all authors
  async getAll(): Promise<Author[]> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data.map(convertAuthorFromDB)
    } catch (error) {
      handleSupabaseError(error)
      throw error
    }
  },

  // Get author by slug
  async getBySlug(slug: string): Promise<Author | null> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // No rows returned
        throw error
      }
      
      return convertAuthorFromDB(data)
    } catch (error) {
      handleSupabaseError(error)
      throw error
    }
  },

  // Get author with their books
  async getWithBooks(slug: string): Promise<(Author & { books: Book[] }) | null> {
    try {
      const { data: authorData, error: authorError } = await supabase
        .from('authors')
        .select('*')
        .eq('slug', slug)
        .single()

      if (authorError) {
        if (authorError.code === 'PGRST116') return null
        throw authorError
      }

      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select(`
          *,
          download_links (*)
        `)
        .eq('author_id', authorData.id)
        .order('featured', { ascending: false })
        .order('title', { ascending: true })

      if (booksError) throw booksError

      const author = convertAuthorFromDB(authorData)
      const books = booksData.map(book => convertBookFromDB(book))

      return { ...author, books }
    } catch (error) {
      handleSupabaseError(error)
      throw error
    }
  }
}

// Books service functions
export const booksService = {
  // Get all books with authors
  async getAll(options?: { 
    featured?: boolean 
    limit?: number 
    categories?: string[]
  }): Promise<Book[]> {
    try {
      let query = supabase
        .from('books')
        .select(`
          *,
          authors (*),
          download_links (*)
        `)

      if (options?.featured !== undefined) {
        query = query.eq('featured', options.featured)
      }

      if (options?.categories?.length) {
        query = query.overlaps('categories', options.categories)
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      query = query
        .order('featured', { ascending: false })
        .order('title', { ascending: true })

      const { data, error } = await query

      if (error) throw error
      return data.map(convertBookFromDB)
    } catch (error) {
      handleSupabaseError(error)
      throw error
    }
  },

  // Get featured books
  async getFeatured(limit: number = 3): Promise<Book[]> {
    return this.getAll({ featured: true, limit })
  },

  // Get book by ID
  async getById(id: string): Promise<Book | null> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          authors (*),
          download_links (*),
          table_of_contents (*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        throw error
      }

      const book = convertBookFromDB(data)
      
      // Add table of contents if available
      if (data.table_of_contents?.length) {
        book.tableOfContents = data.table_of_contents
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((toc: any) => ({
            title: toc.title,
            anchor: toc.anchor,
            level: toc.level
          }))
      }

      return book
    } catch (error) {
      handleSupabaseError(error)
      throw error
    }
  },

  // Search books
  async search(query: string): Promise<Book[]> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          authors (*),
          download_links (*)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,original_title.ilike.%${query}%`)
        .order('featured', { ascending: false })
        .order('title', { ascending: true })

      if (error) throw error
      return data.map(convertBookFromDB)
    } catch (error) {
      handleSupabaseError(error)
      throw error
    }
  },

  // Get books by category
  async getByCategory(category: string): Promise<Book[]> {
    return this.getAll({ categories: [category] })
  }
}

// Categories service functions
export const categoriesService = {
  // Get all unique categories from books
  async getAll(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('categories')
        .not('categories', 'is', null)

      if (error) throw error

      const categoriesSet = new Set<string>()
      data.forEach(book => {
        book.categories?.forEach(category => {
          if (category) categoriesSet.add(category)
        })
      })

      return Array.from(categoriesSet).sort()
    } catch (error) {
      handleSupabaseError(error)
      throw error
    }
  },

  // Get category with book count
  async getWithCounts(): Promise<{ category: string; count: number }[]> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('categories')
        .not('categories', 'is', null)

      if (error) throw error

      const categoryCounts: { [key: string]: number } = {}
      
      data.forEach(book => {
        book.categories?.forEach(category => {
          if (category) {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1
          }
        })
      })

      return Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
    } catch (error) {
      handleSupabaseError(error)
      throw error
    }
  }
}

// General search function
export const searchService = {
  // Full-text search across books and authors
  async fullTextSearch(query: string): Promise<{
    books: Book[]
    authors: Author[]
  }> {
    try {
      const [booksResult, authorsResult] = await Promise.all([
        supabase
          .from('books')
          .select(`
            *,
            authors (*),
            download_links (*)
          `)
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,original_title.ilike.%${query}%`)
          .order('featured', { ascending: false }),
        
        supabase
          .from('authors')
          .select('*')
          .or(`name.ilike.%${query}%,bio_summary.ilike.%${query}%`)
          .order('name', { ascending: true })
      ])

      if (booksResult.error) throw booksResult.error
      if (authorsResult.error) throw authorsResult.error

      return {
        books: booksResult.data.map(convertBookFromDB),
        authors: authorsResult.data.map(convertAuthorFromDB)
      }
    } catch (error) {
      handleSupabaseError(error)
      throw error
    }
  }
}