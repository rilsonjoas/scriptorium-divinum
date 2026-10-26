# Painel de citações, F2 (API de administração) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expor a API de administração de citações (listar, criar, editar com concorrência otimista, ocultar, reativar, histórico), sem `DELETE`, com um evento em `quote_events` por escrita, na mesma transação.

**Architecture:** Uma camada de dados nova (`db/admin-quotes.ts`) concentra regras e transações; as rotas (`routes/admin-quotes.ts`) só validam o formato e chamam essa camada, sob o mesmo `requireAdmin` de `admin.ts`. Regras de negócio que recusam (autor com grafia nova, texto duplicado, URL de obra não publicada, ativa sem fonte) lançam `ZodError`, para o `400` sair no formato do cluster sem código novo no handler. Só o `409` ganha classe nova (`ConflictError`).

**Tech Stack:** Fastify 5, Drizzle ORM (postgres-js), Zod, zod-to-json-schema, Vitest (testes de integração contra Postgres real).

**Spec:** `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md` (seções 4, 5, 7, 11 e 12). Plano da fase anterior: `docs/superpowers/plans/2026-10-18-painel-de-citacoes-f1.md`.

## Global Constraints

- Mudança é aditiva (R1): a API pública não muda de formato nem de rota; só ganham rotas novas sob `/api/v1/admin/quotes`.
- Retirar é ocultar (R3): **nenhuma rota `DELETE`** em citações.
- `id` estável (R2): `PATCH` nunca altera `id`; o corpo com campo desconhecido é recusado (`.strict()`).
- Toda escrita grava **um** `quote_events` na **mesma transação** (R8). Ações: `criou|editou|ocultou|reativou|verificou`.
- `400` no formato do cluster: `{ error: 'validation_error', message, issues: {campo: [mensagens]}, details: {issues: [...]} }`.
- Ativa exige `source` preenchido (R6, também garantido pelo CHECK `quotes_ativa_exige_fonte`). Para **item novo** ficar `ativa` (criar ativa, ou publicar rascunho) exige também `fonteUrl` e `verificadoEm`. Reativar uma oculta antiga exige só `source`.
- Ocultar exige `motivo` (texto, 3 a 1000 caracteres).
- Autor: chave de `lib/quote-authors.ts` (`chaveDeAutor`). Autor novo é aceito; grafia diferente de um autor existente com a mesma chave é **recusada** com a grafia existente na mensagem.
- Texto: não vazio, no máximo `TEXTO_MAX = 2000` caracteres, e sem duplicata pela chave (minúsculas, só letras e números; mesma regra do autor, acento distingue).
- `scriptoriumUrl`, quando informada, aponta para obra **publicada** (último segmento do caminho = `books.slug` com `published = true`, a regra de `scripts/verificar-acervo.ts`).
- `source`/`dominioPublico` incoerentes com `isCuratedSource` geram **aviso** (campo `avisos` na resposta), nunca bloqueio.
- Testes de integração só com `TEST_DATABASE_URL` (porta 5434, container `scriptorium-postgres-test`); o `.env` local aponta para outro projeto.
- Commit termina com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; `git add` por caminho, nunca `-A`.

## Review Focus

- `updatedAt` com microssegundos: o Postgres guarda `now()` com microssegundos, o JS só milissegundos; comparar em SQL com `date_trunc('milliseconds', updated_at)` ou todo `PATCH` legítimo daria `409` (Task 4).
- `PATCH` que não muda nada: `200` com a linha atual, **sem** evento e **sem** mexer em `updated_at` (Task 4).
- `PATCH` tentando `status: 'oculta'`, `id` ou campo desconhecido: `400` (Task 2 e Task 5).
- `ocultar` numa já oculta e `reativar` numa já ativa: `409` com `error: 'conflict'` (Task 4).
- Texto só de pontuação (chave vazia) ou acima de `TEXTO_MAX`: `400` (Task 2 e Task 3).
- Falha ao gravar o evento desfaz a escrita da citação (atomicidade) (Task 4).
- Histórico de citação já excluída por migration continua legível: `GET /:id/eventos` devolve `200` com os eventos, não `404` (Task 3).

