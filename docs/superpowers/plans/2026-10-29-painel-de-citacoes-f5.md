# Painel de citações, F5 (id estável, PR automático do Gerador, canário de conteúdo) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tirar o último motivo para não gravar em produção pela tela: um restore pelo seed passa a **preservar o `id`** (o histórico de `quote_events` e os ids que o Gerador e o canário guardam continuam valendo), a cópia embutida do Gerador passa a ser regerada **por um PR automático**, e o canário passa a perceber **mudança de conteúdo** (hoje só enxerga ids). Ao fim, a escrita em produção pela tela é liberada.

**Architecture:** Três frentes em três repositórios, com PRs separados e uma ordem de publicação: (1) `scriptorium-divinum`: o canônico (`quotes-canonical.json`) ganha `id`; export e restore viram funções testadas em `server/src/db/quotes-canonical.ts` (restore em transação, validação antes de apagar); o aviso da tela passa a apontar para o fluxo automático. (2) `GeradorCSLewis`: um workflow agendado e manual que roda `quotes:sync` e abre o PR. (3) `hetzner-infra`: o canário compara também texto, obra, tema e link de compra da cópia com a API. Por último, um PR só de documentação libera a escrita em produção, depois que as três frentes estiverem no ar e conferidas.

**Tech Stack:** TypeScript, Drizzle/postgres-js, Vitest (integração com `TEST_DATABASE_URL`), React 18 + Testing Library (aviso da tela), GitHub Actions (YAML + `gh`), Python 3 + unittest (canário), Markdown.

**Spec:** `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md` (seções 10 e 11, linha F5; regras R2, R3, R5, R7). Plano anterior: `docs/superpowers/plans/2026-10-29-painel-de-citacoes-f4.md`. Achado que esta fase fecha: o canário não percebe texto, obra ou tema corrigidos (revisão da F4, `docs/DECISOES.md`).

## Global Constraints

- **Não escrever em produção pela tela nem pela API antes da Task 7** (ela só roda depois de tudo verificado). O banco de produção só é **lido** durante toda a F5: nenhuma migration, nenhum `INSERT`/`UPDATE`.
- O canônico guarda, por citação: `id`, `author`, `text`, `source`, `dominioPublico`, `scriptoriumUrl`, `theme`, `fonteUrl`, `verificadoEm`, `status`, `motivoOcultacao`. **Não** guarda `createdAt`/`updatedAt` (nascem de novo no restore) nem `daily_quotes`.
- O restore continua sendo para **ambiente do zero** (`TRUNCATE quotes CASCADE` apaga `daily_quotes`); a recuperação de desastre de verdade é o backup do banco. O manual diz isso.
- Um arquivo inválido **nunca** deixa a tabela vazia: validar tudo antes e fazer `TRUNCATE` + `INSERT` na mesma transação.
- A cópia do Gerador (`src/data/lewis-quotes.snapshot.json`) é regerada **só** por `npm run quotes:sync`; o campo `geradoEm` muda a cada execução, então "tem diferença" **não** pode ser decidido por `git diff`: usar `npm run quotes:sync -- --check` (compara só as citações).
- O PR do Gerador é **automático com merge manual** (chamada do desenho, seção 12, item 5). O repositório `rilsonjoas/GeradorCSLewis` hoje tem `default_workflow_permissions=read` e `can_approve_pull_request_reviews=false`: **o autor precisa liberar** (passo da Task 3, comando colado por ele) antes de o fluxo conseguir abrir PR.
- Canário: retirada continua **erro**; citação nova faltando continua **aviso**; conteúdo diferente numa citação que existe nos dois lados é **aviso** (a reserva segue válida, só desatualizada).
- Testes de servidor: só com `TEST_DATABASE_URL=postgresql://scriptorium_test:scriptorium_test@localhost:5434/scriptorium_divinum_test` e `docker start scriptorium-postgres-test`; rodar `cd server && npx vitest run --config vitest.integration.config.ts <filtro>` (o `pnpm test:integration -- filtro` pendura). Web: `cd web && npx vitest run <filtro>`. Canário: `python3 hetzner-infra/tests/canario-api-cluster.test.py`.
- Commit termina com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; `git add` por caminho, nunca `-A`; PR termina com `🤖 Generated with [Claude Code](https://claude.com/claude-code)`. Branches: `feat/citacoes-painel-f5` (este repo), uma em cada repositório vizinho. PR e merge só com CI verde; o merge dispara deploy e o autor o cola (`gh pr merge N --merge --repo <dono/repo>`; o classificador bloqueia o agente).
- Ordem de publicação: **Gerador (Task 3) → hetzner-infra (Task 4) → este repositório (Tasks 1, 2, 5) → liberação (Task 7)**. O aviso da tela (Task 5) cita o fluxo do Gerador, que precisa existir antes.

