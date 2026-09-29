-- ============================================================
-- Nova entrada: Padre Antônio Vieira - Sermão da Sexagésima (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'antonio-vieira',
  'Padre Antônio Vieira',
  'Sacerdote jesuíta, missionário no Brasil, diplomata e orador sacro (1608–1697), o Padre Antônio Vieira é universalmente considerado o maior mestre da prosa clássica da língua portuguesa e o "Príncipe da Oratória". Suas obras — especialmente os célebres "Sermões" — combinam uma agudeza teológica monumental, domínio incomparável da retórica e uma ardorosa defesa dos povos indígenas e oprimidos.',
  ARRAY['Oratória Barroca', 'Companhia de Jesus', 'Literatura em Língua Portuguesa', 'Tradição Clássica']
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
  'Sermão da Sexagésima',
  (SELECT id FROM authors WHERE slug = 'antonio-vieira'),
  'Português',
  'Monumento supremo da oratória sacra e da literatura em língua portuguesa, pregado em Lisboa na Capela Real em 1655. Sobre a parábola do semeador (Lc 8.5), Vieira estabelece a sua célebre "Arte de Pregar a Palavra de Deus", censurando com brilhantismo o cultismo vazio dos oradores barrocos e defendendo que a verdadeira pregação evangélica deve unir a força da doutrina ao exemplo incontestável da vida.',
  'sermao-da-sexagesima-antonio-vieira',
  'Sermão da Sexagésima',
  '1655',
  2026,
  NULL,
  ARRAY['Português'],
  ARRAY['Sermões', 'Oratória Sacra', 'Literatura Clássica', 'História da Igreja'],
  ARRAY['antonio-vieira', 'jesuitas', 'sermao-da-sexagesima', 'oratoria', 'lingua-portuguesa', 'barroco', 'semeador'],
  '/texts/sermao-da-sexagesima-antonio-vieira.md',
  true,
  true,
  false,
  NOW(),
  'public-domain',
  'Obra em domínio público histórico. Fixação crítica baseada na edição clássica dos Sermões do Padre Antônio Vieira.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