Pendência aceita (registrar no ADR): duas criações simultâneas do mesmo texto podem passar pela checagem de duplicata. Há um único administrador; um índice único sobre a chave exigiria migration e fica para quando houver mais de um.

---

### Task 1: Teste direto do `setWhere` (pendência da F1)

**Files:**
- Modify: `server/src/db/quotes.ts` (extrair o INSERT de `getDailyQuote`)
- Create: `server/src/db/quotes-gravar-dia.integration.test.ts`

**Interfaces:**
- Produces: `export async function gravarEscolhaDoDia(dateKey: string, quoteId: string): Promise<void>` em `db/quotes.ts`. Faz o `INSERT ... ON CONFLICT (date_key) DO UPDATE SET quote_id = ... WHERE NOT EXISTS (citação gravada ativa)` que hoje está inline em `getDailyQuote`; `getDailyQuote` passa a chamá-la. Comportamento idêntico.

- [ ] **Step 1: Write the failing test** em `quotes-gravar-dia.integration.test.ts` (mesmo esqueleto de `quotes-status.integration.test.ts`: `migrate`, `functions.sql`, `TRUNCATE authors, books, quotes, daily_quotes RESTART IDENTITY CASCADE` no `beforeEach`, três citações `A`, `B`, `C` ativas com `source`, ids `41000000-0000-0000-0000-00000000000{1,2,3}`). Casos, com a leitura de `daily_quotes` por SQL direto:
  - `'sem linha do dia: grava'`: `gravarEscolhaDoDia('2026-01-10', B)` → a linha existe com `quote_id = B`.
  - `'linha do dia com citação ativa: NÃO é sobrescrita'`: grava A, depois `gravarEscolhaDoDia(mesmo dia, B)` → continua `A`.
  - `'linha do dia com citação oculta: é substituída'`: grava A, `UPDATE quotes SET status='oculta', motivo_ocultacao='t' WHERE id = A`, `gravarEscolhaDoDia(dia, B)` → `B`.
  - `'linha do dia com citação em rascunho: é substituída'`: idem com `status='rascunho'`.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd server && TEST_DATABASE_URL=postgresql://scriptorium_test:scriptorium_test@localhost:5434/scriptorium_divinum_test pnpm test:integration -- quotes-gravar-dia`
Expected: FAIL (`gravarEscolhaDoDia` não exportada). Se o container estiver parado: `docker start scriptorium-postgres-test`.

- [ ] **Step 3: Implement** `gravarEscolhaDoDia` movendo o bloco `db.insert(dailyQuotes)...onConflictDoUpdate({... setWhere ...})` de `getDailyQuote` para ela, com o comentário R4 junto.

- [ ] **Step 4: Run test to verify it passes**, e rode também `quotes-ativas` (os 12 casos da F1 seguem verdes).

- [ ] **Step 5: Mutação.** Apagar a linha `setWhere` e rodar o novo teste: o caso "NÃO é sobrescrita" tem de falhar. Restaurar a linha e confirmar verde.

- [ ] **Step 6: Commit**

```bash
git add server/src/db/quotes.ts server/src/db/quotes-gravar-dia.integration.test.ts
git commit -m "test(quotes): teste direto do setWhere da escolha do dia"
```

---

### Task 2: Regras puras e schemas Zod

**Files:**
- Create: `server/src/lib/quote-text.ts`, `server/src/lib/quote-text.test.ts`
- Create: `server/src/schemas/admin-quotes.schema.ts`, `server/src/schemas/admin-quotes.schema.test.ts`

