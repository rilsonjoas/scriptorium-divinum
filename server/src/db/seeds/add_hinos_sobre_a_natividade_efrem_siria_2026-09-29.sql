-- Seed para obra 'Hinos sobre a Natividade e a Fé' de Santo Efrém da Síria
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'santo-efrem-da-siria',
  'Santo Efrém da Síria',
  'Diácono, teólogo e poeta de Nísibis e Edessa (306–373 d.C.), cognominado a ''Cítara do Espírito Santo'' e Doutor da Igreja.',
  ARRAY['Igreja Primitiva', 'Tradição Siríaca', 'Patrística']::text[]
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
  'Hinos sobre a Natividade e a Fé',
  a.id,
  'Português',
  'Cânticos poéticos e contemplativos de Santo Efrém celebrando a profunda maravilha do Verbo eterno feito menino no seio da Virgem Maria.',
  'hinos-sobre-a-natividade-efrem-siria',
  'Hymni de Nativitate et de Fide',
  '363 d.C.',
  2026,
  'Scriptorium Divinum',
  ARRAY['Siríaco', 'Grego']::text[],
  ARRAY['Igreja Primitiva & Patrística', 'Tradição Oriental & Bizantina', 'Liturgia, Orações & Hinos', 'Cristologia & Encarnação']::text[],
  ARRAY['Encarnação', 'Natal', 'Poesia Sacra', 'Patrística Siríaca', 'Luz Divina']::text[],
  '/texts/hinos-sobre-a-natividade-efrem-siria.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'santo-efrem-da-siria'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
