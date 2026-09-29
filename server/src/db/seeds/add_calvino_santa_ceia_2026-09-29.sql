-- ============================================================
-- Nova entrada: João Calvino - Pequeno Tratado sobre a Santa Ceia (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'joao-calvino',
  'João Calvino',
  'Teólogo francês, jurista e reformador de Genebra (1509–1564), João Calvino foi o principal sistematizador da teologia protestante reformada. Autor das monumentais "Institutas da Religião Cristã" e de exaustivos comentários bíblicos, seu "Pequeno Tratado sobre a Santa Ceia" (1541) é uma de suas obras mais célebres, oferecendo uma síntese profunda e equilibrada sobre a presença espiritual real de Cristo e a nutrição da alma pela fé através do Espírito Santo.',
  ARRAY['Tradição Reformada', 'Reforma Protestante', 'Teologia Sistemática', 'Sacramentos']
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
  'Pequeno Tratado sobre a Santa Ceia',
  (SELECT id FROM authors WHERE slug = 'joao-calvino'),
  'Português',
  'Tratado clássico de 1541 onde João Calvino expõe com clareza pastoral e rigor teológico o mistério da Ceia do Senhor. Demonstra que o sacramento não é um símbolo vazio nem uma presença corporal grosseira, mas uma comunhão real e viva com o Corpo e Sangue de Cristo operada pelo poder do Espírito Santo através da fé, servindo de remédio e alimento espiritual para os crentes.',
  'pequeno-tratado-sobre-a-santa-ceia-calvino',
  'Petit traicté de la saincte cène de nostre Seigneur Jésus Christ',
  '1541',
  2026,
  'inteligência artificial, a partir do original francês clássico',
  ARRAY['Francês'],
  ARRAY['Teologia Sistemática', 'Tradição Reformada', 'Sacramentos', 'História da Igreja'],
  ARRAY['joao-calvino', 'santa-ceia', 'sacramentos', 'eucaristia', 'reforma-protestante', 'teologia-reformada'],
  '/texts/pequeno-tratado-sobre-a-santa-ceia-calvino.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto clássico de Ioannis Calvini Opera Omnia (CR). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
