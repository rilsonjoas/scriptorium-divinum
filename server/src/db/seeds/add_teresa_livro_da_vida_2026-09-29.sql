-- ============================================================
-- Nova entrada: Santa Teresa de Ávila - Livro da Vida (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'teresa-de-jesus',
  'Santa Teresa de Ávila',
  'Doutora da Igreja, mística espanhola e reformadora da Ordem do Carmo Descalço (1515–1582 d.C.), mestra suprema da vida de oração e união interior com Deus.',
  ARRAY['Mística Carmelita', 'Espiritualidade Cristã', 'Vida Contemplativa']
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
  'Livro da Vida',
  (SELECT id FROM authors WHERE slug = 'teresa-de-jesus'),
  'Português',
  'A célebre autobiografia espiritual de Santa Teresa de Jesus, contendo a clássica alegoria dos quatro modos de regar o jardim da alma e o relato da transverberação mística.',
  'livro-da-vida-teresa-de-avila',
  'Libro de la Vida (Autobiografía)',
  '1565',
  2026,
  'inteligência artificial, a partir do autógrafo do Escorial (BAC)',
  ARRAY['Espanhol'],
  ARRAY['Mística Cristã', 'Autobiografia Espiritual', 'Oração Mental', 'Vida Carmelita'],
  ARRAY['teresa-de-avila', 'livro-da-vida', 'autobiografia', 'transverberacao', 'oracao'],
  '/texts/livro-da-vida-teresa-de-avila.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do manuscrito autógrafo do Escorial (BAC). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
