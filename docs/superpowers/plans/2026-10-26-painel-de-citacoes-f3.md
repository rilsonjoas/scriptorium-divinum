# Painel de citações, F3 (tela `AdminQuotes`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar ao autor uma tela em `/admin/citacoes` para listar, criar, editar, ocultar, reativar e ver o histórico de citações, usando a API da F2, sem escrever SQL.

**Architecture:** Duas pequenas extensões da API (`diasFixados` por item e filtro `semVerificacao`), depois um serviço tipado no front (`services/adminQuotes.ts`) e componentes de apresentação em `components/admin/quotes/`, compostos por um `QuotesPanel` que a página `AdminQuotes` só embrulha em `AdminLayout`. A validação ao vivo do formulário é uma função pura que espelha as regras da API; o servidor continua sendo a autoridade e seus `issues` aparecem nos campos.

**Tech Stack:** React 18, TypeScript, TanStack Query 5, shadcn/ui (Dialog, Sheet, Table, Badge, Select, Input, Textarea), Tailwind, Vitest + Testing Library (jsdom), Playwright + axe-core, Fastify/Drizzle (extensão da API).

**Spec:** `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md` (seção 8, mais 4, 7 e 12). API que a tela consome: `docs/GERENCIAR-ACERVO.md` (seção "API de administração de citações"). Plano anterior: `docs/superpowers/plans/2026-10-22-painel-de-citacoes-f2.md`.

## Global Constraints

- **Sem botão de excluir** em lugar nenhum da tela (R3 e seção 4.3): só ocultar.
- Rota `/admin/citacoes`, item "Citações" no menu de `AdminLayout`, atrás de `AdminRoute` como as outras.
- Texto de citação sempre como texto (React escapa); nunca `dangerouslySetInnerHTML`.
- Acessibilidade WCAG 2.2 A+AA: todo campo com `<label>`, erros ligados por `aria-describedby`, diálogos do shadcn (foco preso e devolvido), foco visível, selo nunca só por cor. Texto sobre fundo claro usa os tokens `text-library-wood-foreground` e `text-library-bronze-foreground`; **não** usar `library-dourado-texto` sobre claro (A11Y-02).
- Tela entra na auditoria axe (`web/e2e/a11y.spec.ts`) e no teste de foco visível.
- Copiar em português do Brasil, sem emojis na interface.
- `ativa` nova exige `source`, `fonteUrl` e `verificadoEm`; reativar exige `source`; ocultar exige motivo de 3 a 1000 caracteres; texto até 2000 caracteres; `fonteUrl` http/https; `verificadoEm` no formato `AAAA-MM-DD`.
- A tela não oferece a transição `ativa` para `rascunho` (decisão pendente do autor, achado 7 da revisão da F2); a API não muda.
- Aviso de cache ao ocultar: Narniano até 6 h, Gerador C. S. Lewis até 10 min. Se o autor for C. S. Lewis, acrescentar o passo do Gerador (`npm run quotes:sync` no Gerador; texto completo é da F4).
- Testes de servidor: só com `TEST_DATABASE_URL=postgresql://scriptorium_test:scriptorium_test@localhost:5434/scriptorium_divinum_test` e `docker start scriptorium-postgres-test`; rodar com `npx vitest run --config vitest.integration.config.ts <filtro>` (o `pnpm test:integration -- filtro` pendura). Testes de web: `cd web && npx vitest run <filtro>`.
- Commit termina com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; `git add` por caminho, nunca `-A`. Branch `feat/citacoes-painel-f3`; PR e merge só com CI verde; o merge dispara deploy (o autor cola `gh pr merge N --merge --repo rilsonjoas/scriptorium-divinum`, o classificador bloqueia o agente).
- Não escrever em produção pela API antes da F5.

## Review Focus

- `409` ao salvar edição: a mensagem diz que a citação mudou, oferece recarregar e **não apaga o que a pessoa digitou** (Task 3).
- `400` do servidor (grafia de autor, texto duplicado, URL de obra): aparece no campo certo, não só como aviso genérico (Task 2 e Task 3).
- Clique duplo em Salvar/Ocultar/Reativar não envia duas vezes (botão desabilitado enquanto pende) (Task 3 e Task 5).
- Ocultar com motivo curto fica bloqueado; o diálogo mostra os dias fixados e o aviso de cache; Lewis mostra o passo do Gerador (Task 5).
- Lista vazia, filtro sem resultado e erro de rede têm estados próprios (Task 4 e Task 6).
- Página além da última (por exemplo depois de ocultar o único item da última página) volta à última página válida (Task 4).
- Nenhum botão "Excluir" existe (Task 6, teste de ausência).