**Interfaces:**
- Produces (`lib/quote-text.ts`):
  - `chaveDeTexto(texto: string): string`: minúsculas e só letras e números (`/[^\p{L}\p{N}]+/gu` removido), mesma regra de `chaveDeAutor`.
  - `slugDaUrlDoScriptorium(url: string): string`: último segmento do caminho, sem barra final (a regra de `verificar-acervo.ts`); `''` se não houver.
- Produces (`schemas/admin-quotes.schema.ts`):
  - `export const TEXTO_MAX = 2000`
  - `createQuoteSchema` (`.strict()`): `author` (trim, 1..255), `text` (trim, 1..`TEXTO_MAX`), `source?` (nullable, ≤500), `dominioPublico` (boolean, default `false`), `scriptoriumUrl?` (nullable, ≤500), `theme?` (nullable, ≤50), `fonteUrl?` (nullable, URL http/https), `verificadoEm?` (nullable, `YYYY-MM-DD` que existe no calendário, use `isValidDateKey` de `lib/date.ts`), `status` (`'rascunho' | 'ativa'`, default `'rascunho'`).
  - `updateQuoteSchema` (`.strict()`): os mesmos campos todos opcionais (sem default), `status` só `'rascunho' | 'ativa'`, mais `updatedAt: z.string().datetime()` **obrigatório**.
  - `ocultarQuoteSchema` (`.strict()`): `{ motivo: string trim 3..1000 }`.
  - `listAdminQuotesQuerySchema`: `status?` (`'rascunho'|'ativa'|'oculta'`), `author?`, `q?`, `page` (`z.coerce.number().int().min(1)`, default 1).
  - `quoteIdParamSchema`: `{ id: z.string().uuid() }`.
  - Tipos `CreateQuoteInput`, `UpdateQuoteInput`, `ListAdminQuotesQuery`.

- [ ] **Step 1: Write the failing tests.** `quote-text.test.ts`: `chaveDeTexto('Olá,  Mundo!')` e `chaveDeTexto('olá mundo')` iguais; acento distingue (`'Sao'` ≠ `'São'`); `chaveDeTexto('...  ')` é `''`; `slugDaUrlDoScriptorium('https://scriptorium.narniano.com/livros/confissoes/')` é `'confissoes'`; `slugDaUrlDoScriptorium('')` é `''`. `admin-quotes.schema.test.ts`: `createQuoteSchema` aceita o mínimo (`author`, `text`) e preenche `status: 'rascunho'` e `dominioPublico: false`; recusa `text` com `TEXTO_MAX + 1`, campo desconhecido (`id`), `status: 'oculta'`, `verificadoEm: '2026-02-30'`, `fonteUrl: 'javascript:alert(1)'`; `updateQuoteSchema` recusa corpo sem `updatedAt` e `status: 'oculta'`; `ocultarQuoteSchema` recusa `motivo: 'ab'`.

- [ ] **Step 2: Run** `cd server && pnpm test -- quote-text admin-quotes.schema`. Expected: FAIL (módulos não existem).

- [ ] **Step 3: Implement** os dois arquivos conforme o bloco Interfaces.

