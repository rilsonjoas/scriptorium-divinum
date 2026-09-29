-- ============================================================
-- Nova entrada: São Boaventura - As Seis Asas do Serafim (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-boaventura',
  'São Boaventura',
  'Doutor Seráfico, cardeal franciscano e filósofo medieval (1221–1274 d.C.), autor do Itinerário da Mente para Deus e de tratados monumentais de teologia pastoral e mística.',
  ARRAY['Escolástica', 'Tradição Franciscana', 'Teologia Pastoral', 'Mística']
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
  'As Seis Asas do Serafim',
  (SELECT id FROM authors WHERE slug = 'sao-boaventura'),
  'Português',
  'O clássico tratado franciscano de São Boaventura sobre as seis virtudes essenciais do governo espiritual, da liderança pastoral e da elevação mística da alma.',
  'as-seis-asas-do-serafim-boaventura',
  'De Sex Alis Seraphim',
  '1263',
  2026,
  'inteligência artificial, a partir da Opera Omnia de Quaracchi (Tomus VIII)',
  ARRAY['Latim'],
  ARRAY['Escolástica', 'Mística Franciscana', 'Teologia Pastoral', 'Espiritualidade'],
  ARRAY['boaventura', 'seis-asas-serafim', 'franciscanos', 'lideranca-pastoral', 'escolastica'],
  '/texts/as-seis-asas-do-serafim-boaventura.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da Opera Omnia de Quaracchi em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
