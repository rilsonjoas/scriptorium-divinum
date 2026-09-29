-- Seed para obra 'Sobre a Verdade (De Veritate)' de Santo Anselmo de Cantuária
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'santo-anselmo-de-cantuaria',
  'Santo Anselmo de Cantuária',
  'Doutor Magnífico, abade de Bec e arcebispo de Cantuária (1033–1109), pai da Escolástica e mestre do ''fides quaerens intellectum''.',
  ARRAY['Escolástica', 'Teologia Medieval', 'Doutores da Igreja']::text[]
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
  'Sobre a Verdade (De Veritate)',
  a.id,
  'Português',
  'Diálogo filosófico e teológico fundamental em que Santo Anselmo define a verdade como a retidão apreensível pela mente e culmina na Verdade Suprema.',
  'sobre-a-verdade-de-veritate-anselmo',
  'De Veritate',
  '1080',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim']::text[],
  ARRAY['Escolástica & Mística Medieval', 'Apologética & Filosofia Cristã', 'Tratados & Sumas Teológicas', 'Amor Divino & Virtudes Cristãs']::text[],
  ARRAY['Epistemologia', 'Verdade', 'Escolástica', 'Retidão', 'Filosofia Cristã']::text[],
  '/texts/sobre-a-verdade-de-veritate-anselmo.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'santo-anselmo-de-cantuaria'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
