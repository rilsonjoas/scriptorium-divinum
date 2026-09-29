-- ============================================================
-- Nova entrada: Santa Teresa de Ávila - Caminho de Perfeição (2026-09-29)
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
  bio_summary = EXCLUDED.bio_summary,
  name = EXCLUDED.name;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai, human_review_approved_at,
  license_type, attribution_text
)
VALUES (
  'Caminho de Perfeição',
  (SELECT id FROM authors WHERE slug = 'teresa-de-jesus'),
  'Português',
  'O guia prático e espiritual de Santa Teresa sobre a disciplina da oração mental, o desapego das vaidades terrenas, a virtude da humildade sincera e o recolhimento interior através do Pai-Nosso.',
  'caminho-de-perfeicao-teresa-de-avila',
  'Camino de Perfección',
  '1566',
  2026,
  'inteligência artificial, a partir do original crítico cotejado',
  ARRAY['Espanhol'],
  ARRAY['Mística Cristã', 'Oração Mental', 'Vida Monástica', 'Espiritualidade'],
  ARRAY['teresa-de-avila', 'caminho-de-perfeicao', 'carmelitas', 'oracao-mental', 'pai-nosso'],
  '/texts/caminho-de-perfeicao-teresa-de-avila.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do manuscrito do Escorial/BAC. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
