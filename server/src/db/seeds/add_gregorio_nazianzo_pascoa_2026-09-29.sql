-- ============================================================
-- Nova entrada: São Gregório de Nazianzo - Discurso sobre a Páscoa (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-gregorio-de-nazianzo',
  'São Gregório de Nazianzo',
  'Arcebispo de Constantinopla, Doutor da Igreja e cognominado "o Teólogo" (c. 329–390 d.C.), mestre insuperável da oratória e hinódia grega patrística.',
  ARRAY['Patrística', 'Padres Capadócios', 'Ortodoxia Nicena', 'Oratória Sacra']
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
  'Discurso sobre a Páscoa',
  (SELECT id FROM authors WHERE slug = 'sao-gregorio-de-nazianzo'),
  'Português',
  'O lírico e triunfal discurso pascal de São Gregório de Nazianzo que definiu a hinódia litúrgica oriental da Ressurreição e da vitória de Cristo sobre a morte.',
  'discurso-sobre-a-pascoa-gregorio-nazianzo',
  'Oratio XLV: In Sanctum Pascha (Εἰς τὸ Ἅγιον Πάσχα)',
  '383',
  2026,
  'inteligência artificial, a partir de Sources Chrétiennes (SC 358)',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Liturgia Pascal', 'Cristologia', 'Oratória Sacra'],
  ARRAY['gregorio-nazianzo', 'pascoa', 'ressurreicao', 'capadocios', 'patristica'],
  '/texts/discurso-sobre-a-pascoa-gregorio-nazianzo.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de Sources Chrétiennes (SC 358). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
