-- ============================================================
-- Nova entrada: Santo Agostinho - Sobre o Mestre (De Magistro) (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'agostinho-de-hipona',
  'Santo Agostinho de Hipona',
  'Bispo de Hipona e Doutor da Graça (354–430 d.C.), Santo Agostinho é a figura máxima da patrística latina. Seu célebre diálogo filosófico "Sobre o Mestre" (De Magistro, c. 389 d.C.), travado com seu jovem filho Adeodato, é o tratado fundacional da epistemologia cristã e da teoria dos sinais, imortalizando a doutrina de Cristo como o único "Mestre Interior" (Magister Interior) que ilumina a mente com a Verdade.',
  ARRAY['Patrística Latina', 'Doutores da Igreja', 'Filosofia da Educação', 'Epistemologia']
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
  'Sobre o Mestre (De Magistro)',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'Diálogo filosófico magistral de Santo Agostinho com seu filho Adeodato sobre a linguagem, os sinais e o conhecimento. Demonstra que as palavras humanas exteriores apenas advertem a mente, enquanto a verdadeira iluminação e o conhecimento da verdade procedem unicamente de Cristo, o Mestre Interior que habita no íntimo do coração.',
  'sobre-o-mestre-agostinho',
  'De Magistro Liber Unus',
  '389',
  2026,
  'inteligência artificial, a partir do original latino clássico',
  ARRAY['Latim'],
  ARRAY['Filosofia e Ética', 'Patrística', 'Educação Cristã', 'História da Igreja'],
  ARRAY['agostinho', 'de-magistro', 'mestre-interior', 'filosofia-da-educacao', 'patristica', 'epistemologia', 'doutores-da-igreja'],
  '/texts/sobre-o-mestre-agostinho.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto crítico do CCSL (vol. 29) e PL 32. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
