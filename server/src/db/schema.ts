import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  bigint,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const authors = pgTable(
  'authors',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    birthYear: integer('birth_year'),
    deathYear: integer('death_year'),
    bioSummary: text('bio_summary'),
    portraitImageUrl: varchar('portrait_image_url', { length: 500 }),
    denominationOrTradition: text('denomination_or_tradition').array(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_authors_slug').on(table.slug),
    index('idx_authors_name').on(table.name),
  ],
);

export const books = pgTable(
  'books',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 255 }).unique(),
    title: varchar('title', { length: 500 }).notNull(),
    originalTitle: varchar('original_title', { length: 500 }),
    authorId: uuid('author_id')
      .notNull()
      .references(() => authors.id, { onDelete: 'cascade' }),
    publicationYearOriginal: varchar('publication_year_original', { length: 50 }),
    publicationYearTranslation: integer('publication_year_translation'),
    translator: varchar('translator', { length: 255 }),
    language: varchar('language', { length: 100 }).default('Português').notNull(),
    originalLanguages: text('original_languages').array(),
    description: text('description').notNull(),
    categories: text('categories').array(),
    tags: text('tags').array(),
    coverImageUrl: varchar('cover_image_url', { length: 500 }),
    onlineReadPath: varchar('online_read_path', { length: 500 }),
    featured: boolean('featured').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_books_author_id').on(table.authorId),
    index('idx_books_featured').on(table.featured),
    index('idx_books_slug').on(table.slug),
  ],
);

export const downloadLinks = pgTable(
  'download_links',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    bookId: uuid('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'cascade' }),
    format: varchar('format', { length: 20 }).notNull(),
    url: varchar('url', { length: 500 }).notNull(),
    source: varchar('source', { length: 255 }),
    fileSize: bigint('file_size', { mode: 'number' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_download_links_book_id').on(table.bookId),
  ],
);

export const tableOfContents = pgTable(
  'table_of_contents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    bookId: uuid('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 500 }).notNull(),
    anchor: varchar('anchor', { length: 255 }),
    level: integer('level').default(1).notNull(),
    orderIndex: integer('order_index').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_table_of_contents_book_id').on(table.bookId),
  ],
);

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    slug: varchar('slug', { length: 120 }).notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_categories_name').on(table.name),
  ],
);

export const siteSettings = pgTable(
  'site_settings',
  {
    id: uuid('id').primaryKey(),
    siteName: varchar('site_name', { length: 255 }).notNull().default('Scriptorium Divinum'),
    siteDescription: text('site_description')
      .notNull()
      .default('Explore o vasto tesouro da teologia cristã em domínio público'),
    contactEmail: varchar('contact_email', { length: 255 })
      .notNull()
      .default('contato@scriptorium-divinum.com'),
    featuredBooksCount: integer('featured_books_count').notNull().default(3),
    booksPerPage: integer('books_per_page').notNull().default(20),
    maintenanceMode: boolean('maintenance_mode').notNull().default(false),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_site_settings_id').on(table.id),
  ],
);

export const admins = pgTable(
  'admins',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_admins_email').on(table.email),
  ],
);

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    adminId: uuid('admin_id')
      .notNull()
      .references(() => admins.id, { onDelete: 'cascade' }),
    tokenHash: varchar('token_hash', { length: 128 }).notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_sessions_admin_id').on(table.adminId),
    index('idx_sessions_expires_at').on(table.expiresAt),
  ],
);

export const authorsRelations = relations(authors, ({ many }) => ({
  books: many(books),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  author: one(authors, {
    fields: [books.authorId],
    references: [authors.id],
  }),
  downloadLinks: many(downloadLinks),
  tableOfContents: many(tableOfContents),
}));

export const downloadLinksRelations = relations(downloadLinks, ({ one }) => ({
  book: one(books, {
    fields: [downloadLinks.bookId],
    references: [books.id],
  }),
}));

export const tableOfContentsRelations = relations(tableOfContents, ({ one }) => ({
  book: one(books, {
    fields: [tableOfContents.bookId],
    references: [books.id],
  }),
}));

export const adminsRelations = relations(admins, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  admin: one(admins, {
    fields: [sessions.adminId],
    references: [admins.id],
  }),
}));
