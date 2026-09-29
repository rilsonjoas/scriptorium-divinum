-- ============================================================
-- Nova entrada: João Calvino - A Necessidade de Reformar a Igreja (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'joao-calvino',
  'João Calvino',
  'Teólogo e reformador franco-genebrino (1509–1564), autor das célebres Institutas da Religião Cristã e dos mais influentes comentários exegéticos do período da Reforma.',
  ARRAY['Reforma Protestante', 'Tradição Reformada', 'Teologia Sistemática']
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
  'A Necessidade de Reformar a Igreja',
  (SELECT id FROM authors WHERE slug = 'joao-calvino'),
  'Português',
  'A magistral defesa da Reforma dirigida por Calvino ao imperador Carlos V na Dieta de Spire (1544), expondo a pureza do culto divino, a salvação pela graça e o governo da Igreja.',
  'necessidade-de-reformar-a-igreja-calvino',
  'Supplex Exhortatio ad Invictissimum Caesarem Carolum Quintum',
  '1544',
  2026,
  'inteligência artificial, a partir do Corpus Reformatorum (CR 34)',
  ARRAY['Latim'],
  ARRAY['Reforma Protestante', 'Tradição Reformada', 'Eclesiologia', 'Apologética'],
  ARRAY['calvino', 'reforma-da-igreja', 'culto-puro', 'justificacao', 'dieta-de-spire'],
  '/texts/necessidade-de-reformar-a-igreja-calvino.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do Corpus Reformatorum (CR 34). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
