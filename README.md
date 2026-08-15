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
- **📖 Leitor online** (`/ler/:id`): renderiza em markdown as obras que tiverem texto disponível em `server/texts/` (ver política de direitos autorais abaixo). O botão "Ler Online" só aparece quando o conteúdo realmente existe.

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

## ⚖️ Direitos Autorais e Proveniência

**Meta permanente do projeto: operar sempre dentro da lei de direitos
autorais.** Não basta a intenção de ser gratuito — a licitude tem de ser
comprovada obra a obra, em todos os formatos de acesso.

### Regras aplicadas

1. **Domínio público é o critério único de publicação.** No Brasil (Lei
   9.610/98, art. 41) a obra entra em domínio público 70 anos após a morte
   do autor. Autores clássicos (Agostinho, Anselmo, Tomás de Aquino,
   Lutero, Calvino, Pascal, Bunyan etc.) estão há séculos nessa condição —
   os **textos originais** não apresentam risco.
2. **Download e leitura online são juridicamente equivalentes.** Ambos são
   "disponibilização ao público" (arts. 29 e 31). Se a obra é de domínio
   público, os dois são legais; se é protegida, os dois infringem. O que
   decide tudo é **a origem do texto, não o formato de acesso**.
3. **Traduções e edições modernas são obras derivadas protegidas.**
   Tradução tem direito próprio (+70 anos após a morte do tradutor).
   **Só entrar no catálogo textos com proveniência verificável de domínio
   público** (tradução antiga em PD, ou tradução própria/licenciada).
   Todo arquivo em `server/texts/` precisa trazer um cabeçalho de
   proveniência declarando: obra, autor, tradutor (se houver), edição/
   fonte e por que está em domínio público.
4. **Capas e imagens também têm direitos.** Capas de edições modernas e
   ilustrações contemporâneas são protegidas; gravuras antigas (ex.: Doré)
   são de domínio público. Auditoria das URLs de capa antes de publicar.
5. **Sem conteúdo gerado/fornecido sem procedência.** O leitor só exibe o
   botão "Ler Online" quando o arquivo de texto existe de verdade com a
   declaração de proveniência (campo `online_read_path` + arquivo em
   `server/texts/`).
6. **Se um dia houver upload/contribuição de terceiros** (roadmap P8),
   implementar processo de notificação e remoção nos moldes do Marco Civil
   da Internet (Lei 12.965/14, arts. 19–21) antes de abrir o recurso.

O template de proveniência fica em `server/texts/README.md`.

---

## 🤝 Contribuições

Este é um projeto de código aberto dedicado à preservação do patrimônio teológico cristão. Todo o código-fonte está sob a licença **MIT**.