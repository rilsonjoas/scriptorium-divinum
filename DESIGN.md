# DESIGN.md — Sistema de Design do Scriptorium Divinum

> **Regra fundamental:** toda decisão de estilo que não estiver aqui é *ad hoc* e deve ser normalizada para cá. Este documento é a fonte da verdade do visual do projeto.

---

## 1. Filosofia Editorial

O Scriptorium Divinum é uma **biblioteca clássica**, não um produto de SaaS. O visual deve evocar:

- Pergaminho, madeira escura e dourado — não plástico, vidro ou neón.
- Leitura contemplativa — não consumo rápido.
- Autoridade e serenidade — não urgência ou gamificação.

**O que evitar a todo custo:**
- Ícones decorativos em títulos de seção (ex.: Lucide em cada `<h2>`).
- Bordas arredondadas agressivas (`rounded-2xl`, `rounded-full` em cards).
- Sombras excessivas ou efeitos de glassmorphism pesado.
- Paletas frias (azul, verde-limão, roxo) sem relação com os tokens do projeto.
- Animações de bounce ou spring — o movimento aqui é o de página virando.

---

## 2. Paleta de Cores

Todos os tokens estão definidos em `web/src/index.css` como variáveis CSS HSL. **Nunca use valores hex ou rgb diretamente** — use sempre os tokens.

### Tokens canônicos (modo claro)

| Token Tailwind | Variável CSS | Uso |
|---|---|---|
| `text-library-wood-foreground` | `--library-wood-foreground` | Títulos, texto de destaque |
| `text-library-bronze-foreground` | `--library-bronze-foreground` | Subtítulos, labels, links |
| `text-muted-foreground` | `--muted-foreground` | Corpo de texto, descrições |
| `border-library-bronze` | `--library-bronze` | Bordas de cards e divisores |
| `bg-library-gold/10` | `--library-gold` (10% alpha) | Fundos de hover e destaques suaves |
| `bg-library-gold/5` | `--library-gold` (5% alpha) | Interior de blockquotes |
| `border-library-dourado` | `--library-dourado` | Borda esquerda de citações |
| `bg-card/95` | `--card` (95% alpha) | Fundo de cards com blur |
| `text-library-bronze-foreground` | — | Epígrafes e citações em itálico |

### Gradientes permitidos

```css
/* Fundo de seção de apoio/destaque */
bg-gradient-to-br from-library-gold/10 to-library-bronze/10

/* Fundo de header/footer (modo escuro) */
bg-gradient-leather   /* classe utilitária definida em index.css */
```

### Cores proibidas em componentes

❌ `bg-blue-*`, `bg-green-*`, `bg-purple-*` — não fazem parte da paleta.  
❌ `bg-red-*` exceto para `text-destructive` em erros de formulário.  
❌ Qualquer hex (`#fff`, `#333`) inline no JSX.

---

## 3. Tipografia

### Família de fontes

| Classe Tailwind | Fonte | Uso |
|---|---|---|
| `font-display` | Cormorant Garamond | Títulos de página (`<h1>`) |
| `font-heading` | Playfair Display | Subtítulos (`<h2>`, `<h3>`), labels em caixa-alta |
| `font-body` | Inter | Corpo de texto, UI, botões |
| `font-serif` | EB Garamond | Texto corrido em prosa (manifesto, sobre) |
| `font-reading` | Merriweather | Leitor de textos clássicos |

### Hierarquia de tamanhos

```
h1  →  font-display text-4xl md:text-5xl font-bold
h2  →  font-heading text-2xl font-semibold
h3  →  font-heading text-lg font-semibold
p   →  font-body leading-relaxed  (ou font-serif para prosa longa)
label/epígrafe  →  font-heading text-sm tracking-widest uppercase opacity-70
```

### Regras tipográficas

- `leading-relaxed` em todo parágrafo de prosa.
- `tracking-widest uppercase` apenas em labels de seção (nunca em títulos principais).
- Itálico em citações: classe `italic` + `text-library-wood-foreground`.
- Negrito semântico: `font-semibold` em Heading, `font-bold` em Display.

---

## 4. Classes Utilitárias do Projeto

Definidas em `web/src/index.css` — usar sempre estas, não recriar inline:

### `parchment-bg`
Textura de pergaminho sobre cards. Usar em `<div>` ou `<section>` que representa um "volume" físico.

```tsx
<div className="bg-card/95 backdrop-blur-sm border border-library-bronze rounded-lg p-8 parchment-bg shadow-book">
```

### `shadow-book`
Sombra que simula um livro em relevo. Sempre acompanha `parchment-bg`.

### `chapter-divider`
Divisor ornamental horizontal com florim central. Usar entre seções de uma mesma página.

```tsx
<div className="chapter-divider max-w-xs mx-auto mb-6" />
```

### `ornament`
Floreado isolado, para encerrar uma seção importante (não repetir mais de uma vez por página).

```tsx
<div className="ornament mb-14" />
```

### `golden-foil`
Texto com brilho dourado. Uso restrito: somente no título principal da Home e no logo.

---

## 5. Padrões de Componentes

### Card de conteúdo (padrão)

