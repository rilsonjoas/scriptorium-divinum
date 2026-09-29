-- ============================================================
-- Nova entrada: Martinho Lutero - Comentário ao Magnificat (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'martinho-lutero',
  'Martinho Lutero',
  'Monge agostiniano, teólogo, professor bíblico e principal líder da Reforma Protestante do século XVI (1483–1546), em Wittenberg. Sua redescoberta da justificação pela fé somente (sola fide) transformou a história do cristianismo. Autor prolífico, compôs as 95 Teses, os catecismos Maior e Menor, o tratado Da Liberdade do Cristão e o magistral comentário lírico-devocional ao Magnificat (1521).',
  ARRAY['Reforma Protestante', 'Luteranismo', 'Teologia Bíblica', 'Devocional']
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
  'Comentário ao Magnificat',
  (SELECT id FROM authors WHERE slug = 'martinho-lutero'),
  'Português',
  'Uma das obras mais belas e líricas de Martinho Lutero, redigida em 1521 durante os intensos acontecimentos da Dieta de Worms. Dedicado ao jovem Duque João Frederico da Saxônia, o tratado expõe a teologia da graça soberana e da humildade a partir do Cântico de Maria em Lucas 1, demonstrando como Deus olha para a baixeza da criatura, derruba os soberbos de seus tronos e cumpre a Sua promessa eterna a Abraão.',
  'comentario-ao-magnificat-lutero',
  'Das Magnificat verdeutscht und ausgelegt',
  '1521',
  2026,
  'inteligência artificial, a partir do original alemão da Weimarer Ausgabe',
  ARRAY['Alemão'],
  ARRAY['Reforma Protestante', 'Exegese Bíblica', 'Espiritualidade', 'História da Igreja', 'Teologia Bíblica'],
  ARRAY['martinho-lutero', 'magnificat', 'cantico-de-maria', 'humildade', 'graca', 'reforma'],
  '/texts/comentario-ao-magnificat-lutero.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da Weimarer Ausgabe (WA 7). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
