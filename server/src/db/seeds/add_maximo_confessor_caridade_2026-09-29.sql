-- ============================================================
-- Nova entrada: São Máximo o Confessor - Centúrias sobre a Caridade (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-maximo-o-confessor',
  'São Máximo, o Confessor',
  'Monge bizantino, teólogo e mártir da fé (c. 580–662 d.C.), uma das mentes mais brilhantes e profundas da tradição patrística oriental, autor das célebres Centúrias sobre a Caridade na Philokalia.',
  ARRAY['Patrística Bizantina', 'Philokalia', 'Mística Hesicasta', 'Cristologia']
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
  'Centúrias sobre a Caridade',
  (SELECT id FROM authors WHERE slug = 'sao-maximo-o-confessor'),
  'Português',
  'O clássico monumento espiritual da Philokalia grega em quatrocentas sentenças sobre o amor divino desinteressado, a despaixão (apatheia) e a contemplação de Deus.',
  'centurias-sobre-a-caridade-maximo-confessor',
  'Capita de Caritate (Κεφάλαια περὶ ἀγάπης)',
  '626',
  2026,
  'inteligência artificial, a partir de Sources Chrétiennes (SC 9)',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Philokalia', 'Mística Oriental', 'Amor Cristão'],
  ARRAY['maximo-confessor', 'caridade', 'philokalia', 'hesicasmo', 'patristica'],
  '/texts/centurias-sobre-a-caridade-maximo-confessor.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de Sources Chrétiennes (SC 9). Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
