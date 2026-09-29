-- ============================================================
-- Nova entrada: Hugo de São Vítor - O Arras da Alma (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'hugo-de-sao-vitor',
  'Hugo de São Vítor',
  'Cônego regular agostiniano da Abadia de São Vítor em Paris (c. 1096–1141 d.C.), cognominado "o Segundo Agostinho" e mestre da mística especulativa e da pedagogia das artes liberais.',
  ARRAY['Escolástica Monástica', 'Mística Vitorina', 'Tradição Agostiniana']
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
  'Solilóquio sobre o Arras da Alma',
  (SELECT id FROM authors WHERE slug = 'hugo-de-sao-vitor'),
  'Português',
  'Um dos mais belos diálogos místicos da Idade Média, expondo o noivado espiritual da alma com Cristo e a contemplação da criação como penhor e sinal do amor divino.',
  'soliloquio-arras-da-alma-hugo-de-sao-vitor',
  'Soliloquium de Arrha Animae',
  '1130',
  2026,
  'inteligência artificial, a partir de Sources Chrétiennes (SC 155)',
  ARRAY['Latim'],
  ARRAY['Mística Medieval', 'Espiritualidade Vitorina', 'Contemplação', 'Amor Divino'],
  ARRAY['hugo-de-sao-vitor', 'arras-da-alma', 'mistica-medieval', 'soliloquio', 'escolastica'],
  '/texts/soliloquio-arras-da-alma-hugo-de-sao-vitor.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de Sources Chrétiennes (SC 155). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description,
  published = true;

COMMIT;
