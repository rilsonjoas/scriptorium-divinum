-- ============================================================
-- Nova entrada: Martinho Lutero - Da Liberdade do Cristão (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'martinho-lutero',
  'Martinho Lutero',
  'Frade agostiniano, teólogo e professor da Universidade de Wittenberg (1483–1546), Lutero foi a figura seminal da Reforma Protestante. Autor das 95 Teses (1517), tradutor da Bíblia para o alemão e expositor incomparável da justificação pela fé somente (sola fide) e da autoridade soberana das Escrituras (sola scriptura). Seu tratado "Da Liberdade do Cristão" (1520) é uma das obras mais luminosas e profundas de toda a literatura cristã.',
  ARRAY['Reforma', 'Luteranismo', 'Teologia Bíblica']
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
  'Da Liberdade do Cristão',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'Publicado no outono decisivo de 1520, este opúsculo é a síntese espiritual máxima da teologia de Martinho Lutero. A partir da célebre aparente contradição ("o cristão é senhor libérrimo de tudo, não sujeito a ninguém; o cristão é servo prestativo de tudo, sujeito a todos"), articula com admirável clareza a união esponsal da alma com Cristo pela fé (commercium admirabile), o sacerdócio universal dos crentes e o serviço desinteressado e amoroso ao próximo.',
  'da-liberdade-do-cristao',
  'Tractatus de Libertate Christiana (Von der Freiheit eines Christenmenschen)',
  '1520',
  2026,
  'inteligência artificial, a partir do original latino de 1520',
  ARRAY['Latim', 'Alemão'],
  ARRAY['Reforma', 'Teologia Sistemática', 'Soteriologia', 'Espiritualidade'],
  ARRAY['lutero', 'reforma', 'liberdade', 'justificacao', 'fe', 'obras', 'sacerdocio-universal', 'amor'],
  '/texts/da-liberdade-do-cristao.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto latino clássico de 1520 (Tractatus de Libertate Christiana), cotejada com a edição alemã de Weimar (WA 7). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
