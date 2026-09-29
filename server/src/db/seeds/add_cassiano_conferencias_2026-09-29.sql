-- ============================================================
-- Nova entrada: São João Cassiano - Conferências dos Padres (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-joao-cassiano',
  'São João Cassiano',
  'Monge, teólogo e abade de Marselha (c. 360–435 d.C.), elo fundamental entre a tradição monástica dos Padres do Deserto do Egito e o monasticismo ocidental beneditino.',
  ARRAY['Patrística Monástica', 'Padres do Deserto', 'Espiritualidade Cristã']
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
  'Conferências dos Padres do Deserto',
  (SELECT id FROM authors WHERE slug = 'sao-joao-cassiano'),
  'Português',
  'A obra-prima clássica de São João Cassiano compilando os ensinamentos dos grandes mestres do deserto egípcio sobre a pureza do coração, a oração e o discernimento dos pensamentos.',
  'conferencias-dos-padres-joao-cassiano',
  'Conlationes Sanctorum Patrum',
  '426',
  2026,
  'inteligência artificial, a partir de Sources Chrétiennes (SC 42)',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Padres do Deserto', 'Monasticismo', 'Espiritualidade'],
  ARRAY['joao-cassiano', 'conferencias', 'padres-do-deserto', 'pureza-do-coracao', 'oracao'],
  '/texts/conferencias-dos-padres-joao-cassiano.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de Sources Chrétiennes (SC 42). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
