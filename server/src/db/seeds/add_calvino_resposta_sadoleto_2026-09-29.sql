-- ============================================================
-- Nova entrada: João Calvino - Resposta a Sadoleto (2026-09-29)
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
  'Resposta ao Cardeal Sadoleto',
  (SELECT id FROM authors WHERE slug = 'joao-calvino'),
  'Português',
  'A célebre e brilhante carta-apologia de Calvino defendendo a legitimidade da Reforma, a autoridade das Escrituras e a justificação pela fé contra as propostas do cardeal católico Sadoleto.',
  'resposta-ao-cardeal-sadoleto-calvino',
  'Responsio ad Sadoleti Epistolam',
  '1539',
  2026,
  'inteligência artificial, a partir do Corpus Reformatorum (CR 33)',
  ARRAY['Latim'],
  ARRAY['Reforma Protestante', 'Apologética', 'Eclesiologia', 'História da Igreja'],
  ARRAY['calvino', 'sadoleto', 'reforma', 'apologetica', 'justificacao'],
  '/texts/resposta-ao-cardeal-sadoleto-calvino.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do Corpus Reformatorum em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
