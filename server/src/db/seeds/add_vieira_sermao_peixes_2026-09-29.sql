-- ============================================================
-- Nova entrada: Padre Antônio Vieira - Sermão aos Peixes (2026-09-29)
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
  'Sermão de Santo António aos Peixes',
  (SELECT id FROM authors WHERE slug = 'padre-antonio-vieira'),
  'Português',
  'A obra-prima satírica e moral da oratória sacra luso-brasileira, proferida no Maranhão (1654), denunciando com brilho genial a cobiça humana e a exploração dos pequenos pelos grandes.',
  'sermao-santo-antonio-peixes-vieira',
  'Sermam de Santo Antonio aos Peixes',
  '1654',
  1654,
  'texto original em língua portuguesa',
  ARRAY['Português'],
  ARRAY['Oratória Barroca', 'Literatura Lusófona', 'Teologia Moral', 'Clássicos'],
  ARRAY['vieira', 'sermao-aos-peixes', 'barroco', 'maranhao', 'jesuitas'],
  '/texts/sermao-santo-antonio-peixes-vieira.md',
  true,
  true,
  false,
  '2026-09-29T19:00:00Z',
  'public-domain',
  'Edição fidedigna do texto clássico de 1654 em domínio público. Scriptorium Divinum, 2026.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
