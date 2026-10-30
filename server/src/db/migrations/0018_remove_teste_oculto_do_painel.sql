-- ==============================================================================
-- Remove o último teste do painel de citações (2026-10-30)
--
-- A migration 0017 removeu os 2 rascunhos de teste do primeiro uso do painel, mas só se ainda
-- fossem rascunho. Antes do deploy, o autor ocultou uma delas pela tela (motivo "Teste"), então a
-- proteção da 0017 a poupou, como desenhado. Decisão do autor: remover as duas. Esta migration
-- apaga essa, com a mesma justificativa (citação de teste, sem fonte real; R3: exclusão física só
-- por migration).
--
--  a4b1b4d1  G. K. Chesterton, "Testes"  (oculta, motivo "Teste")
--
-- Protegida igual à 0017: só apaga se o `id` bater, o status for `oculta` e o motivo ainda for
-- "Teste"; se o autor aproveitar a citação (reativar ou mudar), ela fica. Idempotente. O
-- histórico em `quote_events` fica (sem FK em cascata, seção 5 do desenho).
-- ==============================================================================

DELETE FROM quotes
WHERE id = 'a4b1b4d1-7465-4dd3-bc62-f955c5a401c1'
  AND status = 'oculta'
  AND motivo_ocultacao = 'Teste';