## Review Focus

- Arquivo canônico inválido (id faltando, repetido ou fora do formato; status desconhecido; ativa sem fonte) é recusado **antes** de apagar, e a tabela fica como estava (Task 1).
- Restore preserva a ligação com `quote_events`: um evento cujo `quote_id` é o de uma citação restaurada continua achando a citação (Task 1).
- Uma citação `oculta` no canônico volta oculta e **não** aparece na lista pública nem no sorteio depois do restore (R3, R5) (Task 1).
- O fluxo do Gerador **não abre PR** quando só `geradoEm` difere, e uma segunda execução com PR já aberto **atualiza** o mesmo PR em vez de abrir outro (Task 3).
- O canário **não quebra** quando a cópia do GitHub não pode ser lida ou tem item sem `id`, e **não** acusa nada quando a cópia é idêntica (Task 4).
- Depois da liberação, nenhum documento ainda diz "não escreva em produção antes da F5" (Task 7).

---

### Task 1: Export e restore do canônico, com `id`

**Files:**
- Create: `server/src/db/quotes-canonical.ts`
- Modify: `server/scripts/export-quotes-canonical.ts`, `server/scripts/seed-quotes.ts` (viram cascas finas sobre o módulo novo)
- Test: `server/src/db/quotes-canonical.integration.test.ts`

**Interfaces:**
- Consumes: tabela `quotes` (`server/src/db/schema.ts`), `quotesAtivas()` (`server/src/db/quotes.ts`), `quoteEvents`.
- Produces:
  - `export interface CanonicalQuote { id: string; author: string; text: string; source: string | null; dominioPublico: boolean; scriptoriumUrl: string | null; theme: string | null; fonteUrl: string | null; verificadoEm: string | null; status: 'rascunho' | 'ativa' | 'oculta'; motivoOcultacao: string | null }`
  - `export function validarCanonico(dados: unknown): CanonicalQuote[]` (lança `Error` com **todos** os problemas, um por linha, citando o índice e o campo)
  - `export async function exportarCanonico(sql: postgres.Sql): Promise<CanonicalQuote[]>` (ordenado por `author`, `text`; **inclui as não ativas**)
  - `export async function restaurarCanonico(sql: postgres.Sql, dados: unknown): Promise<number>` (valida, depois `BEGIN`, `TRUNCATE quotes CASCADE`, `INSERT` com o `id`, `COMMIT`; devolve quantas inseriu)

- [ ] **Step 1: Write the failing tests** (`quotes-canonical.integration.test.ts`, mesmo molde de `admin-quotes.integration.test.ts`: migrations aplicadas em `beforeAll`):
  - **ida e volta idêntica:** insere 4 citações (uma ativa de Lewis com tema, uma ativa de outro autor com `fonteUrl`/`verificadoEm`, uma oculta com `motivoOcultacao`, um rascunho sem fonte); `exportarCanonico` dá `A`; `restaurarCanonico(A)`; `exportarCanonico` dá `B`; `expect(B).toEqual(A)`, incluindo `id`.
  - **ids preservados e evento continua ligado:** grava um `quote_events` com o `quote_id` de uma delas, restaura, e a citação com esse `id` existe.
  - **oculta continua oculta:** depois do restore, a lista pública (`quotesAtivas`) não tem a oculta nem o rascunho.
  - **arquivo inválido não apaga:** com 3 citações no banco, `restaurarCanonico` com `id` repetido, com `id` faltando, com `id` que não é uuid, com `status: 'banida'` e com ativa sem `source` rejeita cada caso e a tabela segue com as 3 (mesmos ids); a mensagem do erro cita o índice e o campo.
  - **falha no meio desfaz:** simular erro de `INSERT` (segunda linha com `author` de 300 caracteres, acima do `varchar(255)`) e conferir que as 3 originais continuam.
  - `validarCanonico` aceita o formato antigo? **Não:** sem `id` é erro (o canônico novo é obrigatório).

