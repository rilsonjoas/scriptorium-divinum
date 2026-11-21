-- ==============================================================================
-- Oculta 5 obras de faixa D cujo próprio texto mostra tradução moderna como base (2026-11-21)
--
-- Decisão do autor (2026-11-21): "remover do site tudo o que não se tem certeza de direitos".
-- Uma busca de evidência da fonte real no texto das obras de atribuição genérica ("a partir de obra
-- em domínio público") achou 5 cujo próprio bloco de proveniência ou abertura mostra uma tradução
-- moderna como base, o que contradiz a atribuição:
--
--   a-tradicao-apostolica-hipolito, tradicao-apostolica-hipolito (duplicadas)
--       texto de abertura: tradução inglesa de Burton Scott Easton, "Copyright 1934, Cambridge University
--       Press", reimpressa em 1962; a atribuição diz "edição em domínio público"
--   da-oracao-e-vida-contemplativa-tomas-de-aquino, sobre-a-oracao-e-a-vida-contemplativa-tomas-de-aquino (duplicadas)
--       tradução de Hugh Pope OP, R. & T. Washbourne, 1914, "Todos os direitos reservados"
--   de-magistro
--       cotejada com a tradução inglesa de Peter King (Hackett, 1995) e a brasileira de Ângelo Ricci (Paulus)
--
-- Não é parecer jurídico (alguns desses prazos podem ter vencido no Brasil), e sim a regra do autor:
-- sem certeza, sai do ar. Ocultar é reversível. Nenhuma citação ativa aponta para elas (conferido em
-- produção em 2026-11-21). Só mexe em quem ainda está publicada; tira do destaque; idempotente. O estado
-- correspondente está em server/texts/MANIFESTO.json (`oculta`, com o motivo).
-- ==============================================================================

UPDATE books
SET published = false,
    featured = false,
    updated_at = now()
WHERE published = true
  AND slug IN (
    'a-tradicao-apostolica-hipolito',
    'da-oracao-e-vida-contemplativa-tomas-de-aquino',
    'de-magistro',
    'sobre-a-oracao-e-a-vida-contemplativa-tomas-de-aquino',
    'tradicao-apostolica-hipolito'
  );
