-- ============================================================
-- Nova entrada: Santo Ambrósio de Milão - Sobre os Mistérios (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'ambrosio-de-milao',
  'Santo Ambrósio de Milão',
  'Bispo de Milão, orador e Doutor da Igreja (c. 339–397 d.C.), Santo Ambrósio foi uma das mais imponentes autoridades da patrística ocidental no século IV, célebre por sua nobreza pastoral, defesa da ortodoxia nicena contra o arianismo e por haver instruído e batizado Santo Agostinho. Seu tratado "Sobre os Mistérios" (De Mysteriis, c. 387 d.C.) é a clássica catequese mistagógica pascal que explica os sacramentos do Batismo, Confirmação e Eucaristia.',
  ARRAY['Patrística Latina', 'Igreja Antiga', 'Doutores da Igreja', 'Liturgia e Sacramentos']
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
  'Sobre os Mistérios (De Mysteriis)',
  (SELECT id FROM authors WHERE slug = 'ambrosio-de-milao'),
  'Português',
  'Catequese mistagógica fundamental da patrística latina do século IV, proferida por Santo Ambrósio aos neófitos na semana da Páscoa em Milão. Descreve com beleza poética e profundidade dogmática o rito do Épheta, a renúncia a Satanás, a regeneração espiritual nas águas batismais, a unção com o Crisma e a recepção do Corpo e Sangue de Cristo na Eucaristia.',
  'sobre-os-misterios-ambrosio-de-milao',
  'De Mysteriis',
  '387',
  2026,
  'inteligência artificial, a partir do original latino clássico',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Sacramentos', 'Liturgia', 'História da Igreja'],
  ARRAY['ambrosio-de-milao', 'de-mysteriis', 'mistagogia', 'batismo', 'eucaristia', 'patristica', 'doutores-da-igreja'],
  '/texts/sobre-os-misterios-ambrosio-de-milao.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir do texto latino crítico do CSEL (vol. 73) e Sources Chrétiennes (SC 25bis). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
