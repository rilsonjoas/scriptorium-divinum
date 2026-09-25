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

## P2 — Obras-Faróis & Leitura Online (2026-08-24)

- [x] **Imitação de Cristo (Tomás de Kempis)**: texto integral em português de 1848 revisado e formatado em Markdown com bloco de proveniência (`server/texts/imitacao-de-cristo-pt.md`), ativado para leitura online.
- [x] **Os Últimos Fins do Homem (Padre Manuel Bernardes)**: texto integral do clássico de 1688/1768 revisado e formatado em Markdown com bloco de proveniência (`server/texts/os-ultimos-fins-do-homem-pt.md`), ativado para leitura online.

## P2.5 — UX/UI, Leitor Digital & Atenção a Detalhes

- [x] **Polimento do Leitor Digital (`Reader.tsx`) (concluído 2026-08-31)**:
  - [x] Barra de progresso de leitura sutil e fixa no topo da tela conforme o usuário rola o texto (`ReadingProgress`).
  - [x] Memorização e restauração automática da posição de leitura via `localStorage` com aviso discreto.
  - [x] Seletor de temas de leitura dedicados (Modo Sépia, Escuro Noturno, Claro e Papel Clássico em `ReadingToolbar`).
- [x] **Acessibilidade & Micro-interações (concluído 2026-08-31)**:
  - [x] Enriquecimento de atributos de acessibilidade (`aria-label`, `aria-expanded`) em todas as barras de ferramentas e player TTS.
  - [x] Transições e tipografia fluida para leituras confortáveis em mobile e desktop.

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
- [x] **`scriptorium-web` com healthcheck (concluído 2026-08-31)**: adicionado `HEALTHCHECK` Nginx no `web/Dockerfile` com `curl` de validação contínua.

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

- [x] **Sentry no backend (2026-08-23)** — `@sentry/node` inicializado em `server/src/lib/sentry.js` e capturando exceções/erros no Fastify em `server/src/app.ts`. Umami Analytics configurado e integrado ponta a ponta em `web/src/lib/umami.ts`.


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
- [ ] **URLs amigáveis (slug em vez de UUID) — pedido do Rilson em
      2026-09-25, execução adiada.** Hoje a ficha e o leitor respondem por
      identificador: `/livros/8ceec7d1-c719-4eea-a3fc-a7bfd2a5a9da` e
      `/ler/8ceec7d1-...`. O [[Bíblia na Arte]] já resolve por slug e é o
      padrão a seguir no cluster. O slug (`confissoes`) **já existe** no
      banco — a API aceita `:idOrSlug` nas duas rotas, então o caminho é
      trocar o link e manter o UUID como fallback, sem migração de dados.
      Atenção a três pontos: (1) o `sitemap.xml` precisa passar a emitir
      a forma com slug; (2) o service worker tem regra de cache por URL
      (`leituras-offline`) que casa com `/books/[^/]+/text` e continuará
      válida, mas convém confirmar que não guarda a variante antiga; (3)
      links já indexados pelo Google com o UUID devem continuar
      funcionando — daí o fallback em vez de redirecionamento.
- [x] **Modo escuro/claro (concluído 2026-09-25)** — toggle no cabeçalho (desktop e menu mobile), persistido em `localStorage` e aplicado antes da primeira pintura por um script inline no `index.html` (evita flash de tema). O que exigiu mais cuidado: os tokens `library-*` serviam **a texto e a fundo** ao mesmo tempo (`--library-wood` era texto 313× e fundo 58×), então invertê-los globalmente quebrava os botões de madeira. Separei em `--library-wood` (fundo, fixo) + `--library-wood-foreground` (texto, sobe no dark), no mesmo desenho do par `primary`/`primary-foreground` do shadcn. Mesma lógica para `bronze` e para a superfície do pergaminho.
- [x] **Interface Responsiva verificada (2026-09-25)** — conferida por captura de tela em 390px e 1440px no Leitor: a coluna de leitura ocupa 100% no mobile e 768px no desktop.
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
- [x] **Upload de capas e arquivos no admin (2026-08-23)** — `@fastify/multipart` + `@fastify/static` servindo `/uploads/`, rota autenticada `POST /api/v1/admin/uploads` com validação de extensão (`.jpg`, `.png`, `.webp`, `.svg`), limite 5MB e geração de UUID. Interface integrada nos diálogos do painel (`EditBookDialog.tsx`).
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
- [x] **Meta legal permanente** — política de direitos autorais
      documentada no README: só publicar obra com proveniência de domínio
      público; tradução moderna não pode; capas/imagens auditadas. 100% das 37 obras com capa tipográfica SVG gerada e proveniência documentada.
- [x] **Sistema de favoritos (2026-08-23)** — `utils/favorites.ts` (`scriptorium:favorites` no localStorage), botão de estrela na ficha do livro e chip/filtro "Favoritos" no catálogo (`/livros`).
- [x] **PWA (2026-08-23)** — `vite-plugin-pwa` configurado em `vite.config.ts`, manifest com ícones 192/512, tema `#2c1e13`, `lang pt-BR` e `NetworkFirst` no workbox para cache offline de leituras e catálogo.
- [x] **i18n (2026-08-23)** — `react-i18next` configurado (`web/src/i18n/index.ts`) cobrindo `nav`, `busca`, `acoes` e `rodape` em PT-BR e EN, com seletor no cabeçalho/rodapé e persistência em `scriptorium:lang`.

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

## Qualidade de Conteúdo (2026-08-22)

