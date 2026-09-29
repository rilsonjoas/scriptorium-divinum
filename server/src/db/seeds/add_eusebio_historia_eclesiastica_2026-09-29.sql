-- ============================================================
-- Nova entrada: Eusébio de Cesareia - História Eclesiástica (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'eusebio-de-cesareia',
  'Eusébio de Cesareia',
  'Bispo de Cesareia na Palestina e "o Pai da História da Igreja" (c. 265–339 d.C.), apologista e erudito patrístico que compilou os documentos, martírios e sucessões apostólicas dos primeiros três séculos cristãos.',
  ARRAY['Patrística', 'Historiografia Cristã', 'Igreja Antiga', 'Apologética']
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
  'História Eclesiástica (Livro I: A Origem Divina de Cristo)',
  (SELECT id FROM authors WHERE slug = 'eusebio-de-cesareia'),
  'Português',
  'O monumento inaugural da historiografia cristã, estabelecendo a preexistência divina do Verbo, o cumprimento das profecias e os primórdios da expansão apostólica no mundo greco-romano.',
  'historia-eclesiastica-eusebio-de-cesareia',
  'Historia Ecclesiastica - Liber I (Ἐκκλησιαστικὴ Ἱστορία)',
  '324',
  2026,
  'inteligência artificial, a partir de Sources Chrétiennes (SC 31)',
  ARRAY['Grego'],
  ARRAY['Patrística', 'História da Igreja', 'Cristologia', 'Apologética'],
  ARRAY['eusebio', 'historia-eclesiastica', 'padres-da-igreja', 'apostolos', 'patristica'],
  '/texts/historia-eclesiastica-eusebio-de-cesareia.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de Sources Chrétiennes (SC 31). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
