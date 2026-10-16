import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { buildApp } from '../app.js';
import { closeDb } from '../db/client.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, '../db/migrations');
const FUNCTIONS_SQL = path.join(import.meta.dirname, '../db/custom-sql/functions.sql');

describe('Commentaries API — Comentários Bíblicos Classicos', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let admin: postgres.Sql;

  beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não definida nos testes de integração');

    admin = postgres(url, { max: 1 });
    const adminDb = drizzle(admin);

    await migrate(adminDb, { migrationsFolder: MIGRATIONS_DIR });
    await admin.unsafe(readFileSync(FUNCTIONS_SQL, 'utf-8'));

    // Garantir que a tabela existe
    await admin.unsafe(`
      CREATE TABLE IF NOT EXISTS biblical_commentaries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        bible_book VARCHAR(100) NOT NULL,
        chapter INTEGER NOT NULL,
        verse_start INTEGER,
        verse_end INTEGER,
        book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        excerpt TEXT,
        anchor_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    // Inserir autor e obra para teste
    await admin.unsafe(`
      INSERT INTO authors (id, slug, name, birth_year, death_year) VALUES
        ('00000000-0000-0000-0000-000000000099', 'martinho-lutero', 'Martinho Lutero', 1483, 1546)
      ON CONFLICT (slug) DO NOTHING;

      INSERT INTO books (id, slug, title, author_id, publication_year_original, description, categories, tags, featured) VALUES
        ('10000000-0000-0000-0000-000000000099', 'comentario-aos-galatas-martinho-lutero', 'Comentário aos Gálatas',
         '00000000-0000-0000-0000-000000000099', '1535', 'Exposição teológica da epístola aos Gálatas',
         ARRAY['Reforma'], ARRAY['justificação'], true)
      ON CONFLICT (slug) DO NOTHING;

      INSERT INTO biblical_commentaries (id, bible_book, chapter, book_id, title, excerpt, anchor_url) VALUES
        ('20000000-0000-0000-0000-000000000001', 'galatas', 1, '10000000-0000-0000-0000-000000000099',
         'Martinho Lutero — Comentário sobre Gálatas 1', 'Exposição sobre a graça e o apostolado.', '/ler/comentario-aos-galatas-martinho-lutero#capitulo-1'),
        ('20000000-0000-0000-0000-000000000002', 'galatas', 2, '10000000-0000-0000-0000-000000000099',
         'Martinho Lutero — Comentário sobre Gálatas 2', 'Justificação pela fé em Cristo.', '/ler/comentario-aos-galatas-martinho-lutero#capitulo-2')
      ON CONFLICT DO NOTHING;
    `);

    app = await buildApp();
  });

  afterAll(async () => {
    if (app) await app.close();
    if (admin) await admin.end();
    await closeDb();
  });

  it('GET /api/v1/commentaries lista todos os comentários cadastrados', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/commentaries',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(2);

    const first = body[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('bibleBook');
    expect(first).toHaveProperty('chapter');
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('anchorUrl');
    expect(first.book).toHaveProperty('title');
    expect(first.book).toHaveProperty('slug');
  });

  it('GET /api/v1/commentaries?bibleBook=galatas&chapter=1 filtra com precisão', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/commentaries?bibleBook=galatas&chapter=1',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body[0].bibleBook).toBe('galatas');
    expect(body[0].chapter).toBe(1);
    expect(body[0].anchorUrl).toContain('#capitulo-1');
  });

  it('GET /api/v1/commentaries?bibleBook=inexistente devolve lista vazia', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/commentaries?bibleBook=inexistente',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });
});
