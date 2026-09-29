-- ============================================================
-- Nova entrada: São João Crisóstomo - Tratado sobre a Oração (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'joao-crisostomo',
  'São João Crisóstomo',
  'Arcebispo de Constantinopla, Doutor da Igreja e um dos quatro grandes Padres do Oriente (c. 347–407 d.C.), cognominado Crisóstomo ("Boca de Ouro") por sua incomparável pregação evangélica e exegese bíblica límpida.',
  ARRAY['Patrística', 'Ortodoxia Oriental', 'Igreja Antiga', 'Teologia Pastoral']
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
  'Tratado sobre a Oração',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'Um dos mais calorosos e célebres tratados patrísticos sobre o poder infinito, a necessidade contínua e as santas disposições da oração sincera da alma diante de Deus.',
  'tratado-sobre-a-oracao-crisostomo',
  'De Precatione Orationes (Περὶ προσευχῆς)',
  '390',
  2026,
  'inteligência artificial, a partir do original crítico cotejado',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Espiritualidade', 'Vida Cristã', 'Oração'],
  ARRAY['joao-crisostomo', 'oracao', 'patristica', 'devocao', 'padres-gregos'],
  '/texts/tratado-sobre-a-oracao-crisostomo.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da Patrologia Graeca (PG 50). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
