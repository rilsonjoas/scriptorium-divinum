# Painel de citações, F4 (manual e aviso do Gerador) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer o painel ser o caminho normal para mexer em citações: a tela avisa, na hora certa, quando a cópia embutida do Gerador C. S. Lewis precisa ser regerada, e a documentação (manual da tela e `GERENCIAR-ACERVO.md`) deixa de mandar escrever SQL.

**Architecture:** Uma função pura no front decide se uma mudança altera a cópia do Gerador (`mudaCopiaDoGerador(antes, depois)`), um componente `AvisoGerador` mostra os passos, e o `QuotesPanel` o usa em três lugares: confirmação de ocultar, formulário e toast depois de salvar, ocultar ou reativar. Depois vêm dois documentos: o manual para o autor e a reescrita das seções de citação de `GERENCIAR-ACERVO.md`.

**Tech Stack:** React 18, TypeScript, shadcn/ui (Alert, Dialog), sonner, Vitest + Testing Library, Playwright + axe-core. Documentação em Markdown.

**Spec:** `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md` (seção 10, fase F4 da seção 11; regras R3, R7). Plano anterior: `docs/superpowers/plans/2026-10-26-painel-de-citacoes-f3.md`.

## Global Constraints

- F4 é só interface de aviso e documentação: **nenhuma mudança de API, banco, OpenAPI ou migration.**
- **Não escrever em produção pela tela ou pela API antes da F5.** O manual e o `GERENCIAR-ACERVO.md` repetem esse aviso em destaque até a F5 existir.
- Sem botão de excluir; exclusão física continua só por migration com justificativa (R3, seção 4.3).
- A cópia do Gerador é `src/data/lewis-quotes.snapshot.json` no repositório `rilsonjoas/GeradorCSLewis` (clone local `gerador-cslewis`). O comando é `npm run quotes:sync` (`-- --check` só compara). O arquivo guarda por citação `id`, `text`, `source`, `theme`, `affiliateUrl` e só tem citações **ativas** de "C. S. Lewis".
- `affiliateUrl` no servidor vem de `dominioPublico`, `source` e `author` (`toQuoteDto`, `server/src/db/quotes.ts`).
- O canário (`hetzner-infra/scripts/canario-api-cluster.py`, de hora em hora) acusa cópia com citação retirada (erro) ou sem citação nova (aviso). O aviso da tela não o substitui.
- Aviso de cache continua: Narniano até 6 h, Gerador até 10 min.
- Acessibilidade WCAG 2.2 A+AA: aviso em `Alert` com texto e lista ordenada (nunca só cor); texto sobre fundo claro usa `text-library-wood-foreground` e `text-library-bronze-foreground`. Sem emojis na interface.
- Português do Brasil; comandos em bloco de código.
- Testes de web: `cd web && npx vitest run <filtro>`; typecheck `npm run -s typecheck`; Playwright `npx playwright test e2e/a11y.spec.ts -g admin`. Server não muda (nenhum teste de integração novo).
- Commit termina com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; `git add` por caminho, nunca `-A`. Branch `feat/citacoes-painel-f4`; PR e merge só com CI verde; o merge dispara deploy do front (o autor cola `gh pr merge N --merge --repo rilsonjoas/scriptorium-divinum`, o classificador bloqueia o agente).

## Review Focus

- Autor escrito de outro jeito (`C.S. Lewis`, `c. s. lewis`, espaços) conta como Lewis; `Lewis` sozinho não (Task 1).
- Editar **só** `fonteUrl`/`verificadoEm` de uma Lewis ativa não pede sincronização: a cópia não guarda esses campos (Task 1, Task 3).
- Criar rascunho, editar rascunho ou editar oculta de Lewis não pede sincronização: a cópia só tem ativas (Task 1).
- Trocar o autor **para** Lewis ou **de** Lewis pede sincronização (a citação entra ou sai da cópia) (Task 1).
- Se ocultar ou reativar falha (409, erro de rede), o aviso de sincronização **não** aparece: nada mudou (Task 3).
- Nenhum documento pode contradizer o aviso "não escrever em produção antes da F5" nem mandar, como caminho normal, SQL que a tela já faz (Task 4, Task 5).

---

### Task 1: Regra pura do aviso do Gerador

**Files:**
- Create: `web/src/lib/gerador.ts`
- Test: `web/src/lib/gerador.test.ts`

