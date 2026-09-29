-- ============================================================
-- Retira 3 traduções portuguesas sem domínio público comprovado
-- Data: 2026-09-29 (regra do Rilson: sem certeza, não publica)
--
-- Nenhuma tinha texto no ar: o online_read_path apontava para arquivos que
-- nunca existiram, e o botão "Ler Online" abria "Conteúdo indisponível".
-- 1. A Cidade de Deus — trad. Oscar Paes Leme: é de 1961 (Editora das
--    Américas), não 1910 como estava cadastrado; ainda vendida pela Vozes.
-- 2. Pensamentos — "Mário Barreto, 1922": nenhum registro dessa tradução.
-- 3. Por que Deus se fez Homem? — "Antônio Pinto de Carvalho, 1940":
--    tradução não confirmada; o tradutor atuava em meados do séc. XX.
-- As edições em PD continuam (The City of God, Thoughts, Proslogium…), e
-- as 8 citações do Lecionário que linkavam as fichas passam para elas.
-- Reversão: scripts/restaurar_traducoes_retiradas_2026-09-29.sql
-- ============================================================

BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM books WHERE slug = 'the-city-of-god') THEN RAISE EXCEPTION 'edição de destino ausente: the-city-of-god'; END IF;
    IF NOT EXISTS (SELECT 1 FROM books WHERE slug = 'thoughts-pensees') THEN RAISE EXCEPTION 'edição de destino ausente: thoughts-pensees'; END IF;
    IF NOT EXISTS (SELECT 1 FROM books WHERE slug = 'proslogium-monologium-cur-deus-homo') THEN RAISE EXCEPTION 'edição de destino ausente: proslogium-monologium-cur-deus-homo'; END IF;
END $$;

UPDATE quotes SET scriptorium_url = 'https://scriptorium.narniano.com/livros/the-city-of-god'
 WHERE id IN ('07fbf854-afcf-439c-9abb-beb1b5b6344f', 'c3761339-c40f-429f-9c7d-ab24c31c2428', '521c33b8-3529-4966-8714-d3dd223b362a');

UPDATE quotes SET scriptorium_url = 'https://scriptorium.narniano.com/livros/thoughts-pensees'
 WHERE id IN ('63e5a2a5-bab4-40aa-8c13-6599a2e9d59c', 'f5ec7190-aca4-426a-971f-083372168099', '99820793-ae56-4c02-b21f-10b5ec731064');

UPDATE quotes SET scriptorium_url = 'https://scriptorium.narniano.com/livros/proslogium-monologium-cur-deus-homo'
 WHERE id IN ('86b18cd8-97d8-4afd-9d72-e3ced0db19b2', 'da523483-97b0-47d7-9448-94ab5e2da21a');

-- sem índice nem downloads e sem outro livro apontando para elas (conferido)
DELETE FROM books WHERE slug IN ('a-cidade-de-deus', 'pensamentos', 'por-que-deus-se-fez-homem');

COMMIT;
