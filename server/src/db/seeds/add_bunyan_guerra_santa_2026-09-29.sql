-- ============================================================
-- Nova entrada: John Bunyan - A Guerra Santa (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'john-bunyan',
  'John Bunyan',
  'Pregador puritano inglês (1628–1688), imortal autor de O Peregrino, Graça Abundante e A Guerra Santa, uma das alegorias mais vívidas da teologia bíblica da redenção e do combate espiritual.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Alegoria Bíblica', 'Vida Cristã']
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
  'A Guerra Santa',
  (SELECT id FROM authors WHERE slug = 'john-bunyan'),
  'Português',
  'A monumental alegoria puritana de John Bunyan retratando a queda, a redenção e a reconquista da cidade de Alma-Humana pelo Príncipe Emanuel contra as hostes de Diabolus.',
  'a-guerra-santa-john-bunyan',
  'The Holy War Made by Shaddai upon Diabolus',
  '1682',
  2026,
  'inteligência artificial, a partir da edição clássica de George Offor (1682)',
  ARRAY['Inglês'],
  ARRAY['Tradição Puritana', 'Alegoria Cristã', 'Guerra Espiritual', 'Clássicos'],
  ARRAY['john-bunyan', 'a-guerra-santa', 'alma-humana', 'emanuel', 'puritanos'],
  '/texts/a-guerra-santa-john-bunyan.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição de George Offor em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
