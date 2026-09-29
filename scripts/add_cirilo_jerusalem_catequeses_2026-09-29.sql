-- ============================================================
-- Nova entrada: São Cirilo de Jerusalém - Catequeses Mistagógicas (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'cirilo-de-jerusalem',
  'São Cirilo de Jerusalém',
  'Bispo de Jerusalém e Doutor da Igreja (c. 313–386 d.C.), São Cirilo foi uma das mais veneradas autoridades patrísticas do século IV na Terra Santa. Suas imortais "Catequeses Mistagógicas" (Catecheses Mystagogicae, c. 350 d.C.), pregadas aos neófitos na Basílica do Santo Sepulcro em Jerusalém na semana da Páscoa, constituem o documento litúrgico e teológico mais precioso da Igreja antiga sobre os sacramentos da Iniciação Cristã (Batismo, Crisma e Eucaristia).',
  ARRAY['Patrística Grega', 'Igreja Antiga', 'Doutores da Igreja', 'Liturgia e Sacramentos']
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
  'Catequeses Mistagógicas',
  (SELECT id FROM authors WHERE slug = 'cirilo-de-jerusalem'),
  'Português',
  'As célebres cinco instruções pascais de São Cirilo aos recém-batizados na Basílica do Santo Sepulcro em Jerusalém no século IV. Explica com riqueza incomparável a renúncia a Satanás no Ocidente, a tripla imersão batismal, a unção com o Crisma, a consubstanciação espiritual na Eucaristia e a clássica reverência na recepção do Sacramento ("fazei da mão esquerda um trono para a mão direita").',
  'catequeses-mistagogicas-cirilo-de-jerusalem',
  'Catecheses Mystagogicae (Κατηχήσεις Μυσταγωγικαί)',
  '350',
  2026,
  'inteligência artificial, a partir do original grego clássico',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Sacramentos', 'Liturgia', 'História da Igreja'],
  ARRAY['cirilo-de-jerusalem', 'catequeses-mistagogicas', 'batismo', 'crisma', 'eucaristia', 'patristica', 'doutores-da-igreja'],
  '/texts/catequeses-mistagogicas-cirilo-de-jerusalem.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de Sources Chrétiennes (SC 126bis) e PG 33. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
