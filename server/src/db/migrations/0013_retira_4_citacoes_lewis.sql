-- ==============================================================================
-- Retira 4 citações de C. S. Lewis que o vault do autor marca como falsa ou duvidosa (2026-10-18)
--
-- Origem: docs/AUDITORIA-RETROATIVA-CITACOES-LEWIS.md (cruzamento da API com a auditoria
-- do vault, `_Auditoria de Citações de C. S. Lewis.md`). Decisão do autor em 18/10/2026,
-- pela política de 25/09/2026 (duvidosa sai; nada fica no ar sem procedência).
--
--  4c765bb2  "Eu oro, porque eu não posso me ajudar..."  ❌ fala do filme Terra de Sombras (1993),
--            do personagem Lewis (roteiro de William Nicholson), não de Lewis.
--  15cc0baa  "A coisa mais perigosa... fração da verdade"  ⚠️ não localizada em fonte primária.
--  208426db  "O cristianismo não é doutrina que devemos acreditar..."  ⚠️ idem.
--  033cd665  "Quando acontece algo que nos destrói a vida..."  ⚠️ idem.
--
-- "Duvidosa" quer dizer busca real sem achar a formulação; não prova que seja falsa. Se uma
-- delas for localizada depois, volta pelo protocolo (docs/PROTOCOLO-VERIFICACAO-DE-CITACOES.md),
-- com fonte. A linha de `daily_quotes` de cada uma some em cascata e o dia escolhe outra.
-- ==============================================================================

DELETE FROM quotes
WHERE id IN (
  '4c765bb2-e43a-4aa6-a2e7-5686649744cb',
  '15cc0baa-b0a1-4907-bc57-3ccc46ebbaac',
  '208426db-a16a-407d-b2eb-3114a0120c1a',
  '033cd665-02ac-42b3-87ad-09e65c2b6bae'
);
