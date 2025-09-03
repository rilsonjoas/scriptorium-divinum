# Scriptorium Divinum

Uma biblioteca digital dedicada às obras clássicas da teologia cristã em domínio público. O projeto oferece acesso gratuito a textos dos Padres da Igreja, reformadores e grandes teólogos da história cristã.

## 🎯 Estado Atual do Projeto

O Scriptorium Divinum é uma aplicação web moderna com integração completa ao Supabase, oferecendo uma experiência dinâmica e funcional.

### ✅ Funcionalidades Implementadas
- **🏠 Frontend Completo**: Interface moderna com React 18 + TypeScript
- **🗄️ Integração Supabase**: Banco PostgreSQL com dados dinâmicos
- **📚 Catálogo Dinâmico**: Sistema completo de livros, autores e categorias
- **🔍 Sistema de Busca**: Busca avançada com filtros por categoria e autor
- **📖 Páginas de Conteúdo**: Livros, Autores, Categorias, Busca, Contribuir
- **🎨 Design Clássico**: Interface inspirada em bibliotecas tradicionais
- **🔐 Sistema Administrativo**: Dashboard admin com autenticação (em desenvolvimento)
- **📱 Interface Responsiva**: Funciona em desktop, tablet e mobile

### 🛠️ Tecnologias Utilizadas
- **React 18** + **TypeScript** - Frontend moderno e tipado
- **Vite** - Build tool otimizado
- **Tailwind CSS** + **shadcn/ui** - Design system consistente
- **TanStack Query** - Gerenciamento de estado para dados
- **Supabase** - Backend as a Service (PostgreSQL + Auth + Storage)
- **Row Level Security** - Segurança nativa do banco de dados

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js 18+** 
- **npm** ou yarn
- **Conta Supabase** (gratuita)

