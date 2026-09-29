-- ============================================================
-- Nova entrada: São Cipriano - A Unidade da Igreja Católica (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'cipriano-de-cartago',
  'São Cipriano de Cartago',
  'Bispo de Cartago e mártir cristão do século III (c. 210–258 d.C.), Cipriano foi uma das maiores autoridades da teologia patrística latina ocidental. Renomado jurista e orador antes da sua conversão, guiou com admirável firmeza pastoral a Igreja do Norte da África durante as ferozes perseguições dos imperadores Décio e Valeriano. Seu tratado "A Unidade da Igreja Católica" (De Catholicae Ecclesiae Unitate, 251 d.C.) é a obra clássica fundamental sobre a comunhão episcopal, o repúdio aos cismas e a maternidade espiritual da Igreja.',
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
  'A Unidade da Igreja Católica',
  (SELECT id FROM authors WHERE slug = 'cipriano-de-cartago'),
  'Português',
  'Escrito em 251 d.C. em meio às contendas do cisma novaciano e à questão dos decaídos na perseguição de Décio, este é o primeiro tratado sistemático sobre a eclesiologia na tradição cristã ocidental. Ficou imortalizado pela célebre máxima "não pode ter a Deus por Pai quem não tem a Igreja por Mãe", pela analogia da túnica inconsútil de Cristo e pela vigorosa defesa da paz e da indivisibilidade do corpo de Cristo.',
  'a-unidade-da-igreja-catolica',
  'De Catholicae Ecclesiae Unitate',
  '251',
  2026,
  'inteligência artificial, a partir do original latino clássico',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Eclesiologia', 'História da Igreja'],
  ARRAY['cipriano', 'cartago', 'patristica', 'eclesiologia', 'unidade', 'igreja-catolica', 'martirio', 'paz'],
  '/texts/a-unidade-da-igreja-catolica.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto latino clássico da edição crítica do CSEL (ed. G. Hartel). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
