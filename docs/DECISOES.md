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
