# Decisões do Scriptorium Divinum

Registro de decisão, não relatório. Uma linha por decisão: **o que foi
decidido, por quem, em que data, e o que foi descartado**. A data é parte da decisão — meia decisão sem data vira mito em três meses.

Escopo deste arquivo: decisões que ** mudam o que o site é**. Correção
de bug, refactor e ajuste de texto ficam no `ROADMAP.md` e no histórico
git. A régua é simples: se a decisão muda o que o leitor encontra, entra
aqui.

---

## 2026-09-26 — Leitor por capítulo, não rolagem contínua

**Decidido:** a obra é segmentada em capítulos e o leitor entrega só o
capítulo ativo.

**Medido antes e depois** (Confissões, produção): article renderizava em
23,3 s e a página tinha 280.448 px; ficou 6,0 s e 1.667 px, com 171
capítulos navegáveis.

**O erro que quase passou:** a primeira versão aceitava só `#` como
início de capítulo, porque um teste com `# Parte / ## Secao` sugeria
isso. O acervo real usa `## Capítulo I` — 170 de nível 2, só 2 de nível
1. A primeira versão não segmentava nada, e o ganho foi de 23,3 s
para 17,0 s: uma melhora que parecia resultado e não era. Só apareceu ao
medir a **altura da página** e conferir a estrutura real do markdown.

**Descartado:** paginação sob demanda (carregar capítulo a capítulo) e
pré-quebrar o texto no servidor. Ambos resolvem os ~6 s que restam
(transferência e parsing dos 579 KB), mas são escopo maior. Registrado
como往后 em vez de escondido.

**Regra que saiu daqui:** medir a variável que se quer mudar, não só o
tempo. Tempo menor pode ser sintoma, não cura.

---

## 2026-09-26 — Downloads de primeira classe, fora do "Como Citar"

**Decidido:** ePub, TXT e Markdown ficam como ações de primeira classe na
ficha da obra, ao lado do PDF hospedado.

**Por quê:** `.md`/`.txt`/`.epub` estavam dentro do diálogo de citação
acadêmica. Quem quer baixar não está citando, e o PDF — o formato que a
maioria procura primeiro — era o único visível.

**Decidido junto:** ePub/TXT/Markdown hospedados são **suprimidos**
quando há texto no cliente. O link guardado no banco quase sempre é o
*link de origem* (Internet Archive, Google Books), não o arquivo final.
Só o PDF vem do banco, porque não há como gerar PDF de qualidade
tipográfica no cliente.

**Descartado:** PDF próprio (re-escaneamento com OCR). Depende de
decisão de conteúdo/licença — o mesmo item que bloqueia o Compêndio. O
link público é a solução honesta enquanto isso.

---

## 2026-09-26 — Links por slug, não por UUID

**Decidido:** todo link interno usa slug, com o UUID só como fallback.

**Verificado e registrado:** o `sitemap.xml` **já emitia slugs** desde
sempre (91 URLs). Este era o receio principal do item e a checagem
dezoitou — a impressão de "URL feia" vinha do clique, e o Google já
tinha a URL boa. Só o link interno estava com UUID.

**Descartado:** redirecionar `/livros/<uuid>` → `/livros/<slug>`. Links
já indexados com o UUID continuam funcionando porque a API resolve os
dois formatos, e sem redirect não há o que quebrar.

**Follow-up registrado e não feito:** `<link rel="canonical">`. Um link
antigo com UUID acessível gera conteúdo duplicado. A correção barata é a
tag; preferi registrar do que introduzir um sistema de SEO inteiro no
meio do Bloco B.

---

## 2026-09-26 — Foco visível, título por rota e Selects associados

**Padrão aplicado:** WCAG 2.2 nível A+AA = **conformidade regular da ABNT
NBR 17225:2025** (fonte única: `Padrão de Acessibilidade` no vault).
"WCAG" sem versão e sem nível é intenção, não padrão.

**Decidido:** a suíte axe-core entra no CI (`web/e2e/a11y.spec.ts`,
8 rotas + foco visível + título por rota, API mockada por fixture). Tags
`withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'])`.

