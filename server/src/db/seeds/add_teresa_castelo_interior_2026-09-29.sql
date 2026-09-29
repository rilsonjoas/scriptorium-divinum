-- ============================================================
-- Nova entrada: Santa Teresa de Ávila - O Castelo Interior (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'teresa-de-avila',
  'Santa Teresa de Ávila',
  'Mística espanhola, reformadora do Carmelo e primeira mulher proclamada Doutora da Igreja (1515–1582), Santa Teresa de Jesus é uma das vozes mais sublimes da espiritualidade e da literatura de todos os tempos. Sua obra-prima "O Castelo Interior ou As Sete Moradas" (El Castillo Interior, 1577) descreve com incomparável genialidade psicológica e espiritual a jornada da alma rumo à íntima união com Deus, desde os primeiros passos da oração até a consumação do matrimônio espiritual e da habitação da Santíssima Trindade.',
  ARRAY['Mística Carmelitana', 'Século de Ouro Espanhol', 'Doutores da Igreja', 'Espiritualidade Cristã']
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
  'O Castelo Interior: As Sete Moradas',
  (SELECT id FROM authors WHERE slug = 'teresa-de-avila'),
  'Português',
  'Cume da mística ocidental e clássico absoluto da literatura do Século de Ouro espanhol. Santa Teresa retrata a alma como um castelo de diamante com sete moradas concêntricas: a entrada pela oração, o combate nas segundas moradas, a retidão nas terceiras, o recolhimento e a quietude nas quartas, a oração de união e a célebre metáfora da crisálida e da borboleta nas quintas, os desposórios nas sextas e a união trinitária e o matrimônio espiritual nas sétimas moradas.',
  'o-castelo-interior-teresa-de-avila',
  'El Castillo Interior o Las Moradas',
  '1577',
  2026,
  'inteligência artificial, a partir do original castelhano clássico',
  ARRAY['Espanhol'],
  ARRAY['Espiritualidade', 'Mística', 'Vida Cristã', 'História da Igreja'],
  ARRAY['teresa-de-avila', 'carmelo', 'castelo-interior', 'moradas', 'oracao', 'mistica', 'doutores-da-igreja', 'seculo-de-ouro'],
  '/texts/o-castelo-interior-teresa-de-avila.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do autógrafo de El Escorial e da edição crítica do Pe. Silverio de Santa Teresa (BAC). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
