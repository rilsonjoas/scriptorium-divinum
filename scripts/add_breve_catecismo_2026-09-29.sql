-- ============================================================
-- Nova entrada: O Breve Catecismo de Westminster (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'assembleia-de-westminster',
  'Assembleia de Westminster',
  'Convocada pelo Parlamento inglês em 1643 para reestruturar a Igreja da Inglaterra, a Assembleia reuniu 121 teólogos puritanos (os "divines") em Westminster Abbey. Produziu a Confissão de Fé, o Catecismo Maior e o Breve Catecismo (1647), considerados os documentos confessionais mais influentes do presbiterianismo e da teologia reformada de língua inglesa.',
  ARRAY['Puritanismo', 'Teologia Reformada', 'Presbiterianismo']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai, human_review_approved_at,
  license_type, attribution_text
)
VALUES (
  'O Breve Catecismo de Westminster',
  (SELECT id FROM authors WHERE slug = 'assembleia-de-westminster'),
  'Português',
  'Composto em 1647 por teólogos puritanos reunidos na Abadia de Westminster, este catecismo sumariza a fé cristã em 107 perguntas e respostas de admirável concisão e precisão teológica. Tradução nova diretamente a partir da edição oficial de 1647 em inglês, com o texto original cotejado e estrutura por capítulos temáticos.',
  'breve-catecismo-westminster',
  'The Westminster Shorter Catechism',
  '1647',
  2026,
  'inteligência artificial, a partir do original inglês de 1647',
  ARRAY['Inglês'],
  ARRAY['Credos e Confissões', 'Teologia Reformada', 'Puritanos'],
  ARRAY['catecismo', 'westminster', 'doutrina', 'puritanos', 'reforma', 'presbiterianismo'],
  '/texts/breve-catecismo-westminster.md',
  false,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do original em inglês de 1647 (The Westminster Shorter Catechism), conforme Philip Schaff, The Creeds of Christendom, vol. III. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
