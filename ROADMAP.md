# Roadmap — Scriptorium Divinum

**Status (2026-08-16):** migrado do Supabase pro VPS Hetzner próprio,
self-hosted (Fastify + Drizzle + Postgres, Docker multi-stage, Traefik,
CI/CD completo via GitHub Actions com deploy automático em `push` na
`main`). 32 obras publicadas (8 originais + 24 novas — patrística,
reforma, Padre Antônio Vieira), admin com auth própria por cookie de
sessão, leitor online funcional. **Não é mais "o menos maduro em
infra" dos projetos pessoais** — essa era a realidade de 2026-08-08
(parágrafo original abaixo, mantido só por histórico); hoje CI/CD e
testes automatizados já existem, cobertos nas seções P3/P4.

O que ainda falta, de verdade: **design/UI-UX/acessibilidade do projeto
inteiro** (1 único `aria-label` em todo o código, zero contraste
calculado — ver "Identidade aplicada aqui" abaixo) e **crescer o
catálogo continuamente** (P8.1) — são os dois maiores gargalos reais
agora, não infra.

<details>
<summary>Levantamento original (2026-08-08), mantido por histórico</summary>

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

</details>

Mesmo padrão de fases usado em todos os projetos pessoais — categorias e
justificativa completa em `hetzner-infra/PADRAO-DE-ENGENHARIA.md`, risco
real primeiro, polimento depois.

### Resumo de hoje (2026-08-16), em ordem

1. Confirmado que a sessão de 8h do opencode (2026-08-14 tarde/noite —
   auth própria, CRUD admin, sitemap, CI/CD, 1º conteúdo real) estava
   **inteiramente commitada, pushada e no ar** — nada perdido, só uma
   confusão de fuso/tempo decorrido (ver histórico do chat)
2. Deploy do catálogo novo (commit `feat(catalog)`, 21 obras +
   multilíngue) confirmado em produção
3. **Achado e corrigido**: crash fatal em `/livros` — `<SelectItem
   value=""/>` no filtro de categoria (Radix proíbe valor vazio),
   quebrava a página inteira sempre que carregava
4. Import rodado pelo Rilson: 21/25 obras novas com sucesso, 4 falhas
   por download do Wikisource
5. **Causa raiz das 4 falhas corrigida**: páginas com extensão
   ProofreadPage (`<pages .../>`) precisam do HTML renderizado
   (`prop=text`), não do wikitexto cru; + bug real no fallback de
   `extracts` (`"extract" in pdata` vs `pdata.get("extract")`) —
   3 das 4 corrigidas e publicadas, catálogo em **32 obras no total**
6. **De Magistro** identificado como tradução moderna (2015, CC BY-SA
   4.0) em vez de domínio público — removido do catálogo até decisão
7. Testado em produção pelo Rilson: achados reais de UI (AdSense
   placeholder vazado, imagem quebrada sem fallback, rota de autor
   inexistente, e-mail falso, textos de rodapé) — todos corrigidos,
   componente `SafeImage` novo generaliza o fix de imagem quebrada
8. Registradas pendências de conteúdo (capa/retrato de Tomás de
   Aquino, texto do Compêndio, download quebrado) e de identidade
   visual (logo/favicon genérico) pro futuro

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

- [x] **Retrato de Tomás de Aquino resolvido (2026-08-16)** — Carlo
      Crivelli (pintor renascentista, c. 1430-1495), confirmado domínio
      público no Wikimedia Commons, redimensionado (13MB/4004x6000 →
      92KB/534x800) e publicado em `/images/authors/tomas-aquino.jpg`.
