-- ============================================================
-- Nova entrada: Atenágoras de Atenas - Petição pelos Cristãos (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'atenagoras-de-atenas',
  'Atenágoras de Atenas',
  'Filósofo ateniense cristão e apologista do século II (c. 133–190 d.C.), autor de uma das mais nobres e filosóficas defesas do cristianismo antigo endereçada ao imperador Marco Aurélio.',
  ARRAY['Patrística', 'Apologética Antiga', 'Filosofia Cristã', 'Igreja Antiga']
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
  'Petição em Favor dos Cristãos',
  (SELECT id FROM authors WHERE slug = 'atenagoras-de-atenas'),
  'Português',
  'A célebre apologia grega endereçada aos imperadores filósofos Marco Aurélio e Cômodo, refutando com lógica límpida as calúnias populares e demonstrando o monoteísmo trinitário cristão.',
  'peticao-pelos-cristaos-atenagoras',
  'Legatio pro Christianis (Πρεσβεία περὶ τῶν Χριστιανῶν)',
  '177',
  2026,
  'inteligência artificial, a partir de Sources Chrétiennes (SC 379)',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Apologética', 'Filosofia Cristã', 'Igreja Antiga'],
  ARRAY['atenagoras', 'peticao-pelos-cristaos', 'marco-aurelio', 'apologetica', 'patristica'],
  '/texts/peticao-pelos-cristaos-atenagoras.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de Sources Chrétiennes (SC 379). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
