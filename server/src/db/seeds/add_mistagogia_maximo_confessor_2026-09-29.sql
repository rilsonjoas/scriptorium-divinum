-- Seed para obra 'A Mistagogia: A Igreja como Ícone do Cosmos' de São Máximo o Confessor
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-maximo-o-confessor',
  'São Máximo o Confessor',
  'Monge, teólogo e mártir bizantino (c. 580–662 d.C.), defensor intrépido da doutrina ortodoxa das duas vontades em Cristo.',
  ARRAY['Igreja Primitiva', 'Tradição Oriental & Bizantina', 'Patrística']::text[]
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
  'A Mistagogia: A Igreja como Ícone do Cosmos',
  a.id,
  'Português',
  'Tratado clássico da teologia bizantina demonstrando como o templo da Igreja e a Santa Liturgia são o ícone do cosmos, da alma humana e da união mística com Deus.',
  'mistagogia-maximo-confessor',
  'Mystagogia',
  '630 d.C.',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego']::text[],
  ARRAY['Igreja Primitiva & Patrística', 'Tradição Oriental & Bizantina', 'Tratados & Sumas Teológicas', 'Eclesiologia & Sacramentos']::text[],
  ARRAY['Mistagogia', 'Liturgia', 'Eclesiologia', 'Cosmologia', 'Deificação']::text[],
  '/texts/mistagogia-maximo-confessor.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'sao-maximo-o-confessor'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
