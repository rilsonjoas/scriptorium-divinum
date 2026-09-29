-- ============================================================
-- Retira do site duas obras sem domínio público comprovado
-- Data: 2026-09-28 (decisão do Rilson: "se não há certeza que é legal,
-- esconder; quando entrar em domínio público, publicamos")
--
-- 1. As Institutas da Religião Cristã (PT) — tradução de Waldyr Carvalho
--    Luz, 1957. Uma tradução de 1957 não pode estar em PD no Brasil em
--    2026 (mesmo com morte do tradutor em 1957, só em 2028).
-- 2. Compêndio de Teologia (PT) — tradução de D. Odilão Moura OSB
--    (1918–2010, nota de falecimento de nov/2010:
--    http://oleniski.blogspot.com/2010/11/nota-de-falecimento-de-dom-odilao-moura.html).
--    Protegida no Brasil até 2081.
--
-- Nenhuma das duas tinha texto no ar (os .md nunca existiram); só a
-- ficha, que se dizia "domínio público". As edições em PD continuam:
-- Institutes (John Allen, EN) e Compendium Theologiae (latim).
--
-- 4 citações (Lecionário) usavam o link dessas fichas no "Ler livro
-- completo": 3 de Calvino passam para as Institutes em inglês; a de
-- Tomás (Suma I, q. 1, a. 8) passa para a Suma Parte I, do lote inglês
-- de 2026-09-28 — POR ISSO este script roda DEPOIS da importação dele.
--
-- Reversão: scripts/restaurar_obras_retiradas_2026-09-28.sql
-- ============================================================

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM books WHERE slug = 'summa-theologica-part-i-prima-pars') THEN
    RAISE EXCEPTION 'Importe o lote inglês antes: a Suma Parte I ainda não existe';
  END IF;
END $$;

UPDATE quotes
   SET scriptorium_url = 'https://scriptorium.narniano.com/livros/institutes-of-the-christian-religion'
 WHERE id IN ('f97f5fda-62ec-4692-974d-04d0e65065c1',
              '4140591a-a7c5-485e-8ea2-43c9f16644b7',
              '1389a186-3cc3-44aa-8f74-002dceddc44c');

UPDATE quotes
   SET scriptorium_url = 'https://scriptorium.narniano.com/livros/summa-theologica-part-i-prima-pars'
 WHERE id = 'cd1d84b2-3c23-414e-89f7-6593b1665939';

-- sem índice nem downloads (conferido em 2026-09-28); nenhuma citação
-- aponta para estas obras pela chave scriptorium_work_id
DELETE FROM books WHERE slug IN ('institutas-da-religiao-crista', 'compendio-da-suma-teologica');

COMMIT;

-- Verificação:
-- SELECT slug FROM books WHERE slug IN ('institutas-da-religiao-crista','compendio-da-suma-teologica');  -- 0 linhas
-- SELECT count(*) FROM quotes WHERE scriptorium_url ILIKE '%institutas-da-religiao-crista%' OR scriptorium_url ILIKE '%compendio-da-suma%';  -- 0
