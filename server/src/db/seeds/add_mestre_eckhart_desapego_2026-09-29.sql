-- ============================================================
-- Nova entrada: Mestre Eckhart - Tratado do Desapego (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'mestre-eckhart',
  'Mestre Eckhart',
  'Teólogo dominicano, filósofo e místico renano (c. 1260–1328 d.C.), mestre na Universidade de Paris e uma das vozes mais originais e profundas da mística especulativa cristã medieval.',
  ARRAY['Mística Renana', 'Escolástica Dominicana', 'Filosofia Cristã']
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
  'Tratado do Desapego e do Homem Nobre',
  (SELECT id FROM authors WHERE slug = 'mestre-eckhart'),
  'Português',
  'O clássico monumento da mística renana sobre o desapego radical (Abgescheidenheit), o nascimento interior do Verbo na alma e a união beatífica com a Essência Divina.',
  'tratados-do-desapego-mestre-eckhart',
  'Von Abgescheidenheit und vom edeln Menschen',
  '1315',
  2026,
  'inteligência artificial, a partir da edição crítica de Josef Quint',
  ARRAY['Alemão'],
  ARRAY['Mística Medieval', 'Mística Renana', 'Filosofia Cristã', 'Espiritualidade'],
  ARRAY['mestre-eckhart', 'desapego', 'mistica-renana', 'contemplacao', 'dominicanos'],
  '/texts/tratados-do-desapego-mestre-eckhart.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de Josef Quint (Kohlhammer). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
