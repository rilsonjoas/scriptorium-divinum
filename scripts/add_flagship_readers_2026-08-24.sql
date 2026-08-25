-- ============================================================
-- Ativação de Leitura Online para Obras-Faróis
-- Data: 2026-08-24
--
-- Ativa a leitura online para:
--   1. Imitação de Cristo (Tomás de Kempis) -> /texts/imitacao-de-cristo-pt.md
--   2. Os Últimos Fins do Homem (Padre Manuel Bernardes) -> /texts/os-ultimos-fins-do-homem-pt.md
-- ============================================================

BEGIN;

UPDATE books SET online_read_path = '/texts/imitacao-de-cristo-pt.md'
WHERE slug = 'imitacao-de-cristo';

UPDATE books SET online_read_path = '/texts/os-ultimos-fins-do-homem-pt.md'
WHERE slug = 'os-ultimos-fins-do-homem';

COMMIT;

-- Verificação:
-- SELECT slug, online_read_path FROM books WHERE slug IN ('imitacao-de-cristo', 'os-ultimos-fins-do-homem');
