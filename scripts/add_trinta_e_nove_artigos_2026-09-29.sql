-- ============================================================
-- Nova entrada: Os Trinta e Nove Artigos da Religião (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'igreja-da-inglaterra',
  'Igreja da Inglaterra',
  'A Igreja da Inglaterra (Church of England) consolidou a sua identidade teológica e litúrgica durante a Reforma Inglesa do século XVI, sob a liderança de teólogos como Thomas Cranmer, Nicholas Ridley e os bispos do período elisabetano. Os Trinta e Nove Artigos da Religião (1571) constituem o documento confessional histórico fundamental do Anglicanismo histórico e da tradição reformada inglesa, articulando a doutrina trinitária, a autoridade bíblica, a justificação pela fé e a eclesiologia sacramental.',
  ARRAY['Anglicanismo', 'Reforma Protestante', 'Confessionalismo']
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
  'Os Trinta e Nove Artigos da Religião',
  (SELECT id FROM authors WHERE slug = 'igreja-da-inglaterra'),
  'Português',
  'Definição doutrinária histórica e confessional da Igreja da Inglaterra, promulgada pela Convocação de 1562 e ratificada em 1571 sob o reinado de Elizabeth I. Articula em 39 artigos lapidares os fundamentos da fé cristã trinitária, a autoridade suprema das Sagradas Escrituras, a justificação pela fé somente, a teologia dos sacramentos e as relações entre a Igreja e o Estado.',
  'trinta-e-nove-artigos-da-religiao',
  'The Thirty-Nine Articles of Religion',
  '1571',
  2026,
  'inteligência artificial, a partir do original latino e inglês',
  ARRAY['Inglês', 'Latim'],
  ARRAY['Credos e Confissões', 'Teologia Sistemática', 'História da Igreja'],
  ARRAY['anglicanismo', 'trinta-e-nove-artigos', 'confissao-de-fe', 'reforma-inglesa', 'cranmer', 'teologia', 'sacramentos'],
  '/texts/trinta-e-nove-artigos-da-religiao.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir das edições canônicas latinas e inglesas de 1571 (Philip Schaff, The Creeds of Christendom). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
