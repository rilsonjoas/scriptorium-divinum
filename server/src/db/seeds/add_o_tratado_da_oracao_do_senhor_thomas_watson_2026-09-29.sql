-- Seed para obra 'O Tratado da Oração do Senhor (Pai Nosso)' de Thomas Watson
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'thomas-watson',
  'Thomas Watson',
  'Pregador puritano de St. Stephen Walbrook em Londres (c. 1620–1686), conhecido por sua prosa vívida, rica em metáforas e profundidade bíblica.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Cura Pastoral']::text[]
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
  'O Tratado da Oração do Senhor (Pai Nosso)',
  a.id,
  'Português',
  'Exposição versículo por versículo da Oração Dominical por Thomas Watson, instruindo a mente e inflamando o coração no diálogo filial com o Pai celestial.',
  'o-tratado-da-oracao-do-senhor-thomas-watson',
  'The Lord''s Prayer',
  '1692',
  2026,
  'Scriptorium Divinum',
  ARRAY['Inglês']::text[],
  ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Oração & Contemplação', 'Graça, Fé & Justificação']::text[],
  ARRAY['Pai Nosso', 'Oração', 'Puritanos', 'Devoção', 'Exegese']::text[],
  '/texts/o-tratado-da-oracao-do-senhor-thomas-watson.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'thomas-watson'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