**Por que a mock é obrigatória:** sem ela cada página cai no estado de
erro e a auditoria mede um `<ErrorState>` em vez do catálogo — passa
limpinho e não prova nada.

**Três correções que saíram:**
- `index.css` **não tinha nenhuma regra de foco** (zero
  `:focus-visible`). Agora há uma global com `--ring` e a variante
  vinho/dourado dentro do leitor. 2.4.7 AA.
- **4.1.2 nos Selects da Radix:** o `<Label htmlFor="author">` já
  existia desde antes, mas o `SelectTrigger` — que é um `<button>`, e
  `<button>` é elemento labelable — **nunca teve `id`**. A associação
  não fechava em 4 campos do admin. Nas páginas públicas o `<label>` era
  irmão do Select, sem `htmlFor` nenhum; agora é `aria-labelledby`.
- **2.4.2:** o `<title>` era estático para **todas** as rotas. Agora
  `usePageTitle` em 12 rotas. E `/busca?q=X` não buscava sozinho — a
  página preenchia a caixa e exigia o botão.

**Bug que só o teste pegou:** a primeira versão do `usePageTitle`
restaurava o título anterior no `cleanup`. Numa SPA, o cleanup da
página que **sai** roda depois do efeito da que **entra** e sobrescreve o
título novo — `/busca?q=...` herdava o título da home.

**Claim público:** só o que o CI prova. O texto de conformidade no
`ROADMAP.md` está com os colchetes preenchidos e **"verificação manual
com leitor de tela: não feita"** — porque não foi feita. Verificar em
aparelho real exige aparelho.

---

## 2026-09-26 — Três implementações de tondo viraram uma

**Decidido:** `.frame-tondo` é a única classe de moldura de retrato.

**O achado:** não era "falta a classe", era que existiam **três
implementações divergentes** — `.tondo-portrait` no CSS, classes ad-hoc
no JSX de `AutorDetalhes`, e nenhuma compartilhada. Aro de madeira numa,
aro dourado na outra.

**Descartado:** transformar as antigas em alias. Consolidação pela
metade não é consolidação; foram apagadas.

**Mantido:** capas de livro seguem **retangulares**. É o que diferencia o
Scriptorium do [[Bíblia na Arte]], onde tudo é moldurado.

---

## 2026-09-26 — Sete obras sem texto ficam com estado explícito

**Situação medida:** 7 das 37 obras estão no catálogo sem nenhum texto
disponível — A Cidade de Deus, Compêndio de Teologia, Institutas,
Imitação de Cristo, Os Últimos Fins do Homem, Pensamentos e Por que Deus
se fez Homem. Todas são traduções portuguesas cujo texto nunca foi
vinculado. **Cinco** têm a edição original em latim/inglês já catalogada
e legível; **duas** (Imitação de Cristo, Os Últimos Fins do Homem) não
têm.

**O que o site fazia:** não prometia nada — o "Ler Online" é
condicionado a `textAvailable` — mas também não explicava o silêncio. O
leitor caía numa página com capa, autor e descrição e nenhuma
explicação de por que não havia o que ler.

**Decidido (Rilson):** manter as sete no acervo com **estado explícito**,
apontando para a edição original quando ela existe.

**Decidido junto:** a relação vive em **dado**, na coluna
`books.related_edition_slug` (migração `0005_related_edition`), não num
mapa no frontend. Um mapa no código apodrece e mente; o acervo é
editável e o mapa não acompanha.

**Descartado:** remover as sete do catálogo. A obra **existe** no acervo,
em outra língua. Apagar 7 de 37 títulos emplumários (19%) para resolver
um problema que uma frase honesta resolve seria o mesmo erro de
prometer o que não se tem, no sentido oposto.

**Achado de método:** o endpoint de lista devolve `textAvailable: false`
para **todas** as 37 obras, porque não projeta o campo. Medir pelo
endpoint de lista daria "nada tem texto"; a verdade só apareceu
consultando o endpoint de texto de cada uma, uma por uma.

---

## 2026-09-26 — Migration agora roda no deploy

**Decidido:** o deploy passa a rodar `node dist/db/migrate.js` dentro do
container da API.