**Interfaces:**
- Consumes: `chaveDeAutor(nome: string): string` de `web/src/lib/validarCitacao.ts`; tipo `AdminQuote` de `web/src/services/adminQuotes.ts`.
- Produces:
  - `export type CitacaoDoGerador = Pick<AdminQuote, 'author' | 'text' | 'source' | 'theme' | 'dominioPublico' | 'status'>`
  - `export function ehLewis(autor: string): boolean`
  - `export function mudaCopiaDoGerador(antes: CitacaoDoGerador | null, depois: CitacaoDoGerador | null): boolean`
  - `export const GERADOR_COPIA_URL: string` (link do arquivo no GitHub: `https://github.com/rilsonjoas/GeradorCSLewis/blob/main/src/data/lewis-quotes.snapshot.json`)

- [ ] **Step 1: Write the failing test** (`gerador.test.ts`), uma tabela `it.each` com `antes`, `depois` e esperado, mais os de `ehLewis`:
  - `ehLewis`: `'C. S. Lewis'`, `'C.S. Lewis'`, `'c. s. lewis '` são true; `'Lewis'`, `'Santo Agostinho'`, `''` são false.
  - `mudaCopiaDoGerador` true: criar ativa de Lewis (`null` para ativa); ocultar (ativa para oculta); reativar (oculta para ativa); mudar `text`; mudar `source`; mudar `theme`; mudar `dominioPublico`; autor de outro para Lewis (ativa); autor de Lewis para outro (ativa).
  - false: `antes` e `depois` iguais; criar rascunho de Lewis (`null` para rascunho); rascunho para rascunho com texto novo; oculta para oculta com texto novo; ativa de outro autor com texto novo; `null` para ativa de outro autor.
  - O tipo `CitacaoDoGerador` não tem `fonteUrl` nem `verificadoEm`, então "só verificação" é igual por construção: o teste passa dois objetos com os mesmos seis campos e espera false.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web && npx vitest run src/lib/gerador`
Expected: FAIL (módulo não existe).

- [ ] **Step 3: Implement** `ehLewis` (`chaveDeAutor(autor) === 'cslewis'`) e `mudaCopiaDoGerador`: uma função interna `impressao(q)` devolve `null` se `q` é `null`, não está `ativa` ou não é Lewis; senão `JSON.stringify([author normalizado por chaveDeAutor, text, source, theme, dominioPublico])`. A função devolve `impressao(antes) !== impressao(depois)`. Comentário curto no topo dizendo que o espelho é o que `sync-quotes-snapshot.mjs` do Gerador guarda.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web && npx vitest run src/lib/gerador && npm run -s typecheck`
Expected: PASS, typecheck limpo.

- [ ] **Step 5: Commit**

```bash
git add web/src/lib/gerador.ts web/src/lib/gerador.test.ts
git commit -m "feat(painel): regra que diz quando a cópia do Gerador muda"
```

---

### Task 2: Componente `AvisoGerador` e a confirmação de ocultar

**Files:**
- Create: `web/src/components/admin/quotes/AvisoGerador.tsx`
- Modify: `web/src/components/admin/quotes/OcultarDialog.tsx:74-75`
- Test: `web/src/components/admin/quotes/AvisoGerador.test.tsx`, `web/src/components/admin/quotes/OcultarDialog.test.tsx`

**Interfaces:**
- Consumes: `ehLewis`, `GERADOR_COPIA_URL` (Task 1).
- Produces: `export function AvisoGerador({ efeito, id }: { efeito: 'sair' | 'mudar' | 'entrar'; id?: string })`. Renderiza um `Alert` com o título "Depois, atualize a cópia do Gerador C. S. Lewis" e uma lista ordenada:
  1. `cd gerador-cslewis && git pull`
  2. `npm run quotes:sync`
  3. Conferir `git diff src/data/lewis-quotes.snapshot.json`: o esperado é uma frase por efeito (`sair`: "o id <id> sai do arquivo"; `mudar`: "o texto de <id> muda"; `entrar`: "entra uma citação nova"; sem `id` a frase não cita id) e, com link para `GERADOR_COPIA_URL`, o arquivo no GitHub.
  4. Fazer commit, abrir o PR e publicar.
  Última linha: "Se você esquecer, o canário avisa em até 1 hora."

