-- ============================================================
-- Nova entrada: John Bunyan - A Guerra Santa (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'john-bunyan',
  'John Bunyan',
  'Pregador puritano batista e célebre escritor inglês (1628–1688), John Bunyan é o autor de algumas das maiores obras da literatura cristã universal, incluindo "O Peregrino" (The Pilgrim''s Progress), "Graça Abundante" e "A Guerra Santa" (The Holy War, 1682). Sua impressionante capacidade de traduzir verdades bíblicas profundas e a psicologia da conversão em narrativas alegóricas inesquecíveis tornou-o uma das vozes mais lidas e amadas em todo o mundo.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Literatura Cristã', 'Alegorias']
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  original_languages, categories, tags, online_read_path,
  featured, published, translation_is_ai, human_review_approved_at,
  license_type, attribution_text
)
VALUES (
  'A Guerra Santa',
  (SELECT id FROM authors WHERE slug = 'john-bunyan'),
  'Português',
  'A monumental alegoria bíblica de John Bunyan que retrata a batalha cósmica e individual pela alma humana. Narra a fundação da formosa cidade de Alma-Humana (Mansoul), sua trágica queda pelas artimanhas de Diábolos através da Porta do Ouvido e dos Olhos, o cerco da Lei e o triunfo glorioso do Príncipe Emanuel, que reconquista a cidade com o Seu próprio Sangue e restaura a comunhão eterna.',
  'a-guerra-santa-john-bunyan',
  'The Holy War',
  '1682',
  2026,
  'inteligência artificial, a partir do original inglês clássico',
  ARRAY['Inglês'],
  ARRAY['Literatura Cristã', 'Alegorias', 'Tradição Puritana', 'Vida Cristã'],
  ARRAY['john-bunyan', 'a-guerra-santa', 'alegoria', 'puritanos', 'alma-humana', 'emanuel', 'redencao'],
  '/texts/a-guerra-santa-john-bunyan.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica de George Offor (The Works of John Bunyan). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