- [ ] **Step 2: Run to verify they fail**

Run: `cd server && export TEST_DATABASE_URL=postgresql://scriptorium_test:scriptorium_test@localhost:5434/scriptorium_divinum_test && npx vitest run --config vitest.integration.config.ts quotes-canonical`
Expected: FAIL (módulo não existe).

- [ ] **Step 3: Implement** o módulo com as assinaturas acima. `validarCanonico` percorre tudo e junta os problemas antes de lançar; uuid por expressão regular de 8-4-4-4-12; ativa exige `source` não vazio (mesma regra do `CHECK quotes_ativa_exige_fonte`). `restaurarCanonico` usa `sql.begin`. Refazer os dois scripts como casca: `export` grava o JSON em `scripts/data/quotes-canonical.json` (campos na ordem da interface); `seed` lê o JSON e chama `restaurarCanonico`. Atualizar os comentários de cabeçalho dos dois (o aviso de "ressuscitar" continua; acrescentar que agora o `id` é preservado).

- [ ] **Step 4: Run tests, typecheck, suíte de integração inteira**

Run: `cd server && npx vitest run --config vitest.integration.config.ts && npx tsc --noEmit`
Expected: PASS (os 152 de antes mais os novos), typecheck limpo.

- [ ] **Step 5: Commit**

```bash
git add server/src/db/quotes-canonical.ts server/src/db/quotes-canonical.integration.test.ts server/scripts/export-quotes-canonical.ts server/scripts/seed-quotes.ts
git commit -m "feat(citacoes): export e restore do canônico preservam o id"
```

---

### Task 2: Canônico com os ids de produção (só leitura)

**Files:**
- Modify: `server/scripts/data/quotes-canonical.json`
- Create: `server/scripts/data/export-quotes-canonical.sql` (a consulta que gera o JSON no formato exato do export, para rodar no banco por `psql`), `server/src/db/quotes-canonical-data.test.ts` (teste unitário do arquivo versionado)
- Modify: `docs/GERENCIAR-ACERVO.md` (como atualizar o canônico a partir de produção)

**Interfaces:**
- Consumes: `validarCanonico` (Task 1); `postgres-shared` no VPS (somente `SELECT`).
- Produces: `quotes-canonical.json` válido, com 270 citações e os ids que estão em produção.

- [ ] **Step 1: Write the failing test** (`quotes-canonical-data.test.ts`, sem banco): lê `scripts/data/quotes-canonical.json`; `validarCanonico` não lança; tem exatamente 270 itens; ids únicos; contagem por `status` é 270 ativas; contém as 145 de "C. S. Lewis"; e para cada item o par `(author, text)` existe no JSON anterior (guardado como fixture mínima de pares em `server/src/db/__fixtures__/pares-canonico-2026-10-29.json`, gerado do arquivo **antes** de mudar), provando que **só o `id` entrou**.

- [ ] **Step 2: Run to verify it fails**

Run: `cd server && npx vitest run src/db/quotes-canonical-data`
Expected: FAIL (o JSON ainda não tem `id`).

- [ ] **Step 3: Gerar o arquivo a partir de produção, só leitura.** Escrever `export-quotes-canonical.sql` com um `SELECT json_agg(json_build_object('id', id, 'author', author, ...) ORDER BY author, text)` que reproduz a ordem de campos da interface; rodar `ssh narniano@debian13-4gb-narniano 'docker exec -i postgres-shared psql -U postgres -d scriptorium_divinum_db -At' < server/scripts/data/export-quotes-canonical.sql` e gravar a saída formatada (`JSON.stringify(x, null, 2) + "\n"`, como o export) em `quotes-canonical.json`. Conferir que o `GET /api/v1/quotes` público devolve os mesmos ids (amostra de 10).

- [ ] **Step 4: Run test to verify it passes; documentar**

Run: `cd server && npx vitest run src/db/quotes-canonical-data`
Expected: PASS. Em `GERENCIAR-ACERVO.md`, trocar a instrução de export antiga pelo comando acima e dizer que o canônico é um **espelho legível e semente de ambiente novo**; a recuperação de desastre é o backup do banco.

