-- ============================================================
-- Correção de Vínculo de Leitura Online (A Cidade de Deus & Compêndio)
-- Data: 2026-08-31
--
-- Vincula os livros 'a-cidade-de-deus' e 'compendio-da-suma-teologica' aos
-- arquivos de texto em markdown presentes no acervo (server/texts/cidade-de-deus-en.md
-- e server/texts/compendium-theologiae-la.md).
--
-- Como executar em produção: psql "$DATABASE_URL" -f scripts/fix_flagship_text_paths_2026-08-31.sql
-- ============================================================

BEGIN;

-- Atualizar A Cidade de Deus
UPDATE books
SET online_read_path = '/texts/cidade-de-deus-en.md'
WHERE slug IN ('a-cidade-de-deus', 'cidade-de-deus', 'the-city-of-god');

-- Atualizar Compêndio de Teologia
UPDATE books
SET online_read_path = '/texts/compendium-theologiae-la.md'
WHERE slug IN ('compendio-da-suma-teologica', 'compendio-de-teologia', 'compendium-theologiae');

COMMIT;

-- Verificação:
-- SELECT slug, online_read_path FROM books WHERE slug IN ('a-cidade-de-deus', 'compendio-da-suma-teologica', 'the-city-of-god', 'compendium-theologiae');
