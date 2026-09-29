-- ============================================================
-- Nova entrada: São Gregório Magno - Regra Pastoral (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'gregorio-magno',
  'São Gregório Magno',
  'Papa, monge beneditino e Doutor da Igreja (c. 540–604 d.C.), Gregório I foi uma das personalidades mais influentes da história da Igreja ocidental, unindo santidade monástica, admirável visão administrativa e profunda sabedoria pastoral. Sua obra-prima "Regra Pastoral" (Liber Regulae Pastoralis, c. 590 d.C.) tornou-se o código definitivo de conduta e ministério para bispos e sacerdotes em toda a Idade Média.',
  ARRAY['Patrística Latina', 'Monástica', 'Doutores da Igreja', 'Teologia Pastoral']
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
  'Regra Pastoral',
  (SELECT id FROM authors WHERE slug = 'gregorio-magno'),
  'Português',
  'O tratado supremo de teologia pastoral e cura d'almas da Igreja antiga. Com a célebre definição "A arte das artes é o governo das almas", São Gregório expõe quem deve assumir o ministério, a santidade de vida exigida do pastor, a arte psicológica de admoestar cada classe de ouvintes e a vigilância na humildade.',
  'regra-pastoral-gregorio-magno',
  'Liber Regulae Pastoralis',
  '590',
  2026,
  'inteligência artificial, a partir do original latino clássico',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Teologia Pastoral', 'Espiritualidade', 'História da Igreja'],
  ARRAY['gregorio-magno', 'pastoral', 'cuidado-das-almas', 'patristica', 'doutores-da-igreja', 'lideranca-crista'],
  '/texts/regra-pastoral-gregorio-magno.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de Sources Chrétiennes (SC 381-382) e PL 77. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