---

### Task 1: API: `diasFixados` por item e filtro `semVerificacao`

**Files:**
- Modify: `server/src/db/admin-quotes.ts` (`listAdminQuotes`), `server/src/schemas/admin-quotes.schema.ts` (`listAdminQuotesQuerySchema`)
- Modify: `server/src/db/admin-quotes.integration.test.ts`, `server/src/routes/admin-quotes.integration.test.ts`
- Modify: `docs/GERENCIAR-ACERVO.md` (linha da rota de listagem)

**Interfaces:**
- Produces: `export type AdminQuoteItem = AdminQuote & { diasFixados: string[] }` em `db/admin-quotes.ts`; `listAdminQuotes(query).itens` passa a ser `AdminQuoteItem[]`. `diasFixados` são as `date_key` (`AAAA-MM-DD`) de `daily_quotes` em que a citação está gravada, em ordem crescente. `ListAdminQuotesQuery` ganha `semVerificacao?: true` (query string `semVerificacao=true`); ele filtra `status = 'ativa' AND verificado_em IS NULL` e se combina com os outros filtros por AND. `createQuote`/`updateQuote` continuam devolvendo `AdminQuote` (sem `diasFixados`).

- [ ] **Step 1: Write the failing tests.** Em `db/admin-quotes.integration.test.ts` (bloco `listAdminQuotes`): `'diasFixados lista as datas gravadas da citação, em ordem'` (gravar a citação 1 em `2026-01-12` e `2026-01-10` via `gravarEscolhaDoDia`, a 2 em nenhuma; `itens` da 1 tem `['2026-01-10','2026-01-12']`, da 2 tem `[]`); `'semVerificacao=true traz só ativas sem verificado_em'` (seed da lista tem 2 ativas sem verificação, 1 oculta, 1 rascunho: resultado são exatamente as 2 ativas; com `verificado_em` preenchido numa delas, sobra 1). Em `routes/admin-quotes.integration.test.ts`: `'GET ?semVerificacao=true filtra e valor inválido dá 400'`.
- [ ] **Step 2: Run** `cd server && TEST_DATABASE_URL=... npx vitest run --config vitest.integration.config.ts admin-quotes`. Expected: FAIL nos três casos novos.
- [ ] **Step 3: Implement** a subconsulta `(SELECT coalesce(array_agg(d.date_key::text ORDER BY d.date_key), '{}') FROM daily_quotes d WHERE d.quote_id = quotes.id)` no `select` da página (só os itens da página, não o acervo todo), o filtro novo e `semVerificacao: z.literal('true').transform(() => true as const).optional()` no schema da query.
- [ ] **Step 4: Run** os mesmos testes mais `pnpm typecheck`/`npx tsc --noEmit` e `npx eslint src`. Expected: PASS.
- [ ] **Step 5: Commit** (`feat(quotes): diasFixados por item e filtro semVerificacao na listagem`).

---

### Task 2: Cliente da API e serviço `adminQuotes`

**Files:**
- Modify: `web/src/lib/api-client.ts` (guardar o corpo do erro)
- Create: `web/src/services/adminQuotes.ts`, `web/src/services/adminQuotes.test.ts`
- Create/Modify: `web/src/lib/api-client.test.ts`

