# Painel de citações e regras de conteúdo do cluster: desenho

Data: 2026-10-18. Estado: **aprovado pelo autor em 18/10/2026; F1 em produção desde 19/10/2026; F2 (API de administração) feita em 22/10/2026** (ver `docs/superpowers/plans/`).
Autor da decisão: Rilson. Redação: Claude, a partir da conversa de 17 e 18/10/2026.
Relacionados: `hetzner-infra/CONTRATOS-ENTRE-PROJETOS.md` (seções 2.7 e 9), `docs/GERENCIAR-ACERVO.md`,
`docs/PROTOCOLO-VERIFICACAO-DE-CITACOES.md`, `docs/REGISTRO-VERIFICACAO-CITACOES-LEWIS.md`, `docs/DECISOES.md` (ADR 001),
`hetzner-infra/ROADMAP-CLUSTER.md`, item 20 do `ROADMAP.md`.

## 1. Intenção e porquê

Hoje, mexer em citações exige um desenvolvedor: cada retirada ou correção é uma migration SQL, e foi assim que as 11
citações saíram em 18/10. Isso é seguro e auditável, mas tem três custos que o autor quer eliminar:

1. **Só uma pessoa com o repositório aberto consegue fazer.** Para um acervo que vai crescer (e que pode ter voluntários),
   o caminho normal precisa ser uma tela.
2. **A verificação de fonte vive em documentos, não no sistema.** No banco, as 270 citações têm `verificado_em` e `fonte_url`
   vazios, embora 145 de Lewis tenham passado por um registro cuidadoso. O protocolo (nenhuma citação sem fonte) é uma regra de
   papel, não do produto.
3. **Acrescentar conteúdo tem de ser seguro por construção.** Em 17/10 a citação do dia ficou presa na mesma frase; em 18/10
   achamos citação fabricada, obra de artista excluído por direitos, cópia do Gerador que apodrece. Todos os incidentes têm a
   mesma raiz: o conteúdo muda e os consumidores (Lecionário, Gerador, Narniano, o próprio site) só descobrem em silêncio.

O objetivo é um painel que torne o caminho certo o caminho fácil, e um conjunto de **regras de conteúdo** (seção 4) que valha
para citações, pinturas e passagens, para que conteúdo novo nunca gere conflito nas APIs.

## 2. Metas, não-metas, anti-metas

**Metas**
- Cadastrar, editar, ocultar e reativar citação por uma tela, com a regra "só fica ativa com fonte" aplicada pelo sistema.
- Nenhuma mudança de contrato para os consumidores: a API pública continua igual (mesmos campos, mesma OpenAPI).
- Histórico de cada mudança (quem, quando, o quê, por quê), para "não voltar aos mesmos lugares".
- O Gerador C. S. Lewis, que se alimenta do Scriptorium, continua correto depois de qualquer mudança no painel, com a cópia
  embutida mantida em dia de forma detectável e, na fase final, automática.
- Documentação completa: manual de uso do painel, regras, riscos, como retomar.

**Não-metas (agora)**
- Painel único para todo o ecossistema (decisão de 17/10: não).
- Painel para pinturas e passagens: elas têm fluxos próprios (vault + reseed; tabelas RCL). Aqui só se registram as **regras**
  e as lacunas (seção 9), sem construir telas.
- Acesso de terceiros, chaves de API, voluntários com perfis. Um administrador só (o autor).
- Excluir citação pelo painel (ver 4.3).

**Anti-metas (seria falha mesmo que funcione)**
- Qualquer mudança que faça uma citação, pintura ou passagem **já mostrada** mudar sem decisão explícita.
- Uma citação ativa sem fonte.
- Um consumidor que quebre ou mostre conteúdo ocultado por causa de cópia velha.
- Dois donos para o mesmo dado (painel e seed brigando, como aconteceu com as obras até 16/10).
- Complexidade que um único mantenedor não consiga operar.

## 3. Estado atual verificado (produção, 18/10/2026)

- `quotes`: **270** linhas, 15 autores (Lewis 145 = 54%). **0 sem `source`**. **270 sem `verificado_em` e 270 sem `fonte_url`**.
  31 com `scriptorium_url`; 0 com `scriptorium_work_id`.
