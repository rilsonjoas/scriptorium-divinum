-- Adiciona campos de verificação de fonte à tabela `quotes` e remove a
-- citação fabricada achada em 25/09/2026 (atribuída a "O Cavalo e seu
-- Menino", C. S. Lewis), sem fonte alguma confirmada depois de checagem
-- extensiva (Wikiquote, Goodreads, Marginalia, Brave Search em pt/en —
-- zero rastro em qualquer lugar). Ver nota "Scriptorium Divinum" e
-- "_Auditoria de Citações de C. S. Lewis" no vault pra detalhe completo.
--
-- `fonte_url`/`verificado_em` são NULLABLE de propósito: linhas legadas
-- ficam como "não verificado" (NULL), não é retroauditoria — isso é
-- pendência separada. Só entram preenchidos daqui pra frente, por
-- disciplina de processo (ver docs/PROTOCOLO-VERIFICACAO-DE-CITACOES.md),
-- não por constraint de banco (não dá pra forçar isso sem quebrar as
-- ~740 linhas existentes).

BEGIN;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS fonte_url text;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS verificado_em date;

DELETE FROM quotes WHERE id = '3683c3a4-b0d8-4082-90e2-9eed4e9269d6';
-- "Não há obra de literatura que eu poderia escrever, por mais longa que
--  seja a vida que me é concedida, que expressaria para vocês um milésimo
--  das coisas que estão dentro de mim." — atribuída a "O Cavalo e seu
--  Menino". Estilo (reflexão meta-literária em 1ª pessoa) incompatível com
--  a prosa narrativa do livro; sem ocorrência em nenhuma fonte checada.

COMMIT;
