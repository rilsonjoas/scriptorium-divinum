-- ============================================================
-- Nova entrada: Thomas Goodwin - O Coração de Cristo no Céu (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'thomas-goodwin',
  'Thomas Goodwin',
  'Teólogo puritano de Oxford e presidente do Magdalen College (1600–1680), célebre pregador da Assembleia de Westminster e mestre do consolo evangélico e da cristologia afetuosa.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Cristologia Pastoral', 'Teologia Afetuosa']
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
  'O Coração de Cristo no Céu',
  (SELECT id FROM authors WHERE slug = 'thomas-goodwin'),
  'Português',
  'A monumental e consoladora obra puritana de Thomas Goodwin demonstrando a compaixão contínua, a ternura inalterada e a intercessão afetuosa de Cristo glorificado para com os crentes na terra.',
  'o-coracao-de-cristo-thomas-goodwin',
  'The Heart of Christ in Heaven Towards Sinners on Earth',
  '1651',
  2026,
  'inteligência artificial, a partir da edição puritana de Londres (1651)',
  ARRAY['Inglês'],
  ARRAY['Tradição Puritana', 'Cristologia', 'Teologia Pastoral', 'Conforto Espiritual'],
  ARRAY['thomas-goodwin', 'coracao-de-cristo', 'sumo-sacerdote', 'puritanos', 'compaixao'],
  '/texts/o-coracao-de-cristo-thomas-goodwin.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica puritana (Banner of Truth). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
