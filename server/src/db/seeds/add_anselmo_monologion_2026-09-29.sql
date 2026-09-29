-- ============================================================
-- Nova entrada: Santo Anselmo de Cantuária - Monologion (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'anselmo-de-cantuaria',
  'Santo Anselmo de Cantuária',
  'Arcebispo de Cantuária, Doutor Magnífico (1033–1109 d.C.), patriarca da teologia escolástica medieval e mestre incomparável do método fides quaerens intellectum.',
  ARRAY['Escolástica', 'Filosofia Cristã', 'Monasticismo Beneditino', 'Teologia Filosófica']
)
ON CONFLICT (slug) DO UPDATE SET
  bio_summary = EXCLUDED.bio_summary,
  name = EXCLUDED.name;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai, human_review_approved_at,
  license_type, attribution_text
)
VALUES (
  'Monologion',
  (SELECT id FROM authors WHERE slug = 'anselmo-de-cantuaria'),
  'Português',
  'A célebre meditação escolástica de Santo Anselmo que investiga a existência, a unidade e os atributos infinitos da Divindade através da razão iluminada pela fé cristã.',
  'monologion-anselmo',
  'Monologium de Divinitatis Essentia',
  '1076',
  2026,
  'inteligência artificial, a partir do original crítico cotejado',
  ARRAY['Latim'],
  ARRAY['Escolástica', 'Teologia Filosófica', 'Trindade', 'Filosofia'],
  ARRAY['anselmo', 'monologion', 'existencia-de-deus', 'sumo-bem', 'escolastica'],
  '/texts/monologion-anselmo.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição de F. S. Schmitt. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
