-- ============================================================
-- Nova entrada: São Bernardo de Claraval - Sermões sobre o Cântico dos Cânticos (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'bernardo-de-claraval',
  'São Bernardo de Claraval',
  'Doutor Melífluo, abade cisterciense, místico e pregador medieval (1090–1153 d.C.), uma das vozes mais ardentes e influentes da espiritualidade cristã monástica ocidental.',
  ARRAY['Monasticismo Cisterciense', 'Mística Medieval', 'Teologia Monástica']
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
  'Sermões sobre o Cântico dos Cânticos',
  (SELECT id FROM authors WHERE slug = 'bernardo-de-claraval'),
  'Português',
  'A obra-prima mística de São Bernardo de Claraval expondo a teologia nupcial da alma com Cristo através da alegoria espiritual dos beijos e do amor divino no Cântico de Salomão.',
  'sermoes-cantico-dos-canticos-bernardo-claraval',
  'Sermones in Cantica Canticorum',
  '1136',
  2026,
  'inteligência artificial, a partir da edição crítica de J. Leclercq',
  ARRAY['Latim'],
  ARRAY['Mística Medieval', 'Comentário Bíblico', 'Teologia Espiritual', 'Amor Divino'],
  ARRAY['bernardo-claraval', 'cantico-dos-canticos', 'mistica-nupcial', 'cistercienses'],
  '/texts/sermoes-cantico-dos-canticos-bernardo-claraval.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de Jean Leclercq em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
