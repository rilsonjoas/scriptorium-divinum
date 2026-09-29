-- ============================================================
-- Nova entrada: Jeremy Taylor - Santo Morrer (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'jeremy-taylor',
  'Jeremy Taylor',
  'Bispo e célebre teólogo anglicano (1613–1667), apelidado de "o Shakespeare da Teologia" e "o Crisóstomo da Igreja da Inglaterra" por sua prosa lírica e profundidade devocional.',
  ARRAY['Tradição Anglicana', 'Espiritualidade Cristã', 'Teologia Pastoral']
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
  'Regras e Exercícios do Santo Morrer',
  (SELECT id FROM authors WHERE slug = 'jeremy-taylor'),
  'Português',
  'O clássico monumento devocional da literatura cristã inglesa sobre a brevidade da vida, a preparação serena para a enfermidade e a passagem esperançosa para a eternidade com Cristo.',
  'santo-morrer-jeremy-taylor',
  'The Rule and Exercises of Holy Dying',
  '1651',
  2026,
  'inteligência artificial, a partir da edição clássica de Heber/Eden',
  ARRAY['Inglês'],
  ARRAY['Tradição Anglicana', 'Espiritualidade', 'Teologia Pastoral', 'Morte e Eternidade'],
  ARRAY['jeremy-taylor', 'holy-dying', 'anglicanismo', 'eternidade', 'vida-crista'],
  '/texts/santo-morrer-jeremy-taylor.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica de Heber/Eden. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
