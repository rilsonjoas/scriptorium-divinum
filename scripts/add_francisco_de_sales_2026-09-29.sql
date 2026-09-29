-- ============================================================
-- Nova entrada: São Francisco de Sales - Introdução à Vida Devota (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'francisco-de-sales',
  'São Francisco de Sales',
  'Bispo de Genebra e Doutor do Amor Divino (1567–1622), São Francisco de Sales foi um dos maiores mestres da direção espiritual e da teologia mística na era moderna. Fundador da Ordem da Visitação ao lado de Santa Joana de Chantal, sua obra imortal "Introdução à Vida Devota" (Filoteia, 1609) revolucionou a espiritualidade cristã ao demonstrar com doçura e realismo que a santidade é acessível e necessária a todas as pessoas no meio do mundo.',
  ARRAY['Espiritualidade Salesiana', 'Doutores da Igreja', 'Século XVII', 'Teologia Espiritual']
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
  'Introdução à Vida Devota (Filoteia)',
  (SELECT id FROM authors WHERE slug = 'francisco-de-sales'),
  'Português',
  'Clássico fundamental da espiritualidade cristã universal. Dirigido a Filoteia (a alma que ama a Deus), São Francisco de Sales ensina que a verdadeira devoção não destrói as vocações temporais, mas as embeleza e aperfeiçoa. Trata da oração mental cotidiana, da frequência aos sacramentos, da prática da mansidão nas relações diárias e da paz interior diante das tentações.',
  'introducao-a-vida-devota-francisco-de-sales',
  'Introduction à la vie dévote',
  '1609',
  2026,
  'inteligência artificial, a partir do original francês clássico',
  ARRAY['Francês'],
  ARRAY['Espiritualidade', 'Vida Cristã', 'Teologia Pastoral', 'História da Igreja'],
  ARRAY['francisco-de-sales', 'filoteia', 'vida-devota', 'oracao', 'mansidao', 'doutores-da-igreja', 'espiritualidade-salesiana'],
  '/texts/introducao-a-vida-devota-francisco-de-sales.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica definitiva da Ordem da Visitação de Annecy. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
