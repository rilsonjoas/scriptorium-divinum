-- ============================================================
-- Nova entrada: São Cipriano - Sobre a Oração Dominical (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'cipriano-de-cartago',
  'São Cipriano de Cartago',
  'Bispo de Cartago e mártir cristão do século III (c. 210–258 d.C.), Cipriano foi uma das maiores autoridades da teologia patrística latina ocidental. Renomado jurista e orador antes da sua conversão, guiou com admirável firmeza pastoral a Igreja do Norte da África durante as ferozes perseguições dos imperadores Décio e Valeriano. Seu tratado sobre a Oração Dominical (De Dominica Oratione, c. 252 d.C.) é uma das obras mais profundas da espiritualidade antiga sobre o Pai Nosso e a postura orante do cristão.',
  ARRAY['Patrística Latina', 'Igreja Antiga', 'Mártires']
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
  'Sobre a Oração Dominical',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Tratado fundamental do século III em que São Cipriano expõe petição por petição a Oração do Senhor (o Pai Nosso), instruindo a comunidade cristã na disciplina da oração silenciosa, na modéstia interior, na fraternidade e no perdão mútuo. Conhecido pela célebre máxima "Deus não é ouvinte da voz, mas do coração", o texto é uma das mais ricas joias da espiritualidade e da teologia patrística ocidental.',
  'sobre-a-oracao-dominical',
  'De Dominica Oratione',
  '252',
  2026,
  'inteligência artificial, a partir do original latino clássico',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Espiritualidade', 'Teologia Bíblica'],
  ARRAY['cipriano', 'cartago', 'oracao', 'pai-nosso', 'patristica', 'espiritualidade', 'liturgia', 'igreja-antiga'],
  '/texts/sobre-a-oracao-dominical.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto latino clássico do CSEL (ed. G. Hartel) e Patrologia Latina (PL 4). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
