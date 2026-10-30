# F7: usabilidade do formulário de citação

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (nativo).

**Goal:** o formulário `QuoteFormDialog` (admin, Scriptorium web) deixa de aceitar texto livre onde a escolha é de uma lista ou de um formato fixo, para o autor não criar inconsistência por digitação e não ter de adivinhar formatos. Achados no primeiro uso real (30/10/2026, autor): endereço sem `https://` prefixado, data sem seletor, autor digitado (grafia livre), e o link da obra no Scriptorium só passava se fosse de uma obra publicada de verdade (a API recusa com razão; o formulário deixava digitar qualquer coisa).

**Architecture:** só o front (`web/`); a API não muda (as regras da seção 7 do desenho seguem sendo a defesa de verdade). Funções puras novas em `web/src/lib/formularioCitacao.ts`; o diálogo as usa. Fonte das obras publicadas: `booksService.getAll({ limit: 100, includeUnavailable: true })` (API pública, 54 obras hoje).

**Tech Stack:** React, Vitest + Testing Library, axe (Playwright `e2e/a11y.spec.ts`).

**Spec:** `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md` seção 8 (formulário "com validação ao vivo... e a lista de autores existentes para evitar grafia nova").

## Global Constraints

- A API e a OpenAPI não mudam. O valor enviado continua o mesmo (`author` string, `fonteUrl` com esquema, `verificadoEm` `AAAA-MM-DD`, `scriptoriumUrl` `https://scriptorium.narniano.com/livros/<slug>`).
- Autor inédito continua aceito (seção 7 do desenho): vira opção "Outro autor (novo)…" que revela o campo de texto, com a mesma validação de grafia parecida.
- Data de verificação **sem valor padrão**: preencher "hoje" sozinho convidaria a registrar conferência que não aconteceu. Há um botão "Hoje", que é um clique consciente, e o seletor nativo não aceita data futura.
- Sem emoji na interface; acessível (rótulos, `aria-describedby`, foco); axe 5/5.

## Review Focus

- Editar citação cujo autor não está na lista (legado) ou cujo link do Scriptorium não está entre as obras listadas: o valor atual é preservado e visível, nunca apagado em silêncio.
- A lista de obras falha ao carregar: o campo volta a texto com aviso, e salvar continua possível.
- Citação existente editada sem mexer em nada continua sem enviar nada (`diferencas`).
- Endereço da conferência: campo deixado só com `https://` vira vazio ao sair; valor sem esquema ganha `https://`; `http://` digitado é respeitado.

---

### Task 1: funções puras

**Files:** Create `web/src/lib/formularioCitacao.ts`, `web/src/lib/formularioCitacao.test.ts`.

**Interfaces (produces):**
- `normalizarUrl(valor: string): string` — `''` ou só esquema → `''`; sem esquema → `https://` + valor aparado; com `http://`/`https://` → aparado, igual.
- `hojeISO(agora?: Date): string` — `AAAA-MM-DD` de São Paulo (mesma regra do `dateKeyInTimeZone`).
- `urlDaObra(slug: string): string` — `https://scriptorium.narniano.com/livros/<slug>`.
- `slugDaObra(url: string): string` — último segmento, como `slugDaUrlDoScriptorium` do servidor.

- [ ] Step 1: testes (RED): os casos acima, incluindo `'   '`, `'https://'`, `'exemplo.org/p'`, `'HTTP://X'`, `'ftp://x'` (mantém, a validação do servidor decide), vetores de `hojeISO` (02:59:59Z e 03:00:00Z).
- [ ] Step 2: implementar; GREEN.

### Task 2: formulário

**Files:** Modify `web/src/components/admin/quotes/QuoteFormDialog.tsx`; Test `QuoteFormDialog.test.tsx`, `QuotesPanel.test.tsx` (onde digitam autor/data).

- [ ] Step 1 (RED): testes novos: (a) autor é um `<select>` com as opções existentes e "Outro autor (novo)…"; escolher "Outro" mostra o campo "Nome do novo autor" e a validação de grafia parecida continua; (b) autor legado fora da lista abre em "Outro" com o valor; (c) endereço da conferência: foco vazio preenche `https://`, sair com só o esquema esvazia, sem esquema ganha `https://`; (d) "Conferida em" é `type="date"`, `max` = hoje, e o botão "Hoje" preenche; (e) link do Scriptorium é `<select>` com as obras publicadas ("Título, Autor") e envia a URL correta; valor atual fora da lista aparece como "(atual)"; falha ao carregar a lista mostra o campo de texto e o aviso; (f) editar sem mexer em nada não envia nada.
- [ ] Step 2: adaptar os testes existentes que digitavam o autor/data.
- [ ] Step 3: implementar; GREEN; suíte web, typecheck, lint, build.
- [ ] Step 4: axe (`npx playwright test e2e/a11y.spec.ts -g admin`) e conferência visual do diálogo (print do autor).

### Task 3: docs e fechamento

- [ ] `docs/MANUAL-PAINEL-CITACOES.md` seção 4 (autor por lista, endereço, data, obra do Scriptorium por lista), registro no ROADMAP e DECISOES (tema segue texto livre: candidato a lista; chamada: sem valor padrão na data), memória. PR; o merge dispara deploy do Scriptorium web (autor cola).
