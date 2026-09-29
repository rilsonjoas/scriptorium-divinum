-- Seed para obra 'Da Clareza e Certeza da Palavra de Deus' de Ulrico Zuínglio
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'ulrico-zuinglio',
  'Ulrico Zuínglio',
  'Pastor da Grande Catedral de Zurique e líder da Reforma na Suíça (1484–1531), teólogo humanista e defensor da autoridade suprema das Escrituras.',
  ARRAY['Reforma Protestante', 'Tradição Suíça', 'Tradição Reformada']::text[]
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
  'Da Clareza e Certeza da Palavra de Deus',
  a.id,
  'Português',
  'Tratado clássico em que Zuínglio defende que a Palavra de Deus traz em si mesma luz, autoridade soberana e poder regenerador dispensando tutelas humanas.',
  'clareza-e-certeza-palavra-de-deus-zuinglio',
  'Von Klarheit und Gewissheit des Wortes Gottes',
  '1522',
  2026,
  'Scriptorium Divinum',
  ARRAY['Alemão Suíço', 'Latim']::text[],
  ARRAY['Reforma Protestante', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação', 'Apologética & Filosofia Cristã']::text[],
  ARRAY['Escritura', 'Sola Scriptura', 'Reforma Suíça', 'Iluminação Divina', 'Zurique']::text[],
  '/texts/clareza-e-certeza-palavra-de-deus-zuinglio.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'ulrico-zuinglio'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
