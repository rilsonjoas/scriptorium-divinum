# Roadmap — Scriptorium Divinum

Levantamento feito em 2026-08-08, na mesma sessão em que biblia-na-arte e
meus-remedios foram migrados pro VPS Hetzner próprio, self-hosted, sem
Supabase. Este documento não existia antes — é a primeira vez que o
projeto tem um roadmap de infra/qualidade, não só o README de produto.

Dos quatro projetos pessoais com plano de ir pro VPS
(biblia-na-arte, meus-remedios, lecionário, scriptorium-divinum), **este é
o menos maduro em infraestrutura**: zero Dockerfile, zero CI, zero testes
automatizados, e ainda 100% acoplado ao Supabase — incluindo um bug de
autenticação do painel admin (HTTP 400) documentado no próprio README
desde a criação do projeto, nunca resolvido.

A boa notícia: **o biblia-na-arte tinha exatamente esse mesmo problema**
(SPA Vite+React acoplada ao Supabase, sem infra própria) e o caminho de
migração já está validado e documentado em
`biblia-na-arte/CLAUDE.md` e `hetzner-infra/MIGRATION.md` (Fase 4.3). Não
é reinventar — é reaplicar o mesmo playbook: API própria (Fastify +
Drizzle + Zod), Postgres self-hosted com role isolada, Docker multi-stage,
Traefik. **Migração deliberadamente adiada** — não começar sem pedido
explícito.

Mesmo padrão de fases usado em todos os projetos pessoais — categorias e
justificativa completa em `hetzner-infra/PADRAO-DE-ENGENHARIA.md`, risco
real primeiro, polimento depois.

---

## P0 — Segurança

> [!DONE] Arquitetura confirmada (2026-08-09)
> Migrou de verdade pra API própria (Fastify + Drizzle + Zod, mesmo
> padrão do biblia-na-arte) — commit `8957789`, "Migra arquitetura para
> monorepo pnpm com API Fastify + Drizzle e web integrado". O catálogo
> público não depende mais de Supabase.

- [x] Catálogo público migrado pra API própria — resolve o risco de
      "morte por inatividade" que já matou o Supabase do biblia-na-arte
- [x] **Admin migrado pra auth própria (2026-08-14)** — commit `51a71b7`,
      "Migra admin do Supabase para auth própria por cookie de sessão".
      Login por cookie httpOnly de sessão (`admins`/`sessions` no
      Postgres próprio), hash scrypt, guard `requireAdmin`, CRUD admin
      completo (autores/livros/categorias) na API própria, CORS com
      credenciais. Testado real em produção: login 200, `/me` 200 com
      cookie e 401 sem cookie. Bundle web com **0 referências a Supabase**
- [x] **Bypass removido de verdade** — `checkAdminStatus` com "make all
      logged users admin for testing" não existe mais (era `lib/supabase.ts`,
      arquivo deletado); `AuthContext` reescrito com sessão própria
- [x] RLS das tabelas do Supabase — virou código morto: nada mais usa
      Supabase, projeto está sendo retirado de produção

### Auditoria de dependências (2026-08-14)

Estado: **runtime do servidor com zero advisories** (fastify, postgres,
drizzle). O `pnpm audit` completo lista ~40 vulnerabilidades, mas quase
todas em **ferramentas de build/dev** (vite, rollup, postcss, eslint) que
não rodam em produção — risco de supply-chain em máquina de dev/CI, não no
site no ar.

Em **produção** restam 7 advisories aceitos (todos não exploráveis no uso
real do projeto, cobertos pela allowlist do CI):

- `lodash` (via `recharts`, 1 high `_.template` + 2 prototype pollution):
  sem patch real (lodash 4.x EOL) e recharts só usa utilitários — não há
  template string controlada por usuário
- `react-router` v6 (3 moderate: open redirect via backslash + open
  redirect→XSS + constructor injection em SSR hydration): **sem patch no
  v6** (só v7.18+); o de SSR não se aplica (SPA sem SSR) e os de open
  redirect têm baixa exposição (links vêm de slugs sanitizados `[a-z0-9-]`)
