-- ============================================================
-- Nova entrada: São Bernardo de Claraval - Do Amor de Deus (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'bernardo-de-claraval',
  'São Bernardo de Claraval',
  'Abade cisterciense, místico e Doutor Melífluo da Igreja (1090–1153 d.C.), São Bernardo de Claraval foi a maior autoridade espiritual da Europa medieval no século XII. Grande reformador monástico, pregador eloquente e cantor da doçura da humanidade de Cristo e de Maria Santíssima, seu tratado "Do Amor de Deus" (De Diligendo Deo, c. 1130 d.C.) é uma das obras-primas mais luminosas da mística e da teologia afetiva ocidental.',
  ARRAY['Monástica Cisterciense', 'Mística Medieval', 'Doutores da Igreja', 'Teologia Afetiva']
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
  'Do Amor de Deus',
  (SELECT id FROM authors WHERE slug = 'bernardo-de-claraval'),
  'Português',
  'Tratado místico monumental onde São Bernardo formula o princípio áureo: "A causa de amar a Deus é o próprio Deus; a medida de O amar é amá-Lo sem medida". Expõe com incomparável elevação lírica e profundidade teológica a célebre escada dos Quatro Graus do Amor: o amor carnal por si mesmo, o amor de Deus pelos benefícios, o amor de Deus por Si mesmo e o amor supremo de si unicamente por amor a Deus.',
  'do-amor-de-deus-bernardo-de-claraval',
  'Liber de Diligendo Deo',
  '1130',
  2026,
  'inteligência artificial, a partir do original latino clássico',
  ARRAY['Latim'],
  ARRAY['Espiritualidade', 'Mística', 'Teologia Medieval', 'História da Igreja'],
  ARRAY['bernardo-de-claraval', 'cistercienses', 'amor-de-deus', 'mistica', 'quatro-graus-do-amor', 'doutores-da-igreja'],
  '/texts/do-amor-de-deus-bernardo-de-claraval.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de J. Leclercq e H. Rochais (S. Bernardi Opera) e PL 182. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
