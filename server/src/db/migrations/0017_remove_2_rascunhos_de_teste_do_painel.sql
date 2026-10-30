-- ==============================================================================
-- Remove 2 rascunhos de teste do painel de citações (2026-10-30)
--
-- Origem: primeiro uso real do painel pelo autor, em 30/10/2026. Duas citações criadas só para
-- testar o formulário (texto "Teste" e "Testes"), as duas em rascunho, sem fonte real. Decisão do
-- autor: remover. O painel não tem botão de excluir de propósito (regra R3 do desenho), então a
-- exclusão física é esta migration, com justificativa.
--
--  3d8b3505  Dietrich Bonhoeffer, "Teste"   (17:33 UTC)
--  a4b1b4d1  G. K. Chesterton, "Testes"     (18:02 UTC)
--
-- `AND status = 'rascunho'` protege: se o autor aproveitar uma delas (editar para uma citação
-- real, ativa ou oculta) antes do deploy, ela NÃO é apagada. Idempotente; num banco novo não
-- faz nada. O histórico em `quote_events` fica de propósito (sem FK em cascata, seção 5 do
-- desenho): registra que o teste existiu.
-- ==============================================================================

DELETE FROM quotes
WHERE id IN (
  '3d8b3505-903e-4248-8ba1-8bf9e3e949ec',
  'a4b1b4d1-7465-4dd3-bc62-f955c5a401c1'
)
AND status = 'rascunho';
