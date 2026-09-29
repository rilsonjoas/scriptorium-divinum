-- ============================================================
-- Nova entrada: São Gregório de Nazianzo - Discursos Teológicos (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'gregorio-de-nazianzo',
  'São Gregório de Nazianzo',
  'Arcebispo de Constantinopla, teólogo, poeta e Doutor da Igreja (c. 329–390 d.C.), cognominado por excelência "o Teólogo" no Oriente cristão. Juntamente com São Basílio Magno e São Gregório de Nissa, compôs o triunvirato dos Padres Capadócios, responsáveis pela vitória definitiva da ortodoxia niceno-constantinopolitana sobre o arianismo e o macedonianismo. Seus "Cinco Discursos Teológicos" constituem a mais sublime exposição da teologia da Trindade e da divindade do Espírito Santo na antiguidade.',
  ARRAY['Patrística Grega', 'Padres Capadócios', 'Doutores da Igreja', 'Teologia Trinitária']
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
  'Os Cinco Discursos Teológicos',
  (SELECT id FROM authors WHERE slug = 'gregorio-de-nazianzo'),
  'Português',
  'O monumento clássico supremo da teologia trinitária da patrística grega, pronunciado em Constantinopla no ano de 380 d.C. São Gregório de Nazianzo expõe quem tem o direito de fazer teologia, refuta os sofismas heréticos, demonstra a geração eterna e consubstancialidade do Filho (homoousios) e proclama com clareza incomparável a plena Divindade do Espírito Santo na unidade inefável da Trindade Santíssima.',
  'discursos-teologicos-gregorio-de-nazianzo',
  'Λόγοι θεολογικοί (Orationes Theologicae 27–31)',
  '380',
  2026,
  'inteligência artificial, a partir do original grego clássico',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Teologia Trinitária', 'Pneumatologia', 'Cristologia', 'Doutores da Igreja'],
  ARRAY['gregorio-de-nazianzo', 'o-teologo', 'discursos-teologicos', 'trindade', 'espirito-santo', 'capadocios'],
  '/texts/discursos-teologicos-gregorio-de-nazianzo.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de Paul Gallay e Sources Chrétiennes (SC 250). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
