-- ============================================================
-- Nova entrada: Padre Manuel Bernardes - Luz e Calor (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'padre-manuel-bernardes',
  'Padre Manuel Bernardes',
  'Sacerdote do Oratório de São Filipe Néri em Lisboa (1644–1710), um dos mais sublimes escritores espirituais e mestres da pureza vernácula da língua portuguesa.',
  ARRAY['Espiritualidade Oratoriana', 'Mística Portuguesa', 'Literatura Clássica']
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
  'Luz e Calor para o Coração',
  (SELECT id FROM authors WHERE slug = 'padre-manuel-bernardes'),
  'Português',
  'O clássico devocional português do Padre Manuel Bernardes que instrui a alma na quietude interior, na oração afetuosa e no desapego das ilusões mundanas.',
  'luz-e-calor-manuel-bernardes',
  'Luz e Calor para o Coração, e Ânimo dos que Desejam Salvar-se',
  '1696',
  1696,
  'texto original em língua portuguesa',
  ARRAY['Português'],
  ARRAY['Espiritualidade Cristã', 'Vida Interior', 'Literatura Clássica', 'Devocional'],
  ARRAY['bernardes', 'luz-e-calor', 'oratorianos', 'espiritualidade', 'classicos-portugueses'],
  '/texts/luz-e-calor-manuel-bernardes.md',
  true,
  true,
  false,
  '2026-09-29T19:00:00Z',
  'public-domain',
  'Edição fidedigna do texto clássico de 1696 em domínio público. Scriptorium Divinum, 2026.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