- [ ] **Step 4: Run** os mesmos testes. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add server/src/lib/quote-text.ts server/src/lib/quote-text.test.ts server/src/schemas/admin-quotes.schema.ts server/src/schemas/admin-quotes.schema.test.ts
git commit -m "feat(quotes): chave de texto e schemas da API de administração"
```

---

### Task 3: Camada de dados, parte 1: listar, criar, histórico

**Files:**
- Create: `server/src/db/admin-quotes.ts`
- Create: `server/src/db/admin-quotes.integration.test.ts`
- Modify: `server/src/plugins/error-handler.ts` (classe `ConflictError`, usada na Task 4; declarar aqui para as Tasks 4 e 5 só consumirem)

**Interfaces:**
- Produces (`plugins/error-handler.ts`): `export class ConflictError extends Error { constructor(message: string, readonly atual?: unknown) }` e, no handler, `409` com `{ error: 'conflict', message, atual }` (omitir `atual` se `undefined`).
- Produces (`db/admin-quotes.ts`):
  - `interface AdminQuote { id; author; text; source: string | null; dominioPublico: boolean; scriptoriumUrl: string | null; theme: string | null; fonteUrl: string | null; verificadoEm: string | null; status: 'rascunho'|'ativa'|'oculta'; motivoOcultacao: string | null; createdAt: string; updatedAt: string }` (datas em ISO 8601).
  - `interface QuoteEventDto { id; quoteId; acao; antes: unknown; depois: unknown; motivo: string | null; adminId: string | null; em: string }`
  - `createQuote(input: CreateQuoteInput, adminId: string): Promise<{ quote: AdminQuote; avisos: string[] }>`
  - `listAdminQuotes(query: ListAdminQuotesQuery): Promise<{ itens: AdminQuote[]; total: number; pagina: number; porPagina: number; contadores: { porStatus: Record<'rascunho'|'ativa'|'oculta', number>; porAutor: { autor: string; total: number }[]; semVerificacao: number } }>` — `porPagina = 50`; `contadores` são do acervo inteiro, sem filtro nenhum, para a tela mostrar o quadro geral; `semVerificacao` conta as `ativa` com `verificado_em IS NULL`. Filtro `author` usa `whereByAuthor`; `q` busca em `text` e `source` por `ILIKE` com `%` e `_` escapados; ordem `created_at DESC, id`.
  - `listEventos(quoteId: string): Promise<QuoteEventDto[]>`, mais recentes primeiro; **não** exige que a citação exista.
  - Funções internas reutilizadas na Task 4 (mesmo arquivo): `validarAutor(tx, author)`, `validarTexto(tx, text, ignorarId?)`, `validarScriptoriumUrl(tx, url)`, `exigirFonteParaAtiva(quote, { novo: boolean })`, `avisosDe(quote)`, `paraAdminQuote(row)`, `gravarEvento(tx, evento)`. Todas as recusas são `ZodError` com `issues: [{ code: 'custom', path: [campo], message }]`.

- [ ] **Step 1: Write the failing tests** (integração; esqueleto de `quotes-status.integration.test.ts`; `TRUNCATE authors, books, quotes, quote_events RESTART IDENTITY CASCADE`; livros de apoio inseridos por SQL com `published` true e false). Casos de `createQuote`, cada um conferindo o estado do banco por SQL:
  - `'cria rascunho com mínimo e grava evento criou na mesma operação'`: 1 linha em `quotes` (`status='rascunho'`), 1 em `quote_events` (`acao='criou'`, `antes` nulo, `depois.text` igual, `admin_id` igual).
  - `'ativa nova exige source, fonteUrl e verificadoEm'`: sem `fonteUrl` → rejeita com `ZodError` cujo `issues` aponta `fonteUrl`; com tudo → `status='ativa'`.
  - `'recusa grafia nova de autor existente e sugere a existente'`: existe `C. S. Lewis`; criar com `C.S. Lewis` → `ZodError` em `author`, mensagem contém `"C. S. Lewis"`; criar com `C. S. Lewis` exato passa; autor inédito passa.
  - `'recusa texto duplicado pela chave'`: existe `Texto, um.`; criar `texto um` → `ZodError` em `text`; texto só de pontuação (`'...'`) → `ZodError` em `text`.
  - `'recusa scriptoriumUrl de obra inexistente ou não publicada'` e aceita a de obra publicada.
  - `'avisos: obra não curada e não domínio público'`: `avisos` não vazio quando `dominioPublico=false`, `source` preenchido e `!isCuratedSource(author, source)`; vazio no caso curado ou em domínio público.
  - `'nada é gravado quando a validação falha'`: após os `ZodError` acima, `quotes` e `quote_events` continuam vazios.
  - Para `listAdminQuotes`: filtro por `status`, por `author` (variante de grafia), `q` (inclusive `q='%'` literal não casa tudo), paginação (51 itens → página 1 com 50, página 2 com 1, `total` 51) e `contadores`.
  - Para `listEventos`: retorna os eventos de citação que foi excluída por `DELETE FROM quotes` (sobrevive); ordem decrescente.

- [ ] **Step 2: Run** `cd server && TEST_DATABASE_URL=... pnpm test:integration -- admin-quotes`. Expected: FAIL (módulo não existe).

- [ ] **Step 3: Implement** o arquivo e a `ConflictError`. `createQuote` roda em `db.transaction`: valida (autor, texto, URL, regra de ativa), insere, grava o evento `criou` (`depois` = a linha como `AdminQuote`), devolve `{ quote, avisos }`. `validarAutor` compara `chaveDeAutor` em JS contra `SELECT DISTINCT author FROM quotes`; `validarTexto` compara por SQL (`regexp_replace(lower(text), '[^[:alnum:]]+', '', 'g') = chave`) e recusa chave vazia.

- [ ] **Step 4: Run** os mesmos testes. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add server/src/db/admin-quotes.ts server/src/db/admin-quotes.integration.test.ts server/src/plugins/error-handler.ts
git commit -m "feat(quotes): camada de dados do painel (listar, criar, histórico)"
```

