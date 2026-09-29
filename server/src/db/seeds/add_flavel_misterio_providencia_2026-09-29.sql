-- ============================================================
-- Nova entrada: John Flavel - O Mistério da Providência (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'john-flavel',
  'John Flavel',
  'Pregador e teólogo puritano inglês em Dartmouth (1627–1691), célebre por sua profunda sensibilidade pastoral, afeto espiritual e obras devocionais como A Guarda do Coração e O Mistério da Providência.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Teologia Pastoral', 'Espiritualidade']
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
  'O Mistério da Providência',
  (SELECT id FROM authors WHERE slug = 'john-flavel'),
  'Português',
  'A clássica e reconfortante exposição puritana de John Flavel ensinando os cristãos a discernirem, meditarem e confiarem na mão sábia e soberana de Deus em todas as circunstâncias da vida.',
  'o-misterio-da-providencia-john-flavel',
  'The Mystery of Providence',
  '1678',
  2026,
  'inteligência artificial, a partir da edição clássica puritana de Londres (1678)',
  ARRAY['Inglês'],
  ARRAY['Tradição Puritana', 'Teologia Pastoral', 'Providência Divina', 'Vida Cristã'],
  ARRAY['john-flavel', 'providencia', 'puritanos', 'conforto-espiritual', 'soberania-de-deus'],
  '/texts/o-misterio-da-providencia-john-flavel.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica puritana (Banner of Truth). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
