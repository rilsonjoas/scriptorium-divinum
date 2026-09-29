-- ============================================================
-- Nova entrada: Livro de Oração Comum - Coletas (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'igreja-da-inglaterra',
  'Igreja da Inglaterra',
  'A tradição histórica eclesial de Canterbury que sintetizou a patrística antiga e a teologia reformada no monumento litúrgico do Book of Common Prayer e nos 39 Artigos de Religião.',
  ARRAY['Tradição Anglicana', 'Liturgia Histórica', 'Reforma Inglesa', 'Patrística e Bíblia']
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
  'As Coletas do Livro de Oração Comum (1662)',
  (SELECT id FROM authors WHERE slug = 'igreja-da-inglaterra'),
  'Português',
  'O tesouro litúrgico e devocional clássico das Coletas históricas de Thomas Cranmer e da Igreja da Inglaterra, unindo concisão patrística, poesia sacra e piedade bíblica.',
  'coletas-livro-de-oracao-comum-1662',
  'The Collects of the Book of Common Prayer',
  '1662',
  2026,
  'inteligência artificial, a partir da edição oficial de 1662 (Oxford)',
  ARRAY['Inglês', 'Latim'],
  ARRAY['Tradição Anglicana', 'Liturgia e Oração', 'Devocional Clássico', 'Poesia Sacra'],
  ARRAY['livro-de-oracao-comum', 'coletas', 'cranmer', 'anglicanismo', 'liturgia'],
  '/texts/coletas-livro-de-oracao-comum-1662.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição oficial de 1662 em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