### Configuração do Banco de Dados
1. Crie um projeto no [Supabase](https://app.supabase.com)
2. Execute os scripts SQL em `database/`:
   ```sql
   -- Execute nesta ordem:
   database/schema.sql       -- Estrutura das tabelas
   database/admin-setup.sql  -- Sistema administrativo (profiles, roles, etc.)
   ```
3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   # Preencha com suas credenciais do Supabase
   ```

### Instalação e Execução
```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Navegue até o diretório
cd scriptorium-divinum

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Edite o arquivo .env com suas credenciais do Supabase

# Execute em modo de desenvolvimento
npm run dev

# Acesse em http://localhost:3004
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento (porta 3004)
npm run build    # Build para produção
npm run preview  # Preview do build de produção
npm run lint     # Análise de código com ESLint
```

### Estrutura do Banco de Dados
O projeto usa **PostgreSQL** via Supabase com as seguintes tabelas:
- `authors` - Informações dos autores teológicos
- `books` - Catálogo de livros e obras
- `download_links` - Links para downloads das obras
- `profiles` - Perfis de usuários e roles administrativos

## 📂 Estrutura do Projeto

```
scriptorium-divinum/
├── src/
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── ui/             # Componentes base do shadcn/ui
│   │   ├── AdminLayout.tsx  # Layout para painel administrativo
│   │   ├── AdminRoute.tsx   # Proteção de rotas admin
│   │   ├── BookCard.tsx     # Card de livro
│   │   ├── Header.tsx       # Cabeçalho com busca
│   │   ├── Footer.tsx       # Rodapé
│   │   └── Layout.tsx       # Layout principal
│   ├── contexts/           # Context providers
│   │   └── AuthContext.tsx # Contexto de autenticação
│   ├── hooks/              # Custom React hooks
│   │   └── useDatabase.ts  # Hooks para Supabase
│   ├── lib/                # Utilitários e configurações
│   │   └── supabase.ts     # Cliente Supabase
│   ├── pages/              # Páginas da aplicação
│   │   ├── admin/          # Páginas administrativas
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   └── AdminDebug.tsx
│   │   ├── Index.tsx       # Página inicial
│   │   ├── Livros.tsx      # Catálogo de livros
│   │   ├── Autores.tsx     # Lista de autores
│   │   ├── Busca.tsx       # Busca avançada
│   │   ├── Contribuir.tsx  # Como contribuir
│   │   └── LivroDetalhes.tsx
│   ├── services/           # Serviços de dados
│   │   └── database.ts     # Funções do banco
│   └── types/              # Definições TypeScript
├── database/               # Scripts SQL
│   ├── schema.sql          # Estrutura das tabelas
│   └── admin-setup-complete.sql # Sistema admin
└── .env                    # Variáveis de ambiente
```

## 📋 Estado de Desenvolvimento Atual

### 🚧 Em Desenvolvimento
- **Sistema Administrativo**: Painel admin em finalização
  - ✅ Dashboard com estatísticas
  - ✅ Sistema de autenticação
  - ⚠️ Login/registro (problemas técnicos sendo resolvidos)
  - 🔄 CRUD de livros, autores e categorias (próxima etapa)

### 🔧 Problemas Conhecidos
- **Autenticação Admin**: Erro HTTP 400 no signup via Supabase
- **Configuração RLS**: Políticas de Row Level Security precisam ser ajustadas
- **Email Confirmation**: Pode estar ativado no Supabase causando problemas de login

### 📋 Próximos Passos Imediatos

#### Prioridade Alta (1-2 semanas)
1. **🔐 Resolver Autenticação Admin**
   - Corrigir configurações do Supabase Auth
   - Testar sistema de roles e permissões
   - Implementar reset de senha funcional

2. **📝 CRUD Administrativo**
   - Formulários para adicionar/editar livros
   - Gestão completa de autores
   - Sistema de categorias
   - Upload de capas e arquivos

3. **📊 Melhorias no Dashboard**
   - Gráficos de estatísticas
   - Listagem de atividades recentes
   - Sistema de logs administrativos

#### Prioridade Média (1 mês)
4. **🔍 Sistema de Busca Aprimorado**
   - Busca full-text no PostgreSQL
   - Filtros combinados avançados
   - Sugestões de busca automática

5. **📚 Expansão do Conteúdo**
   - Adicionar mais obras clássicas
   - Implementar sistema de tags
   - Metadados históricos enriquecidos

6. **🎨 Melhorias de UX**
   - Loading states mais elegantes
   - Animações suaves
   - Modo escuro/claro

#### Funcionalidades Futuras
- **📱 Progressive Web App (PWA)**
- **📖 Leitor integrado de textos**
- **⭐ Sistema de favoritos**
- **🔗 API REST pública**
- **🌐 Internacionalização (i18n)**

## 🔗 Acesso ao Sistema

### Usuários Finais
- **Site Principal**: `http://localhost:3004/`
- **Busca Avançada**: `http://localhost:3004/busca`
- **Catálogo**: `http://localhost:3004/livros`
- **Autores**: `http://localhost:3004/autores`

### Administradores
- **Login Admin**: `http://localhost:3004/admin/login`
- **Dashboard**: `http://localhost:3004/admin/dashboard`
- **Debug/Testes**: `http://localhost:3004/admin/debug`

## 🤝 Contribuições

Este é um projeto de código aberto dedicado à preservação do patrimônio teológico cristão:

- **🐛 Issues**: Reporte bugs e problemas técnicos
- **💡 Funcionalidades**: Sugestões de melhorias e novos recursos  
- **📚 Conteúdo**: Adição de obras e correção de metadados
- **🎨 Design**: Melhorias na interface e experiência do usuário
- **📖 Documentação**: Expansão e melhoria da documentação

## 📄 Licença

Este projeto está sob licença **MIT**, mantendo o espírito de acesso livre das obras que preserva. Todo o código-fonte está disponível para uso, modificação e distribuição.

## 🛠️ Tecnologias e Dependências

### Frontend
- **React 18** - Biblioteca JavaScript para UI
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool moderno e rápido
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI reutilizáveis
- **React Router** - Roteamento client-side
- **TanStack Query** - Gerenciamento de estado de servidor
- **Lucide React** - Biblioteca de ícones

### Backend & Database  
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security** - Segurança nativa do PostgreSQL
- **Supabase Auth** - Sistema de autenticação

## 🔗 Recursos Relacionados

- **[Supabase](https://supabase.com/)** - Backend e banco de dados
- **[shadcn/ui](https://ui.shadcn.com/)** - Sistema de componentes
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS
- **[Projeto Gutenberg](https://www.gutenberg.org/)** - Textos em domínio público
- **[Internet Archive](https://archive.org/)** - Digitalizações históricas
- **[CCEL](https://ccel.org/)** - Biblioteca de clássicos cristãos

---

*"In principio erat Verbum"* - **Scriptorium Divinum**  
*Uma biblioteca digital para preservar o patrimônio teológico cristão*