**Interfaces:**
- Produces (`api-client.ts`): `ApiError` ganha `body?: unknown` (o JSON inteiro do erro) e o helper `export function issuesDe(err: unknown): Record<string, string[]>` (o campo `issues` do corpo; `{}` se não houver) e `export function atualDe<T>(err: unknown): T | undefined` (o campo `atual` do corpo de um `409`). O construtor atual não muda a ordem dos parâmetros; `body` entra como quinto parâmetro opcional.
- Produces (`services/adminQuotes.ts`):
  - tipos `QuoteStatus = 'rascunho' | 'ativa' | 'oculta'`, `AdminQuote` e `QuoteEvent` espelhando `server/src/db/admin-quotes.ts`, `AdminQuoteItem = AdminQuote & { diasFixados: string[] }`, `QuoteListResponse = { itens: AdminQuoteItem[]; total: number; pagina: number; porPagina: number; contadores: { porStatus: Record<QuoteStatus, number>; porAutor: { autor: string; total: number }[]; semVerificacao: number } }`, `QuoteFormValues = { author: string; text: string; source: string; dominioPublico: boolean; scriptoriumUrl: string; theme: string; fonteUrl: string; verificadoEm: string; status: 'rascunho' | 'ativa' }`.
  - `adminQuotes.list(q: { status?: QuoteStatus; author?: string; q?: string; semVerificacao?: boolean; page?: number }): Promise<QuoteListResponse>`
  - `adminQuotes.create(v: QuoteFormValues): Promise<{ quote: AdminQuote; avisos: string[] }>` (campos de texto vazios viram `null`/ausentes no corpo)
  - `adminQuotes.update(id: string, v: Partial<QuoteFormValues>, updatedAt: string): Promise<{ quote: AdminQuote; avisos: string[] }>`
  - `adminQuotes.ocultar(id: string, motivo: string): Promise<{ quote: AdminQuote }>`
  - `adminQuotes.reativar(id: string): Promise<{ quote: AdminQuote }>` — **envia corpo `'{}'`**: o `apiClient` sempre manda `Content-Type: application/json` e o Fastify recusa corpo vazio nesse caso (pendência 6 da F2).
  - `adminQuotes.eventos(id: string): Promise<{ eventos: QuoteEvent[] }>`
  - Query keys: `export const quoteKeys = { all: ['admin-quotes'] as const, list: (q: object) => ['admin-quotes', 'list', q] as const, eventos: (id: string) => ['admin-quotes', 'eventos', id] as const }`.

- [ ] **Step 1: Write the failing tests.** `api-client.test.ts`: um `fetch` simulado que devolve `409` com `{error:'conflict', message:'m', atual:{id:'x'}}` faz `apiClient` lançar `ApiError` com `statusCode 409`, `atualDe(err)` igual a `{id:'x'}`; um `400` com `issues: {text:['repetido']}` dá `issuesDe(err)` igual a `{text:['repetido']}`; `issuesDe(new Error('x'))` é `{}`. `adminQuotes.test.ts` (com `vi.stubGlobal('fetch', ...)` como em `CitacaoDoDia.test.tsx`): `list` monta a query string só com os filtros presentes (`status=oculta&page=2`) e `semVerificacao=true`; `create` manda `POST /api/v1/admin/quotes` com campos vazios omitidos ou nulos (`source: ''` não vai como string vazia); `update` inclui `updatedAt`; `reativar` envia `method: 'POST'` e `body: '{}'`; `ocultar` envia `{motivo}`; nenhum método usa `DELETE` (conferir todas as chamadas do `fetch` simulado).
- [ ] **Step 2: Run** `cd web && npx vitest run api-client adminQuotes`. Expected: FAIL (módulos e exports ausentes).
- [ ] **Step 3: Implement** conforme as interfaces; `apiClient` passa o JSON do erro inteiro como `body`.
- [ ] **Step 4: Run** os mesmos testes e `pnpm typecheck`. Expected: PASS.
- [ ] **Step 5: Commit** (`feat(web): cliente tipado da API de administração de citações`).

---

### Task 3: Formulário de citação com validação ao vivo

**Files:**
- Create: `web/src/lib/validarCitacao.ts`, `web/src/lib/validarCitacao.test.ts`
- Create: `web/src/components/admin/quotes/QuoteFormDialog.tsx`, `web/src/components/admin/quotes/QuoteFormDialog.test.tsx`

**Interfaces:**
- Consumes: `QuoteFormValues`, `AdminQuote`, `adminQuotes`, `issuesDe`, `atualDe` (Task 2).
- Produces (`lib/validarCitacao.ts`): `export const TEXTO_MAX = 2000`; `export function chaveDeAutor(nome: string): string` (minúsculas e só letras e números, igual a `server/src/lib/quote-authors.ts`); `export function validarCitacao(v: QuoteFormValues, ctx: { autoresExistentes: string[]; novo: boolean }): Record<string, string>` — mapa campo → mensagem, vazio quando válido. `novo` é `true` para criar ou publicar rascunho (exige `fonteUrl` e `verificadoEm` se `status = 'ativa'`).
- Produces (`QuoteFormDialog.tsx`): `export function QuoteFormDialog(props: { open: boolean; onOpenChange: (o: boolean) => void; quote?: AdminQuote; autoresExistentes: string[]; onSaved: (r: { quote: AdminQuote; avisos: string[] }) => void })`. Sem `quote` cria; com `quote` edita.

