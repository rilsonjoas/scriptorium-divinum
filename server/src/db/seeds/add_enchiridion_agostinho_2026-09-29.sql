-- ============================================================
-- Nova entrada: Santo Agostinho - Enchiridion (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'agostinho-de-hipona',
  'Santo Agostinho de Hipona',
  'Bispo de Hipona e Doutor da Graça (354–430 d.C.), Santo Agostinho é a figura máxima da patrística latina e um dos mais influentes teólogos e filósofos de toda a história do cristianismo. Autor de obras monumentais como "Confissões" e "A Cidade de Deus", seu "Enchiridion" (421 d.C.) é a sua única síntese sistemática e concisa de toda a doutrina cristã, estruturada admiravelmente sobre as três virtudes teologais: Fé (o Credo), Esperança (o Pai Nosso) e Caridade (os Mandamentos do Amor).',
  ARRAY['Patrística Latina', 'Doutores da Igreja', 'Igreja Antiga', 'Teologia da Graça']
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
  'Enquirídio: Sobre a Fé, a Esperança e a Caridade',
  (SELECT id FROM authors WHERE slug = 'agostinho-de-hipona'),
  'Português',
  'O clássico "manual de bolso" de Santo Agostinho (Enchiridion ad Laurentium, 421 d.C.), contendo a sua síntese mais madura e sistemática sobre a fé cristã. Desenvolve a clássica metafísica do mal como privação do bem (privatio boni), a soberana gratuidade da graça de Cristo, a necessidade da regeneração batismal, a esperança expressa na Oração do Senhor e a primazia universal da caridade como plenitude de todos os mandamentos.',
  'enchiridion-agostinho',
  'Enchiridion de Fide, Spe et Caritate ad Laurentium',
  '421',
  2026,
  'inteligência artificial, a partir do original latino clássico',
  ARRAY['Latim'],
  ARRAY['Patrística', 'Teologia Sistemática', 'Espiritualidade', 'História da Igreja'],
  ARRAY['agostinho', 'enchiridion', 'fe-esperanca-caridade', 'graca', 'patristica', 'doutores-da-igreja', 'teologia-dogmatica'],
  '/texts/enchiridion-agostinho.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica latina do CCSL (vol. 46, ed. E. Evans) e PL 40. Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
