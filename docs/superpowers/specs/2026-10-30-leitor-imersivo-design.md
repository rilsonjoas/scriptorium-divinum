# Leitor imersivo do Scriptorium Divinum — design e estado final

Data: 2026-10-30. Decisões do Rilson. Este documento registra o que foi decidido, o que foi entregue (PR #49, #50 e a branch de limpeza de textos) e o que ficou de fora.

## Intenção

O leitor mostrava pouco texto por tela e pouca imersão: cabeçalho do site, título, aviso de IA, cartão com borda e barra flutuante ocupavam a altura, e sobrava uma caixa de ~415 px com linhas de 130+ caracteres (~700 caracteres visíveis). A meta foi uma leitura no nível de Kindle/Apple Books: texto ocupando a tela, medida confortável, controles que saem do caminho.

Resultado medido: ~1.800 caracteres por vista em duas páginas (3x mais), fonte padrão de 16,2 px.

## Decisões do Rilson

- **Leitura imersiva é o padrão** ao clicar em "Ler Online": tela cheia, sem cartão, sem cabeçalho do site. `Esc` ou o botão sai.
- **Painel lateral em gaveta**, fechado por padrão, com abas **Índice** e **Destaques** (a aba única some quando a obra não tem índice). Abre pelo botão ☰ ou pela tecla `I`.
- **Tudo na barra flutuante, com legenda em cada botão.** O menu ⋯ só existe em tela estreita (< 768 px). Ordem: ‹ página › | Aa · ☰ · citar · ouvir · informações · sair da imersão.
- **Ficha da edição em modal**, sem sair da imersão (antes ficava no rodapé da página).
- **Sem arrastar com o mouse** para virar página: conflita com selecionar texto (glossário, destaques, card de citação). No celular o deslizar do dedo continua.
- **Ícones Lucide, sem emoji.** Os ornamentos `✦` e `❦` ficam: são glifos tipográficos da identidade.
- **Seção "Saiba mais" da página Sobre removida.**

## O que foi entregue

### Leitor (PR #49)
- Duas páginas por vista em tela larga; a opção "Largura da coluna" passou a valer (antes era ignorada em duas páginas).
- Texto justificado com hifenização em português, título nunca sozinho no pé da página, transição de página (`motion-safe`), rodapé com tempo restante, setas de borda.
- Tamanho do texto mostrado em px; o botão A+/A− agora funciona (o CSS fixava 1.125rem).
- **Grifar pinta o texto** (API CSS Custom Highlight) e **clicar no trecho grifado oferece "Remover destaque"**.
- Capitular legível no escuro; prévia do card de citação cabe no diálogo; diálogo de citação com uma família tipográfica.
- Dica de primeiro uso (uma vez, via `localStorage`): como virar a página e sair.

### Conteúdo exibido
- Capítulo só de títulos junta-se ao seguinte; capítulos curtos são agrupados (mínimo 900 caracteres) para não deixar página vazia.
- Frontmatter YAML não vaza mais como "contexto" da ficha: só a seção `# Proveniência` vira contexto (verificado nos 290 textos: 196 com proveniência, 94 sem, 0 vazamentos).
- Callouts `> [!NOTE]` do Obsidian não aparecem crus.
- **Marcas de edição** (`[960A]`, `|18`) aparecem pequenas e apagadas, sem alterar o texto (`marcasDeEdicao.ts`).
- **Chamadas de nota** `texto[1]` + linha `[1] nota` viram notas clicáveis em balão (`notasNumeradas.ts`), **só quando a ligação é certa** (id com 1 chamada e 1 definição na obra): 3.375 de 5.076 chamadas nas 12 maiores obras (66%); as ambíguas ficam como estão. A definição é levada ao capítulo da chamada.
- **Linha de traços `____`** colada ao fim do parágrafo (Suma e outras 18 obras) vira régua horizontal na exibição (`normalizarReguas`).
- **Capitular também no modo Páginas** (a regra CSS esperava o `p` direto no artigo).
- **Títulos com `#` duplicado** (`## ### Artigo 1`) usam o nível escrito dentro, na exibição (`normalizarTitulos`).

### Contraste (PR #50 e testes)
- Herói da home no tema claro: de 1,34–1,64:1 para 4,68–5,26:1.
- Testes que medem o **pior pixel renderizado** (o axe não vê fundos com gradiente ou translúcidos): 14 para o herói e 16 para o topo e a barra do leitor, nas combinações de tema do site e do leitor. Provado contra o código antigo.
- Achado e corrigido nesta rodada: título do livro escuro sobre o topo escuro (leitor Escuro + site claro, 1,02:1; agora 12:1).
- Grifo mais suave nos fundos escuros, para o texto manter folga (5,9 a 7,4:1).

### Textos (branch `chore/limpar-residuos-de-fonte`, em revisão)
- `scripts/limpar-residuos-de-fonte.mjs`, modo de teste por padrão (`--aplicar` grava): 41 trechos em 10 obras (rodapé do Novo Advento, barra de navegação e anúncio, cabeçalho bibliográfico da *Santa Macrina*). Só remoções, créditos de fonte e tradutor preservados.

## Não objetivos / fora de escopo
- Não mexer na técnica de paginação (colunas CSS), na API nem no banco.
- Não alterar conteúdo das obras além do resíduo de site copiado.
- Não trocar a identidade visual (skill `design-narniano`).

## Limites conhecidos
- Grifo usa a API CSS Custom Highlight (Chrome, Safari 17.2+, Firefox 140+); em navegador antigo o grifo fica salvo, sem cor.
- Trecho repetido no capítulo: o destaque cai na primeira ocorrência.
- Capítulo que passa por uma página e meia deixa a segunda quase vazia (comportamento de livro impresso).

### Traduções (arquivos em `server/texts`, ainda **não publicadas**)
- *Suma Teológica, 2ª parte da 2ª parte*: Questões 131 a 141 (439 linhas, ~26 mil palavras) e 11 fragmentos soltos traduzidos do inglês, com as fórmulas e termos que a obra já usava. Resultado: 0 palavras em inglês de ~687 mil; mesma estrutura (linhas, títulos, réguas).
- *Apologia da Confissão de Augsburgo*: Partes 31 a 37 (91 parágrafos, ~14 mil palavras) e títulos. Resultado: 0 em inglês de ~106 mil.
- São **tradução por IA, sem revisão humana**: a revisão (texto de Santo Tomás e do Livro de Concórdia) é do autor antes de publicar.
- O *Breve Catecismo de Westminster* não tem lacuna: é bilíngue de propósito (o original de 1647 em citação ao lado de cada resposta).

## Pendências e decisões que são do autor
1. **Publicar as obras já limpas ou traduzidas** exige cadastro no catálogo (seed com licença, fonte e categoria). Candidatas: *Suma 2-2* e *Apologia de Augsburgo* (agora sem inglês, após revisão), e quatro obras em português já limpas e ainda sem cadastro: *Proslogion* (2 arquivos), *Comentário aos Gálatas* de Lutero e *Os Últimos Fins do Homem* de Manuel Bernardes.
2. **Arquivos órfãos:** 289 arquivos (fora o README) para 255 obras publicadas = 34 órfãos. Duas são versões antigas de obras publicadas (`a-unidade-da-igreja-catolica-cipriano`, `da-liberdade-do-cristao-martinho-lutero`), 22 são originais em inglês e 1 em latim (o site é PT-only), e o *Tratado sobre as Relíquias* (Calvino) está corrompido (despublicar ou reprocessar).
3. **Aparato acadêmico** (`[960A]`, `|18`): hoje fica discreto. Apagar de vez é decisão de leitura.
4. **Chamadas de nota ambíguas** (ex.: Institutas, Baxter): ficam como texto até haver conferência obra a obra.

## Como verificar
- `cd web && npx vitest run` (364), `npx tsc --noEmit -p tsconfig.app.json`, `npx eslint src`.
- `npx playwright test e2e/a11y.spec.ts` (axe + contraste por pixel).
- Lição reaproveitável: o axe não mede contraste sobre gradiente, textura ou fundo translúcido; para isso, medir o pixel.
