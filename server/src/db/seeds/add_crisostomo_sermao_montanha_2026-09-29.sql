-- ============================================================
-- Nova entrada: São João Crisóstomo - Sermão da Montanha (2026-09-29)
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
  bio_summary = EXCLUDED.bio_summary;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai, human_review_approved_at,
  license_type, attribution_text
)
VALUES (
  'Homilias sobre o Sermão da Montanha',
  (SELECT id FROM authors WHERE slug = 'joao-crisostomo'),
  'Português',
  'A célebre e viva exposição exegética e ética de Crisóstomo sobre as Bem-Aventuranças, o Sal da Terra, a Luz do Mundo e os mandamentos da perfeição cristã no Evangelho de Mateus.',
  'homilias-sermao-da-montanha-crisostomo',
  'In Matthaeum Homiliae XV–XIX (Περὶ τῆς ἐν τῷ ὄρει ὁμιλίας)',
  '390',
  2026,
  'inteligência artificial, a partir da Patrologia Graeca (PG 57/58)',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Comentário Bíblico', 'Ética Cristã', 'Vida Cristã'],
  ARRAY['joao-crisostomo', 'sermao-da-montanha', 'bem-aventurados', 'exegese', 'patristica'],
  '/texts/homilias-sermao-da-montanha-crisostomo.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da Patrologia Graeca (PG 57/58). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
