-- ==============================================================================
-- Preenche `source` de 4 citações de C. S. Lewis que estavam sem fonte (2026-10-18)
--
-- Origem: docs/AUDITORIA-RETROATIVA-CITACOES-LEWIS.md. O vault do autor já tinha confirmado a
-- fonte destas quatro (✅, auditoria de 21 a 27/09/2026); o banco só não a registrava.
-- Nada de busca nova: copia o que o vault confirma. `fonte_url` e `verificado_em` ficam
-- vazios de propósito (o vault nomeia livro, página ou carta, não uma URL conferida).
--
--  65e113b5  "O menor ato de bondade hoje..."  Cristianismo Puro e Simples, III, cap. 9 (juros compostos)
--  86587b88  "Não podemos confiar em nós mesmos..."  Cristianismo Puro e Simples, p. 98 (ed. inglesa)
--  67b54cc0  "Se você é produto de um universo materialista..."  carta a Sheldon Vanauken, 23/12/1950
--  b50e13d4  "Ele nos amou, não porque somos amáveis..."  The Collected Letters of C. S. Lewis, vol. 3, p. 119
--
-- O `AND source IS NULL` torna a migration idempotente e impede que ela sobrescreva uma
-- fonte que alguém tenha preenchido à mão depois.
-- ==============================================================================

UPDATE quotes SET source = 'Cristianismo Puro e Simples'
WHERE id IN ('65e113b5-1b70-494c-b769-30ae564164de', '86587b88-093e-4239-8678-a87092bf465e')
  AND source IS NULL;

UPDATE quotes SET source = 'Carta a Sheldon Vanauken, 23/12/1950'
WHERE id = '67b54cc0-cf29-4487-87ff-3294a42235ad' AND source IS NULL;

UPDATE quotes SET source = 'The Collected Letters of C. S. Lewis, vol. 3, p. 119'
WHERE id = 'b50e13d4-3ec0-4801-9a98-5d18c825bce2' AND source IS NULL;
