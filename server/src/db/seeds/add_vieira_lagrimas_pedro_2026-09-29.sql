-- ============================================================
-- Nova entrada: Padre Antônio Vieira - Lágrimas de São Pedro (2026-09-29)
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
  'Sermão das Lágrimas de São Pedro',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'Um dos mais comoventes sermões de Vieira sobre o olhar perdoador de Jesus, a fraqueza humana e as lágrimas santas da contrição e do arrependimento bíblico.',
  'sermao-das-lagrimas-de-sao-pedro-vieira',
  'Sermam das Lagrimas de Sam Pedro',
  '1669',
  1669,
  'texto original em língua portuguesa',
  ARRAY['Português'],
  ARRAY['Oratória Barroca', 'Literatura Lusófona', 'Arrependimento e Perdão', 'Clássicos'],
  ARRAY['vieira', 'lagrimas-de-sao-pedro', 'arrependimento', 'barroco', 'oratoria'],
  '/texts/sermao-das-lagrimas-de-sao-pedro-vieira.md',
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