- `daily_quotes`: 61 linhas (escolha do dia gravada, ±30 dias, `ON DELETE CASCADE` na citação).
- A listagem pública (`listQuotes`), o sorteio (`getRandomQuote`) e o dia (`getDailyQuote`) leem **toda** a tabela, sem filtro.
- Painel de admin existente: Autores, Obras, Categorias, Configurações, painel inicial (`web/src/pages/admin`, padrão
  `AdminAuthors`, rotas em `server/src/routes/admin.ts` sob `requireAdmin`). **Não há citações.**
- `scripts/seed-quotes.ts` faz `TRUNCATE quotes ... CASCADE` e reinsere do `quotes-canonical.json` **sem `id`**: um reseed
  troca todos os ids e apaga `daily_quotes`. Hoje só serve para restaurar do zero.
- Gerador C. S. Lewis: lista ao vivo `GET /quotes?author=C. S. Lewis`, mantém a última lista boa em memória (frescor de até
  10 min) e tem a cópia `src/data/lewis-quotes.snapshot.json` (145 citações) para o caso de subir com o Scriptorium fora. O
  canário acusa **erro** se a cópia tiver citação já retirada e **aviso** se faltar citação nova.
- Consumidores leem só `id`, `author`, `text`, `source`, `dominioPublico`, `scriptoriumUrl`, `theme`, `affiliateUrl`.

## 4. Regras de conteúdo do cluster (valem para citações, pinturas e passagens)

Estas oito regras são o coração do desenho. O painel é só a primeira implementação delas.

| # | Regra | Por quê |
|---|---|---|
| R1 | **Mudança é aditiva.** Campo novo pode; remover ou renomear só depois de migrar todos os consumidores. | Contrato (CONTRATOS seção 3). |
| R2 | **`id` é estável e nunca é reutilizado.** Editar não troca o id; recriar uma citação não herda o id antigo. | O Gerador, o canário, `daily_quotes` e as cópias se ligam por id. |
| R3 | **Retirar é ocultar, não apagar.** A linha continua, com status e motivo. Exclusão física só por migration, com justificativa (fraude, direitos). | Preserva histórico e evita ressuscitar item retirado num restore. |
| R4 | **A escolha do dia é gravada e sai da gravação quando o item deixa de ser elegível.** Item oculto nunca aparece, mesmo em dia já gravado: o dia escolhe outro e a nova escolha é gravada. | Já existe para pinturas (direitos); falta nas citações. |
| R5 | **Elegibilidade num lugar só.** Uma condição (`status = 'ativa'`) alimenta lista, sorteio e dia. | Evita três filtros divergentes. |
| R6 | **Ativa exige fonte.** Para virar ativa pelo painel: `source` preenchido; para itens novos também `fonte_url` e `verificado_em`. Itens antigos (270) ficam ativos como estão e aparecem numa fila de verificação. | Protocolo de 26/09, aplicado pelo sistema. |
| R7 | **Toda cópia derivada é detectável e, quando possível, automática.** Gerador (cópia embutida), arquivo de leituras do Bíblia na Arte, `quotes-canonical.json`. | Cópia que apodrece serve conteúdo retirado. |
| R8 | **Toda mudança deixa rastro.** Quem, quando, antes, depois, motivo. | Auditoria e "não voltar ao mesmo lugar". |

### 4.1 Por que nada disso quebra os consumidores
A API pública não ganha campos nem muda de formato. O que muda é **quais linhas ela devolve** (só as ativas) e que o dia
gravado de um item oculto é substituído. A OpenAPI não muda, então os recortes `contract/` do Lecionário e do Scriptorium web
ficam idênticos (`contract:check` continua verde) e o canário continua válido.

### 4.2 Edição de texto de uma citação ativa
O texto corrigido **propaga** para os dias já gravados (mesmo `id`). Correção de erro de digitação tem de aparecer; o histórico
guarda o texto anterior. (Chamada minha, seção 12.)

### 4.3 Sem botão de excluir
A tela só oculta. Excluir de verdade (por exemplo, citação fabricada) continua sendo migration, que deve citar o registro de
verificação, como as de 18/10. Isso mantém R3 e impede um clique ruim de apagar uma linha que `daily_quotes` referencia.

## 5. Modelo de dados

Uma migration aditiva (drizzle `--custom`, ensaiada em cópia da produção com `scripts/ensaiar-migrate.sh`):

- `quotes.status` `varchar(12) NOT NULL DEFAULT 'ativa'` com `CHECK (status IN ('rascunho','ativa','oculta'))`. As 270 linhas
  existentes ficam `ativa` (hoje todas são públicas).
