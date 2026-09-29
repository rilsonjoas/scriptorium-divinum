-- Seed para obra 'O Padre do Campo: O Pastor no Templo' de George Herbert
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'george-herbert',
  'George Herbert',
  'Pároco de Bemerton, teólogo e poeta sacro anglicano (1593–1633), autor do clássico pastoral ''The Country Parson'' e de ''The Temple''.',
  ARRAY['Tradição Anglicana', 'Cura Pastoral', 'Poetas Metafísicos']::text[]
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
  'O Padre do Campo: O Pastor no Templo',
  a.id,
  'Português',
  'Retrato clássico e tocante do pastor cristão exemplar, retratando a vida de oração, santidade no lar, pregação afetuosa e cuidado dos enfermos.',
  'o-padre-do-campo-george-herbert',
  'A Priest to the Temple, or The Country Parson',
  '1632',
  2026,
  'Scriptorium Divinum',
  ARRAY['Inglês']::text[],
  ARRAY['Tradição Anglicana', 'Espiritualidade & Vida Interior', 'Tratados & Sumas Teológicas', 'Amor Divino & Virtudes Cristãs']::text[],
  ARRAY['Ministério Pastoral', 'Piedade Anglicana', 'Oração', 'Caridade', 'Sacerdócio']::text[],
  '/texts/o-padre-do-campo-george-herbert.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'george-herbert'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
