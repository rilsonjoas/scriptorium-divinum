export type BookFormat = 'online' | 'pdf' | 'epub' | 'mobi' | 'txt';

export interface DownloadLink {
  format: BookFormat;
  url: string;
  source?: string;
}

export interface Author {
  slug: string;
  name: string;
  birthYear?: number;
  deathYear?: number;
  bioSummary?: string;
  portraitImageUrl?: string;
  denominationOrTradition?: string[];
}

export interface Book {
  id: string;
  title: string;
  originalTitle?: string;
  author: Author;
  publicationYearOriginal?: number | string;
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