---

### Task 4: Camada de dados, parte 2: editar, ocultar, reativar

**Files:**
- Modify: `server/src/db/admin-quotes.ts`
- Modify: `server/src/db/admin-quotes.integration.test.ts`

**Interfaces:**
- Consumes: as funções internas da Task 3.
- Produces:
  - `updateQuote(id: string, input: UpdateQuoteInput, adminId: string): Promise<{ quote: AdminQuote; avisos: string[] }>`
  - `ocultarQuote(id: string, motivo: string, adminId: string): Promise<AdminQuote>`
  - `reativarQuote(id: string, adminId: string): Promise<AdminQuote>`
  - Todas lançam `NotFoundError('Citação')` se o `id` não existe (importar de `plugins/error-handler.js`).

Regras:
- `updateQuote`: carrega a linha com `SELECT ... FOR UPDATE` na transação. `updatedAt` do corpo é comparado com `date_trunc('milliseconds', updated_at)` da linha; diferente → `ConflictError('A citação mudou desde que você a abriu', atual)` com a linha atual. Sem mudança real nos campos enviados → devolve a linha atual, sem evento, sem alterar `updated_at`. Com mudança: `UPDATE ... SET ..., updated_at = now()`; evento `verificou` se os campos alterados forem **só** `fonteUrl` e/ou `verificadoEm`, senão `editou`; `antes`/`depois` levam só os campos alterados. Revalida só o que mudou (autor, texto ignorando o próprio `id`, URL). Mudar `status` de `rascunho` para `ativa` exige `source`, `fonteUrl`, `verificadoEm` (valores já gravados ou enviados); `ativa` para `rascunho` é permitido. Editar a linha `oculta` é permitido, exceto `status` (continua `oculta`; reativar é rota própria): enviar `status` num PATCH de oculta → `ZodError` em `status`.
- `ocultarQuote`: só de `ativa` ou `rascunho` para `oculta`; já `oculta` → `ConflictError`. Grava `motivo_ocultacao`, `updated_at = now()`, evento `ocultou` com `motivo`.
- `reativarQuote`: só de `oculta` para `ativa`; qualquer outro estado → `ConflictError`. Exige `source` preenchido (senão `ZodError` em `source`). Limpa `motivo_ocultacao`, evento `reativou` (o motivo antigo vai em `antes`).

