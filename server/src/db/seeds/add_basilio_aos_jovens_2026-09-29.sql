-- ============================================================
-- Nova entrada: São Basílio Magno - Aos Jovens sobre a Literatura Clássica (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'basilio-de-cesareia',
  'São Basílio Magno',
  'Arcebispo de Cesareia na Capadócia e Doutor da Igreja (c. 330–379 d.C.), Basílio Magno foi um dos gigantes dos Pais Capadócios ao lado de seu irmão Gregório de Nissa e de Gregório de Nazianzo. Notável teólogo trinitário na defesa da divindade do Espírito Santo (De Spiritu Sancto) e pioneiro do monaquismo cenobítico oriental, seu célebre discurso "Aos Jovens" (Ad Adolescentes) é o clássico patrístico fundacional sobre a relação harmoniosa e crítica entre a fé cristã e as humanidades clássicas.',
  ARRAY['Patrística Grega', 'Pais Capadócios', 'Igreja Antiga', 'Doutores da Igreja']
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
  'Aos Jovens: Como Tirar Proveito da Literatura Clássica',
  (SELECT id FROM authors WHERE slug = 'basilio-de-cesareia'),
  'Português',
  'Obra-prima da pedagogia cristã e da patrística do século IV, onde São Basílio instrui seus jovens sobrinhos sobre como ler e discernir a literatura grega clássica (Homero, Hesíodo, Platão, historiadores e oradores). Famoso pela analogia das abelhas que colhem unicamente o néctar e deixam o veneno, o tratado é a defesa magna da formação humanística orientada à virtude e à vida eterna.',
  'aos-jovens-sobre-a-literatura-classica',
  'Ad Adolescentes (De Legendis Gentilium Libris)',
  '374',
  2026,
  'inteligência artificial, a partir do original grego clássico',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Educação Cristã', 'Filosofia e Ética'],
  ARRAY['basilio-magno', 'capadocios', 'educacao', 'humanismo', 'patristica', 'etica', 'virtude', 'literatura-classica'],
  '/texts/aos-jovens-sobre-a-literatura-classica.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto grego clássico de Sources Chrétiennes (SC 28bis, ed. F. Boulenger) e PG 31. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
