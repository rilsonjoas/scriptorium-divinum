-- Seed para obra 'A Comunhão com Deus Pai, Filho e Espírito Santo' de John Owen
BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'john-owen',
  'John Owen',
  'Chanceler da Universidade de Oxford e teólogo puritano (1616–1683), cognominado o ''Príncipe dos Puritanos'' pela vastidão teológica e profundidade espiritual.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Teologia Sistemática']::text[]
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
  'A Comunhão com Deus Pai, Filho e Espírito Santo',
  a.id,
  'Português',
  'Monumento cimeiro da teologia espiritual puritana, detalhando a comunhão distinta e afetuosa que o crente desfruta com cada uma das Pessoas da Trindade.',
  'comunhao-com-deus-trindade-john-owen',
  'Of Communion with God the Father, Son, and Holy Ghost',
  '1657',
  2026,
  'Scriptorium Divinum',
  ARRAY['Inglês', 'Latim']::text[],
  ARRAY['Puritanismo & Piedade Reformada', 'Tratados & Sumas Teológicas', 'Espiritualidade & Vida Interior', 'Trindade & Espírito Santo']::text[],
  ARRAY['Comunhão Trinitária', 'Amor do Pai', 'Graça de Cristo', 'Espírito Consolador', 'Puritanos']::text[],
  '/texts/comunhao-com-deus-trindade-john-owen.md',
  true,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução sob licença Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).'
FROM authors a
WHERE a.slug = 'john-owen'
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
  description = EXCLUDED.description,
  categories = EXCLUDED.categories,
  tags = EXCLUDED.tags,
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  updated_at = NOW();

COMMIT;
