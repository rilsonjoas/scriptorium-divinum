# Decisões do Scriptorium Divinum

Registro de decisão, não relatório. Uma linha por decisão: **o que foi
decidido, por quem, em que data, e o que foi descartado**. A data é parte da decisão — meia decisão sem data vira mito em três meses.

Escopo deste arquivo: decisões que ** mudam o que o site é**. Correção
de bug, refactor e ajuste de texto ficam no `ROADMAP.md` e no histórico
git. A régua é simples: se a decisão muda o que o leitor encontra, entra
aqui.

---

## 2026-09-26 — Citação nova exige fonte checada, sem exceção

**Decidido:** nenhuma citação entra em `quotes` sem `fonte_url` real
preenchido, confirmada contra fonte primária antes do INSERT. Protocolo
completo em `docs/PROTOCOLO-VERIFICACAO-DE-CITACOES.md`.

**Por quê:** uma citação fabricada (atribuída a C. S. Lewis, "O Cavalo e
seu Menino", sem fonte alguma em lugar nenhum checado) ficou em produção
mais de um mês, servida em três apps, até o Rilson notar que soava
estranha no Gerador. A auditoria de 21-25/09 não pegou porque caçava
fraude já catalogada, não verificava cada citação individualmente — e o
processo de entrada em si nunca exigiu fonte.

**Medido:** `quotes-canonical.json` (seed da tabela) estava um mês
desatualizado depois da diversificação de autores de 25/09 (174→284) —
rodar `seed-quotes.ts` de novo teria apagado tudo aquilo e ressuscitado a
citação fabricada. Corrigido com `export-quotes-canonical.ts` (banco →
JSON, sentido único daqui pra frente).

**Descartado:** retroauditar as ~740 citações já existentes agora — é
projeto maior, separado, já registrado como pendência. Isto aqui é sobre
entrada nova, não uma promessa retroativa.

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
| **Tradução por IA** | **Decidido na prática em 2026-10-16**: 232 obras já são traduções por IA (CC BY-SA 4.0, com aviso no leitor e "revisão humana: pendente"). O que continua em aberto: modelo/versão registrados por obra, edição-fonte auditada obra a obra e o parecer jurídico sobre a titularidade de tradução gerada por IA. Ver a entrada de 2026-10-16 abaixo. |
| **Planos de leitura + newsletter** | Futuro. Depende de o acervo amadurecer. |
| **Comentários bíblicos por capítulo** | **Estrutura entregue em 2026-10-16** (tabela, migration, rota). Conteúdo: só Lutero em Gálatas, capítulos 1 a 6. Crisóstomo e Agostinho dependem de dar estrutura (título por homilia/capítulo) aos textos. |

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


---

## 2026-10-16 — Paridade bilíngue (PT-BR e EN) e alternância no leitor e na ficha da obra

**Entregue** em 2026-10-16.

**Contexto:** parte das obras tem uma edição em português e outra em inglês. O vínculo é o campo `related_edition_slug` (já exposto no schema Drizzle, no serializer Fastify e na API de livros).

**Problema:** quem estuda precisa passar da tradução ao texto em inglês para conferir uma passagem.

**Solução:**
1. **Ficha da obra (`LivroDetalhes.tsx`):** botão para a edição correspondente (`Ver edição original em inglês` ou `Ver edição em português`).
2. **Leitor (`Reader.tsx`):** botão compacto no cabeçalho (`Ler em EN` / `Ler em PT`), sem sair do fluxo de leitura.
3. **Vínculos:** feitos em segunda fase no seed do catálogo, sempre nos dois sentidos e sem sobrescrever vínculo que já existe. Depois do deploy de 2026-10-16 são 40 vínculos.

**Correção de 2026-10-16 (revisão antes do deploy):** a versão anterior desta entrada falava em "100% das obras em português" e em 45 pares. O seed original falhava ao aplicar porque ligava edições antes de a obra existir; ver a entrada "Revisão do catálogo antes do deploy".

---

## 2026-10-16 — Consolidação do catálogo (números medidos)

**Entregue** em 2026-10-16, depois da revisão descrita abaixo.

**Números do acervo após o deploy** (medidos num ensaio contra cópia da produção, não estimados):
- **288 obras**: 261 em português, 25 em inglês (23 `Inglês` + 2 `English`, rótulo a unificar) e 2 em latim.
- **232 traduções por IA** (CC BY-SA 4.0, revisão humana pendente); as outras 56 são textos de edições antigas ou originais em português, em domínio público.
- **106 autores com obra** (107 cadastrados; 1 sem obra).
- **~16,7 milhões de palavras** nos 281 arquivos que o catálogo serve (4 obras ainda sem arquivo).
- **No ar para o público, depois do ocultamento das últimas entradas: 255 obras em português, 100 autores com obra, ~12,1 milhões de palavras, 229 traduções por IA.**

**O que a versão anterior desta entrada afirmava e não era verdade:** "270 obras em português", "125 autores com dados biográficos", "18,4 milhões de palavras" e "100% de integridade: zero obras com truncamento, marcadores residuais de OCR ou tradução resumida". A medição mecânica achou, entre os textos alterados: trechos inteiros em inglês (`tratado-sobre-as-reliquias-calvino`, `apologia-da-confissao-de-augsburgo`, `suma-teologica-segunda-parte-da-segunda-parte`, `breve-catecismo-westminster`), números de nota de rodapé soltos (`[3798]`) em obras como Irineu e Cassiano, e 28 textos longos sem título algum (o sumário do leitor fica vazio). Isso não bloqueia o deploy, mas precisa ficar visível em vez de escondido atrás de "100%".

---

## 2026-10-16 — Menu de Seleção Unificado e Não Intrusivo no Leitor (ReaderSelectionMenu)

**Entregue** em 2026-10-16.

**Problema:** No leitor (`Reader.tsx`), a seleção de uma única palavra disparava compulsoriamente a abertura do `GlossaryPopover`, sobrepondo o texto e impedindo o fluxo natural de cópia ou seleção. Além disso, a seleção de trechos com múltiplas palavras oferecia ações de criar card ou grifar, mas omitia a ação mais elementar de cópia de texto com feedback acessível.

**Solução:**
1. Criado o componente `ReaderSelectionMenu` (`web/src/components/reader/ReaderSelectionMenu.tsx`).
2. A seleção de qualquer trecho agora exibe uma barra flutuante elegante com ações discretas:
   - `[ Copiar ]`: copia imediatamente para a área de transferência com feedback tátil/visual ("Copiado!").
   - `[ Dicionário ]`: quando apenas 1 palavra é selecionada, exibe o botão do glossário histórico, mas **só abre se o leitor clicar voluntariamente**.
   - `[ Criar Card ]`: quando 2 ou mais palavras são selecionadas, abre o diálogo de card tipográfico.
   - `[ Grifar ]`: salva o trecho nas anotações do leitor.
3. Testes unitários dedicados em `web/src/components/reader/ReaderSelectionMenu.test.tsx` (162 testes verdes no frontend).

---

## 2026-10-16 — Comentários bíblicos indexados por livro e capítulo (API e seeds)

**Entregue** em 2026-10-16, com escopo reduzido na revisão.

**Contexto:** o ecossistema "A Biblioteca" (Scriptorium Divinum, Lecionário, Bíblia na Arte) precisava de uma forma estruturada de ligar as leituras do dia à exegese clássica, no lugar da busca por palavra-chave.

**Solução:**
1. **Tabela `biblical_commentaries`**, criada pela **migration 0008** (antes só existia por seed e o Drizzle não a conhecia): indexada por `(bible_book, chapter)`, FK em cascata para `books(id)`.
2. **Rota `GET /api/v1/commentaries?bibleBook=&chapter=&limit=`**, com validação Zod e documentação em `/docs`. Não devolve comentário de obra despublicada.
3. **Conteúdo: só o verificável.** O seed traz **Lutero, Comentário aos Gálatas, capítulos 1 a 6**, no slug já publicado (`comentario-aos-galatas-lutero`): o arquivo tem `# Capítulo I` a `# Capítulo VI`, que correspondem aos capítulos da epístola. Sem `excerpt`: não há resumo verificado a exibir.

**O que ficou de fora, e por quê:** Crisóstomo (Gálatas, Efésios, Filipenses, Colossenses, Sermão da Montanha) e Agostinho (1 João). Os textos não têm título por capítulo nem por homilia, e as homilias não seguem a divisão da Bíblia (24 homilias para os 6 capítulos de Efésios), então a correspondência não era verificável. O seed anterior também usava âncoras (`#capitulo-1`, `#homilia-15`) que não existiam, resumos idênticos para todos os capítulos e um slug de Agostinho que não existe. Essas linhas voltam quando o texto tiver estrutura.

**Limite conhecido:** o leitor não lê o `#hash` da URL, então o link leva à obra, não ao capítulo. Suportar isso mexe na lógica de retomar leitura e precisa de teste no navegador.

---

## 2026-10-16 — Revisão do catálogo antes do deploy

**Contexto:** os três commits locais da semana (acervo traduzido por IA, menu de seleção, comentários) foram revisados e ensaiados contra uma cópia da produção antes de subir.

**O que o ensaio achou no seed do catálogo** (`add_catalogo_universal_2026.sql`):
- **Falhava ao aplicar** (violação da FK `related_edition_slug`) e, no `migrate`, derrubava em cascata os 103 seeds que vêm depois dele na ordem alfabética (o catálogo é o 39º de 142), e o script ainda imprimia "concluídos com sucesso" com saída 0.
- **Alteraria 152 obras já publicadas**: 147 títulos e 9 idiomas, 8 em português marcados "Inglês" e 1 em inglês marcado "Português".
- **Criaria 72 autores, 36 deles com nome de título ou de cabeçalho** (`# Compêndio de Teologia`) e 17 duplicados, todos com a mesma biografia genérica.
- **Duplicava 21 obras que já existem** (mesmo arquivo, mesmo conteúdo, ou partes de obra que já está inteira).
- Marcava as 294 como tradução por IA e domínio público, descrevia como "anotada" uma edição sem anotações e usava `Latim` como língua original de 263 obras.

**O que mudou:** `migrate.ts` faz ROLLBACK ao falhar e sai com 1; o seed só insere (`DO NOTHING`), em duas fases para os vínculos, com idioma medido no texto, IA/licença/atribuição coerentes e o título original no campo próprio; 6 autores novos, sem biografia nem datas inventadas; `deploy.yml` com `set -e` e falha do migrate derrubando o deploy. **Resultado:** 100 obras novas, 0 das 188 publicadas alteradas, `migrate` duas vezes com exit 0.

**Decisões registradas:**
- **Licença das traduções por IA: CC BY-SA 4.0**, a mesma das 132 já publicadas. Texto original em domínio público é marcado como tal. Risco assumido e a levar ao jurídico: a titularidade de tradução gerada por IA não é pacífica, então o selo vale como declaração de intenção, e o risco maior é a **edição-fonte** (se foi uma tradução ou edição moderna com direitos), que nas 100 novas **não foi auditada** e está dita assim na atribuição.
- **Segurado fora deste deploy** por terem trechos em inglês: `apologia-da-confissao-de-augsburgo` (13%) e `suma-teologica-segunda-parte-da-segunda-parte` (bloco de ~22 mil palavras). Entram quando forem traduzidos por inteiro.
- **Pendente de decisão do autor:** `tratado-sobre-as-reliquias-calvino` está estruturalmente corrompido (parágrafos em inglês da dissertação do editor intercalados fora de ordem com o texto de Calvino, e um catálogo do editor misturado). A versão em produção era pior; a nova melhora, mas não resolve. Recomendação: despublicar até reprocessar a partir da fonte.

---

## 2026-10-16 — Só obras em português no ar, e o que "despublicar" passou a significar

**Decidido (Rilson):** por enquanto o site publica só obras em português. As edições em inglês (25) e em latim (2) ficam ocultas até uma internacionalização completa (interface, busca em inglês, proveniência de cada edição). Também saem do ar `tratado-sobre-as-reliquias-calvino` (arquivo corrompido) e `proslogion` (texto publicado com 2.353 palavras, versão nova de ~9,7 mil aguardando revisão).

**Como ficou:**
- **A ocultação é estado do banco**, registrada na migration `0009_dados_acervo_2026_10_16.sql` e controlada pela chave "Publicada" do painel. Nenhum seed republica mais (ver a entrada "Gestão do acervo" abaixo). Para reativar qualquer obra: chave "Publicada" no painel, obra a obra.
- **Vínculo entre edições** só aparece se a edição vinculada estiver publicada (a API devolve `relatedEditionSlug: null` caso contrário), para o botão "ver outra edição" não levar a um 404.

**Furo achado no caminho:** `published` só era respeitado na listagem, na busca, na página do autor e no sitemap. O **detalhe** (`/api/v1/books/:id`), o **texto** (`/text`) e a **contagem de obras por autor** ignoravam, então uma obra "despublicada" continuava acessível por link direto e legível no leitor. Agora detalhe e texto devolvem 404 e o autor só aparece se tiver obra publicada (o admin continua vendo tudo com `includeUnavailable=true`). Coberto por teste de integração. Esse furo existia antes desta semana.

**Arquivos removidos de `server/texts/`** (redundantes de fato): `imitacao-de-cristo-pt.md` (cópia idêntica, mesmo hash), e as partes 1 e 2 de `exposicao-da-fe-ortodoxa` e de `a-regra-pastoral` (a obra inteira já está publicada). **Mantidos fora do catálogo, para revisão**, por serem *traduções diferentes* da mesma obra e não cópias (texto em comum entre 0% e 17%): `da-liberdade-do-cristao-martinho-lutero`, `confissoes-santo-agostinho`, `a-unidade-da-igreja-catolica-cipriano`, `comentario-aos-galatas-martinho-lutero` e `proslogion-anselmo`.

**Citações que linkavam para edição oculta.** As citações do Scriptorium são em português, mas 12 linkavam para a página da edição em inglês. O seed `zzzz_repontar_citacoes_2026-10-16.sql` (roda depois do que oculta) repassa o link para a edição em português vinculada, quando publicada: 10 citações resolvidas (Cidade de Deus, Institutas, Suma I, Pensées), mais 2 de Pascal que apontavam para um slug que nunca existiu (`pensamentos`). Medido no ensaio: 29 das 31 citações com link apontam para página publicada. **As 2 restantes são de Anselmo** (trechos do Proslogion, capítulo 1) e apontam para `proslogion` assim que ele for republicado; até lá levam a um 404. O campo `source` dessas duas diz "Por que Deus se fez Homem?" (Cur Deus Homo), o que não confere com o trecho: corrigir quando o Proslogion voltar.

**Fora do Scriptorium, mas descoberto aqui:** 4 slugs que o `lewis-quotes.json` do Lecionário usa **nunca existiram** no Scriptorium (404 em produção hoje): `a-cidade-de-deus` (a obra é `a-cidade-de-deus-agostinho`), `pensamentos` (`pensamentos-blaise-pascal`), `por-que-deus-se-fez-homem` (`cur-deus-homo-anselmo`) e `compendio-da-suma-teologica`. Corrigir no repo do Lecionário.

---

## 2026-10-16 — Gestão do acervo: seed só cria, migration muda, o painel manda

**Problema.** Ocultar uma obra pelo painel era desfeito no deploy seguinte. 237 upserts em 137 seeds faziam `DO UPDATE` e reescreviam `published`, `title`, `description`, `attribution_text`, `categories` e `tags`; dois seeds de `UPDATE` refaziam `published` e `featured`; um seed apagava a tabela `categories` e reescrevia `books.categories` em ~190 obras. A data de aprovação humana da Imitação de Cristo era reescrita para "agora" a cada deploy.

**Decisão.** Três donos: o **seed cria** obras e autores novos (`DO NOTHING`); a **migration muda** o que já existe, uma vez; o **painel de admin gerencia** o resto. Manual completo: `docs/GERENCIAR-ACERVO.md`.

**Feito:**
- 237 upserts viram `DO NOTHING` (só saíram campos citados, `published = true` e `updated_at = NOW()`: nenhum dado exclusivo foi perdido);
- migration `0009_dados_acervo_2026_10_16.sql` absorve os dois seeds de `UPDATE` (curadoria) e registra a ocultação decidida; migration `0010_taxonomia_canonica.sql` absorve o seed das categorias;
- o seed que ocultava saiu; `zzzz_repontar_citacoes_2026-10-16.sql` fica como única exceção (só repara link quebrado de citação);
- a pasta `scripts/` ganhou `LEIAME.md` avisando que os 74 `.sql` dela são históricos e não devem ser rodados.

**Ensaiado** contra cópia da produção, `migrate` duas vezes com exit 0: obras, autores, citações e categorias **idênticos** ao desenho anterior (única diferença: a data de aprovação da Imitação passou a ser preservada); edições simuladas do painel (obra republicada e outra ocultada, título, descrição, destaque, atribuição, descrição de categoria e categorias de uma obra) **sobrevivem** a um novo `migrate`.

**Ferramentas novas:** `pnpm --filter server acervo:verificar` (saúde do acervo; sai com 1 se houver erro em obra publicada) e `scripts/ensaiar-migrate.sh` (ensaio do `migrate` numa cópia da produção).

**Ficha da edição no leitor.** O bloco "Sobre esta edição" passou a ter os dados do banco em blocos (obra original, esta edição, revisão, licença, atribuição), sempre exatos e presentes mesmo sem o ensaio de abertura. O ensaio de abertura (115 textos com superlativos sem fonte) fica **recolhido e rotulado** como texto de IA sem revisão enquanto a revisão humana estiver pendente, e aparece aberto depois da aprovação. Conferido por captura de tela do leitor.

**Correção de uma afirmação minha desta mesma revisão:** eu disse que a internacionalização exigiria traduzir a interface do zero. A interface **já tem** um mecanismo de idiomas (`web/src/i18n`, seletor PT | EN | ES no cabeçalho) que cobre **parte** das telas. O que falta é completar, conferir a busca em inglês e documentar a edição-fonte. Enquanto o catálogo for só em português, o seletor de idioma visível no cabeçalho é uma decisão em aberto.

**Links do Lecionário.** `lewis-quotes.json` (web e mobile) tem **5** slugs que dão 404 hoje: `a-cidade-de-deus`, `pensamentos` e `compendio-da-suma-teologica` (nunca existiram com esse nome; PR #8 do repo do Lecionário aponta para os slugs certos, 13 citações), `institutas-da-religiao-crista` (passa a existir com o deploy do catálogo novo) e `por-que-deus-se-fez-homem` (2 citações que são do Proslogion; esperam o Proslogion voltar). **Ordem:** deploy do Scriptorium primeiro, depois o merge do PR #8.

---

## 2026-10-16 — Decisões finais antes do deploy

**O usuário final só precisa saber que é texto de IA (decisão do Rilson).** O aviso do leitor diz "Tradução gerada por inteligência artificial" e a ficha mostra o selo de IA, mas **não exibem mais "revisão humana pendente"**. O estado interno da revisão continua em `human_review_approved_at`, no painel e nos documentos; a aprovação, quando existe, segue sendo mostrada. A frase "Revisão humana: pendente." saiu das 111 atribuições existentes (migration 0009), de todos os seeds e do modelo do manual. O rótulo do ensaio de abertura recolhido passou a ser "Contexto histórico (texto introdutório gerado por IA)".

> **Atualização de 2026-10-17:** o Rilson decidiu tirar também a frase "a edição-fonte não foi auditada" do texto público (migration 0011). Ver a entrada abaixo.

**Interface só em português por enquanto, sem perder a internacionalização.** `IDIOMAS_ATIVOS` (hoje só `pt-BR`) em `web/src/i18n/index.ts` controla o seletor do cabeçalho e do rodapé e o idioma inicial; uma preferência antiga em EN/ES salva no navegador é ignorada. Os textos de EN e ES e todo o mecanismo (i18next, `<html lang>`, componentes) seguem montados. Para voltar a oferecer um idioma: acrescentar o código à lista, depois de completar a tradução da interface e de publicar o catálogo nesse idioma (ver `docs/GERENCIAR-ACERVO.md`, "Idioma").

**`breve-catecismo-westminster` oculto** (texto majoritariamente em inglês); traduzir por inteiro depois e reativar pela chave "Publicada". Com isso o verificador do acervo fica com **0 erros em obra publicada**.

**Números finais** (ensaio contra cópia da produção, `migrate` duas vezes com exit 0): 288 obras no banco, 258 publicadas, **255 no catálogo público** (3 publicadas ainda sem arquivo de texto), 229 por IA, 100 autores com obra.

---

## 2026-10-16/17 — Deploy realizado

**Scriptorium, 2026-10-16 (20:30 UTC).** Backup do banco no VPS antes (`~/backups-pre-deploy/scriptorium-2026-10-16-pre-deploy.dump`, 188 obras). Conferido no destino, não só no CI: containers recriados e saudáveis, `migrate` sem falhas (140 seeds, 12 migrations aplicadas), 288 obras no banco, 258 publicadas (todas em português), 255 no catálogo público, 6 comentários, Calvino/Relíquias, Proslogion, Breve Catecismo e as edições em inglês devolvendo 404, nenhuma frase de revisão pendente, seletor de idioma ausente do DOM, aviso do leitor "Tradução gerada por inteligência artificial". Memória disponível mínima no VPS durante o deploy: 1,46 GB.

**Lecionário, 2026-10-17 (PR #8).** Mergeado depois do deploy acima, com o VPS ocioso: 13 links de citação corrigidos (web e mobile), 11 dos 12 slugs resolvem. Deploy ok; o `eas-build.yml` pulou o build nativo (sem gasto de cota) e o OTA publicou a correção no app. Memória mínima 294 MB durante o build do Lecionário.

**Pendente do lado do repo:** os commits de documentação desta seção ficaram só locais, porque o `deploy.yml` do Scriptorium não ignora `*.md` e `docs/**` (o do Lecionário ignora): um push só de documentação faria um deploy completo. Sugestão: acrescentar `paths-ignore` ao `deploy.yml` do Scriptorium.

---

## 2026-10-17 — Transparência sem tirar a confiança: proveniência no registro, não na atribuição pública

**Decisão (Rilson):** a atribuição exibida ao público não diz mais "a edição-fonte não foi auditada". Fica só o essencial: tradução gerada por IA, a partir de obra em domínio público, com a licença. Migration `0011` (100 linhas) e seed ajustado.

**Onde a transparência passa a morar.** (1) `docs/PROVENIENCIA-ACERVO.md`: registro de cada tradução por IA com a fonte declarada e a faixa de risco; (2) o verificador do acervo (`acervo:verificar`) lista como INFO as obras cuja atribuição é a genérica "a partir de obra em domínio público", que é o marcador de pendência. O README segue dizendo a verdade sobre o estado, para quem lê o repositório.

**Triagem das 232 traduções por IA (palavras-chave, a confirmar à mão):** 24 de risco baixo (fonte nomeada e antiga: Migne, Corpus Reformatorum, Schaff, edições do século XIX), 28 de risco médio (reimpressões modernas como Banner of Truth, Weimarer Ausgabe, Leonina/Quaracchi, Annecy), **60 de risco alto** (edições críticas ou traduções modernas: Sources Chrétiennes 23, "edição crítica" sem editor 13, CCSL 9, BAC 6, CSEL 2, Quint/Kohlhammer 2, Yale 2, Leclercq 2, Pascal Lafuma/Sellier 1) e **120 sem fonte nomeada** (100 de 16/10 e 20 mais antigas). O risco não está no autor, que é de domínio público, mas em **de qual texto a tradução partiu**: uma edição crítica moderna pode ter proteção própria.

**Próximo passo da proveniência:** auditar primeiro a faixa C (descobrir a fonte real; se for antiga, corrigir a atribuição; se for a edição moderna, trocar a base ou ocultar enquanto isso), e levar ao jurídico as perguntas listadas no registro.

## 2026-10-17 — Citação do dia: gravar a escolha de cada dia

Decisão do autor ("é o mais profissional"). Editar o acervo de citações não deve reescrever os dias já mostrados.
Tabela `daily_quotes`, janela de ±30 dias, preenchida pela migration 0012 com a escolha que a fórmula antiga dava.
Ensaiada contra cópia da produção (61/61 iguais). Detalhes e o que a gravação não cobre: ADR 001, atualização (2).
Junto: `?date=` inválido passa a dar 400; datas anteriores a 1970 deixam de dar 404.

---

## 2026-10-18 — Retirada de 4 citações de Lewis que o vault marca como falsa ou duvidosa

**Decisão (Rilson):** retirar uma citação que é fala de filme e três que não se localizam em fonte primária. Origem: `docs/AUDITORIA-RETROATIVA-CITACOES-LEWIS.md`, que cruzou as 156 citações de Lewis da API com a auditoria do vault.

- `4c765bb2` "Eu oro, porque eu não posso me ajudar..." ❌ fala do filme *Terra de Sombras* (1993), do personagem Lewis (roteiro de William Nicholson).
- `15cc0baa`, `208426db`, `033cd665` ⚠️ duvidosas: busca real feita no vault, formulação não localizada.

**Como foi feito:** migration `0013_retira_4_citacoes_lewis` (apaga por id). Ensaiada contra cópia da produção: 281 para 277, segunda execução sem efeito. Nenhuma das 4 estava gravada em `daily_quotes` (nenhum dia mostrado muda). `quotes-canonical.json` atualizado no mesmo PR (senão `seed-quotes.ts` as ressuscitaria). "Duvidosa" não prova que seja falsa: se uma for localizada, volta pelo protocolo, com fonte. Passos seguintes, nos outros projetos: regerar a cópia do Gerador (`npm run quotes:sync`) e conferir o canário.

---

## 2026-10-18 — Fonte registrada em 4 citações de Lewis que já estavam confirmadas no vault

Passo 2 do plano de `docs/AUDITORIA-RETROATIVA-CITACOES-LEWIS.md`. O vault já tinha confirmado a fonte destas quatro (auditoria de 21 a 27/09/2026) e o banco não a registrava. Migration `0014_preenche_source_de_4_citacoes_lewis`: `65e113b5` e `86587b88` (Cristianismo Puro e Simples), `67b54cc0` (carta a Sheldon Vanauken, 23/12/1950), `b50e13d4` (*The Collected Letters of C. S. Lewis*, vol. 3, p. 119). Só o campo `source`: `fonte_url` e `verificado_em` continuam vazios, porque o vault nomeia livro, página ou carta, não uma URL conferida (o protocolo não permite preencher campo sem fonte real). Não mexe em `affiliateUrl` (decisão de monetização à parte). Ensaiada em cópia da produção: 277 citações antes e depois, 4 preenchidas, segunda execução sem efeito. Restam 2 sem fonte (`0e70882b`, `17f74df7`), que vão para a busca em fonte primária.

---

## 2026-10-18 — Retirada de 7 citações de Lewis não localizadas em fonte e `source` da que faltava

**Decisão (Rilson):** retirar as 7 que a busca de 18/10 não localizou (`139977f6`, `17f74df7`, `73cf6ff3`, `913c5eef`, `a3dfbe3b`, `d5518bea`, `fef40aff`) e preencher o `source` de `0e70882b` (*Cristianismo Puro e Simples*, Livro I, cap. 5). Evidência, termos de busca e limites por citação: `docs/REGISTRO-VERIFICACAO-CITACOES-LEWIS.md`. "Não localizada" não prova que seja falsa; se uma for achada depois, volta pelo protocolo, com fonte.

**Como foi feito:** migration `0015_retira_7_citacoes_e_source_voltar_atras`. Ensaiada em cópia da produção: 277 para 270, nenhuma das 7 sobra, segunda execução sem efeito, Lewis fica com zero citações sem `source`. Backup antes: `~/backups/scriptorium_quotes_pre_0015_2026-10-18.sql` no VPS. `quotes-canonical.json` atualizado.

**Efeito conhecido em um dia já mostrado:** `d5518bea` ("O céu não é silencioso") estava gravada como a citação do dia de **2026-10-16**. A linha de `daily_quotes` some em cascata e esse dia passa a escolher outra citação quando alguém o consultar. É intencional (a frase não tem fonte) e é a única das 7 que estava gravada. API: 277 para 270 citações (152 para 145 de Lewis).

---

## 2026-10-18 — A especificação OpenAPI passa a declarar o 400 da rota `quotes/daily`

Achado da Fase 3 (cluster): nenhuma das especificações declarava a resposta 400, então um cliente gerado não "sabia" do erro de validação. Declarado em `quotes/daily` com um schema que **não corta campos** (`additionalProperties: true`), só para documentar o que a API já devolve: `error` e `message`, e `details` (Zod, `validation_error`) ou nada (`FST_ERR_VALIDATION`, padrão do Fastify). Mudança aditiva; o corpo da resposta não mudou (conferido em produção antes e depois). Diferença conhecida entre as APIs: a Bíblia na Arte usa `issues` onde o Scriptorium usa `details`; unificar seria mudança de contrato e fica como decisão do autor (hetzner-infra/ROADMAP-CLUSTER.md).


## 2026-10-18 — Corpo único do 400 de validação (Scriptorium e Bíblia na Arte)

Decisão do autor: unificar já, de forma aditiva. As duas APIs devolvem `{error: 'validation_error', message: 'Parâmetros inválidos', issues: {campo: [mensagens]}, details: {issues: [...]}}`, tanto para o Zod quanto para a validação do Fastify (`?date=abc`, que no Scriptorium saía como `FST_ERR_VALIDATION` sem `details`, e na Bíblia na Arte trazia `issues` como lista). `issues` é sempre o mapa campo → mensagens; `details.issues` guarda a lista crua. Nenhum campo foi removido: o Scriptorium ganhou `issues`, a Bíblia na Arte ganhou `details`, e o `error` do `?date=abc` do Scriptorium passou de `FST_ERR_VALIDATION` para `validation_error`. Nenhum consumidor lê o corpo. A especificação OpenAPI não mudou (continua exigindo só `error` e `message`, com `additionalProperties: true`), então os recortes `contract/` dos consumidores não mudam; o formato completo é vigiado pelo canário (`conferir_corpo_400`) e por testes de integração nas duas APIs, com mutação verificada. Fonte: `hetzner-infra/CONTRATOS-ENTRE-PROJETOS.md`, seção 5.


## 2026-10-18 — Citação ganha status; retirar é ocultar (painel de citações, F1)

Autor aprovou o desenho (`docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md`) e a construção em fases. A F1 acrescenta `quotes.status` (`rascunho|ativa|oculta`, padrão `ativa`), `motivo_ocultacao` e a tabela append-only `quote_events` (sem FK para a citação, para o histórico sobreviver à exclusão por migration). Dois CHECKs: status na lista e "ativa exige fonte". Migration `0016_citacoes_status_e_eventos`, só aditiva.

**Comportamento:** `quotesAtivas()` é a única condição de elegibilidade e alimenta lista, sorteio e dia (R5). A escolha gravada em `daily_quotes` cuja citação deixou de ser ativa é **substituída** (`ON CONFLICT DO UPDATE` com `setWhere` que só toca linha cuja citação não é ativa. Uma gravada ativa não chega a esse INSERT (a leitura devolve antes); o `setWhere` é cinto de segurança contra corrida e **ainda sem teste próprio** (lacuna conhecida da revisão de 18/10, registrada abaixo)). Reativar não desfaz a substituição. Fora da janela de ±30 dias nada é gravado.

**Contrato:** nenhum campo novo na API pública; a OpenAPI gerada pela branch é idêntica à da produção (29 rotas, comparada inteira). Só muda quais linhas voltam.

**Verificação:** ensaio em cópia da produção (270 citações, hash idêntico antes e depois, todas `ativa`, 61 dias gravados preservados, segunda execução sem efeito); testes de integração com mutação (tirar o filtro de lista, sorteio ou dia, ou trocar `DoUpdate` por `DoNothing`, faz teste falhar). Efeito colateral aceito: o CHECK de fonte obrigou testes antigos a inserir `source`.

**Scripts:** `repair-quote-sources.ts` (faz `DELETE`, fere R3) marcado como histórico; `export-quotes-canonical.ts` leva `status` e `motivoOcultacao`; `seed-quotes.ts` os preserva; `verificar-acervo.ts` só avalia as ativas nos avisos de link, autor e verificação.

**Ordem do deploy (achado da revisão):** o `deploy.yml` sobe o container novo (`make deploy`) e só então roda o migrate. Com a 0016 isso abre uma janela de segundos em que lista, sorteio e dia dariam 500 (coluna `status` inexistente). A migration é aditiva e o código antigo convive com ela, então a mitigação é **aplicar a 0016 na produção antes do merge**. Estrutural (futuro): rodar o migrate com a imagem nova antes do `up`.

**Pendências menores da revisão (F1):** (1) teste direto do `setWhere` (**fechada na F2, 22/10/2026**: `gravarEscolhaDoDia`, com mutação); (2) o seed sem `status` no JSON trata tudo como ativa, então **rode `export-quotes-canonical.ts` logo depois de ocultar por SQL**; (3) o CHECK de fonte usa `btrim` só de espaços (tab/quebra de linha passam); (4) `idx_quotes_ativas` não é usado pelo filtro de autor (270 linhas, sem efeito); (5) a F2 não deve gravar `quote_events` antes da F5, porque o seed troca os ids.


## 2026-10-22 — API de administração de citações (painel de citações, F2)

A F2 acrescenta as rotas de `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md` (seção 7), sem migration e sem `DELETE`: listar, criar, editar com `updatedAt` e `409`, ocultar com motivo, reativar e histórico. Detalhe das rotas e regras em `docs/GERENCIAR-ACERVO.md`. Plano: `docs/superpowers/plans/2026-10-22-painel-de-citacoes-f2.md`.

**Contrato:** a OpenAPI local tem as mesmas 29 rotas da produção, byte a byte, mais 5 caminhos novos de admin (6 operações); `components` igual. `contract:check` do site: `igual` nos dois recortes. Mudança aditiva (R1).

**Chamadas minhas (o autor confere):** texto até 2000 caracteres; a chave do texto distingue acento (como a do autor); autor inédito é aceito e só grafia divergente é recusada; ocultar e reativar não pedem `updatedAt` (o estado da citação já protege: `409` se já está oculta ou não está); `PATCH` sem mudança real é no-op sem evento; `GET /:id/eventos` não exige a citação existir; `409` devolve a linha `atual`; evento `verificou` quando só `fonteUrl`/`verificadoEm` mudam; item novo exige fonte completa para ficar ativo, reativar um antigo exige só `source`.

**Decisões de implementação:** (1) a comparação de `updatedAt` é em SQL, em milissegundos (`date_trunc`), porque o Postgres guarda microssegundos e o JS só milissegundos; comparar em JS daria `409` em todo `PATCH` legítimo (teste e mutação). (2) Os corpos das rotas **não têm schema JSON do Fastify**: o Ajv do Fastify remove em silêncio campo desconhecido, e o Zod `.strict()` tem de recusá-lo (`id`, `status: 'oculta'`); custo: o Swagger não mostra o corpo, só o resumo. (3) Linha trancada com `SELECT ... FOR UPDATE` dentro da transação de edição.

**Pendência aceita:** duas criações simultâneas do mesmo texto podem passar pela checagem de duplicata. Há um único administrador; um índice único sobre a chave do texto exigiria migration e fica para quando houver mais de um. **Continua valendo:** não usar a API para escrever em produção antes da F5 (o seed troca os ids e os eventos ficariam órfãos); a F3 (tela) deve esperar isso ou avisar.

**Revisão final da F2 (22/10/2026), corrigido antes do merge:** (1) corrigir a grafia do próprio autor de uma citação era recusado (a validação contava a própria linha); agora a própria citação é ignorada e uma grafia que já existe é sempre aceita. (2) rascunho, ocultar e reativar contornava a R6; reativar um rascunho que nunca foi ativo agora exige a fonte completa. (3) editar uma ativa podia apagar `fonteUrl`/`verificadoEm` e o evento saía como `verificou`; agora é recusado, e `verificou` só quando a verificação é preenchida.

**Pendências menores da F2 (para a F3 ou depois):** (4) `updatedAt` com ano 0001 válido no Zod dá 500 no Postgres (só admin); (5) `scriptoriumUrl` só confere o último segmento (não valida host nem http/https); (6) `POST` sem corpo com `Content-Type: application/json` dá `400 FST_ERR_CTP_EMPTY_JSON_BODY` fora do formato do cluster: a tela deve enviar `{}` (ou tratar no servidor), e `PATCH` sem corpo devolve `issues` vazio; (7) `PATCH` de `ativa` para `rascunho` tira a citação do ar sem motivo nem evento `ocultou`: **decisão do autor pendente** se essa transição deve existir; (8) testes fracos: `DELETE` só confere 404, `q` em `source` não é exercitado, a atomicidade só é provada em `ocultarQuote`, o `FOR UPDATE` não tem teste; (9) o aviso "não escrever em produção antes da F5" só está aqui, não em `GERENCIAR-ACERVO.md`; (10) a F3 vai precisar de um filtro `semVerificacao` e da contagem de dias gravados em `daily_quotes` ao ocultar (seção 8 do desenho).

**Pendências menores da revisão (F1):** (1) teste direto do `setWhere`; (2) o seed sem `status` no JSON trata tudo como ativa, então **rode `export-quotes-canonical.ts` logo depois de ocultar por SQL**; (3) o CHECK de fonte usa `btrim` só de espaços (tab/quebra de linha passam); (4) `idx_quotes_ativas` não é usado pelo filtro de autor (270 linhas, sem efeito); (5) a F2 não deve gravar `quote_events` antes da F5, porque o seed troca os ids.


## 2026-10-25 — Auditoria de dependências: `undici` corrigido, `zod` aceito com teto nos arrays

Dois advisories high novos derrubaram o CI de qualquer PR. **`undici`** (GHSA-xjj6-f33q-929c, transitiva via `@scalar/fastify-api-reference`): corrigido subindo o `override` do `pnpm` para `^7.30.1`. **`zod`** (GHSA-mrhx-c7xc-m3w5, array sem limite pode esgotar memória): a correção existe só na linha 4.x (>=4.6.6) e o servidor usa 3.x com `zod-to-json-schema` (~21 arquivos); migrar não cabe numa correção de segurança. Aceito na allowlist (`scripts/audit-allowlist.mjs`, com o motivo) porque não é alcançável por visitante: arrays vindos do cliente só existem nos corpos do admin (atrás de login, corpo <= 1 MiB), as rotas públicas só validam query string. Em profundidade, todo array dos corpos do admin ganhou teto (`.max`: 200 textos, 100 links, 5000 itens de sumário). **A revisar:** migrar para Zod 4 (plano próprio); quando sair, tirar o GHSA da allowlist.


## 2026-10-26 — Tela de administração de citações (painel de citações, F3)

A F3 entrega `/admin/citacoes` (item "Citações" no menu) sobre a API da F2: resumo, lista com filtros e selos, formulário com validação ao vivo, ocultar com impacto e histórico por citação. Plano: `docs/superpowers/plans/2026-10-26-painel-de-citacoes-f3.md`. Detalhe de uso em `docs/GERENCIAR-ACERVO.md`.

**API (aditiva):** `GET /admin/quotes` passa a trazer `diasFixados` (datas de `daily_quotes` em que a citação está gravada, só para os itens da página) e aceita `semVerificacao=true` (ativas sem `verificado_em`). Fecha a pendência 10 da F2. Nenhum caminho novo; nenhuma rota pública mudou.

**Chamadas minhas (o autor confere):** (1) a tela **não oferece ativa para rascunho** (pendência 7 da F2 continua aberta na API); (2) `reativar` envia `{}` como corpo (contorna a pendência 6); (3) a edição envia **só os campos alterados** e fica desabilitada sem mudança; num `409` o digitado é mantido e a versão atual é carregada por botão; (4) os avisos da API (obra fora da curadoria) saem em toast depois de salvar; (5) filtros de situação e autor são `<select>` nativos (mais simples de testar e acessíveis por padrão); (6) o texto completo do aviso do Gerador é da F4: na F3 vai uma linha com `npm run quotes:sync`.

**Validação:** `web/src/lib/validarCitacao.ts` espelha as regras da API só para feedback ao vivo; o servidor continua sendo a autoridade e seus `issues` aparecem no campo certo (`aria-describedby`).

**Continua valendo:** não escrever em produção pela tela antes da F5 (o seed troca os ids; os eventos ficariam órfãos).

**Acessibilidade (axe + foco visível):** a tela, o diálogo de ocultar e o formulário com erro visível entram em `web/e2e/a11y.spec.ts` (`mockAdminApi`, fixture `listaAdminCitacoes`); a verificação de foco virou a função `focoSemIndicador`, usada nas rotas públicas e na do admin. **Violação real achada e corrigida:** o botão "Sair" do `AdminLayout` (`text-red-600` sobre o bege do menu, 4,35:1) falhava em contraste AA em toda tela do admin; passou a `text-red-700`. As telas antigas do admin continuam fora da auditoria axe (só as de citações entraram).

**Pendências da F2 que seguem abertas:** 4 (`updatedAt` ano 0001), 5 (`scriptoriumUrl` sem host), 7 (ativa para rascunho, decisão do autor), 8 (testes fracos) e 9 (já resolvida aqui: o aviso entrou em `GERENCIAR-ACERVO.md`). A 6 foi contornada na tela (corpo `{}`), mas o servidor ainda responde `FST_ERR_CTP_EMPTY_JSON_BODY` fora do formato do cluster a quem chamar sem corpo.

**Revisão final da F3 (26/10/2026), corrigido antes do PR:** (1) a concentração por autor dividia um contador de todas as situações pelas ativas (Lewis com ocultas e rascunhos passaria de 54%); a API ganhou `contadores.porAutorAtivas` (aditivo) e o resumo usa só ele, enquanto `porAutor` segue com todas as situações para a checagem de grafia. (2) "Limpar filtros" não esvaziava a caixa de busca.

**Pendências menores da revisão da F3:** 409 ao ocultar mostra a mensagem mas não recarrega nem fecha; `fonteUrl` e `verificadoEm` com espaço nas pontas passam no cliente e o servidor recusa (falta trim no serviço); Salvar fica desabilitado sem dizer por quê quando o erro é de campo não tocado (ativa antiga sem `source`); a grafia do próprio autor é checada sem ignorar a própria citação; Reativar não fica desabilitado enquanto envia (há guarda, falta sinal visual e teste); o foco se perde ao recarregar depois de ocultar ou reativar (2.4.3); erros e contador do formulário sem `aria-live`; falha de refetch em segundo plano é silenciosa.

## 29/10/2026: primeiro uso da tela em produção

Três achados do Rilson logo ao abrir `/admin/citacoes`.

**Permissão no banco (o grave).** Histórico e Ocultar davam "Erro interno do servidor": `quote_events` pertencia ao `postgres` (criada à mão na F1, para o deploy não esperar o migrate) e o usuário da API não tinha permissão. Nada foi gravado: o banco seguiu com 270 ativas e 0 eventos, porque o insert do evento e o update da citação rodam na mesma transação. Correção direta na produção: `ALTER TABLE quote_events OWNER TO scriptorium_app` (a tabela e os dois índices). **Por que nada pegou antes:** os testes de integração rodam com um usuário só (superusuário), e o canário e o `/health` não passam por rota de admin. **Guarda nova:** `tabelasSemAcesso` (`server/src/db/acesso-tabelas.ts`) roda no fim do `migrate` e derruba o deploy se alguma tabela do schema public não for legível e gravável pelo usuário da conexão; o teste assume um papel comum com `SET ROLE`, porque o superusuário ignora permissões.

**Interface.** A concentração por autor passou de `C. S. Lewis 145, 54%` para `C. S. Lewis 145 (54%)`, e Próxima/Anterior levam o início da lista de volta à tela. O percentual estava certo (145 de 270 é 53,7%).

**Fora do código:** o rodapé do login tinha `© 2025` fixo (PR #28). O 404 inicial era service worker antigo no navegador.

## 29/10/2026: F4 do painel de citações (aviso do Gerador e manual)

**O aviso só aparece quando a cópia do Gerador muda.** A cópia embutida (`lewis-quotes.snapshot.json`) guarda só as citações **ativas** de C. S. Lewis, com `id`, texto, obra, tema e o link de compra (que depende de domínio público, obra e autor). A regra `efeitoNoGerador` (`web/src/lib/gerador.ts`) compara o "antes" e o "depois" da citação e diz se ela **entra**, **sai** ou **muda** na cópia, ou nada. Por isso editar só a verificação, criar rascunho ou mexer numa citação oculta não avisa: um aviso que dispara sempre é um aviso que se aprende a ignorar. Trocar o autor para ou de Lewis conta (a citação entra ou sai da cópia). A frase do diff esperado ("o id X sai do arquivo", "o texto de X muda", "entra uma citação nova") sai desse mesmo efeito.

**Onde aparece.** Na confirmação de ocultar (sempre, a citação ativa de Lewis vai sair), no formulário enquanto os valores digitados mudariam a cópia, e num aviso rápido de 20 segundos depois de salvar, ocultar ou reativar com **sucesso** (falha não avisa: nada mudou). O "link do diff esperado" do desenho virou o link do arquivo da cópia no GitHub mais a frase do diff, porque o diff só existe depois de rodar o `sync`.

**O lembrete que não depende de memória não é esta tela.** O aviso ajuda, mas quem garante é o canário (até 1 hora) e, na F5, o PR automático do Gerador. Registrado para ninguém achar que a F4 resolve o R6(b).

**Documentação.** `docs/MANUAL-PAINEL-CITACOES.md` (manual para o autor) e `docs/GERENCIAR-ACERVO.md` reescrito: o painel é o caminho normal para citações, a migration fica para carga em lote e exclusão física. **Enquanto a F5 não existir, em produção ainda vale a migration**; os dois documentos repetem o aviso de não gravar pela tela.

**Não faz:** nenhuma mudança de API, banco ou OpenAPI; não regera a cópia; não substitui o canário.

**Carga em lote continua por migration.** O desenho (seção 11, F4) diz "migration só para exclusão física". A F4 manteve a migration também para **carga em lote** de muitas citações: a tela cria uma por vez, e o ensaio (`ensaiar-migrate.sh`) e a revisão do SQL são a rede de segurança de uma carga grande. Se a tela ganhar importação, essa exceção cai.

**Achado da revisão final:** a primeira versão do aviso dizia que o canário avisa se o autor esquecer o passo. Ele só compara conjuntos de ids, então para texto, obra ou tema corrigidos a cópia fica velha sem aviso nenhum; o texto do aviso agora depende do efeito (sair: erro; entrar: aviso; mudar: o canário não percebe). Fechar esse buraco é da F5 (canário que compare o conteúdo, ou o PR automático).

**Pendências menores da revisão da F4:** a frase do diff diz "o texto de X muda" mesmo quando muda obra, tema ou domínio público; o manual diz que o `git diff` mostra só a mudança feita, mas o `sync` sempre regrava `geradoEm` e `total`; o fingerprint ignora o autor bruto, que entra no link de compra (corrigir `C.S. Lewis` para `C. S. Lewis` muda o link sem aviso); alternar domínio público avisa mesmo quando a obra não é da curadoria e o link fica nulo; "Carregar a versão atual" deixa o "antes" do aviso rápido na versão antiga; o manual lista menos gatilhos do aviso que o código; o título do aviso é `h5` dentro do diálogo e o aviso do formulário não é região viva.

## 29/10/2026: F5 do painel de citações (id estável, PR automático do Gerador, canário de conteúdo) e escrita liberada

**O que o restore do canônico passou a garantir.** `quotes-canonical.json` leva o `id` de cada citação (mais `status` e `motivoOcultacao`, inclusive das não ativas). `restaurarCanonico` (`server/src/db/quotes-canonical.ts`) valida o arquivo inteiro antes de apagar (uuid sem distinguir caixa, tipo de cada campo, limites de `varchar`, data `AAAA-MM-DD`, campo desconhecido, lista vazia, ativa sem fonte) e roda `TRUNCATE` + `INSERT` numa transação: um arquivo ruim deixa a tabela como estava. Isso fecha a pendência (2) da F1 (seed sem `status`). O arquivo versionado veio de produção por `export-quotes-canonical.sql` (só leitura): 270 citações, todos os ids iguais aos da API pública; 12 `scriptoriumUrl` já corrigidos em produção por migration entraram, porque o arquivo antigo estava atrasado. A ordem é por ponto de código (função `ordenarCanonico` e `COLLATE "C"` no SQL), porque a collation do Postgres difere entre produção e o banco de teste e fazia o arquivo mudar à toa; um teste de integração garante que a consulta SQL é igual ao export.

**Limites aceitos.** O restore continua sendo para **ambiente do zero** (`TRUNCATE ... CASCADE` apaga `daily_quotes`); a recuperação de desastre de verdade é o backup do banco. O arquivo envelhece a cada mudança pela tela e precisa ser atualizado à mão pela consulta SQL (documentado; automatizar fica como pendência). O canônico não leva `scriptoriumWorkId` (sem uso no código hoje).

**Gerador: PR automático, merge manual.** `.github/workflows/sync-quotes.yml` (repositório `GeradorCSLewis`): diário às 09:00 UTC e sob demanda, roda `quotes:sync -- --check` e, só se as **citações** diferem, regera a cópia e abre ou atualiza o PR da branch `chore/sync-quotes-snapshot` com o resumo do que entra, sai e muda. Ensaiado no GitHub com três execuções reais (em dia sem PR, defasada abre PR, repetida atualiza o mesmo). Permissão do repositório: só `can_approve_pull_request_reviews`, o padrão continua somente leitura. Se o `--check` falhar por oscilação da API e as citações forem as mesmas, o fluxo sai sem commit (achado da revisão). O deploy do Gerador que o merge do fluxo disparou falhou uma vez no `next/font/google` (oscilação do Google Fonts) e passou no rerun.

**Canário: conteúdo, não só ids.** `comparar_conteudo_reserva` (`hetzner-infra/scripts/canario-api-cluster.py`) compara `text`, `source`, `theme` e `affiliateUrl` das citações que existem na API e na cópia: diferença é **aviso**; retirada continua **erro**; nova faltando continua aviso. Aviso não derruba o status: vai para o log e para o resumo do Kuma (que antes rotulava qualquer aviso de "lentidão"). Por isso o aviso da tela, para **ocultar**, manda disparar o fluxo na hora: o canário acusa erro de hora em hora até o merge.

**Revisão final (Opus, 3 repositórios):** 4 achados Important e 2 regradados para Important, todos corrigidos com teste; menores adiados: (1) o canônico não leva `scriptoriumWorkId`; (2) a ordem usa UTF-16 e não tem desempate por `id`; (3) o PR do fluxo fica aberto e obsoleto se a citação é reativada antes do merge; (4) `gh pr list` do fluxo não filtra por base (ensaio com `--ref` em paralelo a um PR real misturaria commits); (5) `indexar_por_id` do canário aceita id repetido na cópia em silêncio.

**Escrita em produção liberada.** Verificado depois do deploy: `/health` 200, rota de admin sem login 401, 270 citações com os mesmos ids do canônico, banco sem nada gravado (270 ativas, 0 eventos), canário `ok`. A recomendação ao autor para a primeira gravação é criar um **rascunho** (não aparece no site, o histórico é visível).



## 30/10/2026 — F7: usabilidade do formulário de citação (achados do primeiro uso)

O autor usou a tela pela primeira vez e achou quatro problemas, todos corrigidos só no front (a API e as regras da seção 7 do desenho não mudaram; continuam sendo a defesa de verdade): endereço da conferência sem `https://` automático, "Conferida em" sem seletor de data, autor digitado (grafia livre) e o endereço da obra no Scriptorium aceitando qualquer texto até a API recusar.

- **Autor:** lista dos existentes + "Outro autor (novo)…" (autor inédito continua aceito). Autor legado fora da lista abre como "novo" com o valor preservado.
- **Endereço da conferência:** `https://` preenchido ao focar, completado ao sair; só o esquema vira vazio.
- **Data:** seletor nativo, sem valor padrão (preencher "hoje" sozinho convidaria a registrar conferência que não aconteceu), `max` = hoje, botão "Hoje".
- **Obra no Scriptorium:** lista das obras publicadas (`GET /books`, até 100), com "(atual)" para valor fora da lista; falha de carga vira campo de texto com aviso.
- **Menor adiado:** "Tema" segue texto livre (candidato a lista dos temas existentes; a API não expõe a lista hoje).
- **Remoção dos 2 rascunhos de teste (30/10/2026):** migration `0017_remove_2_rascunhos_de_teste_do_painel` (R3: exclusão física só por migration, com justificativa). Só apaga se o `id` bater e o status ainda for `rascunho`; o histórico em `quote_events` fica. Ensaiada em cópia da produção (272 para 270, duas execuções).

## 30/10/2026 — Contraste do dourado nos cartões de categoria (pendência antiga fechada)

`Categorias.tsx` (contagem de obras, título e "Explorar Estante" do cartão), `CategoryPage.tsx` (selo com a contagem) e o botão de `FaithCollectionSection.tsx` usavam `library-dourado-texto` (#EDDFB8, pensado para fundo escuro) sobre o cartão claro: **1,2:1** no tema claro. Passaram ao par já usado na home: `dourado-leitura` (#80651A, 4,99:1) no tema claro e `dourado-texto` no escuro (`dark:`).
**Por que o teste não pegava:** o axe marca como "incompleto" (não violação) o texto sobre fundo com `background-image`/alfa, e o cartão tem textura de pergaminho; a auditoria passava com o defeito. Novo teste mede o contraste à mão (compõe o alfa dos fundos, WCAG 1.4.3) em três pontos e reprova com a regressão (1,18 a 1,26:1 antes, passa depois). Quem mexer no dourado deve rodar `e2e/a11y.spec.ts`, não confiar só no axe.

## 30/10/2026 — Menores da F2 e da F3 fechados (validação de entrada do admin)

Revisados contra o uso real da tela. **Corrigidos** (com teste): `fonteUrl` e `verificadoEm` agora aparam espaços nas pontas no servidor (a tela já aparava); `scriptoriumUrl` só aceita `https://scriptorium.narniano.com/livros/<obra>` (antes só o último segmento era conferido, então `https://qualquer.site/livros/obra` passava; os 31 endereços gravados em produção já seguem o formato); `POST`/`PATCH` com `Content-Type: application/json` e corpo vazio dão `400 validation_error` no formato do cluster (antes `FST_ERR_CTP_EMPTY_JSON_BODY`), e erro na raiz do corpo preenche `issues.corpo` (antes `issues` vazio).
**Não reproduzido:** F2 (4), `updatedAt` com ano 0001 ou 9999 dar 500: devolve 400 ou 409; nada a corrigir.
**Decisão de não construir:** lista de temas no formulário. Das 270 citações, 265 não têm tema e 5 têm `ceus` (um identificador interno do Gerador, não erro de acento); nenhum consumidor usa o campo além de repassá-lo. Uma lista não resolve problema real; o campo segue opcional e livre.

## 30/10/2026 — Menores da F3 e da F4 fechados (formulário, painel e avisos do Gerador)

**Formulário:** o Salvar desabilitado diz por quê ("Para salvar, corrija: ..." ou "Nenhuma alteração para salvar."), inclusive de campo ainda não tocado (ativa antiga sem obra); a mensagem de erro de cada campo fica numa região viva que já existe antes de aparecer (leitor de tela só anuncia mudança numa região existente); o contador só é anunciado perto do limite.
**Painel:** ocultar com `409` avisa, recarrega a lista e fecha o diálogo; Reativar fica desabilitado ("Reativando…") enquanto envia; depois de ocultar ou reativar o foco vai para o título da página (a linha que mudou sai ou troca de lugar; WCAG 2.4.3); falha ao atualizar a lista em segundo plano avisa que a tela pode estar desatualizada.
**Avisos do Gerador:** o aviso nomeia o que muda (`texto`, `obra`, `tema`, `domínio público`, `autor`) em vez de dizer sempre "o texto muda"; corrigir a grafia do autor (`C.S. Lewis` para `C. S. Lewis`) passa a avisar, porque o autor entra no link de compra; o "antes" do aviso depois de "Carregar a versão atual" é a versão carregada (o formulário devolve `antes` em `onSaved`); o aviso mora numa região viva e o título deixou de ser um `h5` solto. O manual lista os gatilhos reais.
**Ainda aberto (menor):** alternar domínio público avisa mesmo quando a obra não é da curadoria e o link de compra fica nulo (precisaria da lista da curadoria no cliente).

---

## 2026-10-30 — Encerramento de Pendência de Scan Corrompido (Os Últimos Fins do Homem) e Redefinição Profissional de "Como Contribuir"

**Entregue** em 2026-10-30.

**1. Descarte de scan corrompido de Manuel Bernardes:**
- *Contexto:* A obra *Os Últimos Fins do Homem* (Padre Manuel Bernardes) vinha sendo mantida como pendência na expectativa de um escaneamento limpo. O scan de 1768 do Internet Archive possuía apenas 14 marcadores para dezenas de capítulos e texto severamente fragmentado.
- *Decisão:* Descartada definitivamente das pendências. O Scriptorium já preserva com excelência duas grandes obras completas de Manuel Bernardes (*Nova Floresta* e *Luz e Calor para Bem Viver*). Sem fonte documental primária íntegra, a integridade do acervo prevalece sobre a quantidade.

**2. Reformulação profissional da página "Como Contribuir" (`web/src/pages/Contribuir.tsx`):**
- *Contexto:* O texto anterior oscilava entre chamadas de voluntariado informal com badges coloridos e uma autoimagem de grande comitê institucional.
- *Decisão:* Tom ajustado para neutralidade, sobriedade e rigor documental:
  - Frentes claras de colaboração: Revisão e Erratas Textuais (mailto estruturado), Indicação de Fontes Primárias Auditáveis, Engenharia Open Source (licença MIT) e Difusão Acadêmica.
  - Seção explícita de Critérios de Admissão de Obras (Marco legal da Lei 9.610/98, integralidade textual e neutralidade histórica/ecumênica).
  - Roteamento direto reativado em `web/src/App.tsx` para as páginas informativas dedicadas (`/contribuir`, `/dominio-publico`, `/ajuda`).

## 30/10/2026 — `PATCH` de ativa para rascunho: a tela não oferece (decisão do autor)

Pendência aberta desde a F2: a API aceita mudar uma citação de `ativa` para `rascunho`, que a tira do ar sem motivo e sem o evento `ocultou`. **Decidido pelo autor: a tela não terá esse botão.** Retirar é ocultar (regra R3): o motivo fica no histórico, e "publicada por engano" é um motivo válido. A API continua aceitando a transição (R1: não se remove capacidade da API sem migrar consumidores; só a tela é o caminho normal). Se um dia a transição virar problema, a correção é no servidor (recusar `ativa` para `rascunho`), não na tela.

---

## 2026-10-30 — Suma 2-2 e Apologia de Augsburgo entram no catálogo
**Decisão:** as duas obras que estavam seguradas fora do ar (docs/DECISOES.md, 2026-10-16, "Segurado fora deste deploy") foram publicadas depois de traduzidas por inteiro: `suma-teologica-segunda-parte-da-segunda-parte` (Questões 131 a 141, ~26 mil palavras, e 11 fragmentos soltos) e `apologia-da-confissao-de-augsburgo` (Partes 31 a 37, ~14 mil palavras).

**Como foi feito:** tradução por IA, com as fórmulas e termos que cada obra já tinha em português; conferido por script que o arquivo manteve o mesmo número de linhas, títulos, réguas e linhas em branco, que números e citações foram preservados e que restam 0 palavras em inglês (Suma: 0 de ~687 mil; Apologia: 0 de ~106 mil). O Rilson revisou e autorizou a publicação em 2026-10-30; por isso o seed grava `human_review_approved_at = NOW()` (a ficha mostra "Revisão humana aprovada").

**Publicação:** seed `add_suma_2_2_e_apologia_augsburgo_2026-10-30.sql` (só INSERE, idempotente; validado duas vezes em transação desfeita num Postgres de teste). Metadados seguem os das obras irmãs; licença CC BY-SA 4.0 sobre a tradução, texto-fonte em domínio público (Apologia: tradução inglesa de Bente e Dau, via Projeto Gutenberg).

**Fora desta decisão:** as 4 obras em português limpas e ainda sem cadastro (*Proslogion* em 2 arquivos, *Comentário aos Gálatas* de Lutero, *Os Últimos Fins do Homem* de Manuel Bernardes) seguem à espera de decisão do autor (licença, fonte e duplicidade com `comentario-aos-galatas-lutero`, já publicado).

## 2026-10-30 — Proslogion entra; três candidatas ficam de fora
**Publicada:** `proslogion-anselmo` (texto integral, ~9,7 mil palavras), por seed idempotente. Tradução por IA **sem revisão humana atestada** (`human_review_approved_at` NULL). O arquivo `proslogion.md` (versão curta, ~2,2 mil palavras) não entra: é abreviação da mesma obra.

**Ficam fora, com motivo:**
- `os-ultimos-fins-do-homem-pt` (Manuel Bernardes): OCR cru de edição do séc. XVIII, com o "ſ" longo lido como "f" ("depreífa", "fubftancia"). Ilegível; exige reprocessar o OCR e normalizar a ortografia antes de publicar.
- `comentario-aos-galatas-martinho-lutero`: 96% igual ao `comentario-aos-galatas-lutero`, já publicado. Duplicata.
- `proslogion`: versão curta de obra já publicada.

**Atualização (2026-10-30, mais tarde):** por decisão do autor, os cinco arquivos acima foram **removidos de `server/texts/`** (o histórico do git os guarda): `os-ultimos-fins-do-homem-pt` (só entra se houver fonte boa), `comentario-aos-galatas-martinho-lutero` e `proslogion` (duplicatas), e também `a-unidade-da-igreja-catolica-cipriano` e `da-liberdade-do-cristao-martinho-lutero` (92% e 97% iguais às publicadas). O banco não foi tocado: a linha oculta `proslogion` continua oculta, e **não deve ser apagada**, porque o seed antigo `add_proslogion_2026-09-29.sql` a reinseriria como publicada a cada deploy (`ON CONFLICT DO NOTHING`). O verificador do acervo ficou em 0 erros (289 -> 284 textos).

**Mais um removido (2026-10-30):** `confissoes-santo-agostinho` — rascunho de tradução pela metade (começa com o inglês de E. B. Pusey, depois vira português de tradução automática palavra por palavra; ~53% ainda em inglês). Não era usado por obra publicada: as *Confissões* no ar são `confissoes-garnier-1905-pt.md`, em português integral.

**Sobre controlar arquivos órfãos (tentado e descartado):** um verificador baseado em seeds marcou 12 obras *publicadas* como órfãs (Bíblia, *Auto da Alma*, *Confissões*, *O Peregrino*, Credos…), porque entraram no catálogo por scripts ou pelo painel, não por seed. A fonte da verdade do que está publicado é o **banco**. Um controle confiável precisa consultar o banco (o modo `DATABASE_URL` do `acervo:verificar` já lista "arquivo sem obra no catálogo", hoje só como INFO e fora do CI).

## 2026-10-30 — Manifesto do acervo: cada arquivo declara seu estado, e o CI barra o resto
**Problema:** arquivos em `server/texts/` (git) e linhas no banco (o que aparece) sem relação declarada, com três caminhos de publicar (seed, script, painel). Sobravam órfãos de baixa qualidade e nada impedia novos.

**Decisão (etapa 1 de 3):** `server/texts/MANIFESTO.json` com estado por arquivo (`publicada`, `oculta`, `fonte`, `rascunho`) e verificação no CI, sem banco, em `acervo:verificar` (lógica pura em `server/src/lib/acervo-manifesto.ts`, com testes). Estado inicial gerado a partir do catálogo no ar: 258 publicadas, 23 fonte, 2 ocultas (`breve-catecismo-westminster`, `tratado-sobre-as-reliquias-calvino`). Provado: arquivo sem entrada derruba o CI.

**Etapas seguintes (não feitas):** (2) rotina na VPS comparando manifesto × banco, somente leitura, com aviso no Uptime Kuma; (3) comando único `acervo:publicar` que gera o seed e atualiza o manifesto. A 2 mexe em infraestrutura e pede revisão do autor.