- [ ] **Step 1: Write the failing tests.** `AvisoGerador.test.tsx`: renderiza os quatro passos com os comandos exatos `npm run quotes:sync` e `git diff src/data/lewis-quotes.snapshot.json`; para cada `efeito` a frase esperada aparece (com e sem `id`); o link aponta para `GERADOR_COPIA_URL`; o contêiner tem `role="note"` e não `role="alert"` (é informação, não erro; o `Alert` do shadcn traz `role="alert"` por padrão, então o componente o sobrescreve). `OcultarDialog.test.tsx` (ampliar): ocultar citação de `C.S. Lewis` mostra o aviso com o `id` da citação e a frase "sai do arquivo"; ocultar citação de outro autor não mostra `quotes:sync`; o aviso de cache (6 h e 10 min) continua nos dois casos.

- [ ] **Step 2: Run to verify they fail**

Run: `cd web && npx vitest run AvisoGerador OcultarDialog`
Expected: FAIL.

- [ ] **Step 3: Implement** `AvisoGerador` (shadcn `Alert`, `<ol>`, `<code>` para comandos, link com `rel="noreferrer"` e `target="_blank"` com texto que indica abertura em outra aba) e trocar as linhas 74-75 de `OcultarDialog.tsx`: manter a frase do cache, e quando `ehLewis(quote.author)` renderizar `<AvisoGerador efeito="sair" id={quote.id} />` no lugar do parágrafo antigo.

- [ ] **Step 4: Run tests, typecheck, lint**

Run: `cd web && npx vitest run AvisoGerador OcultarDialog && npm run -s typecheck && npx eslint src/components/admin/quotes`
Expected: PASS, limpo.

- [ ] **Step 5: Commit**

```bash
git add web/src/components/admin/quotes/AvisoGerador.tsx web/src/components/admin/quotes/AvisoGerador.test.tsx web/src/components/admin/quotes/OcultarDialog.tsx web/src/components/admin/quotes/OcultarDialog.test.tsx
git commit -m "feat(painel): aviso do Gerador na confirmação de ocultar"
```

---

### Task 3: Aviso no formulário e depois de salvar, ocultar ou reativar

**Files:**
- Modify: `web/src/components/admin/quotes/QuoteFormDialog.tsx`, `web/src/components/admin/quotes/QuotesPanel.tsx`
- Test: `web/src/components/admin/quotes/QuoteFormDialog.test.tsx`, `web/src/components/admin/quotes/QuotesPanel.test.tsx` (criar se não existir)

**Interfaces:**
- Consumes: `mudaCopiaDoGerador`, `ehLewis` (Task 1); `AvisoGerador` (Task 2); no painel, `formulario.quote` é o `antes` e `r.quote` o `depois`.
- Produces: no formulário, enquanto os valores digitados mudariam a cópia (comparando o estado original da citação, ou `null` na criação, com os valores atuais do formulário), aparece `<AvisoGerador efeito=... />` acima dos botões, com `efeito` `'entrar'` na criação ou quando o autor passa a ser Lewis, `'mudar'` na edição. No painel, depois de sucesso (`salvou`, ocultar, reativar) em que `mudaCopiaDoGerador` é true, um `toast.warning('Atualize a cópia do Gerador C. S. Lewis', { description: 'rode npm run quotes:sync no repositório do Gerador, revise o diff e publique (passo a passo no manual do painel).', duration: 20000 })`.

- [ ] **Step 1: Write the failing tests.**
  - Formulário: abrir **editar** uma Lewis ativa sem digitar nada: sem aviso. Mudar o texto: aparece o aviso `mudar`. Mudar só `fonteUrl` ou `verificadoEm`: sem aviso. Abrir **nova**: sem aviso; digitar autor `C.S. Lewis` com situação `ativa`: aviso `entrar`; com `rascunho`: sem aviso. Editar citação de outro autor trocando o autor para `C. S. Lewis` (ativa): aviso. Editar rascunho de Lewis mudando o texto: sem aviso.
  - Painel (com `adminQuotes` mockado): salvar edição de texto de uma Lewis ativa dispara o toast de aviso; salvar edição só de `fonteUrl` não dispara; ocultar com sucesso uma Lewis dispara; ocultar que falha com 409 **não** dispara; reativar Lewis com sucesso dispara; reativar que falha não dispara; ocultar citação de outro autor não dispara. O toast do sonner é mockado (`vi.mock('sonner')`).

- [ ] **Step 2: Run to verify they fail**

