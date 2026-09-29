-- ============================================================
-- Nova entrada: Jeremy Taylor - Regras e Exercícios do Santo Viver (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'jeremy-taylor',
  'Jeremy Taylor',
  'Bispo e célebre teólogo da Igreja da Inglaterra (1613–1667), apelidado de "o Shakespeare da Teologia" e "o Crisóstomo Inglês" por sua prosa poética e profundidade devocional insuperáveis.',
  ARRAY['Tradição Anglicana', 'Espiritualidade Cristã', 'Teologia Moral', 'Teologia Pastoral']
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
  'Regras e Exercícios do Santo Viver',
  (SELECT id FROM authors WHERE slug = 'jeremy-taylor'),
  'Português',
  'O mais influente clássico devocional anglicano sobre a santificação prudente do tempo, a prática da presença contínua de Deus e o exercício da pureza de intenção em todos os atos da vida cotidiana.',
  'santo-viver-jeremy-taylor',
  'The Rule and Exercises of Holy Living',
  '1650',
  2026,
  'inteligência artificial, a partir do original crítico cotejado',
  ARRAY['Inglês'],
  ARRAY['Tradição Anglicana', 'Vida Cristã', 'Devocional Clássico', 'Santificação'],
  ARRAY['jeremy-taylor', 'holy-living', 'anglicanismo', 'santificacao-do-tempo', 'vida-crista'],
  '/texts/santo-viver-jeremy-taylor.md',
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
