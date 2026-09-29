-- Seed para obra 'Hinos do Amor Divino e da Luz Incriada' de São Simeão o Novo Teólogo
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-simeao-o-novo-teologo',
  'São Simeão o Novo Teólogo',
  'Abade de São Mamas em Constantinopla e místico bizantino (949–1022 d.C.), cantor inigualável da luz incriada e da presença consciente do Espírito Santo.',
  ARRAY['Tradição Oriental & Bizantina', 'Hesicasmo', 'Patrística']::text[]
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
  'Hinos do Amor Divino e da Luz Incriada',
  a.id,
  'Português',
  'Hinos místicos de São Simeão transbordando a experiência extática da visão da Luz divina incriada e da habitação do Paráclito no coração regenerado.',
  'hinos-do-amor-divino-simeao-novo-teologo',
  'Hymni Divini Amoris',
  '1015 d.C.',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego']::text[],
  ARRAY['Tradição Oriental & Bizantina', 'Liturgia, Orações & Hinos', 'Espiritualidade & Vida Interior', 'Trindade & Espírito Santo']::text[],
  ARRAY['Luz Incriada', 'Espírito Santo', 'Hesicasmo', 'Poesia Sacra', 'Deificação']::text[],
  '/texts/hinos-do-amor-divino-simeao-novo-teologo.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'sao-simeao-o-novo-teologo'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
