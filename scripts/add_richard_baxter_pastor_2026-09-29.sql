-- ============================================================
-- Nova entrada: Richard Baxter - O Pastor Reformado (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'richard-baxter',
  'Richard Baxter',
  'Teólogo puritano, pregador e escritor devocional inglês (1615–1691), Richard Baxter foi uma das figuras mais veneradas da história pastoral do cristianismo. Seu ministério exemplar em Kidderminster transformou uma cidade inteira pela combinação única de pregação evangélica fervorosa, santidade pessoal e visitação catequética domiciliar. Sua obra-prima "O Pastor Reformado" (The Reformed Pastor / Gildas Salvianus, 1656) é o tratado clássico supremo de teologia pastoral e cuidado das almas baseado em Atos 20.28.',
  ARRAY['Puritanismo', 'Tradição Reformada', 'Teologia Pastoral', 'Espiritualidade']
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
  'O Pastor Reformado',
  (SELECT id FROM authors WHERE slug = 'richard-baxter'),
  'Português',
  'Tratado clássico indispensável de teologia pastoral e cura d'almas, baseado na exortação de Paulo aos presbíteros em Atos 20.28 ("Cuidai de vós mesmos e de todo o rebanho"). Richard Baxter articula com profundidade a necessidade da santidade pessoal do ministro, o dever irrenunciável da catequese e visitação pessoal de cada família e o valor infinito da Igreja resgatada pelo Sangue de Cristo.',
  'o-pastor-reformado-richard-baxter',
  'The Reformed Pastor (Gildas Salvianus)',
  '1656',
  2026,
  'inteligência artificial, a partir do original inglês clássico',
  ARRAY['Inglês'],
  ARRAY['Teologia Pastoral', 'Tradição Puritana', 'Vida Cristã', 'História da Igreja'],
  ARRAY['richard-baxter', 'puritanos', 'pastoral', 'cuidado-das-almas', 'ministerio', 'evangelho', 'reforma'],
  '/texts/o-pastor-reformado-richard-baxter.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição clássica de William Orme e Banner of Truth Trust. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
