import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { buildApp } from '../app.js';
import { db, closeDb } from '../db/client.js';
import { env } from '../config.js';

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

  it('GET /docs serve a interface interativa da API', async () => {
    const res = await app.inject({ method: 'GET', url: '/docs/' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.body).toContain('scalar');
  });

  it('GET /api/v1/authors omite autor sem nenhuma obra com leitura online', async () => {
    // João Calvino só tem "institutas", que não tem online_read_path
    // (fixture): decisão de 2026-09-29, autor sem obra legível não aparece.
    const res = await app.inject({ method: 'GET', url: '/api/v1/authors' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.length).toBe(1);
    expect(body[0].name).toBe('Santo Agostinho');
    expect(body[0]).toHaveProperty('bookCount', 1);
  });

  it('GET /api/v1/authors?includeUnavailable=true devolve todo mundo (uso do admin)', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/authors?includeUnavailable=true' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.length).toBe(2);
    const calvino = body.find((a: { name: string }) => a.name === 'João Calvino');
    expect(calvino.bookCount).toBe(0);
  });

  it('GET /api/v1/authors/:slug devolve autor e suas obras', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/authors/santo-agostinho' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.name).toBe('Santo Agostinho');
    expect(body.books.length).toBe(1);
  });

  it('GET /api/v1/authors/:slug por link direto continua respondendo mesmo sem obra legível', async () => {
    // Não listado (teste acima), mas quem já tem o link não leva a um 404 —
    // só não sobra nenhuma obra na lista.
    const res = await app.inject({ method: 'GET', url: '/api/v1/authors/joao-calvino' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.books).toEqual([]);
  });

  it('GET /api/v1/books lista livros paginados com autor aninhado, omitindo obra sem leitura online', async () => {
    // "institutas" não tem online_read_path na fixture: some do catálogo
    // público por padrão (decisão de 2026-09-29).
    const res = await app.inject({ method: 'GET', url: '/api/v1/books?page=1&limit=10' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.total).toBe(1);
    expect(body.items[0].slug).toBe('confissoes');
    expect(body.items[0]).toHaveProperty('author');
  });

  it('GET /api/v1/books?includeUnavailable=true devolve tudo (uso do admin)', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/books?includeUnavailable=true' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.total).toBe(2);
    expect(body.items.map((b: { slug: string }) => b.slug).sort()).toEqual(['confissoes', 'institutas']);
  });

  it('GET /api/v1/books/:idOrSlug devolve detalhes e links de download', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/books/confissoes' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.title).toBe('Confissões');
    expect(body.downloadLinks.length).toBe(1);
    expect(body.downloadLinks[0].format).toBe('pdf');
  });

  /**
   * Guarda de 2026-09-26. As queries de livro usam lista EXPLÍCITA de
   * colunas, então um campo novo no schema não aparece na resposta sem
   * que alguém o acrescente — e a falha é silenciosa: a coluna existe no
   * banco, a API responde 200, e o site apenas não mostra o que era para
   * mostrar. Foi o que aconteceu com `relatedEditionSlug` (a edição
   * original das 7 obras sem texto): banco migrado à mão, deploy verde,
   * e o campo voltando `None` porque a query não o pedia.
   *
   * O teste abaixo pega a próxima vez.
   */
  it('GET /api/v1/books/:idOrSlug devolve relatedEditionSlug (coluna nao some da API)', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/books/confissoes' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('relatedEditionSlug');
  });

  it('GET /api/v1/books inclui relatedEditionSlug no catalogo tambem', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/books' });
    expect(res.statusCode).toBe(200);
    expect(res.json().items[0]).toHaveProperty('relatedEditionSlug');
  });

  it('GET /api/v1/books/:idOrSlug informa textAvailable quando o arquivo existe', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/books/confissoes' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('textAvailable', true);
  });

  it('GET /api/v1/books/:idOrSlug computa readingMinutes quando o texto existe', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/books/confissoes' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.textAvailable).toBe(true);
    expect(body.readingMinutes).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/v1/books/:idOrSlug devolve readingMinutes null quando não há texto', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/books/institutas' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.textAvailable).toBe(false);
    expect(body.readingMinutes).toBeNull();
  });

  it('GET /api/v1/books/:idOrSlug/text vem comprimido quando o cliente aceita gzip', async () => {
    // A Bíblia (5 MB) ia sem compressão e levava ~13 s para abrir (2026-09-29).
    const original = readFileSync(TEXT_FIXTURE, 'utf8');
    const grande = original + 'Et verbum caro factum est. '.repeat(20_000);
    writeFileSync(TEXT_FIXTURE, grande);
    try {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/books/confissoes/text',
        headers: { 'accept-encoding': 'gzip' },
      });
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-encoding']).toBe('gzip');
      expect(res.rawPayload.length).toBeLessThan(grande.length / 10);
      expect(JSON.parse(gunzipSync(res.rawPayload).toString('utf8')).text).toBe(grande);
    } finally {
      writeFileSync(TEXT_FIXTURE, original);
    }
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

  it('GET /api/v1/search não devolve obra sem leitura online', async () => {
    // "institutas" bate com "sistemático" no title/description, mas não
    // tem online_read_path na fixture: some da busca (2026-09-29).
    const res = await app.inject({ method: 'GET', url: '/api/v1/search?q=sistemático' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.some((b: { slug: string }) => b.slug === 'institutas')).toBe(false);
  });

  it('GET /sitemap.xml devolve o sitemap com páginas estáticas e livros', async () => {
    const res = await app.inject({ method: 'GET', url: '/sitemap.xml' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('application/xml');
    expect(res.body).toContain('<urlset');
    // A origem vem da configuração, não do literal de produção. Em CI não há
    // .env e o default de PUBLIC_ORIGIN é o domínio real, então o teste
    // passava; na máquina de quem desenvolve o .env aponta para localhost e
    // ele falhava por causa do ambiente, não do sitemap. Comparar com o
    // literal era testar o .env alheio, e ainda escondia regressão real
    // atrás de um teste que só dava vermelho em um dos lados.
    expect(res.body).toContain(`<loc>${env.PUBLIC_ORIGIN}/</loc>`);
    expect(res.body).toContain('/livros/confissoes');
    expect(res.body).toContain('/categorias/');
    // "institutas" e o autor João Calvino (que só tem essa obra) não têm
    // leitura online na fixture: não entram no sitemap (2026-09-29).
    expect(res.body).not.toContain('/livros/institutas');
    expect(res.body).not.toContain('/autores/joao-calvino');
  });

  it('404 para autor ou livro inexistente', async () => {
    const resAuthor = await app.inject({ method: 'GET', url: '/api/v1/authors/inexistente' });
    expect(resAuthor.statusCode).toBe(404);

    const resBook = await app.inject({ method: 'GET', url: '/api/v1/books/inexistente' });
    expect(resBook.statusCode).toBe(404);
  });
});
