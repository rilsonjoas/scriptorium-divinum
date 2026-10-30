# F6a: `date` em `GET /artworks/daily` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (nativo) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** a Bíblia na Arte passa a devolver, em `artworks/daily`, a data que ela calculou como "o dia", e o canário passa a conferir que essa data é o "hoje" de São Paulo (fecha a lacuna de fuso da seção 9 do desenho e de CONTRATOS 5).

**Architecture:** mudança aditiva (R1): a resposta da rota `daily` ganha `date: "AAAA-MM-DD"`; a rota `/artworks/:id` e as listas não mudam. Depois do deploy, os três consumidores regeneram o recorte do contrato (`contract:update`, só tipos) e o canário compara `date` com o "hoje" de SP, como já faz com o Scriptorium e o Lecionário.

**Tech Stack:** Fastify + Zod + Vitest (Bíblia na Arte `server/`), Python unittest (canário em `hetzner-infra`), `contract:update` nos três consumidores.

**Spec:** `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md` seção 9 (linha "Fuso") e seção 11 (F6); `hetzner-infra/CONTRATOS-ENTRE-PROJETOS.md` 2.3 e 5.

## Global Constraints

- R1: só campo novo; nenhum campo existente muda de nome, tipo ou obrigatoriedade.
- `date` é a data **pedida** (`?date=`) ou, sem `?date`, `todaySaoPaulo()`; formato `AAAA-MM-DD`; sempre presente na rota `daily`.
- Cache da rota continua `public, max-age=3600, stale-while-revalidate=300`.
- Ordem de entrega obrigatória: BNA em produção **antes** do canário exigir `date` e **antes** do `contract:update` dos consumidores (o recorte vem da especificação de produção).
- Merge/deploy em produção: só o autor cola (`! gh pr merge N --merge --repo ...`).
- Testes de integração do BNA: banco de teste próprio (ver `server/docker-compose.test.ts`/`test:integration:setup`); nunca contra produção.

## Review Focus

- Data pedida no passado ou no futuro (`?date=2025-07-13`): `date` devolve a data pedida, não a de hoje.
- Virada do dia em SP (21:00-03:00 UTC): sem `?date`, `date` é o dia de SP, não o de UTC.
- Obra gravada (caminho `findPersistedDailyArtwork`) e obra calculada devolvem o mesmo `date`.
- `/artworks/:id`, `/artworks` e `/search` não ganham `date` (o schema de resposta compartilhado não pode vazar).
- Canário: resposta sem `date` após o deploy é **erro**, não silêncio; `date` diferente de hoje é erro de fuso.

---

### Task 1: BNA devolve `date` na rota daily

**Files:**
- Modify: `biblia-na-arte/server/src/schemas/response.schema.ts` (novo `dailyArtworkResponseSchema`)
- Modify: `biblia-na-arte/server/src/routes/artworks.ts` (rota `/artworks/daily`: schema de resposta 200 e retorno)
- Test: `biblia-na-arte/server/src/routes/api.integration.test.ts`

**Interfaces:**
- Produces: `dailyArtworkResponseSchema = artworkResponseSchema.extend({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) })`; resposta de `GET /api/v1/artworks/daily` = obra + `date`.