- `yaml` (moderate): stack overflow em YAML profundamente aninhado —
  parsing de YAML não confiável, não usado no runtime

Já corrigido em 2026-08-14: XSS/open redirect do `@remix-run/router`
(bump `react-router-dom` 6.30.1 → 6.30.4). Upgrade para react-router v7 /
vite 6 foi avaliado e **adiado** — retorno só justificado com o projeto de
volta à mesa (seção "Ordem recomendada").

## P1 — Infra & Deploy

- [x] **No ar e confirmado saudável (2026-08-09)**: `scriptorium-web` e
      `scriptorium-api` rodando no VPS, certificado Let's Encrypt válido,
      health check da API respondendo 200 continuamente, Uptime Kuma já
      monitorando o site. Testado com `curl` real, não só `docker ps`
- [x] **Desconectado da Vercel (2026-08-14, ação manual do usuário)** —
      projeto deletado no dashboard; `scriptorium-divinum.vercel.app`
      responde 404, único host agora é o VPS
- [x] **Uptime Kuma com alerta real** — monitorando `scriptorium.narniano.com`
      e `api-scriptorium.narniano.com`, com alerta configurado em
      **Telegram e e-mail** (não é só painel visual). Item concluído.

## P2 — Saúde & Resiliência

- [x] **Saúde & Resiliência configuradas (2026-08-14)**:
      * Adicionado handler de encerramento global (SIGTERM/SIGINT) para fechar o banco Drizzle e encerrar o servidor Fastify de forma graciosa.
      * Adicionado rotas de health check (`/health`, `/health/live`, `/health/ready`).
- [ ] **`scriptorium-web` sem healthcheck (achado 2026-08-14)**: mesmo
      padrão do biblia-na-arte — o `docker-compose.yml` só define
      `healthcheck` na API, o serviço `scriptorium-web` (nginx) fica sem.
      Adicionar um healthcheck simples no nginx segue o mesmo formato
      já usado em `scriptorium-api`.

## P3 — CI/CD

- [x] **Criado e corrigido (2026-08-14)** — `.github/workflows/ci.yml` no padrão do biblia-na-arte: lint + typecheck + testes unitários/integração (Postgres service) + build web/server + auditoria de dependências a cada push/PR.
- [x] **Build e Push Docker configurados (2026-08-14)** — push para o GHCR (`scriptorium-api` e `scriptorium-web`) ajustado com permissões de pacotes e escopo do owner resolvidos.
- [x] **Auditoria escopada a produção (2026-08-14)** — `node scripts/audit-allowlist.mjs`: roda `pnpm audit --prod` e falha só em advisory **novo** high/critical, ignorando 7 GHSA conhecidos e aceitos (ver P0 — Segurança).

## P4 — Testes

> [!DONE] Não é mais zero (2026-08-09)
> `src/services/database.ts` e a lista abaixo estavam desatualizadas —
> esses arquivos foram deletados na migração de arquitetura. A API nova
> já nasceu com `server/src/routes/api.integration.test.ts` (136 linhas)
> e config de Vitest própria (`vitest.config.ts` +
> `vitest.integration.config.ts`), mesmo padrão do biblia-na-arte

- [x] Testes de integração da API já existem — **rodando em CI com serviço Postgres ativo** (2026-08-14).
- [x] **Primeiro teste do web (2026-08-14)** — vitest + jsdom + React
      Testing Library configurados (`web/vitest.config.ts`, setup com
      jest-dom), rota `test` no `web/package.json`, passo novo no CI.
      10 testes cobrindo: `splitProvenance` (unidade), página `Reader`
      (loading, "Conteúdo indisponível", renderização do markdown,
      link de volta) e o **gating do botão "Ler Online"** em
      `LivroDetalhes` (some quando `textAvailable` é false — trava o bug
      do texto órfão)

## P5 — Monitoramento & Logs

- [ ] Sem Sentry, sem analytics, sem qualquer visibilidade de erro em
      produção hoje

## P6 — Backups & Recuperação

