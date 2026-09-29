-- ============================================================
-- Nova entrada: Santo Anselmo de Cantuária - Proslogion (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'anselmo-de-cantuaria',
  'Santo Anselmo de Cantuária',
  'Arcebispo de Cantuária e Doutor Magnífico da Igreja (1033–1109 d.C.), Santo Anselmo foi o pai da teologia escolástica medieval. Monge e prior na Abadia beneditina de Bec na Normandia antes de assumir a sé primaz da Inglaterra, imortalizou o axioma metodológico da teologia clássica ocidental: "A Fé em Busca de Compreensão" (Fides Quaerens Intellectum / Credo ut Intelligam). Seu célebre Proslogion (1078 d.C.) formulou a oração reflexiva e o clássico argumento ontológico sobre a soberana e necessária existência de Deus.',
  ARRAY['Escolástica Medieval', 'Tradição Beneditina', 'Doutores da Igreja', 'Teologia Filosófica']
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
  'Proslogion: A Fé em Busca de Compreensão',
  (SELECT id FROM authors WHERE slug = 'anselmo-de-cantuaria'),
  'Português',
  'Obra cimeira da teologia e da oração filosófica ocidental, o Proslogion articula a célebre prece "Credo ut intelligam" (Creio para compreender) e formula o imortal argumento que define Deus como "Aquele do qual nada maior pode ser pensado" (aliquid quo nihil maius cogitari possit). O texto une o rigor da lógica com o arrebatamento místico e a contrição orante diante da Luz Inacessível.',
  'proslogion',
  'Proslogion (Fides Quaerens Intellectum)',
  '1078',
  2026,
  'inteligência artificial, a partir do original latino clássico',
  ARRAY['Latim'],
  ARRAY['Teologia Filosófica', 'Escolástica', 'Espiritualidade', 'História da Igreja'],
  ARRAY['anselmo', 'cantuaria', 'proslogion', 'argumento-ontologico', 'fides-quaerens-intellectum', 'escolastica', 'doutores-da-igreja'],
  '/texts/proslogion.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica latina de F. S. Schmitt (Opera Omnia) e Patrologia Latina (PL 158). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