- [ ] **Step 5: Commit**

```bash
git add server/scripts/data/quotes-canonical.json server/scripts/data/export-quotes-canonical.sql server/src/db/quotes-canonical-data.test.ts server/src/db/__fixtures__/pares-canonico-2026-10-29.json docs/GERENCIAR-ACERVO.md
git commit -m "feat(citacoes): canônico com os ids de produção"
```

---

### Task 3: Fluxo do Gerador que abre o PR da cópia (repositório `GeradorCSLewis`)

**Files:** (no clone `/home/narniano/Downloads/Programação/1 - Pessoal/gerador-cslewis`, branch `feat/sync-quotes-pr`)
- Create: `.github/workflows/sync-quotes.yml`
- Modify: `README.md` (seção "A cópia embutida"), `ROADMAP.md` (R6b e o procedimento de retirada)

**Interfaces:**
- Consumes: `npm run quotes:sync` e `-- --check` (`scripts/sync-quotes-snapshot.mjs`, só stdlib do Node, sem `npm ci`); `gh` e `GITHUB_TOKEN` do runner.
- Produces: workflow `sync-quotes.yml` com `on: schedule` (diário, 09:00 UTC) e `workflow_dispatch`; branch fixa `chore/sync-quotes-snapshot`; título do PR "chore: regerar a cópia embutida de citações".

- [ ] **Step 1: Write the workflow.** Permissões `contents: write` e `pull-requests: write`. Passos: checkout; `setup-node` 22; **checar**: `npm run quotes:sync -- --check`; se sair 0, terminar sem fazer mais nada (job verde, mensagem "cópia em dia"); se sair 1, rodar `npm run quotes:sync`, `git switch -C chore/sync-quotes-snapshot`, commitar só `src/data/lewis-quotes.snapshot.json` (autor `github-actions[bot]`), `git push --force origin chore/sync-quotes-snapshot`, e abrir o PR **apenas se `gh pr list --head chore/sync-quotes-snapshot --state open` vier vazio**; com PR já aberto, atualizar o corpo com a data. Corpo do PR: o diff esperado em palavras (quantas entram, saem, mudam, contadas comparando os ids e os campos antes e depois) e a lembrança de que o merge dispara o deploy do Gerador.

- [ ] **Step 2: Liberar a permissão (o autor cola, é configuração do repositório).**

```
gh api -X PUT repos/rilsonjoas/GeradorCSLewis/actions/permissions/workflow -f default_workflow_permissions=write -F can_approve_pull_request_reviews=true
```
Expected: sem erro; `gh api repos/rilsonjoas/GeradorCSLewis/actions/permissions/workflow` mostra `can_approve_pull_request_reviews: true`.

- [ ] **Step 3: Ensaio real, três execuções.** (a) Com a cópia em dia: `gh workflow run sync-quotes.yml --repo rilsonjoas/GeradorCSLewis`; esperado: job verde, **nenhum PR**. (b) Numa branch de teste `ensaio/cópia-defasada` (nunca mergeada) com uma citação removida do arquivo da cópia, `gh workflow run ... --ref ensaio/...`; esperado: PR aberto contra `main` com o diff certo. (c) Rodar de novo: esperado **o mesmo PR atualizado**, sem segundo PR. Fechar o PR do ensaio sem merge e apagar a branch de teste e a `chore/sync-quotes-snapshot`.

- [ ] **Step 4: Documentar** no README e no ROADMAP do Gerador (R6b feito; procedimento ao retirar uma citação: o PR chega sozinho em até 1 dia, ou dispare com `gh workflow run sync-quotes.yml --repo rilsonjoas/GeradorCSLewis`).

- [ ] **Step 5: Commit, push, PR**

```bash
git add .github/workflows/sync-quotes.yml README.md ROADMAP.md
git commit -m "feat: fluxo que abre o PR da cópia embutida de citações"
git push -u origin feat/sync-quotes-pr
gh pr create --repo rilsonjoas/GeradorCSLewis --base main --head feat/sync-quotes-pr --title "feat: fluxo que abre o PR da cópia embutida de citações" --body "..."
```
Merge colado pelo autor. O merge de um workflow não dispara o deploy (`paths-ignore` não cobre `.github`, então confira: se o deploy disparar, é só rebuild sem mudança de código e aceitável).

