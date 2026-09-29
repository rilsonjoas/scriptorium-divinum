-- ============================================================
-- Nova entrada: São Justino Mártir - Primeira Apologia (2026-09-29)
-- ============================================================

BEGIN;

INSERT INTO authors (slug, name, bio_summary, denomination_or_tradition)
VALUES (
  'justino-martir',
  'São Justino Mártir',
  'Filósofo, apologista e mártir cristão da Igreja primitiva (c. 100–165 d.C.), natural da Samaria. Após percorrer as principais escolas filosóficas greco-romanas (estoicismo, aristotelismo, pitagorismo e platonismo), encontrou no Evangelho a "única filosofia segura e proveitosa". Fundou em Roma uma escola cristã e endereçou suas célebres Apologias aos imperadores romanos, formulando a doutrina do Logos Spermatikos e legando à posteridade o mais antigo testemunho da liturgia batismal e eucarística da cristandade antiga.',
  ARRAY['Patrística Grega', 'Apologistas do Século II', 'Filosofia Cristã', 'Mártires da Igreja']
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
  'Primeira Apologia em Defesa dos Cristãos',
  (SELECT id FROM authors WHERE slug = 'justino-martir'),
  'Português',
  'A obra-prima da apologética cristã do século II. Endereçada ao imperador Antonino Pio e ao Senado Romano, refuta corajosamente as acusações de ateísmo e imoralidade feitas contra os cristãos, expõe a teologia do Verbo Divino (Logos) presente nas sementes da filosofia clássica, demonstra o cumprimento cabal das profecias messiânicas e descreve em detalhes luminosos a liturgia do Batismo e da Eucaristia dominical na Igreja primitiva.',
  'primeira-apologia-justino-martir',
  'Ἀπολογία πρώτη ὑπὲρ τῶν Χριστιανῶν (Apologia Prima)',
  '155',
  2026,
  'inteligência artificial, a partir do texto grego crítico clássico',
  ARRAY['Grego'],
  ARRAY['Patrística', 'Apologética', 'História da Igreja', 'Liturgia', 'Filosofia Cristã'],
  ARRAY['justino-martir', 'primeira-apologia', 'logos-spermatikos', 'eucaristia', 'batismo', 'patristica'],
  '/texts/primeira-apologia-justino-martir.md',
  true,
  true,
  true,
  NULL,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição crítica de E. J. Goodspeed e Sources Chrétiennes (SC 507). Revisão humana: pendente. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO UPDATE SET
  online_read_path = EXCLUDED.online_read_path,
  attribution_text = EXCLUDED.attribution_text,
  description = EXCLUDED.description;

COMMIT;
