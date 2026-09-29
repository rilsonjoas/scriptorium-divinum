-- Seed para obra 'Da Maneira de Orar e Meditar' de Hugo de São Vítor
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'hugo-de-sao-vitor',
  'Hugo de São Vítor',
  'Mestre da célebre Abadia de São Vítor em Paris (c. 1096–1141), teólogo e místico que uniu o saber enciclopédico à contemplação afetuosa.',
  ARRAY['Mística Medieval', 'Escola Vitorina', 'Escolástica']::text[]
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
  'Da Maneira de Orar e Meditar',
  a.id,
  'Português',
  'Pequeno e precioso manual vitorino ensinando os graus da oração, a purificação dos afetos e a elevação da alma na meditação das coisas divinas.',
  'da-maneira-de-orar-e-meditar-hugo-sao-vitor',
  'De Modo Dicendi et Meditandi',
  '1130',
  2026,
  'Scriptorium Divinum',
  ARRAY['Latim']::text[],
  ARRAY['Escolástica & Mística Medieval', 'Espiritualidade & Vida Interior', 'Oração & Contemplação', 'Amor Divino & Virtudes Cristãs']::text[],
  ARRAY['Oração', 'Meditação', 'Mística Vitorina', 'Vida Interior', 'Contemplação']::text[],
  '/texts/da-maneira-de-orar-e-meditar-hugo-sao-vitor.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'hugo-de-sao-vitor'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