- [ ] **Step 1: Write the failing tests** (mesmo arquivo de integração):
  - `'editar com updatedAt atual funciona mesmo com microssegundos no banco'`: inserir a linha por SQL com `updated_at = '2026-01-01 10:00:00.123456+00'`; `updateQuote` com `updatedAt: '2026-01-01T10:00:00.123Z'` → sucesso (mutação-alvo: comparar sem `date_trunc` quebra este teste).
  - `'updatedAt velho dá ConflictError com a linha atual'`.
  - `'editar o texto de uma ativa propaga: o dia gravado mostra o texto novo'`: grava o dia com `gravarEscolhaDoDia`, edita o texto, `getDailyQuote` devolve o texto novo.
  - `'PATCH sem mudança real: sem evento e updated_at intacto'`.
  - `'só fonteUrl e verificadoEm gera evento verificou; outro campo gera editou, com antes/depois só dos campos alterados'`.
  - `'rascunho para ativa exige fonteUrl e verificadoEm'`; `'status em PATCH de oculta é recusado'`.
  - `'ocultar exige estado ativa ou rascunho; guarda motivo; dia gravado dessa citação é substituído na próxima consulta'` (usa `getDailyQuote` como na F1); `'ocultar duas vezes dá ConflictError'`.
  - `'reativar volta a ativa, limpa o motivo e o evento guarda o motivo antigo em antes'`; `'reativar uma ativa dá ConflictError'`; `'reativar oculta sem source dá ZodError em source'`.
  - `'id inexistente dá NotFoundError nas três'`.
  - `'atomicidade: se o evento falha, a escrita da citação é desfeita'`: no teste, `CREATE FUNCTION falha_evento() RETURNS trigger AS $$ BEGIN RAISE EXCEPTION 'falha de teste'; END $$ LANGUAGE plpgsql` e `CREATE TRIGGER t_falha BEFORE INSERT ON quote_events FOR EACH ROW EXECUTE FUNCTION falha_evento()`; `ocultarQuote` rejeita e a citação continua `ativa`; o trigger é removido num `finally` (`DROP TRIGGER`, `DROP FUNCTION`) para não contaminar os outros testes.

- [ ] **Step 2: Run** `cd server && TEST_DATABASE_URL=... pnpm test:integration -- admin-quotes`. Expected: FAIL nos casos novos.

- [ ] **Step 3: Implement** as três funções conforme as regras acima, cada uma em `db.transaction`.

- [ ] **Step 4: Run** os mesmos testes. Expected: PASS.

- [ ] **Step 5: Mutações** (uma por vez, restaurar depois): (a) trocar `date_trunc('milliseconds', updated_at)` por `updated_at` → o caso de microssegundos falha; (b) gravar o evento fora da `transaction` (usar `db` em vez de `tx`) → o caso de atomicidade falha; (c) remover a checagem de estado em `ocultarQuote` → o caso "ocultar duas vezes" falha.

- [ ] **Step 6: Commit**

```bash
git add server/src/db/admin-quotes.ts server/src/db/admin-quotes.integration.test.ts
git commit -m "feat(quotes): editar com updatedAt, ocultar e reativar com evento transacional"
```

---

### Task 5: Rotas HTTP, registro e testes de ponta a ponta

**Files:**
- Create: `server/src/routes/admin-quotes.ts`
- Create: `server/src/routes/admin-quotes.integration.test.ts`
- Create: `server/src/test-helpers/admin-login.ts`
- Modify: `server/src/app.ts` (registrar `adminQuoteRoutes` ao lado de `adminRoutes`, linha 170)

**Interfaces:**
- Consumes: Tasks 2 a 4.
- Produces: `export async function adminQuoteRoutes(app: FastifyInstance)` com um `app.register` interno e `addHook('preHandler', requireAdmin)` como em `routes/admin.ts`. Tag `admin`. Rotas e respostas:
  - `GET /api/v1/admin/quotes` → `200` com o retorno de `listAdminQuotes`.
  - `POST /api/v1/admin/quotes` → `201` `{ quote, avisos }`.
  - `PATCH /api/v1/admin/quotes/:id` → `200` `{ quote, avisos }`; `404`, `409`, `400`.
  - `POST /api/v1/admin/quotes/:id/ocultar` → `200` `{ quote }`; `404`, `409`, `400`.
  - `POST /api/v1/admin/quotes/:id/reativar` → `200` `{ quote }`; `404`, `409`, `400`.
  - `GET /api/v1/admin/quotes/:id/eventos` → `200` `{ eventos }`.
  - Respostas de erro no schema da rota como `validationErrorJson` de `routes/quotes.ts` (`additionalProperties: true`) para o Fastify não cortar campos; `409` com `{ error, message, atual? }`. O `adminId` vem de `request.adminSession!.adminId`.
