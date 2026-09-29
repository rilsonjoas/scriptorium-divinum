-- ============================================================
-- Nova entrada: Pseudo-Dionísio - A Teologia Mística (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'pseudo-dionisio-areopagita',
  'Pseudo-Dionísio, o Areopagita',
  'Místico e teólogo cristão (c. séc. V–VI d.C.), autor do Corpus Dionysiacum, pai da teologia apofática e negativa que influenciou profundamente Máximo o Confessor, Tomás de Aquino e São João da Cruz.',
  ARRAY['Patrística Bizantina', 'Mística Apofática', 'Filosofia Cristã', 'Philokalia']
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
  'A Teologia Mística',
  (SELECT id FROM authors WHERE slug = 'pseudo-dionisio-areopagita'),
  'Português',
  'O clássico monumento fundacional da teologia apofática cristã sobre a transcendência incognoscível de Deus, a via negativa e a união beatífica no silêncio contemplativo.',
  'teologia-mistica-pseudo-dionisio',
  'De Mystica Theologia (Περὶ μυστικῆς θεολογίας)',
  '500',
  2026,
  'inteligência artificial, a partir de Sources Chrétiennes (SC 412)',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Mística Cristã', 'Teologia Negativa', 'Filosofia'],
  ARRAY['dionisio-areopagita', 'teologia-mistica', 'apofatismo', 'contemplacao', 'patristica'],
  '/texts/teologia-mistica-pseudo-dionisio.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de Sources Chrétiennes (SC 412). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