- [ ] **Step 1: testes que falham** em `api.integration.test.ts`: (a) `?date=2025-07-13` responde `date === '2025-07-13'`; (b) `?date=2026-08-23` idem, duas chamadas iguais; (c) sem `?date`, `date` casa `/^\d{4}-\d{2}-\d{2}$/` e é igual a `todaySaoPaulo()`; (d) `GET /api/v1/artworks/:id` de uma obra qualquer **não** tem a chave `date`; (e) a OpenAPI (`app.swagger()`) declara `date` na resposta 200 de `/api/v1/artworks/daily` e não em `/api/v1/artworks/{id}`.
- [ ] **Step 2: rodar e ver falhar.** `cd biblia-na-arte/server && npx vitest run --config vitest.integration.config.ts api.integration -t "Pintura do Dia"`. Expected: (a)-(c), (e) FAIL.
- [ ] **Step 3: implementar.** Schema novo em `response.schema.ts`; na rota, `response: { 200: dailyArtworkJson, ... }` e `return { ...artwork, date: dateStr }`. Não mexer em `getDailyArtwork`.
- [ ] **Step 4: testes passam** (mesmo comando) e a suíte completa de integração + unitários + `tsc` ficam verdes. Expected: PASS.
- [ ] **Step 5: mutação.** Trocar `date: dateStr` por `date: todaySaoPaulo()`: o teste (a) tem de falhar; desfazer.
- [ ] **Step 6: docs no mesmo PR.** Atualizar a descrição da rota (texto do `description` menciona `date`) e a seção de API do README/docs do BNA se citar o formato da resposta. Commit por caminho, com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. PR com `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

### Task 2: Canário confere `date` do BNA

**Files:**
- Modify: `hetzner-infra/scripts/canario-api-cluster.py` (bloco "Bíblia na Arte: Pintura do Dia", e a regra de `OBRA`/dicionário se exigir campos)
- Modify: `hetzner-infra/CONTRATOS-ENTRE-PROJETOS.md` (2.3 e 5: tirar "lacuna conhecida"; 5.1 se citar a lacuna)
- Test: `hetzner-infra/tests/canario-api-cluster.test.py`

**Interfaces:**
- Produces: `conferir_data_do_dia(obj, hoje: str, onde: str) -> list[str]`: `[]` se `obj["date"] == hoje`; `["{onde}: sem 'date' na resposta"]` se ausente ou não string; `["fuso: {onde} diz que hoje é X, SP diz Y"]` se diferente.

- [ ] **Step 1: testes que falham** (unittest): data igual devolve `[]`; ausente devolve erro "sem 'date'"; diferente devolve erro que começa com `fuso:`; objeto não dict devolve erro.
- [ ] **Step 2: rodar.** `python3 hetzner-infra/tests/canario-api-cluster.test.py`. Expected: FAIL (função inexistente).
- [ ] **Step 3: implementar** `conferir_data_do_dia` e chamá-la só para `bna /artworks/daily` (sem `?date`); a chamada com `?date={hoje}` confere `date == hoje` também. Comentário curto dizendo que o BNA passou a devolver a data em 30/10/2026.
- [ ] **Step 4: testes passam** (todos, 77+). Atualizar CONTRATOS 2.3 e 5 (lacuna fechada, com a data). Commit por caminho.

### Task 3: Recortes de contrato dos três consumidores (só tipos)

**Files (cada um):**
- Modify: `lecionario/lecionario-web/contract/biblianaarte.*`, `lecionario/lecionario-mobile/contract/biblianaarte.*`, `scriptorium-divinum/web/contract/biblianaarte.*` (gerados)

- [ ] **Step 1:** só depois do BNA em produção (conferir com `curl -s https://<host-bna>/api/v1/artworks/daily | jq .date`). Em cada consumidor, `npm run contract:update` e depois `npm run contract:check`. Expected: diff só com `date` na rota daily; `check` verde.
- [ ] **Step 2:** `tsc`/`typecheck` e testes de cada consumidor verdes (campo extra não deve quebrar nada). Se um fetcher tipado passar a poder usar `date`, **não** mudar comportamento nesta fase.
- [ ] **Step 3:** um PR pequeno por consumidor (3), cada um só com `contract/`. Avisar o autor de que o deploy do Lecionário mobile (EAS Update) pode disparar sozinho e que é equivalente.

### Task 4: Verificação em produção e registro

- [ ] Depois do deploy do BNA: `curl` de `artworks/daily` com e sem `?date=` (campo presente, cache igual), `/artworks/:id` sem `date`, `/health`, canário rodado à mão `ok`.
- [ ] Registrar em `hetzner-infra/ROADMAP-CLUSTER.md` (F6a feita) e `scriptorium-divinum/ROADMAP.md`; memória `project_painel_citacoes.md`. Próximas fases: F6b (BNA grava ±30 dias, R4; exige gravação sequencial por causa da janela de não repetição e substituição de dias futuros quando uma obra sai por direitos) e F6c (vetores de teste do "hoje" nas 4 implementações): planos próprios.
