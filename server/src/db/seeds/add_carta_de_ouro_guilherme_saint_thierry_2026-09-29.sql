-- Seed para obra 'A Carta de Ouro aos Irmãos de Monte-Deus' de Guilherme de Saint-Thierry
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'guilherme-de-saint-thierry',
  'Guilherme de Saint-Thierry',
  'Abade beneditino e monge cisterciense (c. 1085–1148), amigo de São Bernardo e expoente cimeiro da teologia mística do amor divino.',
  ARRAY['Mística Medieval', 'Tradição Monástica', 'Cistercienses']::text[]
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
  'A Carta de Ouro aos Irmãos de Monte-Deus',
  a.id,
  'Português',
  'O clássico ''Epistola Aurea'', carta magna da vida eremítica e contemplativa descrevendo os três estados da alma: o homem animal, o racional e o espiritual.',
  'carta-de-ouro-guilherme-saint-thierry',
  'Epistola Aurea ad Fratres de Monte Dei',
  '1144',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim']::text[],
  ARRAY['Escolástica & Mística Medieval', 'Espiritualidade & Vida Interior', 'Epístolas & Cartas Pastorais', 'Amor Divino & Virtudes Cristãs']::text[],
  ARRAY['Vida Contemplativa', 'Carta de Ouro', 'Cartuxos', 'Cistercienses', 'Amor Divino']::text[],
  '/texts/carta-de-ouro-guilherme-saint-thierry.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'guilherme-de-saint-thierry'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
