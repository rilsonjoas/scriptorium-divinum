-- ============================================================
-- Nova entrada: John Owen - A Glória de Cristo (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'john-owen',
  'John Owen',
  'Teólogo puritano, deão da Christ Church em Oxford (1616–1683), cognominado "o Calvino da Inglaterra", considerado a maior e mais profunda mente teológica do puritanismo britânico.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Teologia Pastoral', 'Cristologia']
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
  'A Glória de Cristo',
  (SELECT id FROM authors WHERE slug = 'john-owen'),
  'Português',
  'A obra-prima testamentária de John Owen, ditada em seu leito de morte, meditando sobre a contemplação pela fé da glória da Pessoa de Cristo, do Seu amor redentor e do Seu sacerdócio eterno.',
  'a-gloria-de-cristo-john-owen',
  'Meditations and Discourses on the Glory of Christ',
  '1684',
  2026,
  'inteligência artificial, a partir da edição clássica de William H. Goold',
  ARRAY['Inglês'],
  ARRAY['Tradição Puritana', 'Cristologia', 'Vida Interior', 'Contemplação Espiritual'],
  ARRAY['john-owen', 'gloria-de-cristo', 'puritanos', 'cristologia', 'fe-salvadora'],
  '/texts/a-gloria-de-cristo-john-owen.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica de William H. Goold (Banner of Truth). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