- `quotes.motivo_ocultacao` `text NULL`. Obrigatório (na aplicação) ao ocultar.
- `quotes.fonte_url` e `verificado_em` já existem.
- `CHECK (status <> 'ativa' OR coalesce(btrim(source), '') <> '')`: hoje 0 linhas violam (verificado), então não precisa
  `NOT VALID`.
- Nova tabela **append-only** `quote_events`: `id`, `quote_id uuid` (sem `ON DELETE CASCADE`, para o histórico sobreviver à
  exclusão por migration), `acao` (`criou|editou|ocultou|reativou|verificou`), `antes jsonb`, `depois jsonb`, `motivo text`,
  `admin_id uuid`, `em timestamptz`.
- Índice parcial `idx_quotes_ativas` sobre `quotes(author) WHERE status = 'ativa'` (opcional; 270 linhas não precisam, mas
  documenta a intenção).

**Verificação das 270 existentes.** Não se preenche `verificado_em` em massa (seria inventar). O painel mostra a fila "sem
verificação registrada: 270" e permite registrar, citação a citação, `fonte_url` e data, consultando o
`REGISTRO-VERIFICACAO-CITACOES-LEWIS.md`. Não há prazo; a regra R6 vale para o que entra daqui para a frente.

## 6. Comportamento público (sem mudar o contrato)

- `listQuotes`, `getRandomQuote` e `getDailyQuote` passam a usar **uma** função `quotesAtivas()` (R5).
- `lerEscolhaGravada`: junta com `quotes` e exige `status = 'ativa'`. Se a gravada está oculta, ignora, escolhe de novo entre as
  ativas (semente por data) e **substitui** a gravação (`ON CONFLICT (date_key) DO UPDATE`), dentro da janela de ±30 dias. A
  escolha continua segura contra consultas simultâneas (releitura depois de gravar).
- Ocultar uma citação **não** chama o Gerador nem o Lecionário: eles leem a API.
- Cache dos consumidores: Narniano até 6 h (documentado), Gerador até 10 min. O painel avisa isso ao ocultar.

### 6.1 Onde a tabela `quotes` é lida hoje (verificado em 18/10/2026)
Leitura **pública**, tudo em `server/src/db/quotes.ts`, e só aí passa a valer o filtro: `listQuotes` (linha 74), `lerEscolhaGravada`
(join com `daily_quotes`, linha 127) e `getRandomQuote` (linha 138). Outros pontos, cada um com a decisão:
- `scripts/export-quotes-canonical.ts`: exporta **todas** as linhas e passa a levar `id`, `status` e `motivoOcultacao` (seção 10).
- `scripts/verificar-acervo.ts` (autores de citação, contagem "sem verificação", links `scriptorium_url`): passa a considerar só as
  **ativas** nos avisos de link e autor (item oculto com link quebrado não é problema), e a contar `sem verificação` entre as ativas.
- `scripts/repair-quote-sources.ts`: script antigo que faz `DELETE FROM quotes`. Fere R3; o construtor o marca como histórico
  (não deve rodar) ou o converte para ocultar. Decisão dele, registrada em `docs/DECISOES.md`.
- Migrations de retirada (0013, 0015) continuam válidas como exclusão física; ficam documentadas como o caminho excepcional.

## 7. API de administração

Sob `requireAdmin`, no mesmo plugin de `admin.ts` ou num arquivo `admin-quotes.ts` (decisão do construtor):

- `GET /api/v1/admin/quotes?status=&author=&q=&page=` lista com contadores por status e por autor.
- `POST /api/v1/admin/quotes` cria (`rascunho` ou `ativa`; `ativa` só com a regra R6).
- `PATCH /api/v1/admin/quotes/:id` edita; exige `updatedAt` na requisição e devolve `409` se mudou (concorrência otimista).
- `POST /api/v1/admin/quotes/:id/ocultar` com `motivo`; `POST /api/v1/admin/quotes/:id/reativar`.
- `GET /api/v1/admin/quotes/:id/eventos` histórico.
- **Sem `DELETE`.**
- Validação (Zod), no mesmo formato de erro `400` do cluster (`validation_error`, `issues`, `details`):
  - `author` normalizado pela chave de `lib/quote-authors.ts`; se já existe outra grafia do mesmo autor, **recusa** e sugere a
    grafia existente (hoje o verificador só avisa);
  - `text` não vazio, limite de tamanho, **duplicata** pela chave do texto normalizado (maiúsculas, espaços e pontuação ignorados);
  - `scriptorium_url` precisa apontar para obra publicada (a regra de `verificar-acervo.ts`);
  - `dominio_publico` e `source` coerentes com `isCuratedSource` (aviso, não bloqueio).
