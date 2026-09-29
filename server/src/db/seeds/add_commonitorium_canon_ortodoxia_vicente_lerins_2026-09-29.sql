-- Seed para obra 'Commonitorium: O Cânon da Tradição e Ortodoxia' de São Vicente de Lérins
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-vicente-de-lerins',
  'São Vicente de Lérins',
  'Monge no mosteiro da ilha de Lérins (c. 400–450 d.C.), autor do célebre ''Commonitorium'' que definiu o cânon clássico da fé católica: o que sempre, em toda parte e por todos foi crido.',
  ARRAY['Igreja Primitiva', 'Monasticismo Gaulês', 'Patrística']::text[]
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
  'Commonitorium: O Cânon da Tradição e Ortodoxia',
  a.id,
  'Português',
  'Texto fundacional da teologia patrística sobre o critério de discernimento da doutrina cristã autêntica: universalidade, antiguidade e consenso unânime.',
  'commonitorium-canon-ortodoxia-vicente-lerins',
  'Commonitorium pro Catholicae Fidei Antiquitate et Universitate',
  '434 d.C.',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim']::text[],
  ARRAY['Igreja Primitiva & Patrística', 'Tratados & Sumas Teológicas', 'Eclesiologia & Sacramentos', 'Apologética & Filosofia Cristã']::text[],
  ARRAY['Regra de Fé', 'Ortodoxia', 'Patrística Latina', 'Tradição', 'Lérins']::text[],
  '/texts/commonitorium-canon-ortodoxia-vicente-lerins.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'sao-vicente-de-lerins'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