- Produces (`test-helpers/admin-login.ts`): `export async function entrarComoAdmin(app, sql: postgres.Sql): Promise<{ cookie: string; adminId: string }>`, que apaga e recria o admin `admin-quotes@teste.com`, faz `POST /api/v1/admin/login` e devolve o par `nome=valor` do cookie (a lógica de `auth.integration.test.ts`).

- [ ] **Step 1: Write the failing tests** (HTTP via `app.inject`, esqueleto de `quotes-ativas.integration.test.ts`, cookie do helper):
  - `'toda rota recusa sem login (401)'`: percorrer as 6 rotas (com `id` UUID qualquer) sem cookie → `401` em todas. Mutação: remover o `addHook` → falha.
  - `'não existe DELETE em citações'`: `DELETE /api/v1/admin/quotes/<uuid>` com cookie → `404`.
  - `'ciclo completo'`: `POST` cria ativa (com `source`, `fonteUrl`, `verificadoEm`) → `201`; `PATCH` com `updatedAt` devolvido → `200`; `PATCH` repetido com o `updatedAt` antigo → `409` com `error: 'conflict'` e `atual`; `POST ocultar` sem `motivo` → `400`; com motivo → `200` e some de `GET /api/v1/quotes`; `POST reativar` → `200` e volta; `GET eventos` → 4 eventos, mais recente primeiro: `reativou, ocultou, editou, criou` (o `PATCH` recusado com `409` não grava evento).
  - `'400 no formato do cluster'`: `POST` com `text: ''` → `statusCode 400`, `error === 'validation_error'`, `issues.text` é array não vazio, `details.issues` existe; idem para a recusa de regra de negócio (grafia nova de autor): mesmo formato, `issues.author[0]` contém a grafia existente.
  - `'PATCH recusa status oculta, id e campo desconhecido (400)'`; `':id` inválido (`/admin/quotes/abc`) → `400`'`; `'GET eventos de citação excluída devolve 200'`.
  - `'a API pública não muda'`: depois do ciclo, `GET /api/v1/quotes` devolve objetos só com as chaves públicas de `quoteSchema` (sem `status`, `fonteUrl`, `motivoOcultacao`, `updatedAt`).

- [ ] **Step 2: Run** `cd server && TEST_DATABASE_URL=... pnpm test:integration -- admin-quotes.integration`. Expected: FAIL (rotas não existem, `404`).

- [ ] **Step 3: Implement** o helper, as rotas e o registro em `app.ts`. Parse de corpo/params/query com os schemas da Task 2 dentro do handler (padrão de `routes/admin.ts`); schema JSON da rota via `zodToJsonSchema` para o Swagger.

- [ ] **Step 4: Run** os testes novos e a suíte inteira: `pnpm test && TEST_DATABASE_URL=... pnpm test:integration` (esperado: tudo verde; F1 tinha 104 integração e 41 unitários, o total só cresce) e `pnpm build` e `pnpm lint` (os que o projeto tiver; conferir `package.json`).

- [ ] **Step 5: Commit**

```bash
git add server/src/routes/admin-quotes.ts server/src/routes/admin-quotes.integration.test.ts server/src/test-helpers/admin-login.ts server/src/app.ts
git commit -m "feat(quotes): rotas de administração de citações (sem DELETE)"
```

---

### Task 6: Contrato, documentação e abertura do PR