Run: `cd web && npx vitest run QuoteFormDialog QuotesPanel`
Expected: FAIL nos casos novos; os antigos continuam passando.

- [ ] **Step 3: Implement.** No formulário, derivar `depois` dos valores atuais (`author`, `text`, `source`, `theme`, `dominioPublico`, `status`) e `antes` de `quote ?? null`, e renderizar o aviso quando `mudaCopiaDoGerador(antes, depois)`. No painel, uma função `avisarGerador(antes, depois)` chamada só nos caminhos de sucesso de `salvou`, do `onDone` do ocultar (com `antes` a citação ativa e `depois` `{...q, status: 'oculta'}`) e do `reativar` (`antes` oculta, `depois` ativa). Nenhum aviso nos `catch`.

- [ ] **Step 4: Run tests, typecheck, lint, suíte inteira do web**

Run: `cd web && npx vitest run && npm run -s typecheck && npx eslint src/components/admin/quotes`
Expected: tudo passa (250 mais os novos).

- [ ] **Step 5: Commit**

```bash
git add web/src/components/admin/quotes/QuoteFormDialog.tsx web/src/components/admin/quotes/QuoteFormDialog.test.tsx web/src/components/admin/quotes/QuotesPanel.tsx web/src/components/admin/quotes/QuotesPanel.test.tsx
git commit -m "feat(painel): aviso do Gerador no formulário e depois de cada mudança"
```

---

### Task 4: Aviso entra na auditoria axe

**Files:**
- Modify: `web/e2e/a11y.spec.ts`, `web/e2e/fixtures.ts` (a citação de Lewis na lista fixa, se ainda não houver)

**Interfaces:**
- Consumes: `mockAdminApi`, `listaAdminCitacoes`, `adminLogado`, `auditar` (Task 7 da F3).
- Produces: dois testes novos: o diálogo de ocultar aberto numa citação de Lewis e o formulário de edição de uma Lewis com o texto alterado, ambos auditados por axe e com o aviso visível.

- [ ] **Step 1: Write the failing test.** No teste do diálogo de ocultar, abrir a citação de Lewis da fixture, esperar o texto "Depois, atualize a cópia do Gerador C. S. Lewis" e chamar `auditar`. No formulário, abrir editar da Lewis, alterar o texto, esperar o aviso e auditar.

- [ ] **Step 2: Run it**

Run: `cd web && npx playwright test e2e/a11y.spec.ts -g admin`
Expected: os dois novos passam se o aviso já estiver acessível; se axe acusar violação, corrigir o componente (Task 2) e rodar de novo. Registrar no ledger a violação, se houver.

- [ ] **Step 3: Commit**

```bash
git add web/e2e/a11y.spec.ts web/e2e/fixtures.ts
git commit -m "test(painel): aviso do Gerador na auditoria axe"
```

---

### Task 5: Manual da tela

**Files:**
- Create: `docs/MANUAL-PAINEL-CITACOES.md`

**Interfaces:**
- Consumes: comportamento real da tela (F3 e Tasks 2 e 3), `docs/PROTOCOLO-VERIFICACAO-DE-CITACOES.md`, `server/src/scripts/create-admin.ts`.
- Produces: o manual que `GERENCIAR-ACERVO.md` (Task 6) referencia por caminho.

- [ ] **Step 1: Write the manual**, em português, para o autor, na ordem: (1) aviso em destaque: não gravar em produção antes da F5; (2) como entrar (`/admin/login`, e-mail do administrador, o que fazer se esquecer a senha: reset com `dist/scripts/create-admin.js` no container `scriptorium-api`, executado pelo próprio autor, sem colar a senha em conversa); (3) ler o resumo (o que cada número significa; concentração em `Autor 145 (54%)`); (4) filtros e paginação; (5) criar (rascunho por padrão; ativa exige fonte, link e data de verificação; autor com a grafia que já existe; o protocolo de fonte primária); (6) editar (só o que mudou é enviado; 409 e "Carregar a versão atual"); (7) ocultar (motivo, impacto, cache, e o passo do Gerador, com os quatro passos do componente); (8) reativar; (9) histórico; (10) o que a tela não faz (excluir, passar de ativa para rascunho) e como fazer por migration; (11) problemas conhecidos: 404 na rota (service worker antigo: recarga forçada), "Erro interno do servidor" (conferir o log da API e, se for `permission denied`, o dono da tabela, lição de 29/10/2026). Cada comando e caminho citado tem de existir.