---

### Task 4: Canário compara o conteúdo da cópia (repositório `hetzner-infra`)

**Files:** (no clone `/home/narniano/Downloads/Programação/1 - Pessoal/hetzner-infra`, branch `feat/canario-conteudo-reserva`)
- Modify: `scripts/canario-api-cluster.py` (`comparar_reserva` e o ponto onde ela é chamada), `tests/canario-api-cluster.test.py`, `CONTRATOS-ENTRE-PROJETOS.md` (seção do canário, se citar a regra)

**Interfaces:**
- Consumes: lista da API (`/quotes?author=C. S. Lewis`, cada item com `id`, `text`, `source`, `theme`, `affiliateUrl`) e a cópia (`citacoes` com os mesmos cinco campos).
- Produces: `comparar_reserva(api: dict[str, dict], copia: dict[str, dict]) -> tuple[list[str], list[str]]`, com a mesma regra de antes para retirada (erro) e nova (aviso) e **um aviso a mais**: "N citação(ões) com conteúdo diferente da API (ex.: <id>: texto, obra)". A assinatura muda de conjuntos de ids para dicionários por id; o chamador monta os dicionários.

- [ ] **Step 1: Write the failing tests** (unittest, no estilo dos existentes): cópia idêntica dá `([], [])`; retirada dá erro e nada além; nova faltando dá aviso; **texto diferente** num id que existe nos dois lados dá aviso que cita o id e o campo `texto`; obra, tema e link de compra diferentes idem; só `geradoEm` diferente (campo fora de `citacoes`) não é visto; item da cópia sem `id` é ignorado sem exceção; vários campos diferentes na mesma citação contam **uma** citação.

- [ ] **Step 2: Run to verify they fail**

Run: `cd "/home/narniano/Downloads/Programação/1 - Pessoal/hetzner-infra" && python3 tests/canario-api-cluster.test.py`
Expected: FAIL nos casos novos; os antigos precisam ser adaptados à nova assinatura (fazer isso junto, com o mesmo conteúdo de verificação).

- [ ] **Step 3: Implement** a comparação por id e campo; adaptar o chamador (monta `{id: item}` da API e da cópia, ignorando entradas sem `id` string). Mensagens em português no formato das existentes.

- [ ] **Step 4: Run tests**

Run: `python3 tests/canario-api-cluster.test.py && python3 scripts/canario-api-cluster.py`
Expected: testes passam; o canário real sai "ok" (a cópia de hoje está em dia). Em seguida, **prova com a cópia defasada**: apontar o canário (variável de ambiente já existente ou parâmetro de teste) para um arquivo local com um texto alterado e ver o aviso de conteúdo.

- [ ] **Step 5: Commit, push, PR; publicação**

```bash
git add scripts/canario-api-cluster.py tests/canario-api-cluster.test.py CONTRATOS-ENTRE-PROJETOS.md
git commit -m "feat(canario): compara o conteúdo da cópia do Gerador, não só os ids"
```
Depois do merge (colado pelo autor), atualizar o clone do VPS: `ssh narniano@debian13-4gb-narniano 'cd ~/hetzner-infra && git pull --ff-only'` (o autor cola; escrita no VPS) e conferir a próxima execução do cron: `tail /var/backups/hetzner-infra/canario-api.log` com "ok".

---

### Task 5: Aviso da tela aponta para o fluxo automático

**Files:**
- Modify: `web/src/components/admin/quotes/AvisoGerador.tsx`, `web/src/components/admin/quotes/QuotesPanel.tsx` (texto do toast), `docs/MANUAL-PAINEL-CITACOES.md` (seção 7)
- Test: `web/src/components/admin/quotes/AvisoGerador.test.tsx`, `web/src/components/admin/quotes/QuotesPanel.test.tsx`

**Interfaces:**
- Consumes: workflow `sync-quotes.yml` (Task 3), canário de conteúdo (Task 4).
- Produces: `AvisoGerador` com dois passos principais e o caminho manual como alternativa; a frase do canário para o efeito `mudar` deixa de dizer que ele "não percebe".

