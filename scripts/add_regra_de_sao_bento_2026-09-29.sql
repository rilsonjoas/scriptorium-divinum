-- ============================================================
-- Nova entrada: São Bento - A Regra de São Bento (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'bento-de-nursia',
  'São Bento de Núrsia',
  'Patriarca dos monges do Ocidente e patrono principal da Europa (c. 480–547 d.C.), São Bento fundou a célebre Abadia de Monte Cassino e redigiu a Santa Regra (Regula Sancti Benedicti). Sua síntese genial da vida comunitária cristã — baseada na oração e no trabalho (Ora et Labora), na estabilidade, no silêncio, na acolhida fraterna e nos doze graus da humildade — tornou-se o fundamento da espiritualidade e da civilização medieval ocidental.',
  ARRAY['Monástica Ocidental', 'Igreja Antiga', 'Pais Monásticos', 'Tradição Beneditina']
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
  'A Regra de São Bento',
  (SELECT id FROM authors WHERE slug = 'bento-de-nursia'),
  'Português',
  'Monumento da espiritualidade e da civilização cristã, a Santa Regra de São Bento instituiu a "escola do serviço do Senhor". Contém o imortal Prólogo ("Escuta, ó filho..."), o código dos Doze Graus da Humildade, o ritmo equilibrado entre oração comunitária e trabalho manual (Ora et Labora) e a lei áurea da hospitalidade monástica ("Todos os hóspedes que chegarem sejam recebidos como o próprio Cristo").',
  'a-regra-de-sao-bento',
  'Regula Sancti Benedicti',
  '530',
  2026,
  'inteligência artificial, a partir do original latino clássico',
  ARRAY['Latim'],
  ARRAY['Espiritualidade', 'História da Igreja', 'Monástica', 'Vida Cristã'],
  ARRAY['sao-bento', 'beneditinos', 'regra', 'ora-et-labora', 'humildade', 'monaquismo', 'patristica', 'idade-media'],
  '/texts/a-regra-de-sao-bento.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto latino clássico das edições críticas de Dom Cuthbert Butler e Dom Germain Morin (PL 66). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
