import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { buildApp } from '../app.js';
import { db, closeDb } from '../db/client.js';

const MIGRATIONS_DIR = path.join(import.meta.dirname, '../db/migrations');
const FUNCTIONS_SQL = path.join(import.meta.dirname, '../db/custom-sql/functions.sql');
const TEXTS_DIR = path.join(import.meta.dirname, '../../texts');
const TEXT_FIXTURE = path.join(TEXTS_DIR, 'integration-fixture.md');

describe('Scriptorium Divinum API — Testes de Integração', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let admin: postgres.Sql;

  beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL não definida nos testes de integração');

    admin = postgres(url, { max: 1 });
    const adminDb = drizzle(admin);

    await migrate(adminDb, { migrationsFolder: MIGRATIONS_DIR });
    await admin.unsafe(readFileSync(FUNCTIONS_SQL, 'utf-8'));

    await admin.unsafe('TRUNCATE table_of_contents, download_links, books, authors RESTART IDENTITY CASCADE');

    await admin.unsafe(`
      INSERT INTO authors (id, slug, name, birth_year, death_year, bio_summary, denomination_or_tradition) VALUES
        ('00000000-0000-0000-0000-000000000001', 'santo-agostinho', 'Santo Agostinho', 354, 430, 'Bispo de Hipona', ARRAY['Patrística', 'Católica']),
        ('00000000-0000-0000-0000-000000000002', 'joao-calvino', 'João Calvino', 1509, 1564, 'Reformador', ARRAY['Reforma Protestante']);

      INSERT INTO books (id, slug, title, original_title, author_id, publication_year_original, description, categories, tags, featured) VALUES
        ('10000000-0000-0000-0000-000000000001', 'confissoes', 'Confissões', 'Confessiones', '00000000-0000-0000-0000-000000000001', '397', 'Autobiografia espiritual', ARRAY['Patrística', 'Filosofia Cristã'], ARRAY['conversão', 'graça'], true),
        ('10000000-0000-0000-0000-000000000002', 'institutas', 'As Institutas', 'Institutio', '00000000-0000-0000-0000-000000000002', '1536', 'Tratado sistemático', ARRAY['Reforma Protestante'], ARRAY['salvação', 'graça'], false);

      INSERT INTO download_links (id, book_id, format, url, source, file_size) VALUES
        ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'pdf', '/downloads/confissoes.pdf', 'Internet Archive', 2500000);
    `);

    writeFileSync(TEXT_FIXTURE, '# Proveniência\n\n- **Obra**: Confissões\n- **Domínio público porque**: autor falecido há +70 anos (Lei 9.610/98, art. 41)\n\n# Confissões\n\nTexto de teste.\n');
    await admin.unsafe(
      `UPDATE books SET online_read_path = '/texts/integration-fixture.md' WHERE id = '10000000-0000-0000-0000-000000000001'`,
    );

    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
    if (admin) await admin.end({ timeout: 5 });
    await closeDb();
    if (existsSync(TEXT_FIXTURE)) unlinkSync(TEXT_FIXTURE);
  });

  it('GET /health responde ok', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('status', 'ok');
  });

  it('GET /health/live responde live', async () => {
    const res = await app.inject({ method: 'GET', url: '/health/live' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('status', 'live');
  });

  it('GET /health/ready valida conexão ativa com o Postgres', async () => {
    const res = await app.inject({ method: 'GET', url: '/health/ready' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ready', database: 'connected' });
  });

  it('GET /docs/json expõe especificação OpenAPI', async () => {
    const res = await app.inject({ method: 'GET', url: '/docs/json' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('openapi');
  });

  it('GET /api/v1/authors lista autores com contagem de obras', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/authors' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.length).toBe(2);
    expect(body[0]).toHaveProperty('bookCount');
  });

  it('GET /api/v1/authors/:slug devolve autor e suas obras', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/authors/santo-agostinho' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.name).toBe('Santo Agostinho');
    expect(body.books.length).toBe(1);
  });

  it('GET /api/v1/books lista livros paginados com autor aninhado', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/books?page=1&limit=10' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.total).toBe(2);
    expect(body.items[0]).toHaveProperty('author');
  });

  it('GET /api/v1/books/:idOrSlug devolve detalhes e links de download', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/books/confissoes' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.title).toBe('Confissões');
    expect(body.downloadLinks.length).toBe(1);
    expect(body.downloadLinks[0].format).toBe('pdf');
  });

  it('GET /api/v1/books/:idOrSlug informa textAvailable quando o arquivo existe', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/books/confissoes' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('textAvailable', true);
  });

  it('GET /api/v1/books/:idOrSlug/text devolve o texto em markdown', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/books/confissoes/text' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.title).toBe('Confissões');
    expect(body.text).toContain('Texto de teste');
  });

  it('GET /api/v1/books/:idOrSlug/text devolve 404 quando não há arquivo', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/books/institutas/text' });
    expect(res.statusCode).toBe(404);
  });

  it('GET /api/v1/categories lista categorias agregadas com contagem', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/categories' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.length).toBeGreaterThan(0);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Patrística', bookCount: 1 }),
      ]),
    );
  });

  it('GET /api/v1/settings devolve as configurações públicas default', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/settings' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toMatchObject({
      siteName: 'Scriptorium Divinum',
      maintenanceMode: false,
    });
    expect(body).toHaveProperty('featuredBooksCount');
    expect(body).toHaveProperty('booksPerPage');
  });

  it('GET /api/v1/search busca full-text em português', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/search?q=espiritual' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0].title).toBe('Confissões');
  });

  it('GET /sitemap.xml devolve o sitemap com páginas estáticas e livros', async () => {
    const res = await app.inject({ method: 'GET', url: '/sitemap.xml' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('application/xml');
    expect(res.body).toContain('<urlset');
    expect(res.body).toContain('https://scriptorium.narniano.com/</loc>');
    expect(res.body).toContain('/livros/confissoes');
    expect(res.body).toContain('/categorias/');
  });

  it('404 para autor ou livro inexistente', async () => {
    const resAuthor = await app.inject({ method: 'GET', url: '/api/v1/authors/inexistente' });
    expect(resAuthor.statusCode).toBe(404);

    const resBook = await app.inject({ method: 'GET', url: '/api/v1/books/inexistente' });
    expect(resBook.statusCode).toBe(404);
  });
});