Regras de `validarCitacao`: `author` vazio → erro; autor cuja chave bate com a de um existente de grafia diferente → mensagem `Já existe este autor escrito assim: "X". Use essa grafia.`; grafia idêntica a uma existente é aceita; `text` vazio ou acima de `TEXTO_MAX` → erro; `status = 'ativa'` sem `source` → erro em `source`; `status = 'ativa'` e `novo` sem `fonteUrl` ou `verificadoEm` → erro em cada; `fonteUrl` não vazia e que não começa com `http://` ou `https://` → erro; `verificadoEm` não vazia fora de `AAAA-MM-DD` ou data inexistente → erro.

- [ ] **Step 1: Write the failing tests.** `validarCitacao.test.ts`: um teste por regra acima, com as mensagens esperadas e `{}` para um formulário completo. `QuoteFormDialog.test.tsx` (service `adminQuotes` mockado com `vi.mock('@/services/adminQuotes')`): (a) `'mostra erros ao vivo e mantém Salvar desabilitado enquanto inválido'`; (b) `'digitar C.S. Lewis com C. S. Lewis existente mostra a sugestão e as sugestões vêm de um datalist rotulado'`; (c) `'criar chama adminQuotes.create com os valores e chama onSaved'`; (d) `'editar manda updatedAt da citação aberta'`; (e) `'issues do servidor aparecem no campo certo'` (create rejeita com `ApiError` 400 e `body.issues = { text: ['Já existe uma citação com este texto (id 1)'] }` → a mensagem fica ligada ao textarea por `aria-describedby`); (f) `'409 mostra aviso de que mudou, oferece Recarregar e preserva o texto digitado'` (update rejeita com 409 e `atual`; botão "Carregar a versão atual" troca os campos pela `atual`; antes disso o campo ainda tem o texto digitado); (g) `'duplo clique em Salvar chama o serviço uma vez'`; (h) `'avisos da API aparecem depois de salvar'`; (i) o contador `n / 2000` do texto é anunciado e o texto de citação com `<b>x</b>` não é interpretado como HTML.
- [ ] **Step 2: Run** `cd web && npx vitest run validarCitacao QuoteFormDialog`. Expected: FAIL.
- [ ] **Step 3: Implement** `validarCitacao` (pura) e o diálogo com `react-hook-form` desligado: estado local simples e `validarCitacao` a cada mudança; botão Salvar desabilitado se houver erro ou se estiver pendente; ao salvar com sucesso, `onSaved` e fechar. Em edição o campo `status` oferece só `rascunho` e `ativa` quando a citação é rascunho (publicar), e não aparece para ativa nem oculta.
- [ ] **Step 4: Run** os mesmos testes e `pnpm typecheck`. Expected: PASS.
- [ ] **Step 5: Commit** (`feat(web): formulário de citação com validação ao vivo`).

---

### Task 4: Resumo e lista

**Files:**
- Create: `web/src/components/admin/quotes/QuotesResumo.tsx`, `QuotesLista.tsx` e os dois `.test.tsx`

**Interfaces:**
- Consumes: `QuoteListResponse`, `AdminQuoteItem`, `QuoteStatus` (Task 2).
- Produces:
  - `QuotesResumo(props: { contadores: QuoteListResponse['contadores']; carregando?: boolean })`: mostra total (soma dos três status), ativas, ocultas, rascunhos, "sem verificação" e a concentração dos 5 maiores autores como `Autor N, P%` com `P` sobre as **ativas**, arredondado em inteiro (ex.: `C. S. Lewis 145, 54%` para 145 de 270).
  - `export type Filtros = { status?: QuoteStatus; author?: string; q?: string; semVerificacao?: boolean; page: number }`.
  - `QuotesLista(props: { dados?: QuoteListResponse; carregando: boolean; erro?: Error; filtros: Filtros; autoresExistentes: string[]; onFiltros: (f: Filtros) => void; onEditar: (q: AdminQuoteItem) => void; onOcultar: (q: AdminQuoteItem) => void; onReativar: (q: AdminQuoteItem) => void; onHistorico: (q: AdminQuoteItem) => void; onNova: () => void })`.

