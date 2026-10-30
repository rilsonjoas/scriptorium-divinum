# F6b: a Bíblia na Arte grava a Pintura do Dia dos próximos 30 dias Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (nativo). Steps usam checkbox.

**Goal:** `GET /artworks/daily?date=D`, com `hoje <= D <= hoje+30` (fuso SP), grava a escolha de todos os dias de hoje até D, em ordem, e a prévia de amanhã deixa de ser instável (R4 do desenho do painel de citações, seção 9).

**Architecture:** `getDailyArtwork` (BNA `server/src/db/queries.ts`) delega a janela de gravação a `garantirEscolhasAte(dateStr, today)`: uma transação com `pg_advisory_xact_lock` que percorre os dias de hoje até `dateStr` em ordem; dia com linha válida segue; dia sem linha (ou com linha de obra que deixou de ser publicável) é calculado e gravado. A ordem importa: a janela de não repetição de cada dia lê as linhas anteriores, então calcular o dia D+5 sem gravar D+1..D+4 daria escolha diferente da sequencial. Datas passadas e acima de hoje+30 continuam só calculadas.

**Tech Stack:** Fastify, Drizzle (`postgres-js`), Vitest de integração (Postgres real de teste).

**Spec:** `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md` seção 9 (linha R4) e seção 11 (F6); `hetzner-infra/CONTRATOS-ENTRE-PROJETOS.md` 2.3.

## Global Constraints

- Contrato público inalterado (mesmo corpo, mesmo cache); só muda **quando** a escolha é gravada.
- Janela de gravação: `DAILY_PERSIST_AHEAD_DAYS = 30` (`lib/daily-artwork.ts`), contada a partir de `today` (`todaySaoPaulo()`); passado nunca grava.
- Escolha sequencial: um dia só é calculado depois de gravados os anteriores da janela.
- Obra gravada que deixou de ser publicável (inativa ou sem imagem) é removida da gravação e o dia é recalculado; o recálculo evita as obras gravadas **antes e depois** do dia (`bothSides`), para não repetir dentro de ±30 dias.
- Dia sem obra calculável não grava e não interrompe os seguintes.
- Merge/deploy em produção: só o autor cola.

## Review Focus

- Pedido de D+30 com nada gravado: grava 31 linhas na ordem, igual à sequência dia a dia.
- Duas requisições simultâneas, de datas diferentes: sem linha duplicada, sem escolha divergente.
- Obra de um dia futuro retirada por direitos: o dia é recalculado, os demais não mudam, nenhuma obra repete dentro da janela.
- `?date=` no passado e além de hoje+30: nada gravado.
- Acervo cresce depois da gravação: dia futuro já gravado não muda.

---

### Task 1: gravação sequencial da janela

**Files:**
- Modify: `biblia-na-arte/server/src/lib/daily-artwork.ts` (constante `DAILY_PERSIST_AHEAD_DAYS`)
- Modify: `biblia-na-arte/server/src/db/queries.ts` (`getRecentDailyArtworkIds`, `findPersistedDailyArtwork`, `computeDailyArtworkId` ganham `exec` e `bothSides`; novo `garantirEscolhasAte`; `getDailyArtwork`)
- Test: `biblia-na-arte/server/src/db/daily-artwork.integration.test.ts`

**Interfaces:**
- Produces: `garantirEscolhasAte(dateStr: string, today: string): Promise<void>` (não exportada); `getDailyArtwork(dateStr, today?)` mantém assinatura e retorno.

- [ ] **Step 1: testes que falham.** (a) substituir "datas futuras e passadas são calculadas sem gravar nada" por: futura dentro da janela grava hoje..D; passada não grava; D = hoje+31 não grava. (b) "pedir D+5 primeiro dá a mesma sequência de pedir dia a dia" (dois cenários, banco limpo entre eles; várias obras no pool). (c) "obra de um dia futuro retirada por direitos: dia recalculado, outros intactos, sem repetição na janela". (d) "chamadas simultâneas de datas diferentes: uma linha por dia e mesmas escolhas". (e) "obra nova no acervo não muda dia futuro já gravado".
- [ ] **Step 2: rodar e ver falhar.** `cd biblia-na-arte/server && npx vitest run --config vitest.integration.config.ts daily-artwork`. Expected: (a)(b)(c)(d)(e) FAIL.
- [ ] **Step 3: implementar** conforme Architecture. `getRecentDailyArtworkIds(dateStr, exec = db, bothSides = false)` com `bothSides` olhando `date` em `[d-30, d+30]` exceto `d`. Dentro de `garantirEscolhasAte`, leituras de `daily_artwork` usam o `tx`.
- [ ] **Step 4: testes passam**; suíte completa de integração (inclui `api.integration`), unitários, `tsc`, lint. Expected: PASS.
- [ ] **Step 5: mutação.** Calcular D sem gravar os anteriores (pular o `for`): (b) tem de falhar; tirar o `bothSides`: (c) tem de falhar; desfazer.

### Task 2: documentação no mesmo PR e verificação em produção

- [ ] Atualizar a `description` da rota `daily` (hoje diz "A obra de hoje é gravada na primeira consulta... `date` passado ou futuro devolve o gravado ou só calcula"), `CONTRATOS-ENTRE-PROJETOS.md` 2.3 (gravação dos próximos 30 dias; como forçar recálculo: `DELETE FROM daily_artwork WHERE date > <hoje>`), `ROADMAP-CLUSTER.md`, `scriptorium-divinum/ROADMAP.md`, memória.
- [ ] Depois do deploy (autor cola o merge): `curl` de `?date=` amanhã duas vezes (mesma obra), `SELECT count(*), min(date), max(date) FROM daily_artwork WHERE date >= current_date` (leitura), canário `ok`, tempo da primeira chamada de `?date=hoje+30` (só uma vez; as seguintes baratas).
- [ ] Registrar o custo/limite: acervo novo só chega aos dias ainda não gravados; trocar já: apagar as linhas futuras.
