-- ==============================================================================
-- A atribuição pública não diz mais "a edição-fonte não foi auditada" (2026-10-17)
--
-- Decisão do autor: ser transparente sem tirar a confiança de quem lê. A
-- transparência fica em lugar certo: o estado da proveniência de cada obra é
-- registrado em docs/PROVENIENCIA-ACERVO.md e sinalizado pelo verificador
-- (`pnpm --filter server acervo:verificar`: "edição-fonte não nomeada"), e o texto
-- exibido ao público volta a dizer só o que é: tradução gerada por IA, a partir de
-- obra em domínio público, com a licença. A frase genérica "a partir de obra em
-- domínio público" é o marcador usado para achar as obras cuja edição-fonte ainda
-- precisa ser nomeada.
-- ==============================================================================

UPDATE books
SET attribution_text = replace(attribution_text, '; a edição-fonte não foi auditada', '')
WHERE attribution_text LIKE '%; a edição-fonte não foi auditada%';
