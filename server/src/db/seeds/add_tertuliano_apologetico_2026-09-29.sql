-- ============================================================
-- Nova entrada: Tertuliano - Apologético (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'tertuliano',
  'Tertuliano',
  'Padre da Igreja e célebre jurista cartaginês (c. 155–220 d.C.), pioneiro da teologia em língua latina e criador de vocábulos e conceitos fundamentais do patrimônio doutrinário cristão.',
  ARRAY['Patrística', 'Igreja Antiga', 'Apologética Latina']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai, human_review_approved_at,
  license_type, attribution_text
)
VALUES (
  'Apologético',
  (SELECT id FROM authors WHERE slug = 'tertuliano'),
  'Português',
  'A monumental defesa jurídica e teológica dos cristãos perante os governadores do Império Romano, famosa pela proclamação triunfal de que o sangue dos mártires é a semente fecunda da Igreja.',
  'apologetico-tertuliano',
  'Apologeticus adversus gentes pro Christianis',
  '197',
  2026,
  'inteligência artificial, a partir do original crítico cotejado',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Apologética', 'História da Igreja', 'Perseguição'],
  ARRAY['tertuliano', 'apologetico', 'martirio', 'padres-latinos', 'imperio-romano'],
  '/texts/apologetico-tertuliano.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do Corpus Christianorum Series Latina (CCSL 1). Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
