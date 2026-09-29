-- ============================================================
-- Nova entrada: Santo Agostinho - A Trindade (De Trinitate) (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'agostinho-de-hipona',
  'Santo Agostinho de Hipona',
  'Bispo de Hipona e Doutor da Graça (354–430 d.C.), Santo Agostinho é a figura máxima da patrística latina. Sua monumental obra "A Trindade" (De Trinitate, 399–419 d.C.), composta ao longo de duas décadas em quinze livros, é o mais profundo e influente tratado dogmático e psicológico sobre o mistério da Santíssima Trindade em toda a tradição teológica ocidental.',
  ARRAY['Patrística Latina', 'Doutores da Igreja', 'Teologia Trinitária', 'Metafísica Cristã']
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
  'A Trindade (De Trinitate)',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Monumento supremo da teologia patrística ocidental sobre o mistério do Deus Uno e Trino. Santo Agostinho expõe a plena consubstancialidade e unidade de operação das três Pessoas divinas (Pai, Filho e Espírito Santo), desenvolve as célebres analogias psicológicas da alma humana (Memória, Inteligência e Vontade) e conclui com a sublime oração contemplativa à Trindade Santa.',
  'a-trindade-santo-agostinho',
  'De Trinitate Libri Quindecim',
  '419',
  2026,
  'inteligência artificial, a partir do original latino clássico',
  ARRAY['Latim'],
  ARRAY['Teologia Sistemática', 'Patrística', 'Trindade', 'História da Igreja'],
  ARRAY['agostinho', 'de-trinitate', 'trindade', 'patristica', 'doutores-da-igreja', 'teologia-dogmatica', 'memoria-inteligencia-vontade'],
  '/texts/a-trindade-santo-agostinho.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica do CCSL (vols. 50 e 50A) e PL 42. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
