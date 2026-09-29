-- Seed para obra 'Prefácio à Epístola de São Paulo aos Romanos' de Martinho Lutero
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'martinho-lutero',
  'Martinho Lutero',
  'Monge agostiniano, doutor em teologia e iniciador da Reforma Protestante do séc. XVI (1483–1546).',
  ARRAY['Reforma Protestante', 'Tradição Luterana']::text[]
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
  'Prefácio à Epístola de São Paulo aos Romanos',
  a.id,
  'Português',
  'Célebre introdução teológica aos Romanos que transformou a história espiritual do Ocidente e tocou o coração de John Wesley na Rua Aldersgate.',
  'prefacio-aos-romanos-lutero',
  'Vorrede auf die Epistel S. Paul an die Römer',
  '1522',
  2026,
  'Scriptorium Divinum',
  ARRAY['Alemão', 'Latim']::text[],
  ARRAY['Reforma Protestante', 'Comentários Bíblicos & Homilias', 'Tratados & Sumas Teológicas', 'Graça, Fé & Justificação']::text[],
  ARRAY['Justificação pela Fé', 'Graça', 'Lei e Evangelho', 'Romanos', 'Reforma']::text[],
  '/texts/prefacio-aos-romanos-lutero.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'martinho-lutero'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
