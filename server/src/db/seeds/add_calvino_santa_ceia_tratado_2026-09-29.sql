-- ============================================================
-- Nova entrada: João Calvino - Pequeno Tratado da Santa Ceia (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'joao-calvino',
  'João Calvino',
  'Teólogo e reformador franco-genebrino (1509–1564), autor das Institutas da Religião Cristã e de tratados magistrais sobre a espiritualidade sacramental e o culto divino.',
  ARRAY['Reforma Protestante', 'Tradição Reformada', 'Teologia Sacramental']
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
  'Pequeno Tratado sobre a Santa Ceia',
  (SELECT id FROM authors WHERE slug = 'joao-calvino'),
  'Português',
  'O clássico tratado conciliador e pastoral de João Calvino (1541) expondo a presença espiritual real de Cristo, a nutrição da alma pela fé e a superação das disputas sacramentais da Reforma.',
  'tratado-sobre-a-santa-ceia-calvino',
  'Petit Traicté de la Saincte Cene',
  '1541',
  2026,
  'inteligência artificial, a partir do Corpus Reformatorum (CR 33)',
  ARRAY['Francês'],
  ARRAY['Reforma Protestante', 'Teologia Sacramental', 'Eucaristia', 'Tradição Reformada'],
  ARRAY['calvino', 'santa-ceia', 'sacramentos', 'comunhao', 'reforma'],
  '/texts/tratado-sobre-a-santa-ceia-calvino.md',
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
