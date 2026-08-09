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

- [ ] **Resolver ou substituir o auth do painel admin.** README documenta
      erro HTTP 400 no signup/login via Supabase Auth como problema
      conhecido, nunca resolvido — hoje o admin não é usável
- [ ] **Conferir as políticas de RLS** das tabelas `authors`, `books`,
      `download_links`, `profiles` — o próprio README lista "Configuração
      RLS: Políticas... precisam ser ajustadas" como problema aberto.
      Sem RLS correta, dados que deveriam ser protegidos podem estar
      publicamente graváveis/legíveis via API do Supabase
- [ ] **Decisão estratégica, não só bug fix**: em vez de consertar o auth
      do Supabase, considerar migrar pro mesmo padrão do biblia-na-arte
      — API própria + Postgres self-hosted. Justificativa: o Supabase
      gratuito do biblia-na-arte **morreu por inatividade** em produção
      sem aviso (banco e storage apagados) — é um risco real já
      materializado uma vez neste mesmo conjunto de projetos, não
      hipotético

## P1 — Infra & Deploy

> [!WARNING] Estado real incerto (2026-08-09)
> Containers `scriptorium-web` e `scriptorium-api` confirmados rodando
> no VPS com certificado Let's Encrypt válido (`scriptorium.narniano.com`,
> `api-scriptorium.narniano.com`) — foi ao ar na madrugada de 08/08, em
> paralelo, sem eu acompanhar a implementação. **Não sei se isso migrou
> pra API própria (resolvendo o P0) ou se subiu o app original ainda
> preso ao Supabase.** Conferir antes de assumir qualquer um dos dois —
> os itens abaixo ficam como estavam até essa confirmação

- [x] No ar no VPS — Dockerfile e `docker-compose.yml` existem (estado
      anterior desta lista, "não existe Dockerfile", está desatualizado)
- [ ] Confirmar arquitetura real: ainda Supabase, ou migrou pra API
      própria + Postgres (`scriptorium_app`)?

## P2 — Saúde & Resiliência

- [ ] Não auditado — categoria nova (fusão com o SHIELD, 2026-08-09)

## P3 — CI/CD

- [ ] Não existe `.github/workflows/` — criar do zero. Mínimo viável:
      lint + typecheck + build a cada push/PR (o lecionário já tem um
      workflow bom pra copiar a estrutura, `lecionario/.github/workflows/ci.yml`)
- [ ] `npm audit` (ou `pnpm audit`, se migrar de gerenciador) no CI

## P4 — Testes

- [ ] Zero testes automatizados hoje — nem test runner configurado
- [ ] Prioridade ao cobrir: `src/services/database.ts` (toda a camada de
      acesso a dados passa por ali) e a lógica de busca/filtros de
      `Busca.tsx`

## P5 — Monitoramento & Logs

- [ ] Sem Sentry, sem analytics, sem qualquer visibilidade de erro em
      produção hoje

## P6 — Backups & Recuperação

- [ ] Depende da decisão do P1 — se migrou pra Postgres próprio, entra
      no backup geral do VPS; se ainda é Supabase, sem backup nenhum sob
      seu controle (mesmo risco que já matou o Supabase do biblia-na-arte)

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