```tsx
<div className="bg-card/95 backdrop-blur-sm border border-library-bronze rounded-lg p-8 parchment-bg shadow-book mb-8">
  <h2 className="font-heading text-2xl font-semibold text-library-wood-foreground mb-4">
    Título da Seção
  </h2>
  <p className="font-body leading-relaxed text-muted-foreground">
    Conteúdo.
  </p>
</div>
```

### Blockquote / Citação

```tsx
<blockquote className="border-l-4 border-library-dourado pl-5 italic text-library-wood-foreground bg-library-gold/5 py-4 rounded-r-md leading-relaxed">
  "Texto da citação."
  <footer className="mt-3 text-sm not-italic text-muted-foreground">
    — Autor, <cite>Obra</cite>
  </footer>
</blockquote>
```

### Card de navegação (link)

```tsx
<Link
  to="/rota"
  className="group block bg-card/80 border border-library-bronze/60 rounded-lg p-6 hover:border-library-bronze hover:bg-library-gold/5 hover:shadow-book transition-all duration-200"
>
  <h3 className="font-heading text-base font-semibold text-library-wood-foreground mb-2 group-hover:text-library-bronze-foreground transition-colors">
    Título
  </h3>
  <p className="font-body text-sm text-muted-foreground leading-relaxed">
    Descrição.
  </p>
</Link>
```

### Badge de categoria

```tsx
<span className="inline-block px-2 py-0.5 text-xs font-body rounded border border-library-bronze/40 text-library-bronze-foreground bg-library-gold/5">
  Patrística
</span>
```

### Label de seção (caixa-alta)

```tsx
<p className="font-heading text-sm tracking-widest uppercase text-library-bronze-foreground opacity-70 mb-3">
  Rótulo de Seção
</p>
```

### Navegação interna (âncoras)

```tsx
<nav aria-label="Seções desta página" className="flex flex-wrap justify-center gap-2 mb-12">
  <a href="#secao" className="px-3 py-1.5 rounded-full border border-library-bronze/70 text-sm font-body text-library-wood-foreground hover:bg-library-gold/15 transition-colors">
    Seção
  </a>
</nav>
```

---

## 6. Layout e Espaçamento

### Larguras de container

| Contexto | Classe |
|---|---|
| Páginas de texto (Sobre, Ajuda, etc.) | `max-w-3xl` |
| Páginas de grade (catálogo, categorias) | `max-w-6xl` |
| Leitor de texto | `max-w-2xl` |
| Global | `container mx-auto px-4` |

### Espaçamento vertical entre seções

- Entre seções grandes: `mb-14`
- Entre cards no mesmo bloco: `mb-8`
- Entre parágrafo e parágrafo: `mb-5` (ou `mb-4` no máximo)
- Padding interno de card: `p-8` (padrão) · `p-6` (compacto)

### Grid de cards

```tsx
{/* 3 colunas em sm+, 1 em mobile */}
<div className="grid sm:grid-cols-3 gap-4">

{/* 2 colunas em md+, 1 em mobile */}
<div className="grid md:grid-cols-2 gap-6">
```

---

## 7. Animações e Transições

| Situação | Classe / Token |
|---|---|
| Hover em cards e links | `transition-all duration-200` |
| Hover em texto | `transition-colors` |
| Animações de entrada complexas | `var(--ease-liturgico)` (lento, deliberado) |
| Revelações rápidas | `var(--ease-vela)` |

**Regras:**
- Sem `animate-bounce`, `animate-ping` ou spring.
- Duração máxima de transição: `350ms` (`duration-slow`).
- Animações de hover sempre via CSS (`transition-*`), nunca via JS.

---

## 8. Modo Escuro

O modo escuro é gerenciado pela classe `.dark` no `<html>`. Os tokens sobrescrevem automaticamente via `@layer base`. **Não use `dark:` utilities diretamente em componentes** — os tokens já cuidam disso. Exceções documentadas aqui:

- `dark:text-*` pode ser usado apenas em componentes que têm superfície fixa (ex.: botão de tema).
- Superfícies explicitamente escuras (header, footer) usam `data-superficie="escura"` para o token `golden-foil`.

---

## 9. Checklist para novos componentes

Antes de fazer merge de qualquer componente novo, verificar:

- [ ] Usa somente tokens de cor da paleta (sem hex inline)
- [ ] Tipografia segue a hierarquia definida na §3
- [ ] Cards usam `parchment-bg shadow-book border-library-bronze`
- [ ] Sem ícones Lucide decorativos em títulos de seção
- [ ] `max-w-*` correto para o contexto da página
- [ ] Transições via `transition-*`, duração ≤ 350ms
- [ ] Texto de corpo tem `leading-relaxed`
- [ ] Acessibilidade: `aria-label` em `<nav>`, `id` em headings referenciados

---

## 10. Referências

- Tokens de cor: [`web/src/index.css`](web/src/index.css) — variáveis `:root` e `.dark`
- Tailwind config: [`web/tailwind.config.ts`](web/tailwind.config.ts)
- Componente de exemplo limpo: [`web/src/pages/Sobre.tsx`](web/src/pages/Sobre.tsx)
- Leitor canônico: [`web/src/pages/LeitorPage.tsx`](web/src/pages/LeitorPage.tsx)
