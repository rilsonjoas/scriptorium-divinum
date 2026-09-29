-- ============================================================
-- Nova entrada: Padre Antônio Vieira - 1ª Dominga da Quaresma (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'padre-antonio-vieira',
  'Padre Antônio Vieira',
  'Jesuíta, diplomata, pregador e um dos maiores mestres da prosa literária da língua portuguesa de todos os tempos (1608–1697), cognominado "o Imperador da Língua Portuguesa" por Fernando Pessoa.',
  ARRAY['Barroco Luso-Brasileiro', 'Tradição Jesuíta', 'Oratória Sacra']
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
  'Sermão da Primeira Dominga da Quaresma',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Monumental sermão barroco de Vieira sobre as tentações de Jesus no deserto, o combate espiritual e a primazia da Palavra de Deus contra as ilusões do mundo.',
  'sermao-primeira-dominga-quaresma-vieira',
  'Sermam da Primeira Dominga da Quaresma',
  '1670',
  1670,
  'texto original em língua portuguesa',
  ARRAY['Português'],
  ARRAY['Oratória Barroca', 'Literatura Lusófona', 'Quaresma e Penitência', 'Clássicos'],
  ARRAY['vieira', 'quaresma', 'tentacoes', 'barroco', 'oratoria'],
  '/texts/sermao-primeira-dominga-quaresma-vieira.md',
  true,
  true,
  false,
  '2026-09-29T19:00:00Z',
  'public-domain',
  'Edição fidedigna do texto clássico seiscentista em domínio público. Scriptorium Divinum, 2026.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
