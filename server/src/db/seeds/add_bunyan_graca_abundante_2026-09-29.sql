-- ============================================================
-- Nova entrada: John Bunyan - Graça Abundante ao Principal dos Pecadores (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'john-bunyan',
  'John Bunyan',
  'Pregador puritano inglês (1628–1688), imortal autor de O Peregrino e A Guerra Santa, preso por doze anos por pregar o Evangelho, cuja autobiografia Graça Abundante é um monumento da fé cristã.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Vida Cristã']
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
  'Graça Abundante ao Principal dos Pecadores',
  (SELECT id FROM authors WHERE slug = 'john-bunyan'),
  'Português',
  'A dramática e consoladora autobiografia espiritual de John Bunyan narrando sua juventude desregrada, o terrível combate contra o desespero e a vitória da superabundante graça redentora de Deus em Cristo.',
  'graca-abundante-john-bunyan',
  'Grace Abounding to the Chief of Sinners',
  '1666',
  2026,
  'inteligência artificial, a partir do original crítico cotejado',
  ARRAY['Inglês'],
  ARRAY['Puritanismo', 'Autobiografia Espiritual', 'Graça Divina', 'Conversão'],
  ARRAY['john-bunyan', 'graca-abundante', 'puritanos', 'conversao', 'autobiografia'],
  '/texts/graca-abundante-john-bunyan.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir das Obras Completas de George Offor. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
