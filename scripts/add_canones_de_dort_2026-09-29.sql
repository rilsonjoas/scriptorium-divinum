-- ============================================================
-- Nova entrada: Cânones de Dort (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'sinodo-de-dort',
  'Sínodo de Dort',
  'Reunido em Dordrecht entre 1618 e 1619 pelas Igrejas Reformadas dos Países Baixos, com a presença de delegados teológicos de oito igrejas reformadas estrangeiras (Grã-Bretanha, Suíça, Genebra, Palatinado, Hesse, Nassau, Bremen e Emden), o Sínodo de Dort foi o maior concílio internacional da Reforma. Formulou os Cânones de Dort em resposta aos Cinco Artigos dos Remonstrantes (seguidores de Jacó Armínio), estabelecendo com rigor exegético e pastoral a doutrina bíblica da graça soberana.',
  ARRAY['Teologia Reformada', 'Calvinismo', 'Confessionalismo']
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
  'Cânones de Dort',
  (SELECT id FROM authors WHERE slug = 'sinodo-de-dort'),
  'Português',
  'Promulgados em 1619 pelo Sínodo Internacional de Dordrecht, os Cânones constituem a resposta bíblica e confessional aos Cinco Artigos dos Remonstrantes. Estruturados nos Cinco Pontos de Doutrina (Eleição Divina, Morte de Cristo, Corrupção Humana e Conversão Eficaz, e Perseverança dos Santos), trazem a formulação positiva de cada artigo seguida pela explícita Rejeição dos Erros e pela solene Conclusão Sinodal.',
  'canones-de-dort',
  'Canones Synodi Dordrechtanae',
  '1619',
  2026,
  'inteligência artificial, a partir do original latino de 1619',
  ARRAY['Latim'],
  ARRAY['Credos e Confissões', 'Teologia Reformada', 'Doutrina da Graça'],
  ARRAY['dort', 'canones', 'calvinismo', 'eleicao', 'graca', 'tulip', 'predestinacao', 'perseveranca'],
  '/texts/canones-de-dort.md',
  false,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir das atas oficiais em latim (Canones Synodi Dordrechtanae, 1619), cotejada com a edição de Philip Schaff (The Creeds of Christendom, vol. III). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