**Por quê:** o `make deploy` só sobe o container; o migrator do drizzle
precisava ser chamado à mão. O efeito é o pior possível — **silencioso**.
A coluna `related_edition_slug` foi criada em código, o deploy foi
verde, e a API continuou devolvendo `null` porque o schema estava atrás
do código, sem nada no pipeline acusar.

**Comportamento:** se o container existir e a migration falhar, o deploy
**falha**. Schema atrás do código é pior que deploy vermelho. Se o
container não for encontrado, o deploy avisa e segue — para não quebrar
todo deploy por um nome de container.

---

## Itens deliberadamente **não** decididos (2026-09-26)

Registrado aqui para não virar culpa de ninguém depois:

| Item | Por quê não foi decidido |
|---|---|
| **Logo/favicon** | **JÁ ESTAVA FEITO** — commit `52fc4f8` "aplica a logo real do projeto (favicons + header)", com 5 tamanhos (16→64). O ROADMAP descrevia um ícone 82×82 de scaffold que não existe mais: o item é que estava velho, não o favicon. |
| **Sitemap no Search Console** | Confirmado pelo Rilson em 2026-09-26: `/sitemap.xml` processado, 91 páginas. Fechado. |
| **Tradução por IA** | Futuro. Sem decisão de modelo e de licença. |
| **Planos de leitura + newsletter** | Futuro. Depende de o acervo amadurecer. |
| **Comentários bíblicos por capítulo** | Futuro. Escopo grande, sem modelo definido. |

---

## 2026-09-26 — Quatro páginas informativas viram uma — ✅ ENTREGUE

**Entregue** em `0250a3c`. Verificado em produção: os três redirects caem
na âncora certa, a página tem os 5 `id` (`uso`, `dominio-publico`,
`contribuir`, `apoiar`, `contato`), o índice interno navega e o Pix e o
e-mail estão na página.

**A auditoria pegou duas violações que já existiam** e que nenhuma rota
da suíte visitava (o `/contribuir` nunca foi auditado):
- **1.1.1 (A):** o QR do Pix é um `<svg>` que *transporta informação* (a
  chave de pagamento) e não tinha `<title>`. Agora tem.
- **1.4.3 (AA):** o botão de contorno do GitHub era dourado sobre
  pergaminho a **1.44:1**. Trocado pelo token de madeira.

**Decidido (Rilson):** Sobre, Ajuda, Domínio Público e Como Contribuir
são **uma página só**, em `/sobre`, com âncoras. As URLs antigas
(`/ajuda`, `/dominio-publico`, `/contribuir`) **redirecionam**.

**Por quê:** 967 linhas em quatro páginas, com downloads e direitos
autores repetidos em dois lugares. Repetição não é，. Repetição em página de conteúdo
divergem: uma delas passa a prometer algo que a outra não.

**O que a página única tem:** a Pix (que já vivia em Sobre) e um e-mail
de contato para sugestões, ideias, livros e críticas —
`scriptorium@narniano.com`, o mesmo que já está no rodapé e no Pix.

**Descartado:** (a) manter as quatro e só reescrever "Como Contribuir" —
a duplicação continua; (b) apagar as URLs antigas — quebra link já
compartilhado e indexado; (c) fundir só Sobre + Contribuir — deixa as
duas de consulta pontual repetindo downloads.

**Redirecionamento e não página separada:** quem tem o link guardado ou
foi indexado pelo Google continua chegando no lugar certo, e o conteúdo
não volta a duplicar.

---

## 2026-09-26 — `--primary` da Bíblia na Arte vai do carmesim ao vinho — ✅ ENTREGUE

