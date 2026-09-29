-- ============================================================
-- Nova entrada: Frei Luís de Granada - Guia de Pecadores (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'frei-luis-de-granada',
  'Frei Luís de Granada',
  'Frade dominicano, teólogo e célebre escritor espiritual espanhol (1504–1588), autor de Guia de Pecadores, uma das obras devocionais mais lidas e traduzidas de toda a Europa renascentista.',
  ARRAY['Espiritualidade Dominicana', 'Mística Espanhola', 'Teologia Pastoral']
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
  'Guia de Pecadores',
  (SELECT id FROM authors WHERE slug = 'frei-luis-de-granada'),
  'Português',
  'O clássico devocional ibérico do século XVI demonstrando os motivos de amor e dever que obrigam o homem a servir a Deus e os admiráveis privilégios da virtude cristã.',
  'guia-de-pecadores-luis-de-granada',
  'Libro de la Guía de Pecadores',
  '1556',
  2026,
  'inteligência artificial, a partir da edição crítica da BAC',
  ARRAY['Espanhol'],
  ARRAY['Espiritualidade', 'Vida Devocional', 'Teologia Moral', 'Clássicos'],
  ARRAY['luis-de-granada', 'guia-de-pecadores', 'dominicanos', 'vida-crista', 'virtude'],
  '/texts/guia-de-pecadores-luis-de-granada.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
