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
- [ ] **Admin ainda não migrou — e causou incidente real.** O painel
      continua preso ao Supabase (auth quebrado, HTTP 400 documentado no
      README). Pior: `web/src/lib/supabase.ts` lançava erro na carga do
      módulo quando as env vars do Supabase ficaram ausentes (depois da
      migração do catálogo) — e como isso é importado por `AuthContext`,
      que envolve o app inteiro, **o site público inteiro ficou fora do
      ar pra qualquer visitante**, não só quem tentasse `/admin`.
      **Corrigido em 2026-08-09** (client desabilitado em vez de lançar
      erro), mas a decisão de fundo — reconstruir o admin com auth
      própria ou descartar — continua em aberto
- [ ] **Achado de segurança à parte, não corrigido**: `checkAdminStatus`
      em `AuthContext.tsx` tem um bypass comentado como "TEMPORARY...
      make all logged users admin for testing" — qualquer usuário
      autenticado vira admin. Inalcançável agora que o login está
      desabilitado, mas precisa ser removido de verdade quando o admin
      for reconstruído, não só ficar comentado no meio do código
- [ ] RLS das tabelas do Supabase (`authors`, `books`, `download_links`,
      `profiles`) — só relevante se decidir manter Supabase pro admin;
      se reconstruir com Postgres próprio, isso vira código morto

## P1 — Infra & Deploy

- [x] **No ar e confirmado saudável (2026-08-09)**: `scriptorium-web` e
      `scriptorium-api` rodando no VPS, certificado Let's Encrypt válido,
      health check da API respondendo 200 continuamente, Uptime Kuma já
      monitorando o site. Testado com `curl` real, não só `docker ps`
- [ ] **Desconectar o projeto da Vercel** — ficou conectado ao GitHub
      desde antes da migração pro VPS (quando era só Vite+Supabase, como
      o AlternativasBR ainda é hoje), e cada push dispara um build lá que
      não faz sentido mais rodar. Ação manual no dashboard da Vercel, não
      dá pra fazer por aqui

## P2 — Saúde & Resiliência

- [ ] Não auditado — categoria nova (fusão com o SHIELD, 2026-08-09)

## P3 — CI/CD

- [ ] Não existe `.github/workflows/` — criar do zero. Mínimo viável:
      lint + typecheck + build a cada push/PR (o lecionário já tem um
      workflow bom pra copiar a estrutura, `lecionario/.github/workflows/ci.yml`)
- [ ] `npm audit` (ou `pnpm audit`, se migrar de gerenciador) no CI

## P4 — Testes

> [!DONE] Não é mais zero (2026-08-09)
> `src/services/database.ts` e a lista abaixo estavam desatualizadas —
> esses arquivos foram deletados na migração de arquitetura. A API nova
> já nasceu com `server/src/routes/api.integration.test.ts` (136 linhas)
> e config de Vitest própria (`vitest.config.ts` +
> `vitest.integration.config.ts`), mesmo padrão do biblia-na-arte

- [x] Testes de integração da API já existem — não rodam em CI ainda
      (ver P3)
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
- [ ] `sitemap.xml` — não existe ainda; aqui faz mais sentido que no
      a-bancada (catálogo de livros/autores tende a crescer, sitemap
      ajuda a indexação de conteúdo novo)
- [ ] README reivindica "Interface Responsiva: funciona em desktop,
      tablet e mobile" — não verificado neste levantamento, conferir de
      fato antes de assumir que está OK
- [ ] Modo escuro/claro está listado como melhoria futura no próprio
      README, não implementado
- [ ] Loading states "mais elegantes" — item aberto no próprio README
- [ ] Acessibilidade — não mencionada em nenhum lugar do projeto até
      agora, provavelmente zero auditoria feita

## P8 — Funcionalidades / entrega de valor real

Direto do "Próximos Passos" do próprio README do projeto — nada inventado
aqui, só organizado por prioridade real:

- [ ] **CRUD administrativo** — hoje só existe o dashboard com
      estatísticas; adicionar/editar livros, autores e categorias está
      listado como "próxima etapa", ainda não implementado
- [ ] Upload de capas e arquivos — não implementado
- [ ] Busca full-text real no Postgres (o README não confirma se a busca
      atual já é full-text ou só `LIKE`/filtro simples — conferir)
- [ ] Leitor de texto integrado, sistema de favoritos, PWA, API pública,
      i18n — todos listados como "funcionalidades futuras" no README,
      nenhum começado

## P9 — Documentação

- [ ] Nunca auditado nesta lista — README existe e é razoavelmente
      completo, mas não confirmado se ainda bate com o estado real do
      código (ver alerta de arquitetura incerta no P1)

---

## Ordem recomendada, se/quando este projeto voltar à mesa

> Numeração renumerada em 2026-08-09 (fusão com o SHIELD)

1. P1 (confirmar a arquitetura real primeiro — muda a leitura de tudo
   mais abaixo, inclusive se o P0 antigo ainda se aplica)
2. P0 (decidir Supabase x API própria, se P1 confirmar que ainda não
   migrou)
3. P3 (CI mínimo, barato de fazer e evita regressão enquanto o resto
   avança)
4. P8 parcial (CRUD admin — é o que faz o projeto passar de "catálogo
   estático" pra "produto administrável de verdade")
5. P4/P5/P7 em paralelo, conforme o tempo permitir
