-- Correção pontual (25/09/2026): citação falsa do Zig Ziglar que escapou
-- da varredura original porque o texto tem "voltar atrás e" no meio,
-- quebrando o match de substring exata usado na auditoria de 21-25/09.
-- Já documentada como ❌ falsa no banco reutilizável da auditoria
-- (`_Auditoria de Citações de C. S. Lewis.md`).

BEGIN;

DELETE FROM quotes WHERE id = '3324363d-5dd4-411e-a674-ad1044daa8f5';
-- "Você não pode voltar atrás e mudar o começo, mas pode começar onde
--  está e mudar o final." — é do Zig Ziglar, não do Lewis.

COMMIT;
