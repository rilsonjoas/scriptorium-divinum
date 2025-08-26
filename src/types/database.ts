export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      authors: {
        Row: {
          id: string
          slug: string
          name: string
          birth_year: number | null
          death_year: number | null
          bio_summary: string | null
          portrait_image_url: string | null
          denomination_or_tradition: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          birth_year?: number | null
          death_year?: number | null
          bio_summary?: string | null
          portrait_image_url?: string | null
          denomination_or_tradition?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          birth_year?: number | null
          death_year?: number | null
          bio_summary?: string | null
          portrait_image_url?: string | null
          denomination_or_tradition?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      books: {
        Row: {
          id: string
          title: string
          original_title: string | null
          author_id: string
          publication_year_original: string | null
          publication_year_translation: number | null
          translator: string | null
          language: string
          original_languages: string[] | null
          description: string
          categories: string[] | null
          tags: string[] | null
          cover_image_url: string | null
          online_read_path: string | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          original_title?: string | null
          author_id: string
          publication_year_original?: string | null
          publication_year_translation?: number | null
          translator?: string | null
          language: string
          original_languages?: string[] | null
          description: string
          categories?: string[] | null
          tags?: string[] | null
          cover_image_url?: string | null
          online_read_path?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          original_title?: string | null
          author_id?: string
          publication_year_original?: string | null
          publication_year_translation?: number | null
          translator?: string | null
          language?: string
          original_languages?: string[] | null
          description?: string
          categories?: string[] | null
          tags?: string[] | null
          cover_image_url?: string | null
          online_read_path?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "authors"
            referencedColumns: ["id"]
          }
        ]
      }
      download_links: {
        Row: {
          id: string
          book_id: string
          format: string
          url: string
          source: string | null
          file_size: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          format: string
          url: string
          source?: string | null
          file_size?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          format?: string
          url?: string
          source?: string | null
          file_size?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "download_links_book_id_fkey"
            columns: ["book_id"]
            referencedRelation: "books"
            referencedColumns: ["id"]
          }
        ]
      }
      table_of_contents: {
        Row: {
          id: string
          book_id: string
          title: string
          anchor: string | null
          level: number
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          title: string
          anchor?: string | null
          level: number
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          title?: string
          anchor?: string | null
          level?: number
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_of_contents_book_id_fkey"
            columns: ["book_id"]
            referencedRelation: "books"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}