Comportamento da lista: tabela com autor, trecho do texto (até 120 caracteres, com reticências), obra, selo de status em texto (`Ativa`, `Oculta`, `Rascunho`), selo `Sem verificação` quando `status = 'ativa'` e `verificadoEm` nulo, selo `Fixada em N dia(s)` quando `diasFixados.length > 0`; ações por linha com `aria-label` que cita a citação (`Editar citação de C. S. Lewis`), "Ocultar" só para ativa e rascunho, "Reativar" só para oculta, "Histórico" sempre; filtro de status (Select), autor (Select com os existentes), busca (Input, com debounce de 300 ms), caixa "Só sem verificação"; paginação anterior/próxima com "Página X de Y"; estados: carregando (esqueleto com `aria-busy`), erro (só a mensagem, com `role="alert"`), vazio sem filtro ("Nenhuma citação cadastrada") e vazio com filtro ("Nenhuma citação com estes filtros" e botão "Limpar filtros"). Se `filtros.page` for maior que o total de páginas, chamar `onFiltros({ ...filtros, page: ultimaPagina })` uma vez.

- [ ] **Step 1: Write the failing tests.** `QuotesResumo`: `'mostra os contadores e a concentração 145 de 270 como 54%'`; `'ativas zero não divide por zero'`. `QuotesLista`: `'linha de ativa sem verificação mostra o selo em texto'`; `'oculta oferece Reativar e não Ocultar; ativa o contrário'`; `'Fixada em 2 dias'` e singular `Fixada em 1 dia`; `'não existe botão Excluir'` (`queryByRole('button', { name: /exclu/i })` nulo em todos os estados); `'busca só chama onFiltros depois de 300 ms'` (fake timers); `'trocar filtro volta para a página 1'`; `'vazio com filtro oferece Limpar filtros'`; `'página além da última pede a última'`; `'erro mostra alerta'`; `'texto com HTML aparece literal'`.
- [ ] **Step 2: Run** `cd web && npx vitest run QuotesResumo QuotesLista`. Expected: FAIL.
- [ ] **Step 3: Implement** os dois componentes com `Table`, `Badge`, `Select`, `Input` do shadcn.
- [ ] **Step 4: Run** os mesmos testes e `pnpm typecheck`. Expected: PASS.
- [ ] **Step 5: Commit** (`feat(web): resumo e lista de citações do painel`).

---

### Task 5: Ocultar com impacto, reativar e histórico

**Files:**
- Create: `web/src/components/admin/quotes/OcultarDialog.tsx`, `EventosSheet.tsx` e os dois `.test.tsx`

**Interfaces:**
- Consumes: `AdminQuoteItem`, `QuoteEvent`, `adminQuotes`, `quoteKeys` (Task 2).
- Produces:
  - `OcultarDialog(props: { quote: AdminQuoteItem | null; onOpenChange: (o: boolean) => void; onDone: (q: AdminQuote) => void })`: aberto quando `quote` não é nulo. Mostra o trecho da citação, textarea "Motivo" (obrigatório, 3 a 1000 caracteres, com contador), o **impacto**: `Está fixada em N dia(s): <datas>. Esses dias passam a mostrar outra citação.` (ou "Não está fixada em nenhum dia."), o aviso de cache (`O Narniano pode continuar mostrando por até 6 horas e o Gerador C. S. Lewis por até 10 minutos.`) e, quando `quote.author` tem a chave `cslewis`, o passo `Atualize a cópia embutida do Gerador: rode npm run quotes:sync no Gerador.`. Botão "Ocultar citação" desabilitado com motivo curto ou pendente; `409` (já oculta) vira mensagem e fecha após recarregar.
  - `EventosSheet(props: { quote: AdminQuoteItem | null; onOpenChange: (o: boolean) => void })`: `Sheet` lateral que busca `adminQuotes.eventos(quote.id)`; cada evento mostra ação em português (`Criada`, `Editada`, `Ocultada`, `Reativada`, `Verificada`), data e hora locais, motivo quando houver e os campos alterados (chaves de `antes`/`depois` com `antes → depois`); estados carregando, vazio ("Sem histórico registrado") e erro.

