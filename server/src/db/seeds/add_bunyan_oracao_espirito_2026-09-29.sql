-- ============================================================
-- Nova entrada: John Bunyan - A Oração no Espírito (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'john-bunyan',
  'John Bunyan',
  'Pregador puritano inglês (1628–1688), imortal autor de O Peregrino, Graça Abundante e A Guerra Santa, preso por doze anos por pregar o Evangelho, mestre da oração interior.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Vida Cristã', 'Oração']
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
  'A Oração no Espírito e com Entendimento',
  (SELECT id FROM authors WHERE slug = 'john-bunyan'),
  'Português',
  'O clássico tratado puritano de John Bunyan expondo a natureza da oração sincera do coração, a obra do Espírito Santo e a intercessão de Cristo contra as fórmulas vazias.',
  'a-oracao-no-espirito-john-bunyan',
  'Praying with the Spirit and with Understanding Also',
  '1662',
  2026,
  'inteligência artificial, a partir das Obras Completas de George Offor (1662)',
  ARRAY['Inglês'],
  ARRAY['Tradição Puritana', 'Oração e Devoção', 'Vida Cristã', 'Pneumatologia'],
  ARRAY['john-bunyan', 'oracao-no-espirito', 'puritanos', 'devocao', 'espirito-santo'],
  '/texts/a-oracao-no-espirito-john-bunyan.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica puritana em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
