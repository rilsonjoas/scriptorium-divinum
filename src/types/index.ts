export type BookFormat = 'online' | 'pdf' | 'epub' | 'mobi' | 'txt';

export interface DownloadLink {
  id?: string;
  format: BookFormat;
  url: string;
  source?: string;
  file_size?: number;
}

// Database types (snake_case as stored in Supabase)
export interface AuthorDB {
  id: string;
  slug: string;
  name: string;
  birth_year?: number;
  death_year?: number;
  bio_summary?: string;
  portrait_image_url?: string;
  denomination_or_tradition?: string[];
  created_at: string;
  updated_at: string;
}

export interface BookDB {
  id: string;
  title: string;
  original_title?: string;
  author_id: string;
  publication_year_original?: string;
  publication_year_translation?: number;
  translator?: string;
  language: string;
  original_languages?: string[];
  description: string;
  categories?: string[];
  tags?: string[];
  cover_image_url?: string;
  online_read_path?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// Frontend types (camelCase for UI)
export interface Author {
  id: string;
  slug: string;
  name: string;
  birthYear?: number;
  deathYear?: number;
  lifespan?: string;
  period?: string;
  nationality?: string;
  bioSummary?: string;
  biography?: string;
  portraitImageUrl?: string;
  denominationOrTradition?: string[];
  originalName?: string;
  externalLinks?: ExternalLink[];
}

export interface ExternalLink {
  id?: string;
  type: string;
  url: string;
  label?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bookCount?: number;
}

export interface Book {
  id: string;
  title: string;
  originalTitle?: string;
  author: Author;
  publicationYearOriginal?: string;
  publicationYearTranslation?: number;
  translator?: string;
  language: string;
  originalLanguages?: string[];
  description: string;
  categories?: string[];
  tags?: string[];
  coverImageUrl?: string;
  onlineReadPath?: string;
  downloadLinks?: DownloadLink[];
  tableOfContents?: { title: string; anchor?: string; level: number }[];
  featured?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  period?: string;
}