- [ ] **Step 1: Write the failing tests.** `OcultarDialog`: `'motivo curto mantém o botão desabilitado'`; `'mostra dias fixados com as datas e o aviso de cache'`; `'sem dias fixados diz que não está fixada'`; `'autor C. S. Lewis mostra o passo do Gerador; outro autor não'`; `'confirmar chama ocultar com o motivo e onDone, uma vez só mesmo com duplo clique'`; `'409 mostra mensagem'`. `EventosSheet`: `'lista os eventos com ação em português, motivo e campos alterados'`; `'sem eventos mostra vazio'`; `'erro mostra alerta'`.
- [ ] **Step 2: Run** `cd web && npx vitest run OcultarDialog EventosSheet`. Expected: FAIL.
- [ ] **Step 3: Implement** os dois com `Dialog`/`Sheet` do shadcn e `useQuery` para os eventos.
- [ ] **Step 4: Run** os mesmos testes e `pnpm typecheck`. Expected: PASS.
- [ ] **Step 5: Commit** (`feat(web): ocultar com impacto e histórico por citação`).

---

### Task 6: Painel, página, rota e menu

**Files:**
- Create: `web/src/components/admin/quotes/QuotesPanel.tsx`, `QuotesPanel.test.tsx`, `web/src/pages/admin/AdminQuotes.tsx`
- Modify: `web/src/App.tsx` (rota `/admin/citacoes` atrás de `AdminRoute`), `web/src/components/AdminLayout.tsx` (item "Citações", ícone `Quote` do `lucide-react`, entre Autores e Categorias)

**Interfaces:**
- Consumes: tudo das Tasks 2 a 5.
- Produces: `QuotesPanel()` sem props: estado de filtros, `useQuery` de `adminQuotes.list` com `quoteKeys.list(filtros)` (`placeholderData: keepPreviousData`), diálogos abertos por estado, `invalidateQueries(quoteKeys.all)` depois de qualquer escrita, `toast` de sucesso (`Citação criada`, `Citação atualizada`, `Citação ocultada`, `Citação reativada`) e os `avisos` da API em toast de alerta. A lista de autores do formulário e do filtro vem de `dados.contadores.porAutor`. Reativar chama `adminQuotes.reativar` direto (sem diálogo) e, se a API recusar por falta de `source`, mostra a mensagem do servidor e abre o formulário de edição daquela citação. `AdminQuotes` é `<AdminLayout><QuotesPanel /></AdminLayout>` com `usePageTitle('Citações')` como as outras páginas.

- [ ] **Step 1: Write the failing test** `QuotesPanel.test.tsx` (service mockado; `QueryClientProvider` novo por teste, `retry: false`): `'carrega e mostra contadores e linhas'`; `'Nova citação abre o formulário, salva e a lista é recarregada'`; `'Ocultar abre o diálogo com o impacto e, confirmado, recarrega'`; `'Reativar chama o serviço e recarrega'`; `'Reativar recusada por falta de fonte abre a edição'`; `'Histórico abre a gaveta'`; `'não há botão Excluir na tela'`; `'erro de rede mostra alerta e não quebra'`. Mais um teste no próprio arquivo: o menu de `AdminLayout` contém o link `Citações` para `/admin/citacoes` (render com `MemoryRouter` e `AuthContext` mínimo).
- [ ] **Step 2: Run** `cd web && npx vitest run QuotesPanel`. Expected: FAIL.
- [ ] **Step 3: Implement** o painel, a página, a rota e o item de menu.
- [ ] **Step 4: Run** `npx vitest run` (suíte web inteira), `pnpm typecheck`, `pnpm lint`, `pnpm build`. Expected: PASS, sem erros.
- [ ] **Step 5: Commit** (`feat(web): tela de administração de citações em /admin/citacoes`).

---

### Task 7: Auditoria de acessibilidade, documentação e PR

**Files:**
- Modify: `web/e2e/a11y.spec.ts` (rotas admin com `mockAdminApi`), `web/e2e/fixtures.ts` (fixture `listaAdminCitacoes`)
- Modify: `docs/GERENCIAR-ACERVO.md` (o painel é o caminho normal; migration só para exclusão física), `docs/DECISOES.md` (ADR da F3), `ROADMAP.md` (item 20: F3 feita; "Retomar daqui" aponta para a F4), `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md` (estado)

