-- ============================================================
-- Nova entrada: Tomás de Kempis - O Solilóquio da Alma (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'tomas-de-kempis',
  'Tomás de Kempis',
  'Cônego regular de Santo Agostinho, místico e escritor devocional da Devotio Moderna (c. 1380–1471 d.C.), no Mosteiro de Monte Santa Inês na Holanda. Autor universalmente celebrado de "A Imitação de Cristo" (o livro mais lido e traduzido da história cristã após a Bíblia) e de outras joias da espiritualidade interior como "O Solilóquio da Alma" e "O Jardim das Rosas".',
  ARRAY['Devotio Moderna', 'Mística Cristã', 'Literatura Devocional', 'Monástica']
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
  'O Solilóquio da Alma',
  (SELECT id FROM authors WHERE slug = 'tomas-de-kempis'),
  'Português',
  'O tratado lírico e místico mais íntimo de Tomás de Kempis, irmão devocional da Imitação de Cristo. Trata do colóquio ardente e afetuoso da alma peregrina com o seu Salvador, o amor ao silêncio e à oração na cela monástica, a pedagogia das aridezes espirituais e a conformação amorosa com a Cruz de Cristo rumo à pátria celeste.',
  'soliloquio-da-alma-tomas-de-kempis',
  'Soliloquium Animae',
  '1430',
  2026,
  'inteligência artificial, a partir do texto latino clássico',
  ARRAY['Latim'],
  ARRAY['Mística Cristã', 'Espiritualidade', 'Vida Cristã', 'Devotio Moderna', 'Oração'],
  ARRAY['tomas-de-kempis', 'soliloquio-da-alma', 'devotio-moderna', 'oracao', 'mistica', 'imitacao-de-cristo'],
  '/texts/soliloquio-da-alma-tomas-de-kempis.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica de M. J. Pohl (Opera Omnia). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
