-- ============================================================
-- Nova entrada: Santa Catarina de Sena - O Diálogo (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'catarina-de-sena',
  'Santa Catarina de Sena',
  'Leiga dominicana da Ordem Terceira da Penitência, mística, reformadora e Doutora da Igreja (1347–1380 d.C.), natural de Sena. Figura monumental do cristianismo medieval, desempenhou papel profético decisivo no retorno do Papa de Avinhão para Roma. Sua obra-prima "O Diálogo da Divina Providência" (ditada em êxtase) é um dos cumes da teologia mística universal, célebre pela alegoria de Cristo como a Ponte viva entre o Céu e a Terra.',
  ARRAY['Dominicanos', 'Mística Cristã', 'Doutores da Igreja', 'Espiritualidade Medieval']
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
  'O Diálogo da Divina Providência',
  (SELECT id FROM authors WHERE slug = 'catarina-de-sena'),
  'Português',
  'A obra-prima mística de Santa Catarina de Sena, Doutora da Igreja. Ditada em colóquio ardente com o Pai Eterno, expõe o tratado do autoconhecimento na cela interior, a magistral alegoria de Jesus Cristo como a Ponte estendida sobre o abismo do mundo com os Seus três degraus sagrados, a teologia das lágrimas e a oração contínua da caridade pela salvação de todas as almas.',
  'o-dialogo-catarina-de-sena',
  'Il Dialogo della Divina Provvidenza',
  '1378',
  2026,
  'inteligência artificial, a partir do texto toscano clássico',
  ARRAY['Italiano'],
  ARRAY['Mística Cristã', 'Espiritualidade', 'Doutores da Igreja', 'Teologia Espiritual'],
  ARRAY['catarina-de-sena', 'o-dialogo', 'ponte-de-cristo', 'providencia-divina', 'dominicanos', 'mistica'],
  '/texts/o-dialogo-catarina-de-sena.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de G. Cavallini. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
