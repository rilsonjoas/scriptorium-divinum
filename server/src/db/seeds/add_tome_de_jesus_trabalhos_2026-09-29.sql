-- ============================================================
-- Nova entrada: Frei Tomé de Jesus - Trabalhos de Jesus (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'frei-tome-de-jesus',
  'Frei Tomé de Jesus',
  'Eremita agostiniano português e místico (1529–1582), cativo em Marrocos após Alcácer-Quibir, autor de Trabalhos de Jesus, uma das obras mais comoventes da literatura espiritual e clássica da língua portuguesa.',
  ARRAY['Mística Agostiniana', 'Literatura Espiritual Portuguesa', 'Devoção à Cruz']
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
  'Trabalhos de Jesus',
  (SELECT id FROM authors WHERE slug = 'frei-tome-de-jesus'),
  'Português',
  'O clássico monumento espiritual e literário da língua portuguesa, composto por Frei Tomé de Jesus no cárcere mourisco em Marrocos, meditando sobre as dores e a redenção de Cristo.',
  'trabalhos-de-jesus-frei-tome',
  'Os Trabalhos de Jesus',
  '1602',
  1602,
  'texto original em língua portuguesa',
  ARRAY['Português'],
  ARRAY['Mística Portuguesa', 'Cristologia', 'Paixão de Cristo', 'Clássicos'],
  ARRAY['tome-de-jesus', 'trabalhos-de-jesus', 'marrocos', 'cativeiro', 'literatura-portuguesa'],
  '/texts/trabalhos-de-jesus-frei-tome.md',
  true,
  true,
  false,
  '2026-09-29T19:00:00Z',
  'public-domain',
  'Edição fidedigna do texto quinhentista clássico em domínio público. Scriptorium Divinum, 2026.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