- [ ] **Ainda pendente — texto e capa do "Compêndio de Teologia"
      (pesquisado de verdade, 2026-08-16)**: a tradução referenciada
      (D. Odilão Moura, 1935) **não foi encontrada disponível
      livremente** em nenhuma fonte checada (Gutenberg, Wikisource,
      busca geral) — `onlineReadPath` aponta pra um arquivo que nunca
      existiu. Opções reais: (a) trocar a obra referenciada por uma
      tradução de domínio público confirmada da Suma Teológica em
      inglês (Gutenberg, dominicanos ingleses, 4 volumes já
      catalogados e prontos — muda o que está anunciado), (b) manter só
      como ficha bibliográfica, sem leitura online, até achar a
      tradução de verdade, ou (c) obter permissão de uma edição
      moderna. Mesma coisa em "A Cidade de Deus" (`cidade-de-deus.jpg`
      404 — capa nunca verificada, não pesquisada ainda).
      `downloadLinks` do Compêndio também tem uma URL local fake
      (`/downloads/tomas/compendio-teologia.pdf`, nginx 404) com
      `source: "Internet Archive"` enganoso — remover até ter uma URL
      real.

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

| Fonte | O que tem | Como acessar | Confiabilidade real |
|---|---|---|---|
| Projeto Gutenberg (gutenberg.org) | 648 obras em PT, txt/epub direto | `gutendex.com` (API JSON) + `gutenberg.org/ebooks/{id}.txt.utf-8` | Alta — PD verificado pela própria curadoria |
| Wikisource PT (pt.wikisource.org) | Traduções PT de clássicos não cobertos pelo Gutenberg | API `w/api.php?action=parse\|query` | Alta — mesma curadoria |
| Brasiliana (USP) / BBM (digital.bbm.usp.br) | Fac-símiles de edições históricas, cada item com status marcado | Busca no site; PDF de página escaneada | Alta, mas **PDF escaneado, não texto** — precisa OCR pro leitor online |
| Domínio Público (dominiopublico.gov.br) | Acervo do governo brasileiro | **Só navegador humano** — Cloudflare bloqueia curl/urllib/WebFetch (testado 2026-08-16) | Não verificado ainda — buscar manualmente e colar resultado |
| Archive.org | Capas e edições digitalizadas | `archive.org/advancedsearch.php` | **Baixa — selo "Public Domain" auto-declarado, 2 falsos positivos reais achados (2026-08-16)**. Sempre abrir o arquivo e checar o colofão antes de catalogar |
| CCEL (ccel.org) | Clássicos cristãos em inglês PD — referência biográfica/catálogo | site | Referência, não fonte de texto PT |

**Regra legal (Brasil):** a tradução é obra derivada — PD se o tradutor
morreu há ≥ 70 anos (ou edição do séc. XIX/início XX). As 8 obras atuais
já seguem esse padrão (J. Oliveira Santos, Oscar Paes Leme, Waldyr
Carvalho Luz...). Gutenberg e Wikisource já aplicam esse filtro na
curadoria deles — é o atalho seguro pra não reavaliar cada obra do zero.

> [!WARNING] Teto do catálogo é menor do que parecia (achado 2026-08-21)
> O plano abaixo já mirava só "~30-50 obras" desde o início, e o
> catálogo está em 32 — perto do teto que o próprio plano previa, não
> longe dele. O motivo é estrutural, não falta de busca: PD em teologia
> clássica em português exige **duas** coisas raras juntas — o original
> (fácil, patrística/reforma é PD há séculos) **e** uma tradução PT-BR
> velha o bastante pra também ser PD (tradutor morto há ≥70 anos). A
> tradição de tradução evangélica/católica pra português é
> majoritariamente do séc. XX (Casa Publicadora, Vida Nova, Fiel etc.)
> — tarde demais pra estar em domínio público hoje. O inglês tem esse
> problema muito menos (tradição de tradução do séc. XIX, CCEL vive
> disso), o português não.
>
> Caminhos reais pra crescer além desse teto natural, nenhum trivial:
> 1. **Publicar também em latim/grego/inglês original** sem tradução
>    PT-BR — mais obras, mas afasta da proposta "em português"
> 2. **Comissionar/crowdsourcing de tradução nova**, licenciada aberta
>    (CC BY-SA) desde o nascimento — não depende de esperar 70 anos,
>    mas é trabalho de verdade, não import automatizado
> 3. **Ampliar a busca pra Portugal**, não só Brasil — tradição de
>    tradução católica portuguesa é mais antiga em alguns casos,
>    universo de fontes PD ligeiramente maior
> 4. **Aceitar o teto** — 30-50 obras bem curadas, com leitor e busca
>    de verdade, ainda é mais do que existe hoje em qualquer lugar
>    centralizado em português; "pequeno mas definitivo" é uma posição
>    legítima, não precisa comparar com Gutenberg (900+ mil obras, todo
>    idioma/gênero)

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

