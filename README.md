# Scriptorium Divinum 📚✨

Uma biblioteca digital dedicada às obras clássicas da teologia cristã em domínio público. O projeto oferece acesso gratuito a textos dos Padres da Igreja, reformadores e grandes teólogos da história cristã.

---

## 🎯 Estado Atual do Projeto

> [!NOTE]
> Desde 2026-08-08 este é um **monorepo pnpm workspace** (`web/` + `server/`) — o projeto foi migrado com sucesso do Supabase para uma arquitetura self-hosted em um VPS Hetzner.

### ✅ Funcionalidades no Ar
- **🏠 Frontend (React + Vite)**: `https://scriptorium.narniano.com` (Servido via Nginx + Traefik)
- **🚀 API REST (Fastify + Drizzle)**: `https://api-scriptorium.narniano.com` (Conectado ao Postgres compartilhado)
- **🗄️ Banco de Dados**: Postgres (`scriptorium_divinum_db`) rodando localmente no VPS com role isolada e segura.
- **🔄 Backup Integrado**: Backups diários criptografados com `age` e sincronizados via Tailscale.

---

## 🛠️ Tecnologias Utilizadas

**Frontend (`web/`):**
- ⚛️ **React 18** + **TypeScript** - Interface moderna e tipada
- ⚡ **Vite** - Build tool rápido e otimizado
- 🎨 **Tailwind CSS** + **shadcn/ui** / **Radix UI** - Design system consistente
- 🔍 **TanStack Query** - Gerenciamento de estado de servidor

**Backend (`server/`):**
- 🚀 **Fastify** - API REST de alta performance e baixo consumo de recursos
- 🗄️ **Drizzle ORM** + PostgreSQL - Acesso e modelagem de dados sem dependência de engines externas
- ✅ **Zod** - Validação de payloads e parâmetros
- 🔒 **Segurança**: helmet + rate limiting + CORS restrito + Sentry para monitoramento de erros

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 20+
- **pnpm** (não npm/yarn/bun)

### Passos para Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/rilsonjoas/scriptorium-divinum.git
cd scriptorium-divinum

# 2. Instale as dependências de todo o workspace
pnpm install

# 3. Configure o banco de dados no backend
# Copie o .env.example e adicione a string de conexão de um Postgres local
cp server/.env.example server/.env

# 4. Execute a aplicação em desenvolvimento
pnpm dev:web       # Rodará o frontend em http://localhost:8080
pnpm dev:server    # Rodará a API em http://localhost:3001
```

### Scripts Disponíveis (raiz do workspace)
```bash
pnpm dev:web        # Frontend em desenvolvimento
pnpm dev:server     # API em desenvolvimento
pnpm build:web      # Build de produção do frontend
pnpm build:server   # Build de produção da API
pnpm lint           # Executa o ESLint em todo o workspace
pnpm typecheck      # Executa verificação de tipos do TypeScript
```

---

## 📂 Estrutura do Monorepo

```
scriptorium-divinum/
├── pnpm-workspace.yaml
├── web/                  # Frontend (React SPA)
│   ├── src/
│   │   ├── components/   # Componentes da interface
│   │   ├── pages/        # Páginas (Dashboard, Livros, Autores, etc)
│   │   ├── lib/          # Configuração de rotas e clients
│   │   └── types/        # Definições TS
│   └── Dockerfile        # Build multi-stage com Nginx
└── server/               # Backend API
    ├── src/
    │   ├── db/           # Schema Drizzle, migrações e sementes
    │   ├── routes/       # Handlers de rota (livros, autores, etc)
    │   └── schemas/      # Validações Zod
    └── Dockerfile        # Build multi-stage (Fastify)
```

---

## 🤝 Contribuições

Este é um projeto de código aberto dedicado à preservação do patrimônio teológico cristão. Todo o código-fonte está sob a licença **MIT**.