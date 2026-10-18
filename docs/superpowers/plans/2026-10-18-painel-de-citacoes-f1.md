# Painel de citações, Fase F1: status, filtro de ativas e substituição do dia — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar às citações um `status` (`rascunho|ativa|oculta`), fazer lista, sorteio e dia lerem só as ativas por uma única função, e substituir a escolha gravada do dia quando ela estiver oculta, sem mudar nada do contrato público.

**Architecture:** Uma migration aditiva (colunas `status` e `motivo_ocultacao`, tabela append-only `quote_events`, dois CHECKs). Em `server/src/db/quotes.ts`, uma condição `quotesAtivas()` (R5) usada nos três pontos de leitura pública; `lerEscolhaGravada` passa a exigir ativa e a gravação vira `ON CONFLICT DO UPDATE` quando a gravada está oculta. Nenhuma rota nova, OpenAPI idêntica.

**Tech Stack:** Fastify, Drizzle ORM + drizzle-kit, Postgres, Vitest (unidade e integração), pnpm.

**Spec:** `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md` (seções 4, 5, 6, 6.1, 11 linha F1).

## Global Constraints

- Mudança aditiva: nenhum campo da API pública muda; `contract:check` verde nos 3 consumidores (Lecionário web, mobile, Scriptorium web).
- `status varchar(12) NOT NULL DEFAULT 'ativa'` com `CHECK (status IN ('rascunho','ativa','oculta'))`; as 270 linhas existentes ficam `ativa`.
- `CHECK (status <> 'ativa' OR coalesce(btrim(source), '') <> '')` sem `NOT VALID` (0 linhas violam em 18/10/2026).
- `quote_events.quote_id` **sem** `ON DELETE CASCADE` e sem FK que apague histórico; tabela só recebe INSERT (F2 escreve nela).
- Janela de gravação do dia continua ±30 dias (`JANELA_GRAVACAO_DIAS`); escolha com filtro de autor continua só calculada.
- Nunca `git add -A`; adicionar por caminho. Push na `main` só com autorização do Rilson; trabalhar em branch + PR.
- Teste de mutação obrigatório: remover o filtro de ativas faz o teste novo falhar.
- Ensaio em cópia da produção com `scripts/ensaiar-migrate.sh` antes do deploy; 270 linhas idênticas depois.

## Review Focus

- Citação oculta que é a única do autor: `GET /quotes?author=X` devolve `[]` (não 404), `/quotes/random?author=X` e `/quotes/daily?author=X` devolvem 404.
- Todas as citações ocultas: `/quotes/daily` devolve 404 e não grava `daily_quotes`.
- Dia gravado cuja citação foi ocultada e que está fora da janela hoje±30: não é regravado, só calculado entre as ativas.
- Consultas simultâneas de um dia com gravada oculta: uma linha só, mesma citação para todas.
- Reativar a citação (status volta a `ativa`) não desfaz a substituição já gravada do dia (decisão: a gravação nova vale; só F2 em diante decide fixar de volta).

---

### Task 1: Schema, migration e CHECKs

**Files:**
- Modify: `server/src/db/schema.ts` (tabela `quotes`, linhas ~196-229; novo `quoteEvents` depois de `dailyQuotes`)
- Create: `server/src/db/migrations/0016_*.sql` e `meta/0016_snapshot.json` (gerados) e entrada no `_journal.json`
- Test: `server/src/db/quotes-status.integration.test.ts` (novo, em `src/db/` o nome termina em `.integration.test.ts` para entrar no config)

**Interfaces:**
- Produces: `quotes.status: 'rascunho' | 'ativa' | 'oculta'` (coluna `status`), `quotes.motivoOcultacao: string | null` (coluna `motivo_ocultacao`); tabela `quoteEvents` (`quote_events`: `id uuid pk default random`, `quoteId uuid not null`, `acao varchar(12) not null` com CHECK em `criou|editou|ocultou|reativou|verificou`, `antes jsonb`, `depois jsonb`, `motivo text`, `adminId uuid`, `em timestamptz default now not null`); índice parcial `idx_quotes_ativas` sobre `quotes(author) WHERE status = 'ativa'`.

- [ ] **Step 1: Escrever o teste que falha** em `quotes-status.integration.test.ts` (padrão de `quotes-gravada.integration.test.ts`: `migrate` + `functions.sql`, `TRUNCATE ... quotes CASCADE` no `beforeEach`), com estes casos:
  - `it('citação nova sem status entra como ativa')`: INSERT sem `status` com `source` preenchido → `status = 'ativa'`.
  - `it('status fora da lista é recusado')`: INSERT com `status='apagada'` rejeita (código `23514`).
  - `it('ativa sem fonte é recusada, oculta sem fonte é aceita')`: INSERT `status='ativa'` com `source` nulo ou `'  '` rejeita `23514`; `status='oculta'` com `source` nulo passa.
  - `it('quote_events aceita INSERT e sobrevive à exclusão da citação')`: cria citação, insere evento com `acao='criou'`, `DELETE FROM quotes`, o evento continua (`count = 1`).
  - `it('acao fora da lista é recusada em quote_events')`.
