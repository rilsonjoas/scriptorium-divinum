-- Seed para obra 'Tratado sobre as Relíquias' de João Calvino
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'joao-calvino',
  'João Calvino',
  'Reformador de Genebra, pastor e teólogo sistemático (1509–1564), autor de comentários bíblicos magistrais e das ''Institutas''.',
  ARRAY['Reforma Protestante', 'Tradição Reformada']::text[]
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
  'Tratado sobre as Relíquias',
  a.id,
  'Português',
  'Texto apologético e incisivo de Calvino denunciando os abusos medievais do comércio de relíquias e exortando a Igreja a adorar a Deus em espírito e em verdade.',
  'tratado-sobre-as-reliquias-calvino',
  'Traité des Reliques',
  '1543',
  2026,
  'Scriptorium Divinum',
  ARRAY['Francês', 'Latim']::text[],
  ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Apologética & Filosofia Cristã', 'Eclesiologia & Sacramentos']::text[],
  ARRAY['Culto Verdadeiro', 'Reforma Francesa', 'Idolatria', 'Genebra', 'Apologética']::text[],
  '/texts/tratado-sobre-as-reliquias-calvino.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'joao-calvino'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
