-- ============================================================
-- Nova entrada: A Confissão de Fé de Westminster (Frente 2, 2026-09-29)
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
  'A Confissão de Fé de Westminster',
  (SELECT id FROM authors WHERE slug = 'assembleia-de-westminster'),
  'Português',
  'Concluída em 1646 pela Assembleia de teólogos reunida na Abadia de Westminster, esta Confissão é o documento doutrinário sistemático mais influente da tradição presbiteriana e reformada de língua inglesa. Seus 33 capítulos articulam com notável precisão a doutrina das Escrituras, a soberania divina, a teologia do pacto, a cristologia, a soteriologia da graça, a eclesiologia e a escatologia.',
  'confissao-de-fe-de-westminster',
  'The Westminster Confession of Faith',
  '1646',
  2026,
  'inteligência artificial, a partir do original inglês de 1646',
  ARRAY['Inglês'],
  ARRAY['Credos e Confissões', 'Teologia Reformada', 'Puritanos'],
  ARRAY['westminster', 'confissao', 'doutrina', 'puritanos', 'presbiterianismo', 'calvinismo', 'alianca'],
  '/texts/confissao-de-fe-de-westminster.md',
  false,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do original em inglês de 1646 (The Westminster Confession of Faith), conforme Philip Schaff, The Creeds of Christendom, vol. III. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