- [x] **4 obras que falhavam — resolvidas (2026-08-16)**: 3 delas
      (Sexagésima, Bom Sucesso das Armas, Mandato 1670) eram bug real de
      transclusão ProofreadPage, corrigido na fonte (ver commit
      `fix(import)`). A 4ª, *De Magistro*, não é PD — é CC BY-SA 4.0
      (tradução de Antonio A. Minghetti, 2015) — **removida do catálogo**
      por decisão do Rilson (2026-08-16): só entram obras com licença
      genuinamente permissiva confirmada, CC BY-SA sem confirmação
      forte não basta pra essa em particular ficar.

**Pesquisa em fontes institucionais (2026-08-16, tarde)** — o Rilson
pediu pra checar se dá pra achar mais em catálogos de governo, não só
Gutenberg/Wikisource. Resultado real, não suposição:

- **dominiopublico.gov.br está atrás de Cloudflare challenge** — 403
  pra qualquer ferramenta programática (testado com `curl`, `urllib` e
  `WebFetch`, os três bloqueados igual). Só acessível por navegador de
  verdade. Fluxo prático: Rilson busca manualmente e cola os
  resultados (título + autor) pro Claude verificar/organizar — sem
  extensão de navegador automatizada envolvida.
- **Archive.org marca "Public Domain" de forma não confiável** — achado
  real testando "Imitação de Cristo" (Kempis): 2 edições diferentes lá,
  as duas marcadas "Public Domain Mark" pela própria plataforma, as
  duas na verdade **não eram** — uma é tradução de 2023 com copyright
  ativo (© Valdemar Teodoro Editor), a outra é pirataria de uma edição
  comercial atual da Editora Vozes com uso comercial expressamente
  proibido no próprio arquivo. Lição: **nunca confiar no selo do
  Archive.org sozinho** — sempre abrir o arquivo de verdade e procurar
  o colofão/página de créditos antes de catalogar.
- **Biblioteca Brasiliana Guita e José Mindlin (BBM/USP,
  digital.bbm.usp.br) é fonte confiável** — instituição séria, cada
  item marca "Domínio público" na própria página (verificado, não só
  selo genérico). Achado usável: "Causa da Religião e Disciplina
  Eclesiástica do Celibato Clerical" (Padre Diogo Antônio Feijó, 1828,
  https://digital.bbm.usp.br/bitstream/bbm/4218/1/008584_COMPLETO.pdf).
  **Limitação real**: BBM entrega PDF de página escaneada, não texto
  limpo — `import_pipeline.py` só sabe baixar de Gutenberg/Wikisource
  hoje. Pra usar BBM de verdade seria preciso OCR (não implementado) —
  por ora, candidato registrado aqui, não no `curated_catalog.json`
  (entraria sempre como "falha" no import por não ter fonte que o
  script entenda).

## P9 — Documentação

- [x] **README reescrito e alinhado com o estado real (2026-08-14)**
      (commit `1595724`): virou monorepo web+server, seção "Funcionalidades
      no Ar" só com o que existe de fato, instruções de setup local e
      estrutura do workspace; deixou de anunciar recursos inexistentes
      (leitor, dark mode etc.)

