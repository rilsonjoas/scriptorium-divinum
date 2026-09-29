-- Seed para obra 'O Conflito da Alma Consigo Mesma' de Richard Sibbes
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'richard-sibbes',
  'Richard Sibbes',
  'Pregador puritano de Gray''s Inn e mestre de St. Catharine''s College, Cambridge (1577–1635), cognominado o ''Doce Doutor Sibbes'' pela ternura pastoral de suas mensagens.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Piedade Inglesa']::text[]
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
  'O Conflito da Alma Consigo Mesma',
  a.id,
  'Português',
  'Obra-prima de cura d''almas puritana baseada no Sl 42.11 (''Por que estás abatida, ó minha alma?''), ensinando a alma a triunfar sobre a melancolia e as dúvidas.',
  'o-conflito-da-alma-richard-sibbes',
  'The Soul''s Conflict with Itself',
  '1635',
  2026,
  'Scriptorium Divinum',
  ARRAY['Inglês']::text[],
  ARRAY['Puritanismo & Piedade Reformada', 'Espiritualidade & Vida Interior', 'Tratados & Sumas Teológicas', 'Combate Espiritual & Penitência']::text[],
  ARRAY['Paz Interior', 'Desânimo', 'Conforto Pastoral', 'Puritanos', 'Salmos']::text[],
  '/texts/o-conflito-da-alma-richard-sibbes.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'richard-sibbes'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
