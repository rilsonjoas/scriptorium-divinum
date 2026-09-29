-- ============================================================
-- Nova entrada: São Francisco de Sales - Tratado do Amor de Deus (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'francisco-de-sales',
  'São Francisco de Sales',
  'Bispo de Genebra e Doutor do Amor Divino (1567–1622), mestre da doçura e da direção espiritual clássica, autor da Introdução à Vida Devota e do Tratado do Amor de Deus.',
  ARRAY['Espiritualidade Salesiana', 'Mística Católica', 'Teologia Pastoral']
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
  'Tratado do Amor de Deus',
  (SELECT id FROM authors WHERE slug = 'francisco-de-sales'),
  'Português',
  'A obra-prima teológica e mística de São Francisco de Sales dissecando a gênese, o progresso e a perfeição da santa caridade na alma humana e o santo abandono à Providência.',
  'tratado-do-amor-de-deus-francisco-de-sales',
  'Traité de l''Amour de Dieu',
  '1616',
  2026,
  'inteligência artificial, a partir da Édition d''Annecy (1894)',
  ARRAY['Francês'],
  ARRAY['Mística Cristã', 'Teologia Espiritual', 'Amor Divino', 'Clássicos'],
  ARRAY['francisco-de-sales', 'amor-de-deus', 'caridade', 'providencia', 'vida-devota'],
  '/texts/tratado-do-amor-de-deus-francisco-de-sales.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da Édition d''Annecy em domínio público. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