- [ ] **Step 1: Write the failing tests.** `AvisoGerador`: o primeiro passo é `gh workflow run sync-quotes.yml --repo rilsonjoas/GeradorCSLewis`; o segundo é "Abrir o PR que o fluxo cria e conferir o diff (o esperado: <frase do efeito>)" com o link do arquivo; há um bloco "Se preferir fazer à mão" com os comandos antigos (`git pull`, `npm run quotes:sync`, `git diff`); para `mudar` a última linha agora diz que o canário **avisa** que o conteúdo difere (aviso, não erro), e para `sair` continua "acusa erro". O toast do painel cita o comando do fluxo.

- [ ] **Step 2: Run to verify they fail**

Run: `cd web && npx vitest run AvisoGerador QuotesPanel`
Expected: FAIL nos casos novos.

- [ ] **Step 3: Implement** a mudança de texto e estrutura; atualizar a seção 7 do manual e a frase "o canário não percebe" nos dois documentos.

- [ ] **Step 4: Suíte, typecheck, lint e axe**

Run: `cd web && npx vitest run && npm run -s typecheck && npx eslint src && npx playwright test e2e/a11y.spec.ts -g admin`
Expected: tudo passa; axe sem violação (o aviso mudou de estrutura).

- [ ] **Step 5: Commit**

```bash
git add web/src/components/admin/quotes/AvisoGerador.tsx web/src/components/admin/quotes/AvisoGerador.test.tsx web/src/components/admin/quotes/QuotesPanel.tsx web/src/components/admin/quotes/QuotesPanel.test.tsx docs/MANUAL-PAINEL-CITACOES.md
git commit -m "feat(painel): aviso do Gerador aponta para o fluxo automático"
```

---

### Task 6: PR deste repositório e publicação em ordem

**Files:** nenhum novo.

- [ ] **Step 1: Suíte completa e revisão final** (servidor: integração inteira; web: tudo; typecheck; build). Revisão por um revisor independente (modelo mais capaz), com o Review Focus acima.
- [ ] **Step 2: Corrigir Critical e Important em uma passada**, com teste que falha antes.
- [ ] **Step 3: Push da branch `feat/citacoes-painel-f5` e PR** com a lista do que mudou e a ordem de publicação; o autor cola os merges na ordem: Gerador (Task 3), hetzner-infra (Task 4) e este.
- [ ] **Step 4: Depois do deploy:** conferir `/health`, `/api/v1/quotes` com 270 citações e os mesmos ids de antes (amostra de 10 contra o canônico), o canário "ok", a primeira execução agendada ou manual do fluxo do Gerador sem PR, o bundle novo e o aviso novo no diálogo de ocultar de uma Lewis (só olhar). Nenhuma escrita.

---

### Task 7: Liberar a escrita em produção (PR só de documentação)

**Files:**
- Modify: `docs/MANUAL-PAINEL-CITACOES.md`, `docs/GERENCIAR-ACERVO.md`, `docs/DECISOES.md`, `ROADMAP.md`, `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md`
- Memória: `project_painel_citacoes.md` e a linha em `MEMORY.md`

Só depois de a Task 6 estar conferida em produção.

- [ ] **Step 1:** Remover o aviso "não grave nada em produção antes da F5" do manual e do `GERENCIAR-ACERVO.md`, e as menções "só depois da F5" (tabela de donos, "Status da citação", "Acrescentar citações"); a migration segue para carga em lote e exclusão física. Registrar no ADR: o que a F5 mudou, o que continua (restore só de ambiente do zero; recuperação de desastre é o backup), e as pendências abertas (canônico fica velho depois de edições pela tela: rodar o export; `daily_quotes` fora do canônico).
- [ ] **Step 2: Conferir que nada ficou contraditório**

Run: `cd "/home/narniano/Downloads/Programação/1 - Pessoal/scriptorium-divinum" && grep -rn "antes da F5\|depois da F5\|só depois da F5" docs/MANUAL-PAINEL-CITACOES.md docs/GERENCIAR-ACERVO.md ROADMAP.md`
Expected: nenhuma linha que ainda proíba a escrita (menções históricas no ADR são aceitas).
- [ ] **Step 3: PR de docs, merge (CI verde) e atualização da spec, do roadmap e da memória.** Dizer ao autor, em uma frase, que a tela pode gravar em produção.
