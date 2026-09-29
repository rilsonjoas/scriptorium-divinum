-- Seed para obra 'Devoções para Ocasiões Emergentes (Meditação XVII)' de John Donne
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'john-donne',
  'John Donne',
  'Decano da Catedral de São Paulo em Londres, pregador e poeta metafísico anglicano (1572–1631), célebre por suas ''Devotions'' e sermões profundos.',
  ARRAY['Tradição Anglicana', 'Poetas Metafísicos', 'Devoção Seiscentista']::text[]
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
  'Devoções para Ocasiões Emergentes (Meditação XVII)',
  a.id,
  'Português',
  'Monumento devocional e literário da língua inglesa, escrito durante grave enfermidade, contendo a imortal meditação: ''Nenhum homem é uma ilha isolada''.',
  'devocoes-para-ocasioes-emergentes-donne',
  'Devotions upon Emergent Occasions',
  '1624',
  2026,
  'Scriptorium Divinum',
  ARRAY['Inglês']::text[],
  ARRAY['Tradição Anglicana', 'Espiritualidade & Vida Interior', 'Liturgia, Orações & Hinos', 'Providência & Escatologia']::text[],
  ARRAY['Meditações', 'Mortalidade', 'Por Quem os Sinos Dobram', 'Poetas Anglicanos', 'Providência']::text[],
  '/texts/devocoes-para-ocasioes-emergentes-donne.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'john-donne'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