---

## P10 — Monetização (registrado 2026-08-21, não começado)

Achado ao registrar isto: `web/src/pages/Sobre.tsx` já lista há um
tempo três itens de monetização como se existissem — "Google AdSense
integrado", "Doações voluntárias", "Links de afiliados" — nenhum dos
três está implementado (confirmado: nenhum script `ca-pub`, nenhum
componente de doação ou afiliado no código). É a mesma classe de
problema que o P9 acima já corrigiu uma vez no README ("deixou de
anunciar recursos inexistentes") — aconteceu de novo, agora na página
Sobre. Duas rotas: implementar de verdade (itens abaixo) ou reescrever
o texto pra "planejado", não "feito", enquanto isso não acontece.

Prioridade revisada em 2026-08-21, alinhada com a mesma política que
ficou clara nos outros projetos pessoais nesta sessão: **doação e
afiliado agora, anúncio (AdSense) fica pra depois.**

- [ ] **Amazon Associates — links pra edição impressa das obras**
      (fazer agora). Não compete com o acervo digital grátis — o texto
      de domínio público continua livre pra ler; o link é só pra quem
      quer a edição física encadernada. Componente já existe pronto
      pra portar: `BookCard.tsx` do repo `TestePolitico` (busca capa
      via Google Books API, recebe `title`/`link`/`description`) —
      reaplicar na página de detalhe de cada obra (`/livro/:id` ou
      equivalente), 1 link por autor/obra, não por edição.
- [ ] **Doações voluntárias (Pix/Ko-fi) — fazer agora, junto com o
      Amazon Associates**, não depois. Baixo esforço de implementar;
      modelo "quem lê sustenta o acervo" combina com um projeto que já
      é sobre tornar acesso gratuito, sem contrapartida de destaque ou
      influência editorial — mesma lógica adotada no `a-bancada-
      evangelica`.
- [ ] **Google AdSense — não agora, critério revisado.** Catálogo (32
      obras) não é mais o gargalo de credibilidade que era com "1 obra
      no ar", mas o teto natural do acervo é baixo (ver aviso em P8.1
      — PD em teologia PT-BR é estruturalmente raro, ~30-50 obras pode
      ser perto do máximo alcançável sem comissionar tradução nova).
      Não amarrar a decisão só a "catálogo > N obras", que pode nunca
      vir — o critério real é **tráfego orgânico mensurado** (GA4/
      Plausible ainda não configurado, ver P5) sendo diferente de
      zero por tempo suficiente. Aplicar antes disso arrisca rejeição
      por conteúdo/tráfego insuficiente, igual ao que aconteceu no
      Teste Político antes da correção de 08/21.
- [ ] **Até Amazon Associates e doação saírem do zero, ajustar o texto
      do `Sobre.tsx`** pra não afirmar como fato o que ainda não
      existe (trocar "Google AdSense integrado" por algo como "estamos
      avaliando formas discretas de sustentar o projeto", etc.) — e
      atualizar de novo assim que cada item for implementado de
      verdade, pra não trocar uma mentira por outra.

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

## Identidade visual — logo real aplicada (2026-08-16)

- [x] **Logo real no favicon/header**, escolhida pelo Rilson entre 2
      versões (monograma "S" dourado sobre marrom — a outra, selo
      circular com livros, é bonita grande mas ilegível em favicon
      16px). Favicons completos (ico, 16/32px, apple-touch-icon,
      android-chrome, webmanifest), og:image que não existia antes.
      Sem variação clara/escura — projeto não tem dark mode. Faz parte
      do **Design Narniano**, cluster "A Biblioteca" — ver
      `12 - Redes sociais/Identidade visual geral.md` no vault e
      `hetzner-infra/PADRAO-DE-ENGENHARIA.md`. Mesma pendência de
      reconciliação de dourado que o Bíblia na Arte tem — ver lá.