**Entregue** em `da155a6` (repo [[Bíblia na Arte]]). Verificado em
produção: o token serve `336 24% 24%` (rgb 76,47,58 ≈ #4B2E39) e o
carmesim `rgb(92, 35, 35)` **não aparece mais em nenhum elemento** da
página de autor. Os 145 testes do servidor e 108 do web passam.

**Decidido (Rilson):** o `--primary` do tema **claro** da [[Bíblia na
Arte]] deixa de ser carmesim e passa a ser vinho profundo, alinhando o
projeto ao padrão do cluster.

**O achado:** o token era `hsl(0 45% 25%)` = `#5C2323`, comentado no
próprio CSS como *"Rich burgundy primary inspired by manuscript
illuminations"*. Em paralelo, a linha 16 do mesmo arquivo dizia que
`--primary` **é dourado** — e o tema **escuro já era dourado**
(`45 60% 55%`). Ou seja: o mesmo token era carmesim no claro e dourado
no escuro, e o comentário do autor previa o que foi feito pela metade.

**Onde aparecia:** ícones e acentos com `text-primary` — foi o que o
Rilson viu no Sigmundt Bergk e no Dietrich Bonhoeffer ("Discipulado,
cap. 6"), medido em produção como `rgb(92, 35, 35)`.

**Por que agora:** o `Padrão` do cluster (`Identidade visual geral` §1C)
registra a Bíblia na Arte como "Biblioteca + toque de Céus", sem
exceção de cor. O polo A Biblioteca é **dourado como luz**, não carmesim.

**O que NÃO foi fizer:** criar um token separado só para acento. Isso
manteria a divergência com o padrão e produciria dois vermelhos
disputando a mesma função — o mesmo erro que o `--accent` do [[Lecionário]]
já cometeu (2.05:1 em 36 lugares, corrigido na origem).

**Pendência:** o `tema` da BnA tem 354 de 1090 obras (32%) sem tema
registrado no export do vault. Isso é "trabalho de tema refinado", que
o Rilson pediu explicitamente — e é curadoria de dado, não código.

---

## 2026-09-26 — O menu repetia o problema que a fusão resolveu

**Entregue** em `2d40203`.

**O achado:** a fusão das quatro páginas deixou o menu com **três itens
apontando para a mesma página** — Sobre, Domínio Público e Ajuda — e o
rodapé com outros três. Era literalmente a repetição que motivou a
fusão, reincidindo dentro da navegação.

**Decidido:** o menu fica com `Sobre` só; o rodapé também. Quem quer
Domínio Público, Ajuda ou Como Contribuir chega pelo índice interno da
página, que é onde o assunto faz sentido.

**E o sitemap parou de listar as URLs antigas.** `/ajuda`,
`/dominio-publico` e `/contribuir` continuam respondendo por redirect
(link externo, digitação), mas **redirect não entra em sitemap**: listar
uma URL que redireciona é pedir para o Google indexar um salto em vez
de uma página.

**Nota de método:** a decisão de "página única" e a de "menu com um item"
são o mesmo problema visto de dois ângulos. Consolidar o conteúdo sem
consolidar a navegação deixa metade do trabalho feito.

---

## 2026-09-26 — Um campo novo na API tem três camadas, e duas falham calado

**Entregue** em `d8b0cca`. Registrado também em `ROADMAP.md` §Dívidas
técnicas.

A descoberta mais cara da sessão, e vale como regra geral: para expor um
campo novo, **três** coisas precisam mudar, e duas delas falham **sem
erro nenhum**.

1. **Migration** — a coluna no banco. Falha barulhenta: o `select` quebra.
2. **Select explícito** em `server/src/db/queries.ts` — o Drizzle não
   devolve campo novo sozinho, e são **duas** listas de coluna (ficha e
   catálogo). Falha silenciosa: a coluna existe, a query não pede, o
   campo vira `undefined` e desaparece no JSON.
3. **Response schema** em `server/src/schemas/book.schema.ts` — a rota
   declara `response: { 200: bookDetailResponseJson }`, e o Fastify
   **serializa conforme o schema, descartando o que não está declarado**.
   Falha silenciosa e é a que mais engana: a API responde 200, com
   status de sucesso, e o dado simplesmente não chega.

**Como o custo apareceu:** a coluna foi migrada à mão, o deploy ficou
verde, o drizzle imprimiu `✅ Migrations concluídas` duas vezes sem
aplicar nada, e a página das 7 obras mostrava o aviso sem o link. Só
descobri porque conferi o efeito na resposta da API em vez de confiar no
log — `relatedEditionSlug` não aparecia nem como chave.

**Prevenção:** dois testes de guarda na integração que falham se o campo
não voltar na ficha nem no catálogo. A regra geral está escrita no
ROADMAP: **conferir o efeito, nunca o log.**