**Files:**
- Modify: `docs/GERENCIAR-ACERVO.md` (seção "API de administração de citações": rotas, regras R6, 409, sem DELETE, e que a F3 traz a tela)
- Modify: `docs/DECISOES.md` (ADR da F2 com as chamadas abaixo e a pendência da duplicata simultânea; marcar como feita a pendência do teste do `setWhere`)
- Modify: `ROADMAP.md` (item 20: F2 feita; atualizar "Retomar daqui" para a F3)
- Modify: `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md` (estado do desenho: F2 feita)

Chamadas minhas deste plano, para o ADR (o autor confere): `TEXTO_MAX = 2000`; chave de texto distingue acento; autor inédito é aceito; ocultar/reativar não pedem `updatedAt` (o estado protege); `PATCH` sem mudança real é no-op sem evento; `GET /:id/eventos` não exige citação existente; `409` devolve `atual`; evento `verificou` quando só `fonteUrl`/`verificadoEm` mudam; itens novos exigem fonte completa para ficar ativos, reativar antigo exige só `source`.

- [ ] **Step 1: OpenAPI.** Gerar a OpenAPI do app local (`app.swagger()` num script no scratchpad, ou pela rota `/docs/json` do app de teste) e compará-la com a da produção, como na F1 (saída com ruído: usar `json.JSONDecoder().raw_decode`). Expected: as 29 rotas públicas idênticas; **diferença só nos caminhos novos** `/api/v1/admin/quotes*`. Rodar `contract:check` nos consumidores que o tiverem (Lecionário, Scriptorium web): continua verde, porque os recortes `contract/` só olham rotas públicas. Se algum falhar, parar e investigar antes do PR.

- [ ] **Step 2: Escrever os quatro documentos.**

- [ ] **Step 3: Commit dos docs**

```bash
git add docs/GERENCIAR-ACERVO.md docs/DECISOES.md ROADMAP.md docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md
git commit -m "docs(quotes): F2 feita (API de administração) e decisões"
```

- [ ] **Step 4: Revisão independente.** Um revisor (modelo mais capaz) lê o diff da branch inteira contra a spec, a seção "Review Focus" e as Global Constraints; tratar o que achar antes do PR.

- [ ] **Step 5: PR.** `git push -u origin feat/citacoes-admin-api-f2`, `gh pr create` com a descrição (o que muda, o que não muda, mutações verificadas, resultado da comparação da OpenAPI), terminando com `🤖 Generated with [Claude Code](https://claude.com/claude-code)`. Autorização permanente do autor para a F2: aguardar CI verde, mergear, **não** há migration nesta fase (só deploy de código).

- [ ] **Step 6: Conferir a produção depois do deploy:** `/health` 200; `GET /api/v1/quotes` com 270; Lewis 145; dia 19/10 inalterado (Bonhoeffer, `d633eb9e`); `GET /api/v1/admin/quotes` sem login → `401` (e `DELETE` → `404`); canário no VPS `ok — contratos ok`. Nada escrito em produção por esta fase (as rotas só ganham uso na F3, e eventos reais só depois da F5).

---

## Self-review

- **Cobertura da seção 7 da spec:** listar com contadores (T3), criar (T3), `PATCH` com `updatedAt`/`409` (T4, T5), ocultar com motivo e reativar (T4, T5), eventos (T3, T5), sem `DELETE` (T5), `400` do cluster (T5), autor/texto/URL/aviso (T3), evento na mesma transação (T4). Pendência da F1 do `setWhere` (T1).
- **Consistência de nomes:** `AdminQuote`, `QuoteEventDto`, `createQuote`, `updateQuote`, `ocultarQuote`, `reativarQuote`, `listAdminQuotes`, `listEventos`, `ConflictError`, `gravarEscolhaDoDia`, `entrarComoAdmin` definidos antes de usados.
- **Fora do escopo (YAGNI):** tela (F3), índice único da chave de texto, perfis de administrador, qualquer migration.