- [x] Confirmado de verdade (2026-08-09, não suposição): `scriptorium_divinum_db`
      já está em `POSTGRES_DBS` no `.env` do VPS, entra no dump diário
      igual aos outros bancos

## P7 — UI/UX, acessibilidade e SEO

- [x] **SEO já implementado** (achado em 2026-08-08, tinha passado batido
      no levantamento original): `index.html` já tem `description`,
      Open Graph e Twitter Card, `public/robots.txt` presente
- [x] **`sitemap.xml` implementado (2026-08-14)** — `GET /sitemap.xml`
      na API (`server/src/routes/sitemap.ts`): estáticas + livros +
      categorias via `listCategories()` + autores (adicionado 2026-08-14).
      Proxy reverso configurado no Nginx do frontend (`web/nginx.conf`).
      Em produção: inclui URLs de livros, categorias e perfis de autores,
      testado no CI
- [x] **Google Search Console verificado (2026-08-14)** — tag `<meta name="google-site-verification">` adicionada ao `web/index.html` e propriedade verificada no Search Console. Sitemap enviado em `https://scriptorium.narniano.com/sitemap.xml`.
- [ ] **Verificar sitemap no Search Console**: Acessar [Google Search Console](https://search.google.com/search-console) → propriedade `scriptorium.narniano.com` → Sitemaps → confirmar que `https://scriptorium.narniano.com/sitemap.xml` está com status "Sucesso" e URLs sendo indexadas.
- [ ] Interface Responsiva — README reivindica; não verificado de fato
- [ ] Modo escuro/claro — só existem as variantes `dark:` do shadcn/ui;
      sem toggle e sem tema aplicado no app
- [ ] Loading states "mais elegantes" — item aberto no próprio README
- [ ] **Acessibilidade e identidade visual — confirmado ainda não feito
      (checado 2026-08-16)**: durante a sessão de 8h com o opencode em
      2026-08-14 (auth própria, CRUD admin, CI/CD, 1º conteúdo — ver
      commits daquele dia), só **1** atributo de acessibilidade real
      entrou no código inteiro (`aria-label="Remover link"` no painel
      admin). Nada de contraste WCAG calculado, `focus-visible`,
      `sr-only`, dark mode aplicado, ou os itens de "Identidade aplicada
      aqui" (capitular, `signature-italic`, `frame-tondo`) — todos
      **planejados, nenhum implementado**. Fácil de confundir com o
      Lecionário, que levou essa passada completa de verdade na mesma
      janela de tempo, em projeto separado. Quando isto voltar à mesa:
      repetir a receita que funcionou lá (contraste com conta real, não
      só olhar; teste em componente real, não suposição).

## P8 — Funcionalidades / entrega de valor real

- [ ] **Dívida de conteúdo no "Compêndio de Teologia" (achado real
      2026-08-16, testando em produção)**: `coverImageUrl`/
      `portraitImageUrl` no banco apontam pra `/images/covers/
      compendio-tomas.jpg` e `/images/authors/tomas-aquino.jpg` —
      arquivos que nunca foram enviados ao servidor (404 real). Mesma
      coisa em "A Cidade de Deus" (`cidade-de-deus.jpg`). `onlineReadPath`
      aponta pra um `.md` que não existe (`textAvailable` já corrigido
      pra `false` corretamente, então o botão "Ler Online" não aparece
      mais — mas a obra continua sem leitura online de verdade).
      `downloadLinks` tem uma URL local fake (`/downloads/tomas/
      compendio-teologia.pdf`, nginx 404) com `source: "Internet
      Archive"` enganoso — devia ser uma URL real do Archive.org ou
      removida. Existem retratos de Tomás de Aquino em domínio público
      (ex. Carlo Crivelli, 1476, National Gallery — via Wikimedia
      Commons) que dariam pra usar; nenhum código bloqueia isso, é
      trabalho de curadoria de conteúdo, não bug.

Direto do "Próximos Passos" do próprio README do projeto — nada inventado
aqui, só organizado por prioridade real. Verificado contra o código em
2026-08-14.

- [x] **CRUD administrativo (2026-08-14)** — autores/livros/categorias
      (POST/PATCH/DELETE) no painel com auth própria; livros com download
      links (formato/url/tamanho); settings do site em
      `/admin/configuracoes`
- [ ] Upload de capas e arquivos — capas e downloads são por URL; não há
      endpoint de upload
- [x] **Busca full-text real no Postgres** — `search_books()` com
      `to_tsvector('portuguese')` + `ts_rank` cobrindo título/descrição/
      categorias/tags (`server/src/db/custom-sql/functions.sql`)
- [x] **API pública** — GETs públicos consumidos pelo próprio site:
      `/api/v1/books|authors|categories|search|settings|sitemap`
- [x] **Leitor de texto integrado (2026-08-14)** — decisão documentada:
      leitor NÃO é risco legal quando o conteúdo é de domínio público
      (download e leitura online são juridicamente equivalentes — Lei
      9.610/98, arts. 29/31). Implementado com **botão condicionado a
      conteúdo real**: `GET /api/v1/books/:id/text` serve o markdown de
      `server/texts/`, `textAvailable` no detalhe do livro, página
      `/ler/:id` no web. Nenhum texto órfão — os 8 `online_read_path` do
      seed só "ligam" o botão quando o arquivo existir com declaração de
      proveniência. Primeira obra no ar: **As 95 Teses de Lutero**
      (2026-08-14, `server/texts/lutero-95-teses.md`)
- [ ] **Meta legal permanente** — política de direitos autorais
      documentada no README: só publicar obra com proveniência de domínio
      público; tradução moderna não pode; capas/imagens auditadas;
      takedown antes de abrir upload de terceiros. Auditoria de capas
      realizada (2026-08-14): **0 de 8 livros têm capa** — nada quebrado,
      o catálogo público usa ícone como placeholder; opcionalmente
      cadastrar capas de domínio público depois
- [ ] Sistema de favoritos, PWA, i18n — não começados

### P8.1 — Crescer o catálogo: conteúdo é o gargalo, não o app (2026-08-16)

Confirmado pelo Rilson: o app já está maduro (102+ testes de QA/a11y,
leitor, busca, ficha técnica) — o que segura o projeto hoje é o acervo.
8 obras / 8 autores no ar (Agostinho, Lutero, Calvino, Bunyan, Pascal,
Tomás, Anselmo, Belarmino), todas excelentes, mas uma biblioteca vive do
tamanho do acervo. Alinha direto com "Estratégia" acima ("prioridade de
conteúdo > prioridade de feature") — isso formaliza o próximo passo.

**Onde achar obra em domínio público com tradução PT-BR também em
domínio público:**

| Fonte | O que tem | Como acessar |
|---|---|---|
| Projeto Gutenberg (gutenberg.org) | 648 obras em PT, txt/epub direto; inclui Bíblia Almeida (id 62383), "Visitas ao Santíssimo Sacramento" (22658), clássicos | `gutendex.com` (API JSON) + `gutenberg.org/ebooks/{id}.txt.utf-8` |
| Wikisource PT (pt.wikisource.org) | Traduções PT de clássicos não cobertos pelo Gutenberg | API `w/api.php?action=query&prop=extracts` |
| Domínio Público (dominiopublico.gov.br) | Acervo do governo brasileiro, alguns clássicos em PT | busca no site; PDFs |
| Brasiliana (USP) / BN Digital | Fac-símiles de edições históricas — ótimas pra capas | download de imagens/PDF |
| Archive.org | Capas (PD/CC0) e edições digitalizadas | `archive.org/advancedsearch.php` |
| CCEL (ccel.org) | Clássicos cristãos em inglês PD — referência biográfica/catálogo | site |

**Regra legal (Brasil):** a tradução é obra derivada — PD se o tradutor
morreu há ≥ 70 anos (ou edição do séc. XIX/início XX). As 8 obras atuais
já seguem esse padrão (J. Oliveira Santos, Oscar Paes Leme, Waldyr
Carvalho Luz...). Gutenberg e Wikisource já aplicam esse filtro na
curadoria deles — é o atalho seguro pra não reavaliar cada obra do zero.

**Plano de execução (4 passos):**
1. **Curadoria** — catálogo-alvo em JSON (~30-50 obras: patrística,
   reforma, devocionais, teologia), cada item com `{obra, autor,
   tradutor, ano, fonte, status legal}`.
2. **Pipeline de importação** — script Python: baixa do Gutenberg/
   Wikisource, limpa cabeçalho/rodapé, converte pro formato markdown do
   site (mesmo formato de `server/texts/lutero-95-teses.md`), divide em
   capítulos, insere via a API admin (a mesma que o `AddBookDialog` usa)
   em lote; capa via Archive.org/BN Digital.
3. **Proveniência documentada** — cada livro guarda `{fonte, edição,
   data de verificação PD}` — mesma exigência já em vigor pra "Meta legal
   permanente" (P8, acima), só formaliza pra importação em lote em vez
   de obra a obra manual.
4. **QA por lote** — cada lote passa pelas suítes existentes (visual/
   a11y, ver P4) + leitura de amostra antes de publicar.

**Atualização 2026-08-16, 01:24** — não é mais "não começado": o plano
virou código de verdade (fora da sessão registrada acima, via opencode).
Commit `feat(catalog): grow catalog, add multilingual support & language
badges` — 21 obras novas em `server/texts/` (Bíblia completa, Boécio,
Bunyan, Lutero — catecismos grande/pequeno, "Da Liberdade Crist",
sermões de padres jesuítas do Brasil colonial, e mais), `curated_catalog.json`,
`scripts/import_pipeline.py` (pipeline de importação via API admin,
autenticação por cookie de sessão), badges de idioma no `BookCard.tsx`,
página `DominioPublico.tsx` nova. **Já no ar**: código deployado e
verificado (site/API 200, `git pull` + rebuild no VPS confirmado via
GitHub Actions).

**Concluído (2026-08-16, madrugada)** — Rilson rodou o script local
apontando pra produção. **29 obras no catálogo agora** (8
originais + 21 novas, de um alvo de 25 tentadas — 4 falharam, ver
abaixo), confirmado por API real (`GET /api/v1/books`,
`total: 29`, paginado em 2 páginas de 20). Achado no caminho e corrigido
na hora: `web/src/pages/Livros.tsx` tinha um `<SelectItem value="">`
(placeholder "Carregando...") — Radix UI proíbe `value=""`, e isso
derrubava a página `/livros` inteira com erro fatal sempre que o filtro
de categoria estava carregando. Corrigido (`value="__loading__"`,
disabled), deployado, confirmado (hash do bundle mudou de
`index-sivdB6Gq.js` pra `index-jvf9vU2u.js`, build novo realmente no ar).

- [ ] **4 obras falharam na importação** — todas por falha de download no
      Wikisource PT (título de página provavelmente não bate exato com o
      real): *Sermão da Sexagésima*, *Sermão pelo Bom Sucesso das Armas
      de Portugal contra as de Holanda*, *De Magistro*, *Sermão do
      Mandato (1670)*. Baixo risco/baixa prioridade — provavelmente só
      ajustar o nome da página em `curated_catalog.json` e rodar de novo
      (script é idempotente, só cadastra o que falta).

## P9 — Documentação

- [x] **README reescrito e alinhado com o estado real (2026-08-14)**
      (commit `1595724`): virou monorepo web+server, seção "Funcionalidades
      no Ar" só com o que existe de fato, instruções de setup local e
      estrutura do workspace; deixou de anunciar recursos inexistentes
      (leitor, dark mode etc.)

---

## Identidade aplicada aqui (2026-08-15)

> Fonte: `Identidade visual geral.md` e `Identidade Visual - Guia Técnico
> (Código).md` no vault. Registro predominante: **A Biblioteca**. Cara
> própria vs. o Bíblia na Arte (que compartilha a mesma base): aqui a
> assinatura é o **texto como manuscrito**, não a moldura de imagem —
> faz sentido, é uma biblioteca de texto, não de pintura.

- [ ] Capitular (`.capitular::first-letter`) na abertura de cada obra no
      leitor (`/ler/:id`) — é literalmente a técnica de scriptorium
      medieval, cabe no nome do projeto
- [ ] `.signature-italic` em citações e nomes de autor no catálogo
- [ ] `frame-tondo` só nos retratos de autor (Agostinho, Lutero etc.),
      não nas capas de livro — mantém a moldura de imagem reservada,
      diferenciando do Bíblia na Arte
- [ ] Curvas `--ease-liturgico`/`--ease-vela` na transição de abertura
      do leitor — deve parecer abrir um livro, não abrir um modal
- [ ] **Logo/favicon — ainda é o padrão genérico do template (pedido do
      Rilson, 2026-08-16)**: `web/public/favicon.ico` é um ícone
      82x82 sem identidade nenhuma (mesma origem do `placeholder.svg`
      ao lado — sobra de scaffold, nunca foi trocado). Precisa de uma
      marca própria, coerente com o registro "A Biblioteca" acima —
      mesma pendência no `biblia-na-arte` (ver o ROADMAP de lá).

## Estratégia — o que "sucesso" significa aqui (2026-08-15)

Público-alvo: cristãos de qualquer tradição interessados em teologia
clássica em domínio público — Padres da Igreja, reformadores, puritanos,
místicos, apologistas — sem restrição de linhagem confessional. O
catálogo deve refletir isso (Agostinho, Aquino, Calvino, Owen, Wesley,
Arminius, Kempis, Bunyan são todos candidatos legítimos, critério é
domínio público + proveniência verificável, não afinidade doutrinária
do curador).

**Estimativa de potencial (teto plausível, não medição real):** o público
de cristão-praticante-que-lê-clássico-em-português é uma fração pequena
mesmo dentro do universo cristão brasileiro — provavelmente baixos
milhares de leitores engajados no cenário realista, não milhões. Isso
não é defeito do projeto: uma "Confissões de Agostinho" bem indexada e
com leitor decente já é rara em português, então a régua de sucesso é
"virar a referência que aparece no Google pra esses termos", não
"competir em audiência com plataforma de conteúdo geral".

**O que isso implica pra estratégia e infra:**
- **Canal principal é SEO de cauda longa** — cada obra publicada com
  leitor integrado é uma página que pode ranquear pra buscas específicas
  ("Confissões de Agostinho pdf grátis", "Institutas de Calvino online",
  "95 Teses de Lutero português" — este último já no ar). Prioridade de
  conteúdo > prioridade de feature.
- **Infra não é o gargalo neste teto.** Texto é leve; mesmo em milhares
  de leitores simultâneos o VPS atual aguenta sem mudança. Só reavaliar
  infra se/quando o projeto sair de PoC pra uso real — não adiantar.
- Sucesso mensurável de curto prazo, se o projeto voltar à mesa: tráfego
  orgânico crescendo mês a mês pra 2-3 obras publicadas, não número
  absoluto de usuários.

## Conexões com o cluster A Biblioteca (2026-08-16)

Ideias reais, verificadas antes de registrar, não brainstorm solto.

### Comentários bíblicos clássicos por livro/capítulo — upgrade da integração com o Lecionário

Ideia do Rilson: comentário clássico ligado à passagem exata do dia
(ex. Calvino em Romanos), não só busca por palavra-chave. Isso é
**trabalho novo pro catálogo** — hoje não existe estrutura de
livro/capítulo aqui, diferente do Bíblia na Arte (`bookSlug`+`chapter`
já pronto). Precisaria da mesma estrutura de dado.

Candidatos em domínio público, **de propósito atravessando tradições**
(o critério do catálogo já é esse — ver "Estratégia" acima), não só
Calvino:
- João Calvino — comentários (quase toda a Bíblia, PD)
- **John Wesley** — *Explanatory Notes upon the New Testament* (PD,
  arminiano — vale citar isso explicitamente, não só o lado reformado)
- **Adam Clarke** — comentário completo, metodista (PD)
- Matthew Henry — comentário completo, amplamente lido em qualquer
  tradição (PD)
- Jamieson-Fausset-Brown — comentário conciso, PD

- [ ] Estrutura de dado: comentário indexado por `bookSlug`+`chapter`
      (mesma lógica do Bíblia na Arte)
- [ ] Primeiro teste: um livro só (Romanos é bom símbolo — Calvino tem
      comentário clássico nele), antes de prometer a Bíblia inteira
- [ ] Depois disso pronto, o Lecionário troca a busca por palavra-chave
      (`4.6` no roadmap dele) pelo casamento exato livro/capítulo

### "Leia mais sobre isso" (busca simples) — já registrado

Versão mais simples, sem depender do item acima: `GET /api/v1/search?q=`
já existe e está testado. Ver `lecionario/ROADMAP.md`, seção 4.6, pro
lado recíproco — essa parte não precisa de trabalho novo aqui.

### Post editorial: "Os clássicos que Lewis leu, em domínio público"

Ideia do Rilson, nascida ao discutir por que o Scriptorium não pode
hospedar texto do próprio Lewis (ele não é domínio público até
~2033+ — Lewis morreu em 1963). Solução: **conteúdo editorial, não
integração de dado** — um post (Narniano/Instagram, sem repositório
próprio aqui pra registrar) sobre os autores clássicos que Lewis leu e
citou (Boécio, padres da igreja, etc.) que **já estão** em domínio
público, linkando pro que o Scriptorium tiver desses autores. Sem
problema legal, serve SEO/descoberta pro Scriptorium, e é conteúdo que
já bate com o pilar "A Biblioteca" da identidade Narniano.

- [ ] Não é item de código — fica registrado aqui só como lembrete de
      conteúdo, pra quando o Rilson escrever no Narniano
- Ver também: `GeradorCSLewis/README.md` (mesma ideia, do lado do tema)

### Rodapé cruzado — cluster A Biblioteca

- [ ] Mesmo item registrado nos outros 3 projetos (`lecionario/ROADMAP.md`
      4.8) — link estático pros 4 (Bíblia na Arte, Lecionário, Gerador
      C.S. Lewis, este), sem integração de dado

## Ordem recomendada, se/quando este projeto voltar à mesa

> Numeração reavaliada em 2026-08-14, após verificação no código. P0/P1/P2/
> P3/P6 concluídos e conferidos; abaixo só o que ainda está aberto.

1. **Adicionar o primeiro texto real ao leitor** — concluído
   (2026-08-14): **As 95 Teses de Lutero** em `server/texts/` com
   proveniência verificável (tradução WHE, CC BY-NC-SA 4.0, obra em
   domínio público); capas do banco auditadas (0 configuradas).
2. **P8.1 — crescer o catálogo (registrado 2026-08-16, não começado)** —
   confirmado como o maior gargalo real hoje: app maduro, acervo pequeno
   (8 obras). Ver seção P8.1 acima pra fontes de conteúdo PD em PT-BR e
   o plano de importação em lote (curadoria → pipeline → proveniência →
   QA). Prioridade #1 se/quando o projeto voltar à mesa.
3. **P4 — primeiro teste do web (concluído 2026-08-14)** — vitest + RTL
   no ar com 10 testes (ver seção P4); expandir cobertura a partir daqui
4. **P5 — Sentry** (ou alternativa self-hosted) — uptime já é monitorado;
   falta visibilidade de erro em runtime (front + api)
5. **P8 — upload de capas/arquivos** — hoje tudo é por URL, painel fica
   dependente de hospedagem externa
6. **P7 — dark mode, loading states, a11y** — polimento, menor retorno

## Nota: admin reconstruído com auth própria (concluído em 2026-08-14)

A reconstrução do login (item acima, que estava preso no Supabase quebrado
+ bypass "make all logged users admin") **saiu do papel** no commit
`51a71b7`. Sendo login de admin único (não de usuário final), e-mail/senha
com cookie de sessão foi a escolha certa. Se algum dia isto abrir pra mais
de um admin ou usuário externo, vale considerar a mesma decisão registrada
no `meus-remedios` (único projeto pessoal com OAuth de usuário real hoje)
— Google OAuth como atalho, nunca substituto de e-mail/senha. Ver
`meus-remedios/README.md`, seção "Decisão: Google OAuth + conta local".
