# Sondagem: migrar o servidor do Scriptorium para o Zod 4 (30/10/2026)

**Por quê:** `GHSA-mrhx-c7xc-m3w5` (memória esgotada ao validar coleções enormes) só tem correção no Zod 4 (`>= 4.6.6`). Está em `scripts/audit-allowlist.mjs`, com justificativa. **Não é explorável hoje**: só o admin logado manda arrays (com teto desde o PR #26) e nenhuma rota pública valida coleção. Migrar é higiene (tirar a exceção da lista), não correção de brecha.

**O que foi feito:** uma sondagem descartável (branch apagada, nada commitado): `zod@^4.6.7`, helper `zodToJsonSchema` sobre `z.toJSONSchema` no lugar do `zod-to-json-schema` (que não suporta o Zod 4), `z.record(a)` para `z.record(z.string(), a)`. Depois, comparação da OpenAPI gerada (`app.swagger()`) com a da `main`.

## Resultado

| Medida | Resultado |
|---|---|
| Erros de tipo (`tsc`) | 51 antes do helper, **0** depois (49 eram só a assinatura do `zodToJsonSchema`, 2 eram `z.record` com um argumento) |
| Testes unitários | 125/125 |
| Testes de integração | 175/176: o que quebra usa um id de teste que não é UUID RFC válido (`63000000-0000-0000-0000-000000000001`); o `uuid()` do Zod 4 é mais rígido e dá 400 em vez de 404. Corrigir o fixture (UUID v4 válido) |
| Rotas na OpenAPI | as **mesmas 34** |
| Diferenças na OpenAPI | 8 tipos, 155 ocorrências |

**Diferenças aditivas (inofensivas, mas mudam os arquivos `contract/` dos consumidores):** `pattern` nos ids UUID (38), `propertyNames` nos `record` (36), `minimum`/`maximum` nos inteiros (33).

**Diferenças de significado (precisam de correção antes de migrar de verdade):**
1. **`createdAt` (21 ocorrências):** `anyOf: [{string}, {string, format: date-time}]` vira `anyOf: [{string}, {}]`. O `{}` aceita qualquer coisa e faria o tipo gerado nos consumidores colapsar para `unknown`. Trocar `z.string().datetime().or(z.string())` por `z.iso.datetime()` ou `z.string()` e conferir.
2. **Campos com valor padrão viram "obrigatórios" (6 ocorrências):** `limit` da busca; `language`, `published`, `featured`, `licenseType`, `translationIsAi` no cadastro de obra. Causa: o helper usou `io: 'output'`, que conta o padrão como presente. **Esquemas de entrada (query, params, corpo) precisam de `io: 'input'`; só os de resposta usam `'output'`.** O helper tem de receber o modo, não adivinhá-lo.

## Plano para fazer de verdade (não feito hoje)

1. Helper `toJsonSchema(schema, { io })` com o modo explícito por chamada (≈ 10 arquivos de rotas).
2. Corrigir o `createdAt` e o fixture do UUID.
3. Regerar a OpenAPI e exigir **diff só aditivo** contra a de hoje (script de comparação como o desta sondagem, que vale virar teste).
4. `contract:update` e `contract:check` nos três consumidores (Lecionário web e mobile, site do Scriptorium): os tipos gerados não podem mudar (nenhum `unknown` novo).
5. Canário (compara o dicionário com a especificação) e `pnpm audit` sem a exceção; remover `GHSA-mrhx-c7xc-m3w5` de `scripts/audit-allowlist.mjs`.
6. O mesmo caminho na Bíblia na Arte (`server/`, `pnpm-workspace.yaml` tem a exceção): não sondado; esperar o mesmo perfil.

**Estimativa honesta:** algumas horas de trabalho cuidadoso por servidor, com risco real só nos contratos (por isso o passo 3 e o 4). **Recomendação:** fazer em um dia calmo, um servidor por vez, não como pendência no fim de uma sessão longa; o ganho é tirar uma exceção de uma lista, e o risco é um tipo `unknown` chegar em três consumidores.
