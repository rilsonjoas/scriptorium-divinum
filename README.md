# Scriptorium Divinum

Uma biblioteca digital dedicada às obras clássicas da teologia cristã em domínio público. O projeto oferece acesso gratuito a textos dos Padres da Igreja, reformadores e grandes teólogos da história cristã.

## 🎯 Estado Atual do Projeto

O Scriptorium Divinum é uma aplicação web moderna construída com React que oferece:

### Funcionalidades Implementadas
- **Página Inicial**: Apresentação do projeto com seções de destaque
- **Catálogo de Livros**: Navegação e busca através do acervo teológico
- **Perfis de Autores**: Informações sobre os grandes teólogos e seus trabalhos
- **Detalhes de Obras**: Páginas individuais para cada livro com informações completas
- **Página Sobre**: Informações sobre o projeto e sua missão
- **Design Responsivo**: Interface adaptável para diferentes dispositivos
- **Tema Clássico**: Design inspirado em bibliotecas tradicionais com elementos em ouro e madeira

### Tecnologias Utilizadas
- **React 18** - Framework JavaScript moderno
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool rápido e moderno
- **React Router** - Navegação client-side
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos e acessíveis
- **Lucide React** - Ícones SVG consistentes
- **TanStack Query** - Gerenciamento de estado para dados assíncronos

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação e Execução
```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Navegue até o diretório
cd scriptorium-divinum

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Acesse em http://localhost:3000
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build de produção
npm run lint     # Análise de código com ESLint
```

## 📂 Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── ui/             # Componentes base do shadcn/ui
│   ├── Header.tsx      # Cabeçalho da aplicação
│   ├── Footer.tsx      # Rodapé
│   ├── Layout.tsx      # Layout base
│   └── ...
├── data/               # Dados estáticos
│   ├── authors.ts      # Informações dos autores
│   └── books.ts        # Catálogo de livros
├── pages/              # Páginas da aplicação
│   ├── Index.tsx       # Página inicial
│   ├── Livros.tsx      # Catálogo de livros
│   ├── Autores.tsx     # Lista de autores
│   ├── LivroDetalhes.tsx # Detalhes de um livro
│   ├── Sobre.tsx       # Sobre o projeto
│   └── NotFound.tsx    # Página 404
├── types/              # Definições TypeScript
└── lib/                # Utilitários e configurações
```

## 📋 Próximos Passos

### Funcionalidades Planejadas

#### Fase 1 - Melhorias na Experiência do Usuário
- [ ] **Sistema de Busca Avançada**: Implementar busca por texto completo, autor, categoria e tags
- [ ] **Filtros Dinâmicos**: Adicionar filtros por período, idioma, categoria teológica
- [ ] **Favoritos**: Sistema para marcar e organizar obras favoritas
- [ ] **Histórico de Leitura**: Rastreamento do progresso de leitura
- [ ] **Modo Escuro/Claro**: Alternância de temas para melhor experiência de leitura

#### Fase 2 - Conteúdo e Dados
- [ ] **Expansão do Acervo**: Adicionar mais obras clássicas em domínio público
- [ ] **Metadados Ricos**: Incluir mais informações históricas e contextuais
- [ ] **Categorização Avançada**: Sistema mais detalhado de categorias teológicas
- [ ] **Cronologia**: Timeline histórica dos autores e obras
- [ ] **Relações entre Obras**: Sistema de obras relacionadas e citações cruzadas

#### Fase 3 - Funcionalidades de Leitura
- [ ] **Leitor Integrado**: Visualizador de textos com recursos de navegação
- [ ] **Anotações Pessoais**: Sistema para fazer anotações e marcações
- [ ] **Compartilhamento**: Links diretos para trechos específicos
- [ ] **Impressão Otimizada**: Layouts otimizados para impressão
- [ ] **Comparação de Traduções**: Visualização paralela de diferentes traduções

#### Fase 4 - Recursos Avançados
- [ ] **API REST**: Endpoint para desenvolvedores interessados nos dados
- [ ] **Integração com E-readers**: Export para formatos EPUB melhorados
- [ ] **Sistema de Comentários**: Discussões acadêmicas sobre as obras
- [ ] **Referências Cruzadas**: Sistema automático de citações bíblicas e teológicas
- [ ] **Multilíngua**: Suporte para múltiplos idiomas da interface

#### Fase 5 - Infraestrutura
- [ ] **Cache Inteligente**: Otimização de performance com caching estratégico
- [ ] **PWA**: Transformar em Progressive Web App para uso offline
- [ ] **SEO Avançado**: Otimização para mecanismos de busca
- [ ] **Analytics**: Métricas de uso respeitando a privacidade
- [ ] **CDN**: Distribuição global de conteúdo

## 🤝 Contribuições

Este é um projeto de código aberto dedicado à preservação e acesso ao patrimônio teológico cristão. Contribuições são bem-vindas em:

- **Adição de Obras**: Sugestões de novas obras em domínio público
- **Correções**: Melhorias em textos, traduções e metadados
- **Funcionalidades**: Implementação de novos recursos
- **Design**: Melhorias na interface e experiência do usuário
- **Documentação**: Expansão e melhoria da documentação

## 📄 Licença

Este projeto é dedicado ao domínio público, seguindo o espírito das obras que preserva. Todo o código-fonte e conteúdo adicional está disponível sob licença MIT.

## 🔗 Recursos Relacionados

- [Projeto Gutenberg](https://www.gutenberg.org/) - Biblioteca de textos em domínio público
- [Internet Archive](https://archive.org/) - Fonte de muitas digitalizações históricas
- [Early Christian Writings](http://www.earlychristianwritings.com/) - Textos patrísticos
- [Christian Classics Ethereal Library](https://ccel.org/) - Biblioteca de clássicos cristãos

---

*"A fé em busca do entendimento"* - Santo Anselmo de Canterbury