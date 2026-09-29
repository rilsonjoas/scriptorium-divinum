-- ============================================================
-- Nova entrada: O Catecismo de Heidelberg (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, birth_year, death_year, bio_summary, denomination_or_tradition)
VALUES (
  'zacarias-ursino-e-caspar-oleviano',
  'Zacarias Ursino e Caspar Oleviano',
  1534,
  1587,
  'Teólogos reformados alemães que, a pedido do Eleitor Frederico III do Palatinato, redigiram em 1563 o Catecismo de Heidelberg. Ursino (discípulo de Melâncton) foi o principal redator teológico e Oleviano contribuiu na forma pastoral e na estrutura dos 52 Dias do Senhor.',
  ARRAY['Reforma Protestante', 'Teologia Reformada']
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
  'O Catecismo de Heidelberg',
  (SELECT id FROM authors WHERE slug = 'zacarias-ursino-e-caspar-oleviano'),
  'Português',
  'Composto em 1563 na Alemanha, o Catecismo de Heidelberg é célebre por sua profunda piedade e tom consolador ("Qual é o teu único consolo na vida e na morte?"). Estruturado nas três partes clássicas — Miséria, Redenção e Gratidão —, é uma das Três Formas de Unidade da fé reformada continental. Tradução nova a partir dos textos em alemão e latim de 1563.',
  'catecismo-de-heidelberg',
  'Heidelberger Katechismus',
  '1563',
  2026,
  'inteligência artificial, a partir do alemão e latim originais de 1563',
  ARRAY['Alemão', 'Latim'],
  ARRAY['Credos e Confissões', 'Teologia Reformada'],
  ARRAY['heidelberg', 'consolo', 'catecismo', 'doutrina', 'reforma'],
  '/texts/catecismo-de-heidelberg.md',
  false,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do original em alemão e latim de 1563, conforme Philip Schaff, The Creeds of Christendom, vol. III. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
