# F6c: vetores de teste do "hoje" de São Paulo nas 4 implementações

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (nativo).

**Goal:** um arquivo de vetores (instante UTC → data de São Paulo esperada), idêntico nos quatro lugares que calculam o "hoje" do cluster, rodado por teste automatizado em cada um, e um teste no `hetzner-infra` que garante que as cópias não divergiram e que os próprios vetores batem com o tzdata (CONTRATOS seção 8, item 3; desenho do painel de citações seção 9, linha "Fuso").

**Architecture:** fonte única `hetzner-infra/vetores/hoje-sao-paulo.json`; cópia byte a byte em cada repositório, ao lado dos testes. Cada implementação ganha um teste que lê a cópia e confere `funcao(instante) === esperado`. `todaySaoPaulo` (BNA) e `narniano_do_dia_data_sp` (Narniano) passam a aceitar um instante opcional (hoje usam o relógio direto). O teste do `hetzner-infra` compara as cópias nos clones irmãos (pula o que não existir) e recalcula cada vetor com `zoneinfo('America/Sao_Paulo')` como oráculo independente.

**Tech Stack:** Vitest (Scriptorium, Lecionário web, BNA), PHP CLI (Narniano, sem WordPress), Python `unittest` (hetzner-infra).

**Spec:** `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md` seção 9; `hetzner-infra/CONTRATOS-ENTRE-PROJETOS.md` seção 8 (item 3).

## Global Constraints

- O "hoje" do cluster é a data civil de `America/Sao_Paulo` (UTC-3 fixo desde 2019, sem horário de verão).
- Fora do escopo: Lecionário mobile (usa a hora local do aparelho por desenho) e o Gerador (consome a data da API).
- Nenhum comportamento de produção muda: só ganham parâmetro opcional com o relógio como padrão.
- Narniano é deploy manual do autor (tema WordPress): o PR só mexe em `functions.php` com refatoração sem mudança de resultado e em teste.

## Review Focus

- Meia-noite exata de SP (03:00:00Z) é o dia novo; 02:59:59Z ainda é o dia anterior.
- Virada de mês, de ano e 29/02 (2028).
- Janeiro (antigo horário de verão, UTC-2): 02:30Z de janeiro ainda é o dia anterior.
- O teste roda igual em qualquer fuso do computador (`TZ=Asia/Tokyo`).
- Cópias divergentes entre repositórios são detectadas.

---

### Task 1: vetores e teste de consistência (hetzner-infra)

**Files:**
- Create: `hetzner-infra/vetores/hoje-sao-paulo.json`
- Create: `hetzner-infra/tests/vetores-hoje.test.py`
- Modify: `hetzner-infra/Makefile` (alvo `test-vetores`), `hetzner-infra/CONTRATOS-ENTRE-PROJETOS.md` seção 8

**Interfaces:**
- Produces: JSON `{ "fonte": string, "casos": [{ "utc": "AAAA-MM-DDTHH:MM:SSZ", "esperado": "AAAA-MM-DD", "nota": string }] }`.

- [ ] **Step 1: teste que falha.** `vetores-hoje.test.py`: (a) o arquivo existe e tem >= 12 casos; (b) cada caso bate com `zoneinfo.ZoneInfo('America/Sao_Paulo')`; (c) cada cópia existente nos clones irmãos (caminhos listados no teste) é byte a byte igual. Run: `python3 hetzner-infra/tests/vetores-hoje.test.py`. Expected: FAIL (arquivo inexistente).
- [ ] **Step 2: criar o JSON** com os casos: 02:59:59Z e 03:00:00Z de 30/10/2026, 23:59:59Z e 02:59:59Z do dia seguinte, virada de ano (2027-01-01), 29/02/2028 e 01/03/2028, fim de fevereiro de 2026, 02:30Z de janeiro (antigo horário de verão), meio de ano (julho), meio-dia UTC.
- [ ] **Step 3: teste passa** (cópias ausentes são puladas). Alvo `make test-vetores`. Commit.

### Task 2: Bíblia na Arte

**Files:** Modify `biblia-na-arte/server/src/lib/lectionary-refs.ts` (`todaySaoPaulo(now: Date = new Date())`); Create `server/src/lib/hoje-sao-paulo.vetores.json` (cópia); Test `server/src/lib/lectionary-refs.test.ts`.

- [ ] **Step 1:** teste que lê o JSON e confere `todaySaoPaulo(new Date(utc)) === esperado` para todos os casos; mais um que roda sob `TZ=Asia/Tokyo` (`process.env.TZ` não vale depois que o Node já iniciou: usar o resultado de `Intl` com `timeZone` explícito e provar que a função não depende do fuso local comparando com `Date.getDate()` divergente em pelo menos um vetor). Run: `cd biblia-na-arte/server && npx vitest run lectionary-refs`. Expected: FAIL (assinatura sem parâmetro).
- [ ] **Step 2:** implementar o parâmetro; teste passa; `tsc`, suíte e lint verdes. Commit por caminho.

### Task 3: Scriptorium (server) e Lecionário web

**Files:** Scriptorium `server/src/lib/hoje-sao-paulo.vetores.json` + `server/src/lib/date.test.ts` (usa `dateKeyInTimeZone`); Lecionário `lecionario-web/src/lib/__tests__/hoje-sao-paulo.vetores.json` + `versiculo-do-dia.test.ts` (usa `dateKeyInTimeZone`).

- [ ] **Step 1:** em cada um, teste que percorre os vetores. Expected: PASS direto (as funções já aceitam `Date`); para provar que o teste vale, mutação: trocar o fuso por `UTC` e ver falhar; desfazer.
- [ ] **Step 2:** suítes verdes, commit por caminho, um PR por repositório.

### Task 4: Narniano (PHP)

**Files:** Modify `narniano/functions.php` (`narniano_do_dia_data_sp( $agora = null )` usa `$agora ?? time()`); Create `narniano/tests/hoje-sao-paulo.vetores.json` e `narniano/tests/hoje-sao-paulo.test.php`.

- [ ] **Step 1:** teste PHP que carrega `functions.php` do mesmo jeito que `do-dia.test.php` e confere `narniano_do_dia_data_sp( strtotime( utc ) )` para todos os vetores. Run: `docker run --rm -v "$PWD":/t -w /t php:8.3-cli php tests/hoje-sao-paulo.test.php`. Expected: FAIL (função sem parâmetro).
- [ ] **Step 2:** implementar; passa; `do-dia.test.php` continua verde. PR; **o deploy do tema é do autor** (não há mudança de comportamento).

### Task 5: registro e verificação

- [ ] `make test-vetores` com os quatro clones presentes. CONTRATOS 8 (item 3 feito), ROADMAP-CLUSTER, ROADMAP do Scriptorium, memória. Nenhuma verificação em produção é necessária (sem mudança de comportamento).
