-- ============================================================
-- Novas entradas: A Cidade de Deus e Institutas (edições EN em PD)
-- Data: 2026-08-23
--
-- Obras-faróis que estavam sem NENHUMA versão legível no acervo.
-- Fontes verificadas obra a obra (ver PESQUISA-OBRAS-FAROIS.md):
--   * The City of God — trad. Marcus Dods (†1909) et al., PG #45304/#45305
--   * Institutes of the Christian Religion — trad. John Allen (†1839),
--     PG #45001/#64392
-- Todos os tradutores falecidos há mais de 110 anos (Lei 9.610/98, art. 41).
--
-- Como executar: psql "$DATABASE_URL" -f scripts/add_marquee_works_2026-08-23.sql
-- Os arquivos de texto correspondentes entram via deploy
-- (server/texts/cidade-de-deus-en.md e institutas-da-religiao-crista-en.md).
-- ============================================================

BEGIN;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, translator, categories, online_read_path
)
VALUES
  (
    'The City of God',
    'dcfa9e03-cecf-4868-a0ee-24a0f2f9339b',
    'English',
    'A monumental apologia de Agostinho, escrita ao longo de treze anos após o saque de Roma (410), contrastando a Cidade Terrena com a Cidade de Deus. Edição inglesa da tradução clássica de Marcus Dods (1871), completa em dois volumes (Livros I–XXII).',
    'the-city-of-god',
    'De Civitate Dei contra Paganos',
    '426',
    'Marcus Dods, George Wilson e J. J. Smith',
    ARRAY['Teologia', 'Histórico', 'Filosofia Cristã', 'Clássicos'],
    '/texts/cidade-de-deus-en.md'
  ),
  (
    'Institutes of the Christian Religion',
    '0ac823b5-7813-4608-a973-23a2ac6a3459',
    'English',
    'A obra sistemática fundamental da Reforma Protestante, na edição latina final de 1559. Edição inglesa da tradução clássica de John Allen (1839), completa em dois volumes (Livros I–IV).',
    'institutes-of-the-christian-religion',
    'Institutio Christianae Religionis',
    '1559',
    'John Allen',
    ARRAY['Reforma Protestante', 'Teologia Sistemática', 'Clássicos'],
    '/texts/institutas-da-religiao-crista-en.md'
  );

INSERT INTO download_links (book_id, format, url, source)
SELECT id, 'txt', u.url, 'Project Gutenberg'
FROM books b
JOIN (VALUES
  ('the-city-of-god', 'https://www.gutenberg.org/cache/epub/45304/pg45304.txt'),
  ('the-city-of-god', 'https://www.gutenberg.org/cache/epub/45305/pg45305.txt'),
  ('institutes-of-the-christian-religion', 'https://www.gutenberg.org/cache/epub/45001/pg45001.txt'),
  ('institutes-of-the-christian-religion', 'https://www.gutenberg.org/cache/epub/64392/pg64392.txt')
) AS u(slug, url) ON u.slug = b.slug;

COMMIT;

-- Verificação pós-execução:
-- SELECT slug, language, online_read_path FROM books WHERE slug IN ('the-city-of-god','institutes-of-the-christian-religion');
-- SELECT b.slug, dl.url FROM download_links dl JOIN books b ON b.id = dl.book_id WHERE b.slug IN ('the-city-of-god','institutes-of-the-christian-religion');
