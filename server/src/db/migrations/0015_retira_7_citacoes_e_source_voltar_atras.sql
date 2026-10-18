-- ==============================================================================
-- Retira 7 citações de C. S. Lewis não localizadas em fonte e preenche 1 `source` (2026-10-18)
--
-- Origem: docs/REGISTRO-VERIFICACAO-CITACOES-LEWIS.md (busca de 18/10/2026 nas 17 citações que o
-- vault não resolvia). Decisão do autor em 18/10/2026, pela política de 25/09/2026
-- (duvidosa sai; nada fica no ar sem procedência). "Não localizada" não prova que seja falsa:
-- se uma for achada depois, volta pelo protocolo, com fonte.
--
--  139977f6  "Uma coisa boa de ler livros velhos é que as modas não os afetam"  paráfrase: a introdução
--            de Lewis a Atanásio NÃO tem essa frase (texto lido); a ideia está na "brisa limpa do mar dos séculos".
--  17f74df7  "A paixão é o que nos leva a prometer..."  sem rastro (condensação de Mere Christianity III.6?).
--  73cf6ff3  "Se tentarmos encontrar algo neste mundo que satisfaça..."  atribuída a Surpreendido pela
--            Alegria; parece síntese do capítulo "Hope" de Mere Christianity (III.10).
--  913c5eef  "A educação sem valores..."  disputada, sem fonte (fora da lista de falsas da Foundation).
--  a3dfbe3b  "O medo de ser 'fora'..."  sem rastro (o tema é o ensaio "The Inner Ring").
--  d5518bea  "O céu não é silencioso..."  sem rastro.
--  fef40aff  "A obediência é o remédio para a cegueira espiritual"  sem rastro.
--
-- A linha de `daily_quotes` de cada uma some em cascata e o dia escolhe outra citação.
--
-- Preenche também o `source` de 0e70882b ("voltar atrás significa progresso"), confirmada em
-- Mere Christianity, Livro I, cap. 5 (paráfrase fiel de "progress means doing an about-turn").
-- `AND source IS NULL` torna idempotente e não sobrescreve fonte preenchida à mão.
-- ==============================================================================

DELETE FROM quotes
WHERE id IN (
  '139977f6-ba73-45a8-bdf1-715b0bd0a7ca',
  '17f74df7-72e1-4848-8214-563574dc7120',
  '73cf6ff3-b13e-4b1a-b5e7-f5c824fb01b5',
  '913c5eef-1113-44f8-b93e-dbd579655c04',
  'a3dfbe3b-ec25-463d-a732-d8f76740f996',
  'd5518bea-e513-4c5a-8cf5-fef7293d37ab',
  'fef40aff-d1f1-4f30-a7fb-0b61c94e3a92'
);

UPDATE quotes SET source = 'Cristianismo Puro e Simples'
WHERE id = '0e70882b-3036-4999-8cf0-4559f09896a1' AND source IS NULL;
