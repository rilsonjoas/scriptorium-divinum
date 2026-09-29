-- ============================================================
-- Nova entrada: Hermas de Roma - O Pastor de Hermas (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'hermas-de-roma',
  'Hermas de Roma',
  'Padre Apostólico do século II (c. 100–150 d.C.), autor de O Pastor de Hermas, um dos escritos patrísticos mais lidos e venerados da Igreja Antiga sobre a penitência e a visão da Igreja.',
  ARRAY['Patrística Apostólica', 'Igreja Antiga', 'Literatura Apocalíptica Cristã']
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
  'O Pastor de Hermas',
  (SELECT id FROM authors WHERE slug = 'hermas-de-roma'),
  'Português',
  'O célebre monumento patrístico do século II contendo visões alegóricas, mandamentos morais e parábolas sobre a edificação da Igreja, a regeneração batismal e o arrependimento.',
  'o-pastor-de-hermas',
  'Pastor Hermae (Ὁ Ποιμήν)',
  '140',
  2026,
  'inteligência artificial, a partir de Sources Chrétiennes (SC 172)',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Padres Apostólicos', 'Eclesiologia', 'Vida Cristã'],
  ARRAY['hermas', 'o-pastor', 'padres-apostolicos', 'visoes', 'penitencia'],
  '/texts/o-pastor-de-hermas.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de Sources Chrétiennes (SC 172). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
