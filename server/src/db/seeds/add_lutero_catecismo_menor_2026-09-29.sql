-- ============================================================
-- Nova entrada: Martinho Lutero - O Catecismo Menor (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'martinho-lutero',
  'Martinho Lutero',
  'Monge agostiniano, sacerdote e teólogo alemão (1483–1546), Martinho Lutero foi a figura central e o pioneiro da Reforma Protestante do século XVI ao publicar as 95 Teses em 1517. Suas obras teológicas, confessionalistas e hinológicas — incluindo "Da Liberdade do Cristão" e "O Catecismo Menor" (Der Kleine Katechismus, 1529) — moldaram decisivamente a fé luterana, a língua alemã moderna e a teologia ocidental da Justificação somente pela Fé (Sola Fide).',
  ARRAY['Luteranismo', 'Reforma Protestante', 'Confessionalismo', 'Teologia Bíblica']
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
  'O Catecismo Menor',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'Obra-prima pedagógica da Reforma de 1529, redigida por Lutero para pastores e chefes de família. Explica com admirável clareza os Dez Mandamentos ("Que significa isto?"), os Três Artigos do Credo Apostólico (Criação, Redenção e Santificação), o Santo Batismo, o Sacramento do Altar e as orações diárias, constituindo a pedra angular da catequese cristã evangélica.',
  'o-catecismo-menor-martinho-lutero',
  'Der Kleine Katechismus',
  '1529',
  2026,
  'inteligência artificial, a partir do original alemão e latino',
  ARRAY['Alemão', 'Latim'],
  ARRAY['Credos e Confissões', 'Catecismos', 'Tradição Luterana', 'Vida Cristã'],
  ARRAY['lutero', 'catecismo-menor', 'reforma-protestante', 'dez-mandamentos', 'credo', 'sacramentos', 'fe'],
  '/texts/o-catecismo-menor-martinho-lutero.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto crítico de Weimarer Ausgabe (WA 30) e Concordia Triglotta. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
