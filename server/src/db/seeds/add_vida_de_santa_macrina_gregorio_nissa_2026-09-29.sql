-- Seed para obra 'A Vida de Santa Macrina' de São Gregório de Nissa
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sao-gregorio-de-nissa',
  'São Gregório de Nissa',
  'Padre Capadócio, bispo de Nissa e Doutor da Igreja (c. 335–395 d.C.), expoente sublime da mística e teologia trinitária.',
  ARRAY['Igreja Primitiva', 'Padres Capadócios', 'Tradição Oriental']::text[]
)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    bio_summary = EXCLUDED.bio_summary,
    denomination_or_tradition = EXCLUDED.denomination_or_tradition,
    updated_at = NOW();

INSERT INTO books (
  title, author_id, language, description, slug,
  original_title, publication_year_original, publication_year_translation,
  translator, original_languages, categories, tags,
  online_read_path, featured, published, translation_is_ai,
  human_review_approved_at, license_type, attribution_text
)
SELECT
  'A Vida de Santa Macrina',
  a.id,
  'Português',
  'Biografia espiritual e afetuosa escrita por São Gregório de Nissa sobre sua irmã Santa Macrina, modelo sublime de sabedoria, ascese e amor divino.',
  'vida-de-santa-macrina-gregorio-nissa',
  'Vita Sanctae Macrinae',
  '380 d.C.',
  2026,
  'Scriptorium Divinum',
  ARRAY['Grego']::text[],
  ARRAY['Igreja Primitiva & Patrística', 'Tradição Oriental & Bizantina', 'Espiritualidade & Vida Interior', 'Amor Divino & Virtudes Cristãs']::text[],
  ARRAY['Hagiografia', 'Vida Monástica', 'Santidade', 'Capadócios', 'Oração']::text[],
  '/texts/vida-de-santa-macrina-gregorio-nissa.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'sao-gregorio-de-nissa'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
