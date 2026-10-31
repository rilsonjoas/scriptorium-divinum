-- Publica no catálogo duas obras que estavam no acervo (server/texts) mas fora do ar
-- por terem trechos em inglês, agora traduzidos por inteiro e revisados pelo autor
-- (confirmado em 2026-10-30): a Suma Teológica, Secunda Secundae, e a Apologia da
-- Confissão de Augsburgo. Veja docs/DECISOES.md ("Segurado fora deste deploy").
--
-- Idempotente: só INSERE (ON CONFLICT (slug) DO NOTHING). Nada já publicado é alterado.
-- Metadados seguem os das obras irmãs (Suma 1ª e 1ª-2ª partes; Reforma Protestante).
BEGIN;

INSERT INTO authors (slug, name)
VALUES ('sao-tomas-de-aquino', 'São Tomás de Aquino')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO authors (slug, name)
VALUES ('felipe-melancton', 'Felipe Melâncton')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator,
  categories, tags, online_read_path,
  featured, published, translation_is_ai,
  human_review_approved_at, license_type, attribution_text
)
SELECT
  'Suma Teológica — Segunda Parte da Segunda Parte',
  a.id,
  'Português',
  'Texto integral em português, traduzido por inteligência artificial.',
  'suma-teologica-segunda-parte-da-segunda-parte',
  'Secunda Secundae',
  2026,
  'Scriptorium Divinum (tradução por IA)',
  ARRAY['Teologia Moral e Escolástica'],
  ARRAY['santo-tomas-de-aquino', 'suma-teologica-segunda-parte-da-segunda-parte', 'classicos-cristaos'],
  '/texts/suma-teologica-segunda-parte-da-segunda-parte.md',
  false,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
FROM authors a
WHERE a.slug = 'sao-tomas-de-aquino'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_original, publication_year_translation, translator,
  categories, tags, online_read_path,
  featured, published, translation_is_ai,
  human_review_approved_at, license_type, attribution_text
)
SELECT
  'Apologia da Confissão de Augsburgo',
  a.id,
  'Português',
  'Resposta de Filipe Melâncton à Confutação da Confissão de Augsburgo (1531). Texto integral em português, traduzido por inteligência artificial.',
  'apologia-da-confissao-de-augsburgo',
  'Apologia Confessionis Augustanae',
  '1531',
  2026,
  'Scriptorium Divinum (tradução por IA)',
  ARRAY['Reforma Protestante', 'Credos, Confissões & Catecismos', 'Graça, Fé & Justificação'],
  ARRAY['melancton', 'apologia', 'confissao-de-augsburgo', 'luteranismo', 'justificacao', 'reforma'],
  '/texts/apologia-da-confissao-de-augsburgo.md',
  false,
  true,
  true,
  NOW(),
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir de obra em domínio público (tradução inglesa de F. Bente e W. H. T. Dau, via Projeto Gutenberg). Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
FROM authors a
WHERE a.slug = 'felipe-melancton'
ON CONFLICT (slug) DO NOTHING;

COMMIT;
