-- ============================================================
-- Nova entrada: São Vicente de Lérins - Commonitorium (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'vicente-de-lerins',
  'São Vicente de Lérins',
  'Presbítero e monge no célebre Mosteiro de Lérins na Gália (c. 400–450 d.C.), São Vicente de Lérins é um dos mais influentes teólogos patrísticos da eclesiologia e do discernimento dogmático. Seu tratado "Commonitorium" (c. 434 d.C.) imortalizou o cânon áureo da catolicidade e da tradição cristã ("Quod ubique, quod semper, quod ab omnibus creditum est" — Aquilo que foi crido em todo lugar, sempre e por todos) e formulou a analogia clássica do desenvolvimento orgânico e homogêneo do dogma cristão.',
  ARRAY['Patrística Latina', 'Monástica', 'Igreja Antiga', 'Teologia Dogmática']
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
  'Commonitorium: A Regra da Fé Apostólica',
  (SELECT id FROM authors WHERE slug = 'vicente-de-lerins'),
  'Português',
  'Tratado patrístico clássico do século V sobre a preservação da fé apostólica e o discernimento contra as novidades heréticas. Contém a célebre regra da universalidade, antiguidade e consenso ("Quod ubique, quod semper, quod ab omnibus"), a distinção fundamental entre o crescimento orgânico do dogma e a alteração da fé, e o comentário lapidar à exortação paulina "Ó Timóteo, guarda o depósito!".',
  'commonitorium-vicente-de-lerins',
  'Commonitorium adversus Haereses',
  '434',
  2026,
  'inteligência artificial, a partir do original latino clássico',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Teologia Dogmática', 'Eclesiologia', 'História da Igreja'],
  ARRAY['vicente-de-lerins', 'commonitorium', 'patristica', 'tradicao', 'dogma', 'regra-da-fe', 'ortodoxia', 'deposito-da-fe'],
  '/texts/commonitorium-vicente-de-lerins.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto latino clássico de Florilegium Patristicum (ed. B. Rauschen) e PL 50. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