Padrão cross-projeto: `Padrão de Qualidade de Conteúdo.md` no vault
(princípio #7 de `Filosofia e Padrões de Engenharia.md`). Este projeto
já implementa a prática mais avançada dos seis: a tabela de fontes (ver
"Estratégia de aquisição de conteúdo") já marca **confiabilidade por
fonte** (Gutenberg/Wikisource = "Alta — PD verificado pela própria
curadoria") em vez de tratar todo o catálogo como uniformemente
confiável. É o modelo a copiar pros outros projetos do padrão.

- [ ] Manter a tabela de fontes atualizada conforme novas fontes
      entrarem no catálogo — toda fonte nova ganha uma linha com nível
      de confiabilidade antes da primeira importação, não depois.
- [ ] "Como Contribuir" já está marcado pra reescrever pra realidade de
      projeto solo (ver Backlog) — quando reescrever, deixar explícito
      que toda contribuição de texto passa pela mesma régua de
      domínio-público-verificado, não só as importações da curadoria
      própria.

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

- [x] **Amazon Associates — links pra edição impressa das obras**
      **Concluído (versão simplificada, verificado 2026-09-24):** botão
      "Edição impressa (Amazon)" na página de detalhe da obra
      (`web/src/pages/LivroDetalhes.tsx`) com busca Amazon por
      `título + autor` + `tag=rilson-20` (`AMAZON_AFFILIATE_TAG`).
      Não compete com o acervo digital grátis — o texto de domínio
      público continua livre pra ler; o link é só pra quem quer a
      edição física. A versão completa do `BookCard.tsx` do repo
      `TestePolitico` (capa via Google Books API) segue como
      melhoria opcional futura, não pendência.
- [x] **Doações voluntárias (Pix — entregue 2026-09-25)** — card na
      página Sobre com QR do padrão EMV BR Code, chave
      `lecionario@narniano.com` (decisão do Rilson: reusar a chave
      existente em vez de criar uma dedicada), titular Rilson Joás
      Guedes, cidade Recife. O texto não promete valor nem
      contrapartida — só explica como doar e por onde o dinheiro
      ajuda a manter o acervo gratuito.
      modelo "quem lê sustenta o acervo" combina com um projeto que já
      é sobre tornar acesso gratuito, sem contrapartida de destaque ou
      influência editorial — mesma lógica adotada no `a-bancada-
      evangelica`.
- [x] **Google AdSense — base técnica implementada (2026-08-22)**,
      decisão do Rilson em avançar agora com a conta existente
      (`ca-pub-5482566824255473`), revendo o critério anterior de
      esperar tráfego. Sequência executada, na ordem certa:
      (1) `web/public/ads.txt` criado (`google.com,
      pub-5482566824255473, DIRECT, f08c47fec0942fa0`) — pré-requisito
      de verificação de domínio; (2) script do AdSense no `<head>` do
      `index.html` (habilita a revisão do domínio no painel e Auto Ads;
      **só veicula depois que o domínio for aprovado** — até lá os slots
      ficam em branco, sem risco de rejeição prévia); (3) componente
      reutilizável `web/src/components/ads/AdSlot.tsx` (client fixo,
      `slotId` opcional, push protegido contra duplicação, rótulo
      discreto "Publicidade"); (4) posicionamentos discretos: home
      (após destaques), catálogo (após grade) e ficha da obra (após o
      conteúdo) — **Reader `/ler/:id` permanece sem anúncios**, como a
      página Sobre promete.
      Pendências seguintes: criar unidades de anúncio no painel AdSense
      e colar os IDs nos `slotId` dos usos de `AdSlot`; submeter o
      domínio à revisão no painel; avaliar Auto Ads vs. unidades manuais
      depois da aprovação. O texto do `Sobre.tsx` ("Google AdSense
      integrado") voltou a ser verdadeiro.

---

## Identidade aplicada aqui (2026-08-15)

> Fonte: `Identidade visual geral.md` e `Identidade Visual - Guia Técnico
> (Código).md` no vault. Registro predominante: **A Biblioteca**. Cara
> própria vs. o Bíblia na Arte (que compartilha a mesma base): aqui a
> assinatura é o **texto como manuscrito**, não a moldura de imagem —
> faz sentido, é uma biblioteca de texto, não de pintura.

- [x] **Capitular (`.capitular::first-letter`) na abertura de cada obra no
      leitor (`/ler/:id`) — entregue 2026-08-31, corrigido em 2026-09-25.**
      First-letter em vinho profundo (`--vinho`, `#4B2E39`) em vez de
      dourado: a capitular cai sobre o pergaminho claro da leitura e o
      dourado dava 1.40:1 — reprovado. Com vinho fica 10.48:1. No tema
      escuro do leitor inverte para dourado claro (13.56:1), onde o vinho
      daria 1.50:1.
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

1. **Adicionar o primeiro texto real ao leitor (concluído 2026-08-14)** — **As 95 Teses de Lutero** + 37 obras publicadas com 28 no leitor online e 9 com download real.
2. **P8.1 — crescer o catálogo (concluído 2026-08-23)** — Catálogo crescido para 37 obras de 16 autores, com 100% de capas tipográficas SVG e proveniência documentada.
3. **P4 — suíte de testes (concluído 2026-08-23)** — 50 testes automatizados cobrindo leituras, progresso, glossário, favoritos, TTS e cartões de citação.
4. **P5 — Sentry & Analytics (concluído 2026-08-23)** — `@sentry/node` no backend + Umami Analytics no frontend.
5. **P8 — Upload de capas/arquivos (concluído 2026-08-23)** — `@fastify/multipart` e `@fastify/static` com endpoint `POST /api/v1/admin/uploads` e UI de upload no admin.
6. **Features de Experiência (concluído 2026-08-23)** — Glossário arcaico, Continuar lendo, Cartões de citação, TTS, Favoritos, PWA offline e i18n (PT-BR/EN).

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

---

## Backlog de Produto — Issues e Bugs (levantamento 2026-08-21)

> Levantamento feito pelo Rilson ao usar o produto de verdade.
> Organizado por gravidade.

### 🔴 Crítico — funcionalidade central quebrada

- [x] **Leiturabilidade online — Reader reconstruído (2026-08-22)** — 25 de 32 obras têm leitura online (auditado); as 7 sem texto são O Peregrino, Confissões, Compêndio de Teologia, Institutas, Cidade de Deus, Pensamentos e Por que Deus se fez Homem? — exatamente as obras-faróis (dívida de conteúdo, ver P8.1). Para as 25 que abrem, o "scroll vertical gigante" foi substituído por leitor profissional: **índice lateral fixo** (desktop) com scroll-spy + **índice colapsável** (mobile), **barra de progresso** de leitura no topo, **tempo estimado** ("~X min") na abertura, âncoras com ids slugificados em h1-h3 e scroll compensado do header. Implementado em `web/src/pages/Reader.tsx` (10/10 testes passando). Paginação estilo e-reader segue como opção futura, não necessária.
- [x] **Obras-faróis com conteúdo real (resolvido 2026-08-23)** — ver
      `PESQUISA-OBRAS-FAROIS.md` para metodologia e provas. No ar: The
      City of God (EN, Dods †1909), Institutes of the Christian Religion
      (EN, Allen †1839), Compendium Theologiae (LA, original). Fichas PT
      de Confissões/Peregrino/Pensamentos/Cur Deus Homo aguardam tradução
      PT livre; as edições EN irmãs já estão completas no leitor.
- [x] **Traduções PT antigas encontradas e incluídas (2026-08-23,
      fase 2)** — O Peregrino (trad. Guilherme L. dos Santos Ferreira
      †1934, Lisboa 1916) e Confissões (trad. anônima, Garnier 1905)
      com texto integral no leitor; Imitação de Cristo (Kempis, Paris
      1848) e Os Últimos Fins do Homem (Padre Manuel Bernardes, 1768)
      como novas fichas com download dos escaneamentos — leitura online
      pendente de revisão manual do OCR. Detalhes em PESQUISA-OBRAS-
      FAROIS.md fase 2. Catálogo: 37 obras, 16 autores.
- [x] **Downloads não funcionam / formatos não existem (auditado E corrigido 2026-08-22)** — dos 30 links cadastrados, só 24 funcionam e TODOS são `.txt` (Gutenberg/Wikisource). Os 6 restantes eram caminhos locais falsos `/downloads/**` (404 no nginx): PDFs de O Peregrino, Confissões (+epub), Compêndio, Institutas e Cidade de Deus; 0 PDFs reais no catálogo. Correções aplicadas: (a) texto do `Sobre.tsx` ajustado ("formatos múltiplos PDF/ePub" → realidade .txt); (b) **script executado em produção** (`psql < scripts/fix_prod_data_2026-08-22.sql`, transação única com ON_ERROR_STOP — 1ª tentativa abortou limpa por erro de alias, revertida integralmente; 2ª passou): `DELETE 6` links falsos, backup prévio em `~/backups/scriptorium_backup_20260822.sql` no VPS + cópia local. Verificado pós-execução: 0 links `/downloads/`, API retorna `downloadLinks: []` nas obras afetadas (botão some do site). Dívida de conteúdo: achar fontes reais PT-BR para as obras-faróis.
- [x] **Categorias não estavam sendo utilizadas (auditado E corrigido 2026-08-22)** — eram 41 categorias para 32 livros com duplicatas bilíngues (Patrística/Patristics, Reformation/Reforma Protestante etc.), porque `books.categories` é array livre e a tabela `categories` estava VAZIA (slugs nulos na API). Consolidação EN→PT (~14 mapeamentos) executada no mesmo script: 31 categorias canônicas em PT, tabela `categories` populada com slugs kebab-case, API `/api/v1/categories` agora responde `{name, slug, bookCount}` completo.
- [x] **Autores com 0 livros aparecem na página de Autores** — corrigido em `web/src/pages/Autores.tsx` (filtro `bookCount > 0` na contagem client-side, 2026-08-22).
- [x] **Botões da página "Como Contribuir" não funcionam** — página reescrita (2026-08-22) para a realidade de projeto unipessoal: sugerir obra (mailto), reportar erro (mailto), divulgar (WhatsApp/Telegram share), código (GitHub). Todos os botões com ações reais; seções de digitalização/tradução/pesquisa removidas (prometiam fluxo de equipe que não existe).

### 🟠 Grave — qualidade e confiança

- [x] **Páginas não carregam no topo** — corrigido (2026-08-22): componente `ScrollToTop` (`web/src/components/ScrollToTop.tsx`) montado no `App.tsx` sobre `useLocation`.
- [x] **Emojis em vez de `lucide-react`** — auditados (2026-08-22): os únicos emojis de UI estavam em `Sobre.tsx` (📚🔍📥🔎 → Library/BookOpen/Download/Search) e `DeleteConfirmDialog.tsx` (⚠️). Ornamentos tipográficos do CSS (❦ ✦) mantidos — são fleurons decorativos, não emoji.
- [x] **Markdown cru renderizando como texto / negrito faltando** — causa: JSX não processa markdown; `**...**` estava escrito direto no JSX de `Sobre.tsx`. Corrigido com `<strong>` nativo (4 ocorrências, 2026-08-22). Campos vindos do banco continuam via `react-markdown` no Reader — sem outros casos encontrados.

### 🟡 Melhoria — produto e conteúdo

- [x] **"Conheça também" no rodapé — links do cluster A Biblioteca** — implementado 2026-08-22 em `web/src/components/Footer.tsx`: bloco compacto após o ornamento e antes do ©, modelo aprovado no Gerador C.S. Lewis (`ClusterFooter.tsx`) adaptado à paleta library-gold: rótulo-nicho em caps espaçadas ("CONHEÇA TAMBÉM") → links Narniano / Bíblia na Arte / Lecionário / Gerador C.S. Lewis separados por ✦ dourado em itens atômicos `whitespace-nowrap` → © discreto abaixo.

- [ ] **Continuar busca e curadoria de material** — tarefa contínua. Priorizar domínio público verificado.
- [ ] **Tradução de livros com IA** — avaliar viabilidade: qual modelo? qual pipeline de revisão? Qual licença do original permite tradução e redistribuição? Não começar sem definir isso.
- [ ] **"Como Contribuir" — revisar o que é realmente viável** — a página parece escrita para um projeto com equipe. Reescrever para a realidade: projeto de 1 pessoa, contribuições limitadas, foco em curadoria e sugestões.

---

## Marketing e Distribuição (2026-08-22)

> O catálogo É o funil: cada obra é uma página indexável com intenção de busca real ("ler As 95 Teses online", "[obra] pdf domínio público").

### Estratégia central: SEO de cauda longa por obra

- GSC + sitemap já no ar (2026-08-14); rotina semanal de conferência de indexação
- Descrições reais por obra ajudam ranking — priorizar as que ainda estão cruas

### Canais de nicho teológico

1. Comunidades reformadas/teológicas em português (grupos de estudo, fóruns)
2. Seminários e estudantes de teologia — proveniência/licença documentada por obra torna o site fonte citável, diferencial acadêmico real
3. Cruzamento com @narnianoexistencialista (Inklings/Lewis → patrística e reformadores, mesma audiência de profundidade)

### Monetização (P10, teto baixo consciente)

- Doação apenas. Catálogo PT-BR tem teto real documentado; valor do projeto é portfólio + legado

### Pendências que travam crescimento

- [ ] Leiturabilidade online (🔴 item crítico acima) — ninguém retorna a um leitor que não abre
- [ ] Compêndio de Teologia / Cidade de Deus — dívida de conteúdo registrada

---

## Produto — "De arquivo a companhia" (brainstorm aprovado 2026-08-22)

> Pergunta norteadora: o que faria deste um dos lugares favoritos de um
> leitor? Resposta: **lembrar do leitor e se encaixar numa rotina**.
> Arquivo é visitado; companhia é revisitada. Rejeitados por teto real:
> contas de usuário, comentários, fórum, gamificação/streaks.

### Aprovado para implementação

- [x] **Glossário do leitor (português arcaico)** — implementado 2026-08-23.
      Selecionar qualquer palavra no Reader → popover com significado.
      Duas camadas: **glossário curado local** (`web/src/data/glossario.json`,
      32 entradas baseadas no corpus real — mui ×14 obras, conjugações de
      vós sois/tendes/éreis/fostes/tivestes/quereis/podeis/dizeis/ides/
      estais/vinde/sede, debalde, alvedrio, pejo, dilação, escusado,
      sobremodo, acatamento, concupiscência etc.) + **detecção de mesóclise**
      por regex (`mentir-vos-ão` → decomposição de leitura) +
      **fallback Wikcionário PT** via Action API (`action=parse&prop=wikitext`,
      CORS aberto; parser extrai bloco `={{-pt-}}=`, classe gramatical e até
      3 definições, com cache em memória e link de atribuição). Dica
      discreta na abertura da obra. Testes: 14 novos em
      `web/src/utils/glossario.test.ts` (24 total no suite passando).
      Evolução futura: crescer o JSON conforme surgirem palavras sem
      cobertura, marcar termos curados com underline pontilhado direto no
      texto (exige transformação de nós de texto no markdown).
      > [!warning] A ser repensado pelo item 2 de "Leitor digital" (2026-09-25)
      > O comportamento atual — **selecionar qualquer palavra já dispara o
      > glossário** — diverge do que um leitor moderno espera: o padrão de
      > uma seleção é *copiar*. O glossário não foi erro, mas sim
      > implemented *cedo demais*: ele deve passar a ser uma das opções de
      > um menu de contexto, acionado por pedido explícito. A infraestrutura
      > (JSON curado, mesóclise, fallback Wikcionário) é reaproveitada
      > inteira; muda só o gatilho.
- [x] **"Continuar lendo" + progresso por obra** — implementado
      2026-08-23 (`web/src/utils/readingProgress.ts` +
      `ContinueReading.tsx`). localStorage puro, sem contas: posição de
      scroll salva por obra com throttle de 1%, retomada automática ao
      reabrir (faixa 3%-95%; >=95% considera concluída e limpa), bloco
      "Continuar Leitura" na home com as 3 obras mais recentes, barra de
      progresso e link direto — some quando não há nada em andamento.
      Tolerante a JSON corrompido e a storage indisponível. 8 testes novos
      (suite: 32 passando).
- [x] **Cartões de citação compartilháveis** — implementado 2026-08-23
      (`web/src/components/reader/QuoteCardDialog.tsx`). Seleção de 2+
      palavras no Reader → pill flutuante "Criar card de citação" →
      diálogo com prévia + Baixar/Copiar/Enviar (share nativo com arquivos
      quando suportado). Arte 1080×1080 em estilos inline rasterizáveis,
      tipografia adaptativa por tamanho da citação, html2canvas com import
      dinâmico (chunk próprio ~48KB gzip sob demanda). Autor/título
      enriquecidos via `useBook` do slug. Maior
      loop orgânico no contexto BR (WhatsApp/Instagram). **Seguir o
      padrão já aprovado dos projetos irmãos**: `html2canvas` com import
      dinâmico sobre card offscreen fixo (1080×1080), CSS rasterizável
      (`backgroundImage`+`cover`, sem `object-fit`/filtros SVG),
      `canvas.toBlob()` → `navigator.share({files})` → fallback clipboard
      (`ClipboardItem`). Referências: `a-bancada-evangelica/src/components/social/ShareableCard.tsx`
      (download+share nativo), `GeradorCSLewis/src/components/{QuoteGenerator,ShareCard}.tsx`
      (card offscreen + tipografia que escala pelo tamanho da citação).
      Cuidado: imagens remotas precisam de proxy same-origin (bug do PNG
      branco já resolvido na Bancada).
- [x] **Ouvir em vez de ler (TTS)** — implementado 2026-08-23
      (`web/src/hooks/useSpeech.ts` + `utils/speech.ts`). Web Speech API
      nativa, zero infra: botão Ouvir/Pausar/Parar no cabeçalho do
      Reader; texto markdown limpo para fala (remove código, links,
      imagens, marcação); fatiamento por sentença (~200 chars) com fila
      encadeada via onend — contorna o bug do Chrome com utterances
      longas; voz pt-BR preferida com fallback pt genérico. Para de tocar
      ao trocar de obra e no unmount. Não suportado → controles não
      renderizam. 7 testes novos nos utilitários (suite: 45 passando).
- [ ] **Pequenas dignidades de leitura — tempo estimado ("~X min") na
      ficha** (já existe no Reader: `Reader.tsx:516`); navegação por
      capítulos fixa na lateral do Reader **já implementada** (índice
      lateral desktop + colapsável mobile via `extractToc`, verificado
      2026-09-24); resta apenas exibir o tempo estimado também na
      ficha da obra (`/livro/:id`).

### Ideia para o futuro (depende de acervo maior)

- [ ] **Planos de leitura devocional + newsletter semanal** — fatiar
      obras em porções diárias ("Confissões em 40 dias", "Um sermão de
      Vieira por domingo") + e-mail automático semanal com um trecho
      ("Sábado, um trecho"). Bloqueada pela constância de conteúdo:
      só fazer quando o catálogo sustentar ritmo semanal sem esforço
      manual. E-mail é canal próprio, independente de Google.

### Performance web (2026-08-22)

- [x] **Code-splitting do bundle** — warning de chunk >500kB eliminado.
      `Reader` virou lazy route (`React.lazy` + `Suspense` no `App.tsx`)
      e `vite.config.ts` ganhou `manualChunks`: stack markdown inteira
      (react-markdown/remark/unified/micromark/hast ≈ 47KB gzip) só
      baixa quando alguém abre um leitor; react/router/tanstack em
      chunk vendor (73KB gzip) com cache de longa duração. Resultado:
      app code 99KB gzip + vendor 73KB no primeiro load (antes: ~172KB
      monolítico); leitor carrega os outros 50KB sob demanda.

---

## Leitor digital — a experiência de leitura (pedido do Rilson, 2026-09-25)

Três problemas levantados em uso real, na ordem de importância. **Não
executar agora** — registrado para uma fase dedicada. São as três
pendências que mais pesam na experiência de quem lê, e o critério de
"pronto" aqui não é funcional: é alguém escolher o Scriptorium para
ler uma obra longa, e não para saber que ele existe.

### 1. O leitor carrega o livro inteiro e a página fica pesadíssima
**Sintoma:** abrir qualquer obra longa trava/navega mal — uma peça só
de Confissões já são ~500KB de markdown, e o `react-markdown` monta o
DOM inteiro de uma vez.

**Direção:** paginação/virtualização em vez de rolagem contínua, no
espírito do Kindle e do Skeelo — o leitor vê uma "página" por vez, com
posição preservada ao voltar. O sumário por capítulos que já existe
dá a estrutura natural para isso. Alternativa mais barata antes de
qualquer uma: renderização incremental do markdown (dividir o texto em
blocos e processar por etapas) para o primeiro trecho aparecer rápido.

**Antes de codar:** medir de verdade (tempo até o primeiro texto
pintado, peso do DOM, FPS de rolagem) em pelo menos três obras de
tamanhos diferentes. Sem número, não há como saber se melhorou.

### 2. Selecionar uma palavra já dispara busca online
**Sintoma:** hoje, selecionar qualquer palavra abre o popover do
glossário de arcaísmo — inclusive em palavra comum, em que o leitor só
queria selecionar. A ação esperada pelo leitor moderno é copiar.

**Direção:** a seleção **não** deve fazer nada sozinha. Ao selecionar,
aparecer um menu de contexto com: **copiar**, **destacar** (já existe,
via `NotesDrawer`), **buscar significado** (o glossário atual, sob
demanda), **buscar no dicionário online**, **citar este trecho** (com
proveniência, reaproveitando o `AcademicCitationDialog`) e **compartilhar**.
A busca online nunca deve ser o comportamento padrão de uma seleção.

**A favor:** a mesma seleção já alimenta o card de citação
(`QuoteCardDialog`) — é o mesmo mecanismo, com mais opções.

### 3. Downloads escondidos dentro de "Como Citar"
**Sintoma:** `.md`, `.txt` e `.epub` estão dentro do diálogo de citação
acadêmica. Não fazem sentido ali — quem quer baixar não está citando.
E **falta o PDF**, que é o formato que a maioria dos leitores de obra
clássica procura primeiro.

**Direção:** a leitura é o coração do app, então **baixar o livro**
precisa de entrada de primeira classe na ficha da obra e no leitor, com
os formatos visíveis de imediato: PDF (link direto, quando a fonte
permitir), ePub, TXT, Markdown/Obsidian. A seção de downloads que já
existe na ficha (`download_links` do banco) deve ser a base disso, com
os formatos gerados no cliente completando o que não tem arquivo
hospedado. Padronizar rótulo, ícone e ordem em todos os pontos do app.

**Depende de:** decidir a política de PDF (re-escaneamento com OCR
próprio, ou link para a fonte pública como o Internet Archive) — mesma
decisão que o item "Ainda pendente — texto e capa do Compêndio de
Teologia" da seção P8 já exige.

---

## Backlog de UI/UX, Produto & Rigor Acadêmico (Levantamento 2026-08-23)

> Levantamento do Rilson após uso em produção. Ações prioritárias de UX mobile, rigor acadêmico e refinamento de dados.

### 🔴 Bugs de Dados e Links em Produção

- [x] **Cidade de Deus ("Conteúdo indisponível") (concluído 2026-08-31)** — vinculado ao texto legível em markdown `cidade-de-deus-en.md` (`scripts/fix_flagship_text_paths_2026-08-31.sql`).
- [x] **Compêndio de Teologia sem leitura (concluído 2026-08-31)** — vinculado ao texto latino `compendium-theologiae-la.md` (`scripts/fix_flagship_text_paths_2026-08-31.sql`).
- [x] **Contagem de obras da Patrística zerada (concluído 2026-08-31)** — filtro/página de categorias com normalização de acentos e carregamento completo.
- [x] **Contagem total de obras no catálogo 37/37 (concluído 2026-08-31)** — `/livros` atualizado com limite 100 e contador dinâmico do acervo completo.
- [x] **Revisão de OCR de *O Peregrino* (concluído 2026-08-31)** — removida folha de rosto/cabeçalho de escaneamento Tesseract.

### 🟠 UI/UX & Mobile Responsivo

- [x] **Menu Hambúrguer no Mobile** — a barra de navegação no mobile tem menu colapsável (hambúrguer/Sheet).
- [x] **Botão de busca no mobile** — busca expandível e integrada ao menu mobile para uso confortável ao toque.
- [x] **Hierarquia tipográfica & tamanhos de fonte desproporcionais (concluído 2026-08-31)** — padronizada escala de tipos no Hero da Home e nos componentes principais.
- [x] **Hero da Home (concluído 2026-08-31)** — organizados dados do hero e ajustado o tamanho das fontes no mobile para melhor escaneabilidade.
- [x] **Vazamento de texto nos cards em destaque (concluído 2026-08-31)** — aplicado `line-clamp-2` no título e `line-clamp-1` no título original em `BookCard.tsx`.
- [x] **AdSense Placeholder visível (concluído 2026-08-31)** — container do `AdSlot` oculta-se com a classe `hidden` quando não houver anúncio veiculado.
- [x] **Controles de tamanho de fonte no Reader** — adicionados controles no leitor online (`ReadingToolbar`).
- [x] **Estilização do Player TTS / Áudio (concluído 2026-08-31)** — player de áudio estilizado em formato de pílula (`bg-library-wood text-library-gold`).
- [x] **Padronização do botão "Ler escaneamento online" (concluído 2026-08-31)** — o botão em `LivroDetalhes` reestilizado com visual padronizado, borda e transição hover.
- [x] **Acesso fácil aos Favoritos (concluído 2026-08-31)** — adicionado atalho direto para os Favoritos no menu do cabeçalho principal.

### 🟡 Rigor Acadêmico, Formatos e Ecossistema

- [x] **Rigor Acadêmico & Citação** — implementados botões "Como Citar esta Obra" na ficha do livro e no leitor com gerador de 1-clique nos formatos ABNT NBR 6023, Chicago 17th, APA 7th e BibTeX (.bib).
- [x] **Formatos dinâmicos de Download (Obsidian / Markdown)** — implementada exportação em Markdown (`.md`) com YAML Frontmatter (Título, Autor, Tradutor, URL e data) para Obsidian, Notion e Logseq.
- [x] **Completar i18n (PT-BR / EN / ES) (concluído 2026-08-31)** — implementado suporte triplo de idiomas (Português, Inglês e Espanhol) com seletor interativo `PT | EN | ES` no cabeçalho e dicionários completos em `i18n/index.ts`.

### 🏛️ Identidade Narniano & Cluster "A Biblioteca"

- [x] **Badge/Selo do Cluster no Rodapé (concluído 2026-08-31)** — mantido no `Footer.tsx` para preservar a sobriedade do cabeçalho sem duplicação visual.
- [x] **Reconciliação da Paleta Narniano (Dourado & Manuscrito) — 2026-09-25.** Os tokens da paleta canônica do cluster (`--library-canela`, `--library-dourado`, `--library-vinho`, `--library-bege-areia`, `--library-grafite` + as variantes texto-seguras) foram adicionados ao `index.css`, espelhando `Identidade visual geral.md` §2. As 40 bordas/ornamentos dourados passaram a usar o dourado canônico `#B49A60` (`--library-dourado`) no lugar do dourado local. O dourado de **texto** sobre madeira escura foi mantido claro de propósito: trocar o `--library-gold` global derrubaria o contraste do cabeçalho de 6.26:1 para 3.69:1 (reprovado). Medido por script, não a olho — os pares válidos hoje: dourado-texto 7.5–12:1 no escuro, madeira-texto 6.7–14:1 no claro.
- [x] **Toque de Manuscrito Medieval** — implementadas capitulares tipográficas (`.capitular-medieval::first-letter`) na abertura dos capítulos do leitor em tom dourado clássico.
- [x] **Conexões Cruzadas do Cluster (concluído 2026-08-31; removido 2026-09-25)** — chegou a existir como `ClusterConnections.tsx` em `AutorDetalhes.tsx` e `LivroDetalhes.tsx`, com links contextuais por URL para *Bíblia na Arte*, *Lecionário* e *Gerador C.S. Lewis*. **Removido**: os links por `?q=` não retornam resultado nenhum nos sites de destino, então o bloco só ocupava espaço e frustrava. A conexão entre projetos continua no rodapé (`ClusterFooter`, padrão aprovado do Gerador C.S. Lewis), onde os links são diretos e funcionam.

### ♿ Acessibilidade (a11y WCAG) & Leiturabilidade Fluida

- [x] **Auditoria de Acessibilidade WCAG (concluído 2026-08-31)** — adicionados rótulos `aria-label` descritivos nos botões interativos e player de áudio TTS.
- [x] **Auditoria de contraste por página, nos dois temas (2026-09-25)** — varredura
      automatizada de 11 rotas públicas em claro e escuro, medindo WCAG por
      elemento. O que ela **realmente** encontrou: três caixas que usavam a
      classe `prose` do Tailwind Typography sem herdar a cor do tema — o
      article do leitor, a caixa de proveniência e a missão na página Sobre —
      todas com texto cinza-escuro sobre superfície escura. Corrigidas com
      a classe `prose-leitor`. Resultado: **modo escuro passou de 6 violações
      reais para 0**; no claro nenhuma violação se confirmou (os 32
      apontamentos restantes eram falso-positivo do script, que não resolve
      cor de fundo quando ela vem por gradiente — verificado caso a caso).
      Teste de guarda adicionado em `index.css.test.ts`: **todo** `.prose` no
      app é obrigado a ter `prose-leitor`.
- [x] **Tipografia Fluida & Leiturabilidade Mobile**:
  - Adicionada escala tipográfica fluida com `clamp()` para que títulos e parágrafos se adaptem proporcionalmente de telas pequenas até 4K.
  - Garantir áreas de toque mínimas de 44×44px para todos os botões no mobile.

---

## Recursos Estratégicos de Experiência e Produto (Entregues 2026-08-23)

> Iniciativas estratégicas para elevar o produto ao padrão Narniano de profundidade e rigor.

- [x] **Modo Scriptorium (Leitura Imersiva Contemplativa & Preferências)**:
  - Painel de ajustes no leitor online com fontes (Merriweather, Garamond, Inter) e temas (Pergaminho, Claro, Escuro, Sépia).
  - Limite de largura de linha (`max-w-prose`) e gaveta de índice (`Drawer`) para navegação no mobile.
- [x] **Ferramentas de Rigor Acadêmico (Citação ABNT/Chicago/APA/BibTeX)**:
  - Botão "Como Citar esta Obra" com cópia em 1 clique nos formatos **ABNT**, **Chicago**, **APA** e **BibTeX** (incluindo autor, tradutor, ano PD, proveniência e URL).
  - Exportação dinâmica para Obsidian (`.md`) com YAML Frontmatter.
- [x] **Destaques e Anotações Pessoais**:
  - Menu de seleção para grifar trechos e gaveta lateral **"Minhas Anotações"** (`NotesDrawer`) para gerenciar frases grifadas e notas pessoais salvas no navegador.
- [x] **Conformidade de Engenharia 100% (`hetzner-infra`)**:
  - Dockerfiles (`web` e `server`) atualizados com diretivas `HEALTHCHECK` ativas e monitoramento de saúde contínuo.
  - Multi-stage builds Node 22 + pnpm 10 com pruning de dependências de produção e usuário não-root (`USER app`).
  - Nginx com Security Headers OWASP, Gzip, cache imutável de 1 ano e guarda de disco de 90% no CI/CD (`deploy.yml`).
- [x] **Páginas de Autor Ricas (Alimentadas pelo Vault Obsidian) (concluído 2026-08-31)**:
  - Enriquecidas as páginas `/autor/:slug` trazendo biografias, contexto histórico, contribuições e citações marcantes diretamente das notas do **Vault Obsidian** (`authorsRichData.ts`).
  - Retrato do autor em moldura circular *tondo* dourada com citação de assinatura em `.signature-quote`.
  - Catálogo de suas obras disponíveis no acervo do Scriptorium Divinum.
- [x] **Polimento de Infraestrutura & Exportação Dinâmica**:
  - Healthcheck do `scriptorium-web`: **já existia** no `web/Dockerfile`
    (linha 32, `curl` na porta 80) — verificado por SSH em 2026-09-25,
    ambos os containers reportando `healthy`. Não foi preciso reiniciar
    produção para declarar isto no `docker-compose.yml`.
  - Gerador dinâmico de exportação entregue em 2026-09-25: **TXT limpo** e
    **ePub** (EPUB 3 válido, ZIP via `fflate` com `mimetype` armazenado
    sem compressão, como o formato exige) a partir do acervo do leitor,
    ao lado do Markdown/Obsidian que já existia. 5 testes novos.

---

## Convergência visual com o cluster (pedido do Rilson, 2026-09-25)

> "Estou achando o Scriptorium meio feio. Não tem como ele se espelhar
> mais no que está implementado no Lecionário e na Bíblia na Arte em
> elementos, bordas, fonte, transições?" + "se usa demais texto em caixa
> alta, fica estranho".

Tudo abaixo foi **medido** nos três repositórios, não impressionado:

| Métrica | Scriptorium | Bíblia na Arte | Lecionário |
|---|---|---|---|
| `uppercase` | **14** | 9 | **0** |
| `rounded-*` (bordas arredondadas) | **227** | 199 | **0** |
| `--radius` base | 0.5rem + 4 degraus | idem | **0.25rem** |
| Fontes | Playfair/Cinzel/Merriweather/Inter | Cormorant/EB Garamond/Inter | **Cormorant/EB Garamond/JetBrains Mono** |
| Canônico do vault | — | parcial | **Cormorant + EB Garamond + JetBrains Mono** |

**Diagnóstico.** O Scriptorium não está "errado" — está *derivado*. Nasceu
do shadcn (com `rounded-lg` em tudo) e foi receiving adições ao longo de
6 semanas, cada uma trazendo um `rounded` novo. O Lecionário, sendo
Next.js com o vault como fonte, tem **zero** arredondados e zero caixa
alta — o que dá a ele a cara sóbria de biblioteca. O Scriptorium tem cara
de "dashboard com tema pergaminho".

### Fases (propostas — aguardam aprovação do Rilson)

**F0 — Decisões de design (primeiro, sem codar).** Antes de mexer em
227 classes, alinhar três decisões com o Rilson, porque elas definem tudo
o resto:
1. **Bordas:** escanear? (O `--radius` do Scriptorium é 0.5rem contra
   0.25rem do Lecionário, e há 227 `rounded-*`.) Recomendo baixar o
   radius base para ~0.25rem e reduzir `rounded-xl/2xl` a `rounded-sm/md`
   — aproximando do Lecionário sem o zero absoluto dele.
2. **Caixa alta:** remover dos títulos de seção (mantendo nos rótulos
   pequenos de rodapé e no "Como citar", onde é convenção editorial
   legítima). Recomendo manter <4 usos, todos em label curto.
3. **Fontes:** o canônico do vault é Cormorant Garamond (display) + EB
   Garamond (body) + JetBrains Mono. O Scriptorium usa Playfair (display),
   Cinzel (classical), Merriweather (reading), Inter (sans), EB Garamond
   (serif). **Não é troca trivial** — Merriweather é a fonte de *leitura
   longa* e foi escolha de leitura, não estética. Recomendo: display e
   serif passam para o canônico; reading (Merriweather) e sans (Inter)
   ficam, com justificativa. Ou seja, converge ~60%, não 100%.

**F1 — Caixa alta** (risco baixo, ganho alto). Extrair um componente
`<SectionLabel>` único (não uma classe solta) e substituir os 14 usos.
O rótulo do rodapé com `tracking-[0.3em]` a 10px volta para algo
legível.

**F2 — Bordas e raio.** Token único de raio, substituir os `rounded-lg/xl`
do shadcn pelo valor convergente. Catálogo com `rg -l 'rounded-'` para
não errar nenhum.

**F3 — Tipografia.** Alinhar display/serif ao canônico, com teste
visual (playwright) antes/depois para não quebrar hierarquia.

**F4 — Transições e elementos.** Unificar duração/easing (o vault tem
`--ease-liturgico`/`--ease-vela`, já registrados no ROADMAP de identidade
desde 2026-08-15 e nunca implementados aqui). Padronizar `transition-*`.

**F5 — Regressão visual.** O projeto já tem um `e2e` com baselines de
QA visual (52 capturas, claro+escuro+mobile, job `visual-qa` no CI,
mencionado no checklist). **Reaproveitar essa ferramenta** como rede de
segurança: antes de F1, regenerar baselines; depois, comparar. Sem isso,
mexer em 227 classes às cegas é arriscado.

> [!warning] Regra desta fase
> Nenhuma fase começa sem: (a) captura do antes, (b) o Rilson vendo o
> antes/depois, (c) a mesma forma nos dois irmãos. Convergência é
> *entre* projetos, não impor o Scriptorium aos outros.

---

## Registro de Sessão — 2026-09-25 (leiturabilidade e bugs de interação)

Fechamento da fila de pendências do Scriptorium e, no fim, uma leva de bugs
encontrados por uso real do site. Os quatro abaixo custaram mais tempo porque
**nenhum aparecia nos testes** — todos só apareceram ao abrir o site de verdade.

### 1. Botões dos cards não respondiam ao clique (bug de ~1 mês)
`.leather-pressed-card::before` — o overlay decorativo da moldura — estava
escrito com `pointer-events-none: none`. É **CSS inválido**: um nome de classe
do Tailwind no lugar do `:`. O navegador descarta a declaração, o
`pointer-events` fica `auto` e o pseudo-elemento, que cobre o cartão inteiro
(`inset: 4px`), passa a engolir os cliques dos próprios botões "Detalhes" e
"Ler Online". Introduzido em `fb04ed5` (2026-08-23) e nunca notado.
**Lição:** os testes de DOM passavam (o `<a href>` estava lá, correto) —
só a auditoria de estilo no browser real pegou. Cobertura adicionada:
`BookCard.test.tsx` (links presentes e overlays contidos) e um teste de
`index.css` que reprova qualquer utilitário do Tailwind usado como
propriedade CSS.

### 2. Texto do leitor ilegível no modo escuro
Causa: eu mesmo troquei, em 2026-09-25, as cores do artigo por
`[--tw-prose-body]:[color:inherit]`. A classe arbitrária era inválida
(o dois-pontos dentro dos colchetes) e o `prose` do Typography continuou
aplicando seus cinzas (#374151) sobre o cartão escuro.
**Lição:** quando o Typography plugin está no meio, a ordem de emissão
importa: ele usa `:where()`, que tem especificidade **zero**, e é escrito
**depois** das regras do projeto. Redefinir a variável customizada não
basta — é preciso `color: ... !important` no article **e** nos descendentes.
Cobertura: teste de `index.css` exigindo o `!important` nos dois níveis.

### 3. Coluna de leitura curta demais no desktop
`max-w-prose-reading` usava `65ch`, mas `ch` se resolve pela fonte do
**próprio elemento** — que ali não é a fonte de leitura. Resultado: 608px
travados, cerca de 45 caracteres por linha, bem abaixo da faixa confortável
de 66–80. Agora em degraus por breakpoint (100% no mobile, 40rem em ≥768px,
42rem em ≥1280px). **Calibrado por medição real** — a primeira tentativa
(44/48rem) deu 85 caracteres por linha, acima do ideal, e foi ajustada:
hoje são **67 caracteres/linha** no desktop e 36 no mobile (390px).

### 4. Áudio sem som, sem aviso
O botão "Ouvir" usava a Web Speech API. Em ambiente sem vozes instaladas
(Linux, containers, alguns navegadores) `speak()` é chamado, o estado vai
para `playing` e **não sai som nenhum** — o leitor ficava achando que tocava.
Agora o `onerror` distingue `synthesis-failed`/`synthesis-unavailable` e a
interface mostra "Sem voz instalada" com botão de tentar de novo.
**Honestidade:** isto **não** faz o áudio funcionar onde não há voz — é a
limitação da API do navegador. TTS real exigiria áudios pré-gerados no
servidor, que é outro escopo.

### Método que funcionou
Para os quatro, a reprodução em navegador headless (Playwright +
`document.elementFromPoint` e `CSS.getMatchedStylesForNode` via CDP) foi
o que destravou o diagnóstico. Testes unitários e de DOM passavam em todos
os casos — inclusive com o botão completamente inerte.

### 5. Auditoria geral de legibilidade, nos dois temas (2026-09-25)
A pedido do Rilson depois de ele encontrar texto escuro sobre fundo
escuro na caixa de proveniência. A correção do item 2 tinha tratado só o
`article` — a **caixa de proveniência** usava a mesma classe `prose` e
continuava com cinza `rgb(17,24,39)` sobre `rgba(42,32,24,0.6)`: 1.11:1.

Escrevi uma auditoria que percorre 11 rotas nos dois temas e mede WCAG
por elemento. Ela achou o que a busca manual não pegou: **três** elementos
com `prose` sem `prose-leitor` — o article, a proveniência e a missão na
página Sobre. Um teste novo agora obriga **todo** `.prose` do app a ter a
classe, e foi validado reintroduzindo a falha (o teste acusa o arquivo e a
linha exatos).

**Sobre a auditoria:** os 32 apontamentos do modo claro **não se
confirmaram** — todos caem em fundo por gradiente (`bg-gradient-to-r
from-library-gold/10`) ou em texto com gradiente (`golden-foil`), que o
script não resolve. Verifiquei caso a caso: o contraste real é 9:1 a 11:1.
Ou seja, o número final é **praticamente zero violações nos dois temas** —
mas isso depende de mim ter checado, e não só do script. Um script de
contraste que não entende gradiente dá falso positivo e falso negativo
nele; a checagem manual dos casos apontados é o que fecha isso.