- [ ] **Step 2: Verificar que o que o manual cita existe**

Run: `cd "/home/narniano/Downloads/Programação/1 - Pessoal/scriptorium-divinum" && for p in docs/PROTOCOLO-VERIFICACAO-DE-CITACOES.md server/src/scripts/create-admin.ts docs/GERENCIAR-ACERVO.md; do test -e "$p" && echo "ok $p" || echo "FALTA $p"; done; grep -c "quotes:sync" ../gerador-cslewis/package.json`
Expected: três `ok` e `1`.

- [ ] **Step 3: Commit**

```bash
git add docs/MANUAL-PAINEL-CITACOES.md
git commit -m "docs(painel): manual da tela de citações"
```

---

### Task 6: `GERENCIAR-ACERVO.md` com o painel como caminho normal

**Files:**
- Modify: `docs/GERENCIAR-ACERVO.md` (seções "Status da citação...", "API de administração...", "Acrescentar citações", "Links e citações" e o topo "A regra")

**Interfaces:**
- Consumes: manual da Task 5.
- Produces: documento coerente com o desenho (seção 12: "o painel passa a ser o dono; migrations só para exclusão física").

- [ ] **Step 1: Reescrever.**
  - "Acrescentar citações": o caminho normal é a tela (link para o manual); o protocolo de fonte e a regra de grafia ficam; o SQL de `INSERT` desce para uma subseção "Carga em lote (excepcional)", dizendo quando ainda se usa migration (muitas citações de uma vez, exclusão física).
  - "Status da citação": ocultar e reativar pela tela; os `UPDATE` por SQL ficam só como "emergência com a API fora do ar", com backup.
  - Manter, sem enfraquecer, o aviso "Não escreva em produção... antes da F5" e a frase "Excluir de verdade continua sendo migration".
  - Trocar "Não há tela de cadastro de citações" (que deixou de ser verdade) e qualquer referência equivalente, e a menção ao passo do Gerador para apontar para o aviso da tela e o manual.
  - A regra de topo ("seed cria, migration muda, painel manda") passa a valer para citações.

- [ ] **Step 2: Conferir coerência**

Run: `cd "/home/narniano/Downloads/Programação/1 - Pessoal/scriptorium-divinum" && grep -n "Não há tela de cadastro\|antes da F5" docs/GERENCIAR-ACERVO.md docs/MANUAL-PAINEL-CITACOES.md`
Expected: nenhuma ocorrência de "Não há tela de cadastro"; "antes da F5" aparece nos dois arquivos.

- [ ] **Step 3: Commit**

```bash
git add docs/GERENCIAR-ACERVO.md
git commit -m "docs(acervo): painel de citações é o caminho normal"
```

---

### Task 7: Registro, PR e conferência

**Files:**
- Modify: `docs/DECISOES.md` (ADR curto da F4), `ROADMAP.md` (estado e "Retomar daqui"), `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md` (estado da F4)
- Memória: `/home/narniano/.claude/projects/-home-narniano-Documentos-Rilson/memory/project_painel_citacoes.md` e a linha em `MEMORY.md`

- [ ] **Step 1: Escrever o ADR** com: por que a regra de aviso é por conteúdo (só avisa quando a cópia muda), a decisão de toast de 20 s mais aviso no diálogo (o lembrete que não depende de memória é a F5), e o que a F4 não faz. Atualizar `ROADMAP.md` e a spec.

- [ ] **Step 2: Suíte e build completos**

Run: `cd web && npx vitest run && npm run -s typecheck && npx eslint src && npm run -s build 2>&1 | tail -3`
Expected: tudo verde; o único warning de lint é o antigo de `NotesDrawer.tsx`.

- [ ] **Step 3: Commit, push e PR**

```bash
git add docs/DECISOES.md ROADMAP.md docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md
git commit -m "docs(painel): registro da F4"
git push -u origin feat/citacoes-painel-f4
gh pr create --repo rilsonjoas/scriptorium-divinum --base main --head feat/citacoes-painel-f4 --title "feat(painel): F4, aviso do Gerador e manual" --body "..."
```

- [ ] **Step 4: Depois do merge (colado pelo autor) e do deploy**: conferir `/health`, o bundle novo, e que o diálogo de ocultar de uma Lewis mostra o aviso (olhar, sem confirmar). Atualizar a memória.