- Toda escrita grava um `quote_events` na **mesma transação**.

## 8. A tela `AdminQuotes`

No padrão de `AdminAuthors` (rota `/admin/citacoes`, item no menu do admin). Conteúdo:

- Cabeçalho com contadores: total, ativas, ocultas, rascunhos, **sem verificação**, e a concentração por autor ("Lewis 145,
  54%"), que alimenta a decisão de diversidade já registrada no item 20.
- Lista com filtro por status, autor e busca; selo "sem verificação" e "fixada em N dias".
- Formulário com validação ao vivo (as mesmas regras da seção 7) e a lista de autores existentes para evitar grafia nova.
- Ocultar abre uma confirmação com o **impacto**: dias em que a citação está fixada (consulta a `daily_quotes`), o aviso de cache
  dos consumidores e, se o autor for Lewis, o passo do Gerador (seção 10).
- Gaveta de histórico por citação.
- Acessibilidade: entra na auditoria axe (`e2e/a11y.spec.ts`), com o dourado novo do tema claro; foco visível testado.

## 9. Pinturas e passagens: as mesmas regras, sem tela nova

Estado verificado em CONTRATOS 9.2 e 9.3. Lacunas contra as regras R1-R8, **para fases futuras, não para este projeto**:

| Regra | Pinturas (Bíblia na Arte) | Passagens (Lecionário) |
|---|---|---|
| R3 retirar = ocultar | Já é assim: `active`/direitos, `EXCLUDED_ARTISTS`. | Tabelas RCL são dados do próprio Lecionário. |
| R4 escolha do dia gravada e substituível | Grava **só hoje** (Scriptorium grava ±30 dias): a prévia de amanhã é instável. **Lacuna:** gravar ±30 dias. Substituição por direitos já existe. | Determinístico pelo calendário; sem gravação. |
| R7 cópias derivadas | `daily-readings-refs.json` copiado do Lecionário à mão; o canário compara. | É a fonte. |
| Fuso | `artworks/daily` não devolve a data, então o canário não verifica o fuso. **Lacuna:** devolver `date` (mudança aditiva). | Vetores de teste do "hoje" nas 4 implementações (CONTRATOS 8). |
| "Novos trechos" (comentários clássicos) | n/a | A rota existe e nenhum consumidor a usa; o acervo só tem Lutero em Gálatas. Antes de consumir, aplicar R1-R8. |

Cada lacuna vira um item do `ROADMAP-CLUSTER.md` no fim deste projeto.

## 10. O Gerador C. S. Lewis

O Gerador depende de duas coisas do Scriptorium: a **lista ao vivo** e a **cópia embutida**.

- **Lista ao vivo:** depois da fase 1 ela só traz citações ativas. Ocultar no painel faz a citação sumir do Gerador em até 10 min,
  sem tocar no Gerador. Nenhuma mudança de contrato.
- **Cópia embutida (a reserva):** é o único ponto que apodrece. Depois de ocultar, editar ou criar uma citação de Lewis, a cópia fica
  diferente da API. O canário já trata: retirada ainda na cópia = **erro**, nova faltando = **aviso**. Para não depender de
  alguém lembrar:
  1. **Fase 4 (manual guiado):** a confirmação de ocultar/editar citação de Lewis lista o passo `npm run quotes:sync` e o link
     do diff esperado.
  2. **Fase 5 (automático):** um fluxo agendado no repositório do Gerador roda `quotes:sync`, e **abre um PR** se houver
     diferença. O merge continua manual (chamada minha, seção 12). Resolve o item R6(b) do roadmap.
- **`id` estável (R2):** o Gerador identifica a citação por `id`. Como ocultar não apaga, o `id` fica válido para sempre.
- **Reseed e `id`:** o `quotes-canonical.json` passa a levar `id`, `status` e `motivoOcultacao`, e o seed passa a preservá-los (hoje
  troca todos os ids e apaga `daily_quotes`). O export passa a incluir as ocultas, para um restore **nunca ressuscitar** o que foi retirado.

## 11. Fases, critérios e como cada uma é verificada

Cada fase é um PR pequeno, com testes, ensaio em cópia da produção quando toca o banco, verificação em produção depois do deploy,
e a documentação atualizada **no mesmo PR**. Regra do autor: nada de retrabalho; registrar o que se achar.

| Fase | Entrega | Critério de pronto |
|---|---|---|
| **F0** | Este documento aprovado; item 20 do roadmap aponta para ele. | Autor aprova. |
| **F1** | Migration (`status`, `motivo_ocultacao`, `quote_events`); `quotesAtivas()` em lista, sorteio e dia; substituição da gravação de item oculto. | `ensaiar-migrate.sh` com 270 linhas idênticas; testes de integração (item oculto some de lista, sorteio e dia; dia gravado é substituído; **mutação**: tirar o filtro quebra o teste); **OpenAPI inalterada** (diff vazio; `contract:check` verde nos 3 consumidores); canário `ok` em produção. |
| **F2** | API de admin (seção 7) + testes (auth, validação, 409, evento na mesma transação, sem `DELETE`). | Integração + teste de que cada rota rejeita sem login; contrato do `400` igual ao do cluster. |
| **F3** | Tela `AdminQuotes` + E2E (criar, ocultar com impacto, reativar, histórico) + auditoria axe. | Playwright verde, axe sem violação, foco visível. |
| **F4** | `GERENCIAR-ACERVO.md` reescrito (painel é o caminho normal; migration só para exclusão física), manual da tela, aviso do Gerador na confirmação. | Revisão do autor. |
| **F5** | Canônico com `id`/`status`; seed preserva `id`; export inclui ocultas; fluxo agendado do Gerador abre PR de `quotes:sync`; canário confere que a reserva do Gerador está em dia. | Ida e volta export → seed idêntica (teste); PR do Gerador gerado de verdade num caso real. |
| **F6** | Lacunas da seção 9 viram itens e, um a um, PRs (Bíblia na Arte grava ±30 dias, `date` em `artworks/daily`, vetores de "hoje"). | Cada item com seu critério. |

Entre as fases F1 e F2 nada muda visível para o usuário final; é seguro parar ali.

## 12. Riscos, chamadas minhas e o que fica para o construtor

**Riscos e mitigação**
- *Painel e migration brigando.* Mitigação: para citações o **painel passa a ser o dono**; migrations só para exclusão física. A
  regra "seed cria, migration muda, painel manda" (ADR de 16/10) é estendida e escrita em `GERENCIAR-ACERVO.md`.
- *Ocultar derruba um dia gravado.* É o comportamento desejado (R4); o teste de mutação o protege.
- *Duas pessoas editando.* Concorrência otimista (`updatedAt`, `409`).
- *Cache dos consumidores.* Documentado (Narniano 6 h, Gerador 10 min); o painel avisa.
- *Perda do histórico numa exclusão por migration.* `quote_events.quote_id` sem FK em cascata.
- *Aumento de superfície de ataque.* Só administrador, mesmo `requireAdmin`; sem `DELETE`; texto puro, limites de tamanho.

**Chamadas minhas (para o autor conferir; mude qualquer uma e eu ajusto o desenho)**
1. Ocultar exige **motivo** em texto.
2. Texto editado **propaga** para os dias já gravados (4.2).
3. **Sem botão de excluir**; exclusão física só por migration (4.3).
4. Itens antigos (270) **continuam ativos** sem verificação; a fila de verificação é gradual (5).
5. O PR do Gerador é **automático com merge manual** (10).
6. Um único administrador; sem perfis.
7. Grafia nova de autor é **recusada** (não só avisada), com sugestão da existente.

**Fica para o construtor:** nomes de arquivos e de rotas internas; se `admin-quotes.ts` é arquivo próprio; o desenho visual da tela
dentro do padrão existente; o limite de tamanho do texto; a forma exata do aviso do Gerador.

## 13. Como retomar se esta sessão se perder
1. Ler este documento e `hetzner-infra/ROADMAP-CLUSTER.md`.
2. Ver em que fase está olhando os PRs mergeados (`gh pr list --state merged`) e o `ROADMAP.md`, item 20.
3. Antes de mexer no banco: `scripts/ensaiar-migrate.sh` e backup da tabela (`quotes` e `daily_quotes`).
4. Depois de cada deploy: canário (`python3 ~/hetzner-infra/scripts/canario-api-cluster.py`), `contract:check`, e olhar a `main` do CI.
