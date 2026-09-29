-- ============================================================
-- Nova entrada: Santa Catarina de Gênova - Tratado do Purgatório (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'santa-catarina-de-genova',
  'Santa Catarina de Gênova',
  'Mística e heroína da caridade nos hospitais de Gênova (1447–1510 d.C.), célebre por sua profunda teologia mística sobre o fogo do amor divino e o Tratado do Purgatório.',
  ARRAY['Mística Italiana', 'Espiritualidade Cristã', 'Teologia Espiritual']
)
ON CONFLICT (slug) DO UPDATE SET
  bio_summary = EXCLUDED.bio_summary;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai, human_review_approved_at,
  license_type, attribution_text
)
VALUES (
  'Tratado do Purgatório',
  (SELECT id FROM authors WHERE slug = 'santa-catarina-de-genova'),
  'Português',
  'A obra mística clássica de Santa Catarina de Gênova expondo a purificação da alma após a morte não como tormento penal, mas como a ação jubilosa e abrasadora do amor de Deus.',
  'tratado-do-purgatorio-catarina-de-genova',
  'Trattato del Purgatorio',
  '1505',
  2026,
  'inteligência artificial, a partir do manuscrito clássico genovês',
  ARRAY['Italiano'],
  ARRAY['Mística Medieval', 'Escatologia', 'Teologia Espiritual', 'Amor Divino'],
  ARRAY['catarina-de-genova', 'purgatorio', 'amor-divino', 'mistica-italiana'],
  '/texts/tratado-do-purgatorio-catarina-de-genova.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto clássico genovês em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
