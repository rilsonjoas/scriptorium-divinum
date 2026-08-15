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

## P2 — Saúde & Resiliência

- [x] **Saúde & Resiliência configuradas (2026-08-14)**:
      * Adicionado handler de encerramento global (SIGTERM/SIGINT) para fechar o banco Drizzle e encerrar o servidor Fastify de forma graciosa.
      * Adicionado rotas de health check (`/health`, `/health/live`, `/health/ready`).

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
- [ ] Web (frontend) continua sem teste nenhum

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
      categorias via `listCategories()` (agrega dos `books.categories`).
      Em produção: 35 URLs (8 estáticas + 8 livros + 19 categorias),
      testado no CI
- [ ] Interface Responsiva — README reivindica; não verificado de fato
- [ ] Modo escuro/claro — só existem as variantes `dark:` do shadcn/ui;
      sem toggle e sem tema aplicado no app
- [ ] Loading states "mais elegantes" — item aberto no próprio README
- [ ] Acessibilidade — não mencionada em nenhum lugar do projeto até
      agora, provavelmente zero auditoria feita

## P8 — Funcionalidades / entrega de valor real

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
      proveniência
- [ ] **Meta legal permanente** — política de direitos autorais
      documentada no README: só publicar obra com proveniência de domínio
      público; tradução moderna não pode; capas/imagens auditadas;
      takedown antes de abrir upload de terceiros. Ação pendente: auditar
      as 19 URLs de capa hoje no banco
- [ ] Sistema de favoritos, PWA, i18n — não começados

## P9 — Documentação

- [x] **README reescrito e alinhado com o estado real (2026-08-14)**
      (commit `1595724`): virou monorepo web+server, seção "Funcionalidades
      no Ar" só com o que existe de fato, instruções de setup local e
      estrutura do workspace; deixou de anunciar recursos inexistentes
      (leitor, dark mode etc.)

---

## Ordem recomendada, se/quando este projeto voltar à mesa

> Numeração reavaliada em 2026-08-14, após verificação no código. P0/P1/P2/
> P3/P6 concluídos e conferidos; abaixo só o que ainda está aberto.

1. **Adicionar o primeiro texto real ao leitor** — infra pronta; falta
   conteúdo com proveniência de domínio público em `server/texts/` (ex.:
   95 Teses) + auditar as URLs de capa do banco (parte da política legal)
2. **P4 — primeiro teste do web** (vitest + React Testing Library) —
   travar o que já existe antes de mexer no leitor; é o único pilar de
   qualidade totalmente zerado
3. **P5 — Sentry** (ou alternativa self-hosted) — uptime já é monitorado;
   falta visibilidade de erro em runtime (front + api)
4. **P8 — upload de capas/arquivos** — hoje tudo é por URL, painel fica
   dependente de hospedagem externa
5. **P7 — dark mode, loading states, a11y** — polimento, menor retorno

## Nota: admin reconstruído com auth própria (concluído em 2026-08-14)

A reconstrução do login (item acima, que estava preso no Supabase quebrado
+ bypass "make all logged users admin") **saiu do papel** no commit
`51a71b7`. Sendo login de admin único (não de usuário final), e-mail/senha
com cookie de sessão foi a escolha certa. Se algum dia isto abrir pra mais
de um admin ou usuário externo, vale considerar a mesma decisão registrada
no `meus-remedios` (único projeto pessoal com OAuth de usuário real hoje)
— Google OAuth como atalho, nunca substituto de e-mail/senha. Ver
`meus-remedios/README.md`, seção "Decisão: Google OAuth + conta local".
