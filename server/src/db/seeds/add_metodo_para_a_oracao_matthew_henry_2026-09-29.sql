-- Seed para obra 'Método para a Oração com Expressões da Escritura' de Matthew Henry
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'matthew-henry',
  'Matthew Henry',
  'Pastor e comentarista bíblico não conformista galês/inglês (1662–1714), autor do célebre ''Comentário sobre Toda a Bíblia'' e de clássicos da vida de oração.',
  ARRAY['Puritanismo', 'Piedade Não Conformista', 'Tradição Reformada']::text[]
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
  'Método para a Oração com Expressões da Escritura',
  a.id,
  'Português',
  'Manual clássico e prático de Matthew Henry ensinando a enriquecer a oração privada e familiar usando a própria linguagem e promessas das Sagradas Escrituras.',
  'metodo-para-a-oracao-matthew-henry',
  'A Method for Prayer with Scripture Expressions',
  '1710',
  2026,
  'Scriptorium Divinum',
  ARRAY['Inglês']::text[],
  ARRAY['Puritanismo & Piedade Reformada', 'Liturgia, Orações & Hinos', 'Oração & Contemplação', 'Espiritualidade & Vida Interior']::text[],
  ARRAY['Oração Bíblica', 'Piedade Puritana', 'Adoração', 'Escritura', 'Vida Devocional']::text[],
  '/texts/metodo-para-a-oracao-matthew-henry.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'matthew-henry'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
