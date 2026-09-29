-- ============================================================
-- Nova entrada: Martinho Lutero - Do Cativeiro Babilônico da Igreja (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'martinho-lutero',
  'Martinho Lutero',
  'Monge agostiniano, doutor em teologia e iniciador da Reforma Protestante do século XVI (1483–1546), tradutor da Bíblia para o alemão e reformador da eclesiologia e hinódia cristã.',
  ARRAY['Reforma Protestante', 'Tradição Luterana', 'Teologia Cristã']
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
  'Do Cativeiro Babilônico da Igreja',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'O clássico tratado sacramental da Reforma em que Lutero examina os sete sacramentos medievais à luz das Escrituras, defendendo a primazia da fé na promessa divina do Batismo e da Ceia.',
  'cativeiro-babilonico-da-igreja-lutero',
  'De Captivitate Babylonica Ecclesiae Praeludium',
  '1520',
  2026,
  'inteligência artificial, a partir da Weimarer Ausgabe (WA 6)',
  ARRAY['Latim'],
  ARRAY['Reforma Protestante', 'Teologia Sacramental', 'Eclesiologia', 'História da Igreja'],
  ARRAY['lutero', 'cativeiro-babilonico', 'sacramentos', 'ceia-do-senhor', 'batismo'],
  '/texts/cativeiro-babilonico-da-igreja-lutero.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da Weimarer Ausgabe (WA 6). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