- [ ] **Step 2: Rodar e ver falhar:** `cd server && pnpm test:integration -- quotes-status` → FAIL (coluna `status` não existe). Se o Postgres de teste não estiver de pé: `pnpm test:integration:setup` (banco com "test" no nome; ver nota da BNA sobre bancos separados por projeto).
- [ ] **Step 3: Editar `schema.ts`:** adicionar `status` (`varchar('status', {length: 12}).notNull().default('ativa')`), `motivoOcultacao` (`text('motivo_ocultacao')`), os dois `check(...)` e o `index('idx_quotes_ativas').on(table.author).where(sql\`status = 'ativa'\`)` no array de restrições de `quotes`; declarar `quoteEvents` com o CHECK de `acao`.
- [ ] **Step 4: Gerar a migration:** `pnpm exec drizzle-kit generate --name=citacoes_status_e_eventos`. Conferir o SQL gerado: só ADD COLUMN, CREATE TABLE, ADD CONSTRAINT, CREATE INDEX; nenhum DROP. Se o drizzle não gerar os CHECKs/índice parcial, completar à mão no `.sql` (mantendo o snapshot coerente com `schema.ts`).
- [ ] **Step 5: Rodar o teste:** deve passar. Rodar também `pnpm typecheck`.
- [ ] **Step 6: Commit**
```bash
git add server/src/db/schema.ts server/src/db/migrations server/src/db/quotes-status.integration.test.ts
git commit -m "feat(citacoes): status, motivo de ocultação e tabela de eventos (F1)"
```

### Task 2: `quotesAtivas()` em lista, sorteio e dia

**Files:**
- Modify: `server/src/db/quotes.ts` (`listQuotes`, `getRandomQuote`, `lerEscolhaGravada`)
- Test: `server/src/routes/quotes-ativas.integration.test.ts` (novo)

**Interfaces:**
- Consumes: `quotes.status` da Task 1.
- Produces: `export function quotesAtivas(): SQL` em `quotes.ts` (`eq(quotes.status, 'ativa')`); `listQuotes`, `getRandomQuote` e `lerEscolhaGravada` o combinam com `and(...)`.

- [ ] **Step 1: Escrever os testes que falham** (rotas via `app.inject`, citações inseridas direto em `admin.unsafe`, 5 citações, 1 oculta com `status='oculta'`):
  - `GET /api/v1/quotes` não traz a oculta; `total`/tamanho = 4.
  - `GET /api/v1/quotes/random` (50 chamadas) nunca devolve o id da oculta.
  - `GET /api/v1/quotes/daily?date=<dia>` com a oculta fixada em `daily_quotes` para aquele dia: devolve outra (ver Task 3 para o pedaço da gravação; aqui só o "nunca devolve a oculta").
  - Review Focus: autor com uma só citação, oculta → lista `[]`, `random?author=` e `daily?author=` → 404; todas ocultas → `daily` 404 e `daily_quotes` vazia.
  - `it('rascunho também não é público')`.
- [ ] **Step 2: Rodar e ver falhar** (`pnpm test:integration -- quotes-ativas`): a oculta aparece.
- [ ] **Step 3: Implementar** `quotesAtivas()` e usá-la nos três pontos. `lerEscolhaGravada` ganha `and(eq(dailyQuotes.dateKey, dateKey), quotesAtivas())` no `where`. Um comentário curto no topo da função: "R5: elegibilidade num lugar só".
- [ ] **Step 4: Rodar** os testes novos e `pnpm test:integration -- quotes` (os testes antigos de quotes, gravada e autor continuam verdes).
- [ ] **Step 5: Mutação:** tirar `quotesAtivas()` de `listQuotes`, rodar o teste (tem de falhar), restaurar. Repetir para `getRandomQuote` e `lerEscolhaGravada`. Anotar no PR.
- [ ] **Step 6: Commit**
```bash
git add server/src/db/quotes.ts server/src/routes/quotes-ativas.integration.test.ts
git commit -m "feat(citacoes): lista, sorteio e dia leem só as ativas (R5)"
```

### Task 3: Substituir a escolha gravada que foi ocultada

**Files:**
- Modify: `server/src/db/quotes.ts` (`getDailyQuote`)
- Test: `server/src/routes/quotes-ativas.integration.test.ts` (acrescentar) e conferir `quotes-gravada.integration.test.ts` inalterado

**Interfaces:**
- Consumes: `quotesAtivas()` (Task 2).
- Produces: comportamento de `getDailyQuote(date?, author?)` — se a gravada do dia não é ativa, escolhe de novo entre as ativas (`pickQuoteBySeed`) e **substitui** a linha de `daily_quotes` (`onConflictDoUpdate({ target: dailyQuotes.dateKey, set: { quoteId } })`) quando o dia está na janela; a releitura continua devolvendo a vencedora.

