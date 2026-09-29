-- ============================================================
-- Nova entrada: São João da Cruz - Cântico Espiritual (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'joao-da-cruz',
  'São João da Cruz',
  'Místico, poeta, reformador da Ordem dos Carmelitas Descalços e Doutor da Igreja (1542–1591 d.C.). Considerado a maior voz poética e o ápice da teologia mística em língua castelhana, João da Cruz articulou com beleza insuperável as etapas da união da alma com Deus através das obras "Subida do Monte Carmelo", "Noite Escura da Alma", "Chama Viva de Amor" e o célebre "Cântico Espiritual".',
  ARRAY['Carmelitas', 'Mística Cristã', 'Doutores da Igreja', 'Poesia Sacra']
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
  'Cântico Espiritual',
  (SELECT id FROM authors WHERE slug = 'joao-da-cruz'),
  'Português',
  'A obra-prima poética e mística de São João da Cruz, inspirada no Cântico dos Cânticos. Retrata a apaixonada jornada da alma (Esposa) em busca de Cristo (o Esposo), desde a dor da ausência e a busca pelas criaturas até a contemplação no horto, o desposório na adega interior e a união consumada no matrimônio espiritual trinitário.',
  'cantico-espiritual-joao-da-cruz',
  'Cántico Espiritual',
  '1584',
  2026,
  'inteligência artificial, a partir do texto castelhano clássico',
  ARRAY['Espanhol'],
  ARRAY['Mística Cristã', 'Poesia Sacra', 'Espiritualidade', 'Doutores da Igreja'],
  ARRAY['joao-da-cruz', 'cantico-espiritual', 'carmelo', 'desposorio-espiritual', 'mistica', 'poesia'],
  '/texts/cantico-espiritual-joao-da-cruz.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do manuscrito de Sanlúcar e da edição clássica da BAC. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
