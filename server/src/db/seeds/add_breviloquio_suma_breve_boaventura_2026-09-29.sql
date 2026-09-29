-- Seed para obra 'Brevilóquio: Suma Breve da Doutrina Cristã' de São Boaventura de Bagnoregio
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-boaventura',
  'São Boaventura de Bagnoregio',
  'Doutor Seráfico, cardeal e ministro geral dos Franciscanos (1221–1274), luminar da teologia mística e escolástica medieval.',
  ARRAY['Escolástica', 'Mística Medieval', 'Franciscanos']::text[]
)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    bio_summary = EXCLUDED.bio_summary,
    denomination_or_tradition = EXCLUDED.denomination_or_tradition,
    updated_at = NOW();

INSERT INTO books (
  title, author_id, language, description, slug,
  original_title, publication_year_original, publication_year_translation,
  translator, original_languages, categories, tags,
  online_read_path, featured, published, translation_is_ai,
  human_review_approved_at, license_type, attribution_text
)
SELECT
  'Brevilóquio: Suma Breve da Doutrina Cristã',
  a.id,
  'Português',
  'Obra-prima sintética de São Boaventura, expondo em compêndio brilhante todo o edifício da teologia cristã, da Trindade à glória final.',
  'breviloquio-suma-breve-boaventura',
  'Breviloquium',
  '1257',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim']::text[],
  ARRAY['Escolástica & Mística Medieval', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação', 'Trindade & Espírito Santo']::text[],
  ARRAY['Escolástica', 'Teologia Sistemática', 'Trindade', 'Criação', 'Franciscanos']::text[],
  '/texts/breviloquio-suma-breve-boaventura.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'sao-boaventura'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
