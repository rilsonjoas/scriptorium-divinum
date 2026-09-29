-- ============================================================
-- Nova entrada: São Basílio Magno - Sobre o Espírito Santo (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'basilio-de-cesareia',
  'São Basílio Magno',
  'Arcebispo de Cesareia na Capadócia, Doutor da Igreja (c. 330–379 d.C.), um dos Três Grandes Capadócios, legislador do monasticismo oriental e autor de tratados fundamentais sobre o Espírito Santo.',
  ARRAY['Patrística', 'Padres Capadócios', 'Ortodoxia Nicena', 'Pneumatologia']
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
  'Tratado sobre o Espírito Santo',
  (SELECT id FROM authors WHERE slug = 'basilio-de-cesareia'),
  'Português',
  'O clássico tratado patrístico de São Basílio Magno sobre a consubstancialidade, divindade e glória coeterna do Espírito Santo com o Pai e o Filho na doxologia e nos sacramentos.',
  'sobre-o-espirito-santo-basilio-magno',
  'De Spiritu Sancto (Περὶ τοῦ Ἁγίου Πνεύματος)',
  '375',
  2026,
  'inteligência artificial, a partir de Sources Chrétiennes (SC 17bis)',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Pneumatologia', 'Trindade', 'Teologia Dogmática'],
  ARRAY['basilio-magno', 'espirito-santo', 'trindade', 'capadocios', 'patristica'],
  '/texts/sobre-o-espirito-santo-basilio-magno.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de Sources Chrétiennes (SC 17bis). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
