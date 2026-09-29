-- ============================================================
-- Nova entrada: São João da Cruz - Subida do Monte Carmelo (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-joao-da-cruz',
  'São João da Cruz',
  'Doutor Místico da Igreja, sacerdote e reformador carmelita descalço (1542–1591 d.C.), um dos maiores poetas líricos da língua castelhana e expoente máximo da mística apofática ocidental.',
  ARRAY['Mística Carmelita', 'Mística Cristã', 'Poesia Sacra', 'Espiritualidade']
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
  'Subida do Monte Carmelo',
  (SELECT id FROM authors WHERE slug = 'sao-joao-da-cruz'),
  'Português',
  'A obra-prima do Doutor Místico sobre a purificação ativa dos sentidos e do espírito, a renúncia dos apetites desordenados e a subida segura pela fé até a união transformadora com Deus.',
  'subida-do-monte-carmelo-joao-da-cruz',
  'Subida del Monte Carmelo',
  '1579',
  2026,
  'inteligência artificial, a partir da edição crítica da BAC',
  ARRAY['Espanhol'],
  ARRAY['Mística Carmelita', 'Espiritualidade', 'Vida Interior', 'Purificação'],
  ARRAY['joao-da-cruz', 'subida-monte-carmelo', 'carmelo', 'noite-escura', 'fe-pura'],
  '/texts/subida-do-monte-carmelo-joao-da-cruz.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da Biblioteca de Autores Cristianos (BAC). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
