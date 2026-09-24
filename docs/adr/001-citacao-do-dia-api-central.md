# 001 — Citação do dia: API central no Scriptorium, não serviço novo

**Data:** 2026-09-22

## Contexto
O objetivo é ter "Citação do dia" e "Pintura do dia" em três lugares —
Narniano.com (WordPress), Scriptorium Divinum e Lecionário — mostrando o
mesmo conteúdo no mesmo dia, dentro do ecossistema do cluster A
Biblioteca (Narniano, Bíblia na Arte, Scriptorium, Lecionário, Gerador
C.S. Lewis).

"Pintura do dia" já está resolvida: `GET /artworks/daily?date=` na API
do Bíblia na Arte (`api-biblianaarte.narniano.com`), Postgres, seleção
determinística por data, já consumida pelo Lecionário (web + mobile).

"Citação do dia" não tem fonte única — tem duas, divergentes:
- `lecionario-web/src/data/lewis-quotes.json`: 217 citações (175 de C.
  S. Lewis + 42 de outros autores de domínio público — Agostinho, Kempis,
  Pascal, Bunyan, Calvino, Tomás de Aquino, Lutero, Padre Antônio
  Vieira, Anselmo), com seed calculado no cliente (`yyyyMMdd % total`) e
  duplicado manualmente entre o app web e o mobile.
- `GeradorCSLewis/src/lib/quotes.ts`: 166 citações, só de Lewis, curadas
  separadamente (com tags temáticas próprias, ex. `theme: "ceus"`), sem
  nenhuma ligação com a lista do Lecionário.

Ou seja, o problema não é só "3 sites duplicando um valor" — já existem
dois acervos de citações mantidos à mão e divergindo sozinhos. Resolver
só a sincronia entre os 3 sites sem resolver a fonte deixaria o Gerador
de fora como um 4º lugar com seu próprio drift.

## Decisão
Criar uma tabela `quotes` única no Postgres compartilhado do VPS,
expondo `GET /quotes/daily?date=` e `GET /quotes/random` como novas
rotas na API que já existe do Scriptorium Divinum (Fastify + Drizzle) —
não um serviço novo. Critérios pra essa escolha, entre as opções
avaliadas:

- **Serviço novo dedicado a citações**: descartado — mais um container,
  role de banco, entrada de proxy e backup pra ~380 linhas de texto não
  compensa o overhead de operar mais um serviço.
- **Estender a API do Bíblia na Arte**: descartado — foge do escopo
  declarado do projeto ("conexão entre Escritura e manifestação
  artística"); citação de Kempis ou Calvino não é arte.
- **Estender a API do Scriptorium Divinum** ✅: o domínio bate — é o
  mesmo universo de autores que o Scriptorium já cura como obras de
  domínio público. `quotes` fica como tabela separada de `obras`, com
  campo `dominio_publico` próprio — uma citação curta com atribuição não
  é "hospedar a obra completa", então não conflita com o critério do
  catálogo principal ("só domínio público verificável").

Campos da tabela incluem `author`, `text`, `source`, `dominio_publico`
(bool), e `scriptorium_work_id` (FK opcional pra obra já digitalizada no
Scriptorium, quando existir).

**Escopo por consumidor:**
- **Lecionário** (web + mobile): substitui `lewis-quotes.ts` local por
  fetch em `/quotes/daily`, no mesmo padrão que `artwork-fetcher.ts` já
  usa pra `/artworks/daily`.
- **Narniano** (WordPress): novo shortcode/widget chamando
  `/quotes/daily` (Scriptorium) e `/artworks/daily` (Bíblia na Arte),
  cache em transient (TTL 24h).
- **Scriptorium**: mostra os dois widgets também na própria home,
  chamando sua própria rota local + a externa do Bíblia na Arte.
- **Gerador C.S. Lewis**: continua mostrando **só** citações de Lewis —
  passa a consumir `/quotes/daily` e `/quotes/random` filtrados por
  `author=Lewis`, em vez do `quotes.ts` local. Não vira gerador
  multi-autor; o filtro é por design, não uma limitação temporária.
- Citações com `dominio_publico=false` (hoje, só as de Lewis) mantêm o
  link de afiliado Amazon (`buildAmazonUrl`, já existente no Lecionário)
  como CTA — comportamento centralizado, não reimplementado por
  consumidor.

**Sinergia futura:** citação de autor com obra completa já digitalizada
no Scriptorium (`scriptorium_work_id` preenchido) pode linkar direto pro
leitor (`/ler/:id`) — tráfego real entre os projetos, não só conteúdo
espelhado. Citações de Lewis, sem obra no Scriptorium, apontam pra
Amazon em vez disso.

## Consequências
- Positivo: uma correção de citação (ex. a auditoria de citações de C.
  S. Lewis feita em 22/09) passa a valer pros 4 lugares de uma vez, não
  só pro Lecionário.
- Positivo: reaproveita infra que já roda (Fastify + Postgres do
  Scriptorium), sem novo serviço, novo backup ou nova entrada de proxy.
- Custo: Lecionário (web + mobile) e Narniano passam a depender de rede
  pra mostrar a citação, em vez do JSON embutido no build — precisa de
  cache com fallback (ISR no Next.js, transient no WordPress) pra não
  quebrar se a API cair.
- Trabalho pontual necessário antes de qualquer implementação: dedupe
  das duas listas atuais (217 do Lecionário + 166 do Gerador) num set
  canônico, decidindo o que é duplicata e o que é citação distinta.
- A ideia original considerava o SSD do VPS "em fim de vida" como
  argumento contra novo serviço — isso estava errado (é o SSD do
  notebook de dev, não do VPS) e os incidentes recorrentes de token do
  Instagram não têm relação com capacidade de infra. A decisão de não
  criar serviço novo se sustenta pelo argumento de escopo/domínio
  (Scriptorium é o dono temático do conteúdo), não por limitação de
  hardware do VPS.

## Próximos passos
1. Dedupe das duas listas de citações (217 + 166) num set canônico.
2. Migration da tabela `quotes` + rotas `/quotes/daily` e `/quotes/random`
   no `server/` do Scriptorium.
3. Trocar `lewis-quotes.ts` do Lecionário pra buscar da API.
4. Trocar `quotes.ts` do Gerador pra buscar da API filtrada por Lewis.
5. Widget/shortcode no Narniano (WordPress) e componente no Scriptorium,
   ambos com cache de 24h.
