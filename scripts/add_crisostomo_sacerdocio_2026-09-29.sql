-- ============================================================
-- Nova entrada: São João Crisóstomo - Sobre o Sacerdócio (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'joao-crisostomo',
  'São João Crisóstomo',
  'Patriarca de Constantinopla e Doutor da Igreja (c. 347–407 d.C.), apelidado de "Crisóstomo" (Boca de Ouro) por sua incomparável eloquência homilética, foi a figura máxima da oratória e da teologia pastoral patrística grega. Seu tratado clássico "Sobre o Sacerdócio" (De Sacerdotio, c. 386 d.C.) é universalmente aclamado como o monumento supremo da espiritualidade sacerdotal e do cuidado pastoral na tradição cristã oriental e ocidental.',
  ARRAY['Patrística Grega', 'Igreja Antiga', 'Doutores da Igreja', 'Oratória Sacra']
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
  'Sobre o Sacerdócio',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Obra-prima inigualável da patrística grega sobre a dignidade, os perigos e os deveres do ministério pastoral. Escrita em diálogo com seu amigo Basílio, São João Crisóstomo retrata a celebração dos santos mistérios cercada pelas hostes angélicas, a arte da pregação sem vanglória e a cura compassiva das almas compradas pelo Sangue de Cristo.',
  'sobre-o-sacerdocio-joao-crisostomo',
  'De Sacerdotio (Περὶ Ἱερωσύνης)',
  '386',
  2026,
  'inteligência artificial, a partir do original grego clássico',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Teologia Pastoral', 'Espiritualidade', 'História da Igreja'],
  ARRAY['joao-crisostomo', 'boca-de-ouro', 'sacerdocio', 'pastoral', 'patristica', 'doutores-da-igreja', 'liturgia'],
  '/texts/sobre-o-sacerdocio-joao-crisostomo.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto grego crítico de Sources Chrétiennes (SC 272) e PG 48. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
