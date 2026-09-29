-- Seed para obra 'Segunda Apologia em Favor dos Cristãos' de São Justino Mártir
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-justino-martir',
  'São Justino Mártir',
  'Filósofo e mártir cristão do séc. II (c. 100–165 d.C.), pioneiro da apologética cristã e do diálogo entre a Revelação bíblica e a razão filosófica.',
  ARRAY['Igreja Primitiva', 'Apologistas', 'Patrística']::text[]
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
  'Segunda Apologia em Favor dos Cristãos',
  a.id,
  'Português',
  'Corajoso memorial apologético endereçado ao Senado Romano em defesa da inocência, integridade moral e coragem dos mártires cristãos.',
  'segunda-apologia-justino-martir',
  'Apologia Secunda pro Christianis',
  '155 d.C.',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego']::text[],
  ARRAY['Igreja Primitiva & Patrística', 'Apologética & Filosofia Cristã', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[],
  ARRAY['Apologética', 'Martírio', 'Logos', 'Filosofia', 'Igreja Primitiva']::text[],
  '/texts/segunda-apologia-justino-martir.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'sao-justino-martir'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
