-- ============================================================
-- Nova entrada: São João da Cruz - Noite Escura da Alma (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'joao-da-cruz',
  'São João da Cruz',
  'Religioso carmelita descalço, poeta lírico sublime e Doutor Místico da Igreja (1542–1591), São João da Cruz é a autoridade máxima universal no discernimento dos caminhos da oração contemplativa e da união mística com Deus. Companheiro de Santa Teresa de Ávila na reforma carmelitana, suas obras monumentais — "Subida do Monte Carmelo", "Noite Escura da Alma", "Cântico Espiritual" e "Chama Viva de Amor" — estabeleceram a teologia definitiva sobre a purificação dos sentidos e do espírito.',
  ARRAY['Mística Carmelitana', 'Século de Ouro Espanhol', 'Doutores da Igreja', 'Teologia Mística']
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
  'Noite Escura da Alma',
  (SELECT id FROM authors WHERE slug = 'joao-da-cruz'),
  'Português',
  'Monumento supremo da teologia mística e da espiritualidade universal, a "Noite Escura da Alma" explica como Deus conduz as almas principiantes e adiantadas da meditação sensível à sublime contemplação infusa. Desenvolve a célebre distinção entre a noite passiva dos sentidos e a noite profunda do espírito, a analogia do fogo que purifica o madeiro antes de transformá-lo em brasa viva, e os dez degraus da escada secreta do amor divino.',
  'noite-escura-da-alma-joao-da-cruz',
  'Noche Oscura del Alma',
  '1578',
  2026,
  'inteligência artificial, a partir do original castelhano clássico',
  ARRAY['Espanhol'],
  ARRAY['Espiritualidade', 'Mística', 'Teologia Espiritual', 'História da Igreja'],
  ARRAY['joao-da-cruz', 'carmelo', 'noite-escura', 'contemplacao', 'mistica', 'doutores-da-igreja', 'seculo-de-ouro', 'oracao'],
  '/texts/noite-escura-da-alma-joao-da-cruz.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir das edições críticas do Pe. Silverio de Santa Teresa e Lucinio del Santísimo Sacramento (BAC). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
