-- ============================================================
-- Nova entrada: São Boaventura - Itinerário da Mente para Deus (Frente 2, 2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'boaventura-de-bagnoregio',
  'São Boaventura de Bagnoregio',
  'Cardeal franciscano, bispo, filósofo e Doutor Seráfico da Igreja (1221–1274 d.C.), São Boaventura foi a figura máxima da teologia mística e da escolástica franciscana do século XIII ao lado de Santo Tomás de Aquino. Ministro Geral da Ordem dos Frades Menores, sua obra cimeira "O Itinerário da Mente para Deus" (Itinerarium Mentis in Deum, 1259 d.C.) é um monumento da filosofia e da contemplação cristã, descrevendo a ascensão da alma através das seis asas do Serafim até a quietude extática no Crucificado.',
  ARRAY['Mística Franciscana', 'Escolástica Medieval', 'Doutores da Igreja', 'Teologia Seráfica']
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
  'O Itinerário da Mente para Deus',
  (SELECT id FROM authors WHERE slug = 'boaventura-de-bagnoregio'),
  'Português',
  'Obra-prima da mística e da filosofia medieval franciscana, escrita no Monte Alverne em 1259. Inspirado na visão do Serafim de seis asas concedida a São Francisco de Assis, São Boaventura estrutura os seis graus de elevação da alma: a contemplação de Deus nos vestígios da criação, na imagem natural da alma (memória, inteligência, vontade), na alma renovada pela graça, no Ser divino (Ipsum Esse) e no Sumo Bem trinitário, culminando no repouso extático na Cruz de Cristo.',
  'itinerario-da-mente-para-deus-boaventura',
  'Itinerarium Mentis in Deum',
  '1259',
  2026,
  'inteligência artificial, a partir do original latino clássico',
  ARRAY['Latim'],
  ARRAY['Filosofia e Ética', 'Mística', 'Escolástica', 'História da Igreja'],
  ARRAY['boaventura', 'franciscanos', 'itinerario-da-mente', 'serafim', 'mistica-medieval', 'doutores-da-igreja', 'contemplacao'],
  '/texts/itinerario-da-mente-para-deus-boaventura.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de Quaracchi (S. Bonaventurae Opera Omnia, Tomo V). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  published = EXCLUDED.published,
  translation_is_ai = EXCLUDED.translation_is_ai;

COMMIT;