**Interfaces:**
- Consumes: a página da Task 6.
- Produces: `mockAdminApi(page)` no spec: além do `mockApi` atual, responde `GET **/api/v1/admin/me` com `{ id: 'ad1', email: 'admin@teste.com', name: 'Admin' }` e `GET **/api/v1/admin/quotes?**` com `listaAdminCitacoes` (3 itens: uma ativa sem verificação e fixada em 1 dia, uma oculta com motivo, um rascunho; `contadores` coerentes; autores `C. S. Lewis` e `Santo Agostinho`).

- [ ] **Step 1: Write the failing tests** no `a11y.spec.ts`: `axe-core WCAG 2.2 A+AA — admin: citações` (rota `/admin/citacoes`, espera `networkidle` e uma linha da tabela visível antes de auditar); o mesmo para o diálogo de ocultar aberto (clicar "Ocultar" na linha da ativa e auditar com o diálogo visível); o mesmo para o formulário de nova citação aberto; `foco é visível em tudo que recebe Tab — admin: citações` (extrair a verificação do teste existente para uma função `focoSemIndicador(page): Promise<string[]>` e usá-la nos dois).
- [ ] **Step 2: Run** `cd web && pnpm test:a11y -- --grep "admin"`. Expected: FAIL (fixtures ausentes ou violações a corrigir). Se o Playwright não tiver navegador local, `pnpm exec playwright install chromium` antes.
- [ ] **Step 3: Corrigir** o que o axe e o teste de foco apontarem nos componentes das Tasks 3 a 6 (contraste, rótulos, nomes de botão, foco); registrar no `DECISOES.md` cada violação real achada e corrigida.
- [ ] **Step 4: Run** `pnpm test:a11y` inteiro (as rotas públicas continuam verdes), `pnpm typecheck`, `pnpm lint`, `pnpm build`, `npx vitest run` na web; no servidor `npx vitest run --config vitest.integration.config.ts` e `npx vitest run`, `npx tsc --noEmit`, `npx eslint .`. Expected: tudo verde.
- [ ] **Step 5: OpenAPI e contrato.** Comparar a OpenAPI local com a produção (script em scratchpad que chama `app.inject('/docs/json')`): esperado, nenhuma rota pública alterada, nenhum caminho novo (a F3 só muda o corpo de `GET /admin/quotes`); `contract:check` do site: `igual`.
- [ ] **Step 6: Documentar** nos quatro arquivos. O ADR registra: a tela não oferece `ativa` para `rascunho`; `reativar` envia `{}`; `diasFixados` e `semVerificacao` na API; violações do axe corrigidas; pendências 4, 5, 7, 8 e 9 da F2 que continuam abertas.
- [ ] **Step 7: Commit** (`docs(quotes): F3 feita (tela AdminQuotes) e decisões`), **revisão final independente** (revisor de modelo mais capaz lê o diff da branch contra spec, plano e Review Focus; tratar Critical/Important com teste RED→GREEN), `git push -u origin feat/citacoes-painel-f3`, `gh pr create` (corpo: o que muda e não muda, testes, mutações, resultado do axe, aviso de que o merge dispara deploy).
- [ ] **Step 8: Depois do merge** (o autor cola o comando): conferir produção: `/health` 200; `/quotes` 270 e Lewis 145; dia 19/10 = Bonhoeffer `d633eb9e`; `GET /api/v1/admin/quotes` sem login = 401; `https://scriptorium.narniano.com/admin/citacoes` carrega o app (200); canário `ok`. A navegação autenticada e a escrita real ficam para o autor, **só leitura** até a F5 (não criar, ocultar nem editar citações em produção).

---

## Self-review

- **Cobertura da seção 8:** contadores e concentração por autor (T4), lista com filtros e selos "sem verificação" e "fixada em N dias" (T1, T4), formulário com validação ao vivo e lista de autores existentes (T3), ocultar com impacto, aviso de cache e passo do Gerador (T5), gaveta de histórico (T5), axe e foco visível (T7), rota e menu (T6). O texto completo do aviso do Gerador é da F4.
- **Consistência de nomes:** `AdminQuoteItem`, `QuoteListResponse`, `QuoteFormValues`, `quoteKeys`, `Filtros`, `validarCitacao`, `issuesDe`, `atualDe` são definidos antes de usados.
- **Fora do escopo (YAGNI):** `DELETE`, perfis de administrador, `ativa` para `rascunho`, edição em lote, importação, F4 a F6.