- [ ] **Step 1: Escrever os testes que falham:**
  - `it('dia gravado cuja citação foi ocultada é substituído e a nova escolha é gravada')`: consulta o dia (grava A), `UPDATE quotes SET status='oculta' ... WHERE id=A`, consulta de novo → devolve B ≠ A, `daily_quotes` tem uma linha para o dia apontando para B, e consulta seguinte devolve B.
  - `it('os dias vizinhos não mudam')`: o dia anterior e o seguinte, já gravados, mantêm a citação.
  - `it('consultas simultâneas depois de ocultar gravam uma linha e devolvem a mesma')`: 12 `Promise.all`.
  - `it('reativar a citação não desfaz a substituição')`: A volta a `ativa`, o dia continua em B.
  - `it('fora da janela não regrava')`: dia hoje+60 sem linha continua sem linha (já coberto pelo teste antigo; garantir que o caminho de substituição não grava fora da janela).
  - Mutação alvo: trocar `onConflictDoUpdate` por `onConflictDoNothing` → o primeiro teste falha.
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** em `getDailyQuote`: depois de `lerEscolhaGravada` sem resultado, a gravação usa `onConflictDoUpdate` com `set: { quoteId: escolhida.id }` e **where** `quote_id` atual não ativo (`NOT EXISTS (SELECT 1 FROM quotes WHERE id = daily_quotes.quote_id AND status = 'ativa')`) para que uma gravada ativa nunca seja sobrescrita por uma corrida; a releitura final permanece.
- [ ] **Step 4: Rodar** `pnpm test:integration` inteiro e `pnpm test`, `pnpm typecheck`, `pnpm lint`.
- [ ] **Step 5: Mutação:** `onConflictDoNothing` no lugar do `DoUpdate` → teste falha; restaurar.
- [ ] **Step 6: Commit**
```bash
git add server/src/db/quotes.ts server/src/routes/quotes-ativas.integration.test.ts
git commit -m "feat(citacoes): escolha do dia gravada e oculta é substituída (R4)"
```

### Task 4: Scripts, contrato, ensaio, documentação e PR

**Files:**
- Modify: `server/scripts/verificar-acervo.ts` (links e autores só das ativas; contagem "sem verificação" entre ativas), `server/scripts/export-quotes-canonical.ts` (leva `status` e `motivoOcultacao`; `id` fica para F5), `server/scripts/repair-quote-sources.ts` (cabeçalho "histórico, não rodar: fere R3"), `docs/GERENCIAR-ACERVO.md`, `docs/DECISOES.md`, `ROADMAP.md` (item 20: F1), `hetzner-infra/CONTRATOS-ENTRE-PROJETOS.md` (seção 9: citação oculta some da lista e do dia)
- Test: ensaio e canário (verificação, sem arquivo novo)

**Interfaces:**
- Consumes: Tasks 1 a 3.

- [ ] **Step 1: Ajustar os scripts** conforme a seção 6.1 do desenho; `pnpm acervo:verificar` roda sem erro no banco de teste.
- [ ] **Step 2: Contrato inalterado:** `pnpm exec tsx` do gerador de OpenAPI (ou o comando já usado no CI) e `git diff --stat` na especificação → vazio. No Lecionário web, mobile e Scriptorium web: `pnpm contract:check` verde.
- [ ] **Step 3: Ensaio em cópia da produção:** tirar `pg_dump` (comando no cabeçalho de `scripts/ensaiar-migrate.sh`), rodar `scripts/ensaiar-migrate.sh /tmp/.../prod.sql` (scratchpad, não `/tmp` solto). Esperado: migrate roda duas vezes sem erro, `quotes` = 270, todas `ativa`, `daily_quotes` = 61, `quote_events` = 0, `acervo:verificar` sem erro novo.
- [ ] **Step 4: Documentação no mesmo PR:** `GERENCIAR-ACERVO.md` (o que é `status`, que ocultar ainda é por SQL até a F2, exemplo `UPDATE quotes SET status='oculta', motivo_ocultacao='...' WHERE id=...` com aviso do Gerador); ADR curto em `DECISOES.md` (status em vez de exclusão; R3/R4/R5); `ROADMAP.md` item 20 com "F1 feita"; CONTRATOS seção 9.
- [ ] **Step 5: Abrir PR** da branch `feat/citacoes-status-f1` (`git push -u origin ...` só com a autorização do Rilson, pois o push na `main` dispara deploy; o PR em si não). CI verde.
- [ ] **Step 6: Depois do merge e do deploy (com autorização):** conferir `/api/v1/quotes` = 270, `/quotes/daily` igual ao de antes do deploy, `/health`, canário `ok`, CI da `main` verde, e `pg` com a migration aplicada (`SELECT count(*) FROM quotes WHERE status='ativa'` = 270). Lição de 26/09: CI verde não prova que a migration rodou.
- [ ] **Step 7: Commit** por arquivo alterado (`git add` por caminho) com mensagens `feat(citacoes): ...`, `docs: ...`.

## Auto-revisão

- Cobertura do desenho: seção 5 (Task 1), R5 e seção 6 (Tasks 2-3), 6.1 (Task 4), critérios da linha F1 da seção 11 (ensaio, testes, mutação, OpenAPI inalterada, canário) todos presentes. A API de admin, a tela, o `id` no canônico e o PR do Gerador ficam para F2-F5.
- Nada fora da F1: `quote_events` é criada vazia; ninguém escreve nela até a F2.
