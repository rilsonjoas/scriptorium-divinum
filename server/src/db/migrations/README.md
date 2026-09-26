# Migrations

Rodar: `pnpm db:migrate`. O `deploy.yml` já faz isso dentro do container
da API desde 2026-09-26 — **antes não rodava**, e o efeito era silencioso
(veja abaixo).

## A regra do `when` (armadilha real, 2026-09-26)

O migrator do drizzle aplica uma entrada do journal **apenas se** o
`when` dela for **maior** que o maior `created_at` já gravado em
`drizzle.__drizzle_migrations`. As que ficam para trás são **puladas em
silêncio** — e o migrator imprime `✅ Migrations concluídas` como se
nada faltasse.

Foi exatamente o que aconteceu com `0005_related_edition` (2026-09-26):
deploy verde, `Migrations concluídas` no log, e a coluna
`books.related_edition_slug` **inexistente** — a API devolvia
`relatedEditionSlug: null` e a chave nem aparecia na resposta do
endpoint.

Por isso o `when` do 0005 está deliberadamente no futuro (03/10/2026):
é o que garante que ele ultrapasse qualquer linha gravada com `now()`
por aplicação manual anterior.

**Regra para a próxima:** se uma migração sua "não roda", olhe o `when`
antes de olhar o SQL. E **nunca** edite o SQL de uma migração que já
rodou — suba o `when` e escreva uma nova.

## Como saber se rodou de verdade

Não confie no "Migrations concluídas". Confira o efeito:

```bash
curl -s https://api-scriptorium.narniano.com/api/v1/books/a-cidade-de-deus \
  | python3 -c "import sys,json; print('relatedEditionSlug' in json.load(sys.stdin))"
```

`True` = a coluna existe. `False` = a migração foi pulada, mesmo com o
log dizendo que rodou.
