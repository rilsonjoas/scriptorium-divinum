# Gerenciar o acervo

Manual de quem adiciona, oculta, remove ou corrige obras do Scriptorium Divinum.
Escrito em 2026-10-16, depois de uma revisão que achou, entre outras coisas, que
ocultar uma obra era desfeito no deploy seguinte. Se algo aqui divergir do
código, vale o código; corrija este arquivo.

## A regra

Três donos, cada um com o seu pedaço:

| Dono | O que faz | Onde |
|---|---|---|
| **Seed** | **Cria** obras e autores novos. Nunca altera o que já existe (`ON CONFLICT (slug) DO NOTHING`). | `server/src/db/seeds/add_*.sql` |
| **Migration** | **Muda** o que já existe, uma única vez (curadoria, ocultação em massa, taxonomia). | `server/src/db/migrations/*.sql` |
| **Painel de admin** | **Gerencia o dia a dia**: publicar, ocultar, destaque, descrição, categorias, capa, atribuição, excluir. Para **citações**, o painel é o dono: criar, editar, ocultar e reativar (manual: `docs/MANUAL-PAINEL-CITACOES.md`). | `/admin/livros`, `/admin/autores`, `/admin/categorias`, `/admin/citacoes` |

O que nunca vale: editar uma obra publicada reescrevendo o seed dela. Como o seed
só cria, a edição seria ignorada.

**Por que isto existe.** Até 2026-10-16 os seeds faziam `DO UPDATE` e reaplicavam
`published`, `title`, `description`, `attribution_text`, `categories` e outros campos
a cada deploy. Ocultar uma obra no painel, ou corrigir uma descrição, desaparecia no
deploy seguinte. A data de aprovação humana da Imitação de Cristo era reescrita para
"agora" a cada deploy. Tudo isso foi corrigido (ver `docs/DECISOES.md`, entrada "Revisão do
catálogo antes do deploy").

Há **uma exceção** no diretório de seeds: `zzzz_repontar_citacoes_2026-10-16.sql`.
Ela só repara link de citação que aponta para obra oculta ou inexistente; não
sobrescreve decisão humana.

## Estados de uma obra

| Estado | Como se reconhece | O que o público vê |
|---|---|---|
| **Publicada** | `published = true` e o arquivo de texto existe | Aparece no catálogo, na busca, na página do autor, no sitemap e no leitor |
| **Oculta** | `published = false` | `404` no detalhe e no texto; some da lista, da busca e do sitemap; o autor some da lista se só tiver obras ocultas; o botão "ver outra edição" de quem aponta para ela some |
| **Fora do catálogo** | arquivo em `server/texts/` sem linha no banco | Nada. É o estado de obra aguardando tradução, revisão ou decisão |
| **Removida** | sem arquivo e sem linha | Nada |

Hoje estão ocultas, por decisão do autor (2026-10-16): todas as edições em inglês e em
latim (só português no ar), o tratado das Relíquias de Calvino (arquivo corrompido), o
Proslogion (revisão pendente) e o Breve Catecismo de Westminster (texto majoritariamente
em inglês).

## Tarefas

### Ocultar uma obra, ou voltar a publicá-la

1. Entre em `/admin/livros`, abra a obra e use a chave **Publicada**.
2. Vale na hora e **persiste entre deploys**.
3. Antes de ocultar, rode `pnpm --filter server acervo:verificar` com o banco: ele avisa
   se alguma citação linka para a obra (o link passaria a dar 404).

Para reexibir as edições em inglês, repita por obra. O vínculo com a edição em
português volta sozinho quando as duas estiverem publicadas.

### Adicionar uma obra

1. **Arquivo.** `server/texts/<slug>.md`. O nome do arquivo é o slug: minúsculas, sem
   acento, com hífens. O corpo precisa ter **títulos** (`#`, `##`) por capítulo ou
   homilia, senão o sumário do leitor fica vazio. Comece com o bloco de frontmatter
   (modelo em `server/texts/README.md`).
2. **Conferir o arquivo.** `pnpm --filter server acervo:verificar`. Corrija o que ele
   marcar como ERRO sobre o seu arquivo.
3. **Criar a linha no banco**, de um destes jeitos:
   - um seed novo `server/src/db/seeds/add_<slug>_<AAAA-MM-DD>.sql` (modelo abaixo), que
     passa pelo ensaio e pelo deploy junto com o texto; ou
   - o pipeline de importação por API (`scripts/import_pipeline.py`, que cria a obra pela
     API de admin a partir de um catálogo curado; use `DRY_RUN=1` primeiro); ou
   - o painel (`Adicionar livro`). Em qualquer caso o arquivo de texto ainda precisa ir
     para o repositório e para o deploy.
4. **Escolher o autor.** Use um autor que já existe (confira em `/admin/autores`; já há
   duplicatas em produção, como `agostinho-de-hipona` e `santo-agostinho`, e a obra
   deve ir para o que tem mais obras). Só crie autor novo com **nome limpo**: o nome da
   pessoa, sem título de obra, sem `#`, sem datas entre parênteses.
5. **Ensaiar e publicar**: ver "Ensaio antes do deploy" e "Deploy".

Modelo de seed para uma tradução por IA:

```sql
BEGIN;

INSERT INTO authors (slug, name)
VALUES ('<slug-do-autor>', '<Nome do autor>')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO books (
  title, author_id, language, description, slug, original_title,
  publication_year_translation, translator, original_languages,
  categories, tags, online_read_path,
  featured, published, translation_is_ai, license_type, attribution_text
)
VALUES (
  '<Título em português>',
  (SELECT id FROM authors WHERE slug = '<slug-do-autor>'),
  'Português',
  '<Uma frase factual: o que é a obra. Sem superlativos.>',
  '<slug>',
  '<Título original>',
  2026,
  'Scriptorium Divinum (tradução por IA)',
  ARRAY['Latim'],
  ARRAY['<categoria canônica, de /admin/categorias>'],
  ARRAY['<tag>'],
  '/texts/<slug>.md',
  false, true, true,
  'cc-by-sa-4.0',
  'Tradução gerada por IA a partir da edição <EDIÇÃO-FONTE NOMEADA: título, tradutor, ano>, em domínio público porque <motivo>. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.'
)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
```

Pontos do modelo que contam:

- `language` é o idioma **do texto do arquivo**, não o do original. (Um seed anterior
  trocou isso em 9 obras.)
- `original_languages` só com o que o arquivo diz. Na dúvida, `NULL`: campo vazio é melhor
  que campo errado.
- `attribution_text` deve **nomear a edição-fonte**. É o campo que protege o projeto se a
  pergunta for "traduzido de quê?". A frase genérica "a partir de obra em domínio público" é
  o **marcador de pendência**: o verificador lista como INFO as obras que a usam, e
  `docs/PROVENIENCIA-ACERVO.md` registra a faixa de risco de cada uma.
- Datas de nascimento e morte de autor só entram com fonte.

### Remover uma obra

1. **Oculte primeiro** (acima) e rode `acervo:verificar` para ver o que dependia dela.
2. Para tirar de vez: `Excluir` no painel e `git rm server/texts/<arquivo>.md`.
3. Cuidados: citações que linkam para ela quebram (o verificador lista); comentários
   bíblicos dessa obra são apagados em cascata. O vínculo de edição de outras obras que
   apontavam para ela é zerado sozinho (a chave estrangeira é `ON DELETE SET NULL`).

### Substituir o texto de uma obra publicada

Edite o arquivo **mantendo o slug** (URL e links de citação dependem dele). Rode
`acervo:verificar`, ensaie e faça o deploy. O leitor guarda o ponto de leitura por
capítulo e posição; se você mudou a divisão em capítulos, quem estava no meio da leitura
pode voltar a um ponto diferente (comportamento não verificado a fundo).

### Corrigir metadados (título, descrição, categoria, capa, atribuição)

Pelo painel. Não em seed: seed não altera obra existente.

### Mudar muitas obras de uma vez

Uma migration de dados, única:

```bash
cd server
pnpm exec drizzle-kit generate --custom --name <o_que_muda>
# edite src/db/migrations/<N>_<o_que_muda>.sql com os UPDATE
```

Exemplos reais: `0009_dados_acervo_2026_10_16.sql` e `0010_taxonomia_canonica.sql`.
Sempre ensaie antes.

## Ferramentas que já existem em `scripts/`

| Ferramenta | Para quê |
|---|---|
| `pnpm --filter server acervo:verificar` | Saúde do acervo (arquivos × banco). Portão antes do deploy |
| `scripts/ensaiar-migrate.sh` | Ensaio do `migrate` numa cópia da produção |
| `scripts/import_pipeline.py` | Importa obras para o catálogo pela API de admin, a partir de `curated_catalog.json` (`DRY_RUN=1` só baixa e grava os `.md`) |
| `scripts/archive_ocr_to_md.py` | Converte o OCR de um livro do Internet Archive em markdown com bloco de proveniência, conferindo as seções com o índice impresso |
| `scripts/chapterize_texts.py` | Divide em capítulos os textos corridos (regra por arquivo; `--check` só relata). **É a ferramenta para os textos longos sem sumário.** Antes de rodar em texto já dividido, use `--check` e revise o diff |
| `scripts/remove_book.py` | Remove uma obra pela API de admin, por id |

Os **74 arquivos `.sql` dentro de `scripts/` são históricos** (de quando os SQL eram
aplicados à mão). 55 deles têm `DO UPDATE` e diferem dos seeds atuais: **não rode nenhum**,
porque desfaria o que o painel gerencia. A única fonte dos seeds é
`server/src/db/seeds/`.

## Qualidade antes de publicar

`pnpm --filter server acervo:verificar` cruza os arquivos com o banco. Níveis:

| Nível | Exemplos | Efeito |
|---|---|---|
| **ERRO** em obra publicada | mais de 5% das palavras em inglês numa obra em português; idioma do banco diferente do idioma do texto; arquivo servido por duas obras; tradução por IA sem atribuição; vínculo para edição que não existe; autor com nome de título | O comando sai com código 1 (portão antes do deploy) |
| **ERRO** em obra oculta | os mesmos | Aparece, mas não bloqueia |
| **AVISO** | parágrafos em inglês dentro de português; marcas de anúncio de editor; linhas de números de página; texto longo com poucos títulos; link de citação para obra oculta ou inexistente | Não bloqueia |
| **INFO** | marcadores `[123]` de nota de rodapé soltos; tom promocional no ensaio de abertura; arquivo sem obra; autor sem obra | Não bloqueia |

Sem `DATABASE_URL` ele só analisa os arquivos. Com ela, cruza com o banco.

Checklist de uma obra nova: título em português correto e original no campo próprio;
idioma e `translation_is_ai` coerentes; edição-fonte nomeada; sem trecho em inglês
dentro de texto em português; sem lixo de digitalização; títulos por capítulo; autor
com nome limpo e sem duplicata; `acervo:verificar` sem erro.

## Proveniência, IA e licença

- **Domínio público é o critério de publicação** (README, "Direitos Autorais e
  Proveniência", regra 3). O texto original de autor morto há séculos não oferece
  risco. O risco está na **edição-fonte**: se a tradução por IA partiu de uma tradução
  ou edição moderna, ela é obra derivada.
- **Campos:** `translation_is_ai`, `human_review_approved_at` (aprovação humana, com
  data), `license_type`, `attribution_text`, `translator`.
- **Tradução por IA** usa `cc-by-sa-4.0` (decisão de 2026-10-16, igual às já publicadas)
  e aparece no leitor com aviso. Obra que é texto original ou edição antiga em domínio
  público usa `public-domain`.
- A titularidade de uma tradução gerada por IA **não é pacífica juridicamente**: o selo
  CC é uma declaração de intenção. Esse ponto vai ao parecer jurídico.
- Estado em 2026-10-17: das 232 traduções por IA, **60 citam edição crítica ou tradução
  moderna (risco alto), 28 risco médio, 24 risco baixo e 120 não nomeiam a fonte**. O texto
  público não traz a ressalva (decisão do autor: transparência sem tirar a confiança de quem
  lê); o controle é o registro `docs/PROVENIENCIA-ACERVO.md` e o verificador.

## Tom e proveniência (o que o leitor vê)

O leitor tem um bloco "Sobre esta edição" com **dois tipos de informação**:

1. **Dados do banco**, sempre exatos: obra original (título, língua, ano), esta edição
   (idioma, se é tradução por IA, licença, atribuição; a revisão humana só aparece quando
   foi aprovada).
2. **Ensaio de abertura**, o texto livre `# Proveniência e Contexto Histórico` que vem
   dentro do arquivo. Em 115 textos ele tem superlativos sem fonte ("obra-prima",
   "inigualável"). Enquanto a tradução for por IA **sem aprovação humana**, o ensaio fica
   **recolhido** e rotulado "texto introdutório gerado por IA". Quando alguém marca a
   revisão humana como aprovada, ele aparece aberto.

O usuário final só precisa saber que a obra é **texto de IA**: o estado interno da revisão
("pendente") não é exibido; o campo `human_review_approved_at` e o painel o guardam. Se um
dia houver revisão aprovada, ela é mostrada.

Regra para escrever esses textos: tom sóbrio, afirmação com fonte, sem adjetivo de
propaganda. Se não dá para citar de onde vem, não entra.

## Idioma

Hoje o site publica **só obras em português**. Para voltar a publicar uma edição em
inglês ou em latim, use a chave "Publicada" no painel, obra a obra.

A interface tem um mecanismo de idiomas (`web/src/i18n`, com PT, EN e ES) que cobre **parte**
das telas. Por decisão de 2026-10-16 o site **oferece só português**: a lista
`IDIOMAS_ATIVOS` em `web/src/i18n/index.ts` controla o seletor (cabeçalho e rodapé) e o
idioma inicial, e uma preferência antiga em EN/ES salva no navegador é ignorada. Os textos
de EN e ES e todo o mecanismo continuam montados.

Para voltar a oferecer inglês: (1) completar a tradução da interface em `web/src/i18n`;
(2) conferir a busca em inglês; (3) documentar a edição-fonte de cada edição em inglês;
(4) republicar as obras em inglês pelo painel; (5) acrescentar `'en'` a `IDIOMAS_ATIVOS`.

## Citação do dia: o que acontece quando você edita citações

A "citação do dia" de cada data é **gravada** (tabela `daily_quotes`) na primeira vez em que alguém a consulta, para
hoje e ±30 dias. Consequências para quem edita o acervo:
- **Acrescentar ou remover citações não muda os dias já mostrados** (dentro dos ±30 dias). Antes mudava todos.
- **Apagar a citação que está gravada num dia** faz só aquele dia escolher outra, na próxima consulta.
- **O dia de hoje, se ninguém o consultou ainda**, e os dias além de ±30, refletem o acervo de agora.
- `server/scripts/seed-quotes.ts` (restaurar do zero) apaga `quotes` e, em cascata, `daily_quotes`. Nunca em produção. Desde a F5 ele **preserva o `id`** de cada citação (o histórico de `quote_events`, o Gerador e o canário continuam ligados), valida o arquivo antes de apagar e roda numa transação: arquivo inválido deixa a tabela como estava.
- Para forçar outra frase num dia específico (raro): `UPDATE daily_quotes SET quote_id = '<id>' WHERE date_key = 'AAAA-MM-DD';`.
  Faça backup antes; quem consultar o dia depois disso recebe a nova frase.
- Decisão e motivos: `docs/adr/001-citacao-do-dia-api-central.md`, atualização de 17/10/2026 (2).

## Status da citação: ativa, oculta e rascunho (desde a F1 do painel de citações)

Toda citação tem um `status`. **Só `ativa` é pública**: a lista (`GET /quotes`), o sorteio (`/quotes/random`) e a citação do dia leem uma
condição só (`quotesAtivas()`, `server/src/db/quotes.ts`). `oculta` e `rascunho` não aparecem para ninguém, nem no Gerador de C. S. Lewis.

- **Retirar é ocultar, não apagar** (regra R3 do desenho em `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md`). O `id` fica
  para sempre válido e o histórico não se perde. **O caminho normal é a tela `/admin/citacoes`**: oculta com motivo, mostra o impacto
  e grava o evento no histórico (manual: `docs/MANUAL-PAINEL-CITACOES.md`, seção 6). **Em produção a tela vale desde 29/10/2026 (F5)**; o SQL abaixo faz o mesmo quando a API estiver fora do ar, em migration ou com backup antes (não grava evento no histórico):
  ```sql
  UPDATE quotes SET status = 'oculta', motivo_ocultacao = 'Motivo em uma frase (e onde está a evidência)', updated_at = now()
  WHERE id = '<id>';
  ```
  O motivo é obrigatório por convenção. Reativar: `UPDATE quotes SET status = 'ativa', motivo_ocultacao = NULL WHERE id = '<id>';`
  (o banco recusa se a citação não tiver `source`).
- **Ativa exige fonte:** o banco recusa `status = 'ativa'` com `source` vazio (CHECK `quotes_ativa_exige_fonte`). Rascunho e oculta podem não ter.
- **Se a citação oculta era a do dia** de uma data já gravada, o dia escolhe outra entre as ativas e **regrava** na próxima consulta (R4). Reativar
  depois **não** devolve o dia: a escolha nova vale.
- **O Gerador C. S. Lewis:** a lista ao vivo dele passa a omitir a citação em até 10 min. A **cópia embutida** (`lewis-quotes.snapshot.json`) não
  muda sozinha: o fluxo `.github/workflows/sync-quotes.yml` do Gerador a regera e abre o PR (diário, ou na hora com
  `gh workflow run sync-quotes.yml --repo rilsonjoas/GeradorCSLewis`); o merge é manual. A tela mostra os passos (aviso "Depois, atualize a cópia do Gerador
  C. S. Lewis") sempre que a mudança altera a cópia; passo a passo em `docs/MANUAL-PAINEL-CITACOES.md`, seção 7. O canário (de hora em hora) acusa **erro**
  se a cópia ainda tem uma citação retirada; citação nova faltando e texto, obra, tema ou link diferentes são **aviso** (log do canário e resumo do Kuma, sem
  derrubar o status).
  O Narniano guarda cache de até 6 h.
- **Excluir de verdade** (citação fabricada, direitos) continua sendo migration `DELETE`, citando o registro de verificação. O histórico em
  `quote_events` não tem chave estrangeira, justamente para sobreviver à exclusão.
- O canônico (`server/scripts/data/quotes-canonical.json`) leva `id`, `status` e `motivoOcultacao`, inclusive das não ativas: um restore não ressuscita o que foi ocultado e não troca ids.

### API de administração de citações (F2) e tela `/admin/citacoes` (F3)

Rotas sob login de administrador (mesmo cookie do resto do admin), em `server/src/routes/admin-quotes.ts`. **Não há `DELETE`**: retirar é ocultar.

| Rota | O que faz |
|---|---|
| `GET /api/v1/admin/quotes?status=&author=&q=&semVerificacao=true&page=` | Lista de 50 em 50, todos os status; cada item traz `diasFixados` (datas `AAAA-MM-DD` em que está gravada como a do dia); `semVerificacao=true` filtra ativas sem `verificado_em`. Traz contadores por status, por autor (todas as situações), `porAutorAtivas` (só ativas, base da concentração mostrada na tela) e `semVerificacao` (ativas sem `verificado_em`). Os contadores são do acervo inteiro, não do filtro. |
| `POST /api/v1/admin/quotes` | Cria `rascunho` (padrão) ou `ativa`. Ativa nova exige `source`, `fonteUrl` e `verificadoEm`. |
| `PATCH /api/v1/admin/quotes/:id` | Edita. Exige `updatedAt` (o valor que a tela recebeu); se a citação mudou desde então, responde `409` com `atual`. Mudança só de `fonteUrl`/`verificadoEm` vira o evento `verificou`; sem mudança real não grava nada. Não aceita `status: 'oculta'`, `id` nem campo desconhecido. |
| `POST /api/v1/admin/quotes/:id/ocultar` | Corpo `{motivo}` (3 a 1000 caracteres). `409` se já está oculta. |
| `POST /api/v1/admin/quotes/:id/reativar` | Volta a `ativa`; exige `source`. `409` se não está oculta. Limpa o motivo (o antigo fica no evento). |
| `GET /api/v1/admin/quotes/:id/eventos` | Histórico, do mais recente ao mais antigo; funciona mesmo para citação excluída por migration. |

Regras que a API recusa com `400` (formato do cluster, `validation_error`): autor com grafia diferente de um autor que já existe (a mensagem traz a grafia existente; autor inédito é aceito), texto repetido (comparação sem caixa, espaço nem pontuação; acento distingue), texto vazio de conteúdo ou acima de 2000 caracteres, `scriptoriumUrl` que não aponta para obra **publicada**. Obra fora da curadoria sem domínio público não bloqueia: vem em `avisos` (a citação fica sem link de compra). Toda escrita grava um `quote_events` **na mesma transação**: se o evento falha, a escrita some.

**A tela** (`/admin/citacoes`, item "Citações" do menu do admin) usa só estas rotas: resumo do acervo (total, ativas, ocultas, rascunhos, sem verificação, concentração dos 5 maiores autores sobre as ativas), lista com filtros (situação, autor, busca, "só sem verificação") e selos em texto ("Sem verificação", "Fixada em N dias"), formulário com validação ao vivo e histórico por citação. **Não há botão de excluir**, e a tela não oferece a passagem de ativa para rascunho (a API aceita; o autor ainda não decidiu se deve). Ao ocultar, a tela mostra os dias já fixados, o aviso de cache (Narniano até 6 h, Gerador até 10 min) e, se o autor for C. S. Lewis, o aviso com os passos do Gerador (o fluxo `sync-quotes.yml`). O mesmo aviso aparece no formulário e, depois de salvar, ocultar ou reativar, num aviso rápido, **só quando a mudança altera a cópia do Gerador** (criar ativa, mudar texto, obra, tema ou domínio público, ocultar, reativar, trocar o autor para ou de Lewis; não quando só muda a verificação nem em rascunho ou oculta). Em edição ela envia só o que mudou; se a citação mudou desde que foi aberta (`409`), o que foi digitado é mantido e a versão atual pode ser carregada.

> **A tela e a API podem gravar em produção** (liberado em 29/10/2026, F5). O restore do canônico preserva o `id` de cada citação, então o histórico de `quote_events` continua ligado. Mas o arquivo `quotes-canonical.json` **envelhece** a cada mudança pela tela: atualize-o pela consulta SQL (passo 5 de "Acrescentar citações") antes de usá-lo para qualquer restore. A recuperação de desastre de verdade é o backup do banco.

Texto corrigido numa citação ativa **propaga** para os dias já gravados (mesmo `id`). Ocultar/editar não chama o Gerador nem o Lecionário (veja o aviso de cache acima).

## Acrescentar citações

**O caminho normal é a tela** (`/admin/citacoes`, botão **Nova citação**; passo a passo em `docs/MANUAL-PAINEL-CITACOES.md`, seção 4). Ela aplica
as mesmas regras abaixo (fonte, grafia do autor, texto repetido) e grava o histórico. Em produção vale desde 29/10/2026 (F5). A migration SQL, versionada e ensaiável como o resto do acervo, ficou para a carga em lote.

### Carga em lote (excepcional)

Mesmo com a tela liberada, a migration continua sendo o caminho para **muitas citações de uma vez** e para **exclusão física**. O passo a passo:

1. **Verifique a fonte primária antes de escrever uma linha de SQL.** A regra é de `docs/PROTOCOLO-VERIFICACAO-DE-CITACOES.md`:
   nenhuma citação entra sem `fonte_url` real, conferida contra a fonte (uma fabricação já ficou um mês em produção por falta desse portão).
2. **Escreva o autor exatamente como já está no banco.** `quotes.author` é texto livre, sem vínculo com a tabela `authors`.
   Veja as grafias existentes: `SELECT author, count(*) FROM quotes GROUP BY author ORDER BY 2 DESC;`. O filtro da API ignora caixa,
   espaços e pontuação (`C.S. Lewis` e `C. S. Lewis` são o mesmo autor), mas **acento distingue** e **apelido não vale** (`Lewis` não é
   `C. S. Lewis`). O verificador avisa quando o mesmo autor aparece escrito de dois jeitos.
3. **Crie a migration** (`pnpm --filter server exec drizzle-kit generate --custom --name=citacoes_AAAA_MM_DD`) e preencha, de forma
   idempotente (rodar duas vezes não duplica):
   ```sql
   INSERT INTO quotes (author, text, source, dominio_publico, scriptorium_url, theme, fonte_url, verificado_em)
   SELECT 'C. S. Lewis', 'Texto exato da citação.', 'Título da obra', false, NULL, NULL,
          'https://fonte-primaria-confirmada', DATE '2026-10-17'
   WHERE NOT EXISTS (SELECT 1 FROM quotes WHERE author = 'C. S. Lewis' AND text = 'Texto exato da citação.');
   ```
   `dominio_publico = false` gera o botão de compra, mas **só se a obra em `source` for conhecida** (`isCuratedSource`); sem isso a citação
   aparece sem link, de propósito. `scriptorium_url` só se aponta para uma obra **publicada** (o verificador confere).
4. **Ensaie** com `scripts/ensaiar-migrate.sh <dump da produção>` e rode `pnpm --filter server acervo:verificar`.
5. **Depois do deploy**, atualize o canônico a partir da produção (só leitura), no seu terminal, na raiz do repositório:
   ```
   ssh narniano@debian13-4gb-narniano 'docker exec -i postgres-shared psql -U postgres -d scriptorium_divinum_db -At' < server/scripts/data/export-quotes-canonical.sql > /tmp/quotes.json
   node -e 'const fs=require("fs");fs.writeFileSync("server/scripts/data/quotes-canonical.json",JSON.stringify(JSON.parse(fs.readFileSync("/tmp/quotes.json","utf8")),null,2)+"\n")'
   ```
   A consulta ordena por ponto de código, então o arquivo só muda quando o acervo muda. O canônico é um **espelho legível e a semente de um ambiente novo**; a recuperação de desastre de verdade é o backup do banco. Ele envelhece a cada citação criada, editada ou ocultada pela tela: atualize antes de usá-lo para restaurar qualquer coisa.

**O que acontece quando a citação entra** (testado em `quotes-gravada.integration.test.ts`):
- Ela aparece **na hora** na lista (`GET /quotes`) e no sorteio, portanto no Gerador.
- **Os dias que já foram mostrados dentro de ±30 dias não mudam** (a escolha de cada dia é gravada).
- A citação nova entra no rodízio dos **dias que ainda não foram consultados**, por `daySeed % total`. Com 270 citações (18/10/2026), a chance de uma
  nova ser a de um dia qualquer é de cerca de 1 em 282: ela **não vira a citação de amanhã por si só**. Para fixar uma citação num dia:
  `UPDATE daily_quotes SET quote_id = '<id>' WHERE date_key = 'AAAA-MM-DD';` (backup antes; vale a partir da próxima consulta).
  Se o dia ainda não tiver linha, insira uma: `INSERT INTO daily_quotes (date_key, quote_id) VALUES ('AAAA-MM-DD', '<id>');`.
- A participação de cada autor no rodízio acompanha o tamanho dele no acervo (Lewis tem ~55%).

## Links e citações

- Citações do Scriptorium: tabela `quotes`, campo `scriptorium_url`. O verificador
  confere se cada link aponta para obra **publicada**.
- O **Lecionário** tem cópias próprias em `lecionario-web/src/data/lewis-quotes.json` e
  `lecionario-mobile/src/data/lewis-quotes.json`. Essas cópias não são conferidas pelo
  verificador. Depois de ocultar, renomear ou remover uma obra, confira os links com o
  comando abaixo (rode na raiz do repositório do Lecionário).
- **Slug é congelado.** Renomear uma obra publicada quebra links de fora (citações, redes
  sociais, buscadores). Mude o título, não o slug. (No vínculo de edição a mudança de slug
  se propaga, mas o link de fora continua quebrado.)

```bash
python3 - <<'EOF'
import json, urllib.request, urllib.error
d = json.load(open('lecionario-web/src/data/lewis-quotes.json', encoding='utf-8'))
itens = d if isinstance(d, list) else d.get('quotes', d)
slugs = sorted({q['scriptoriumUrl'].rstrip('/').split('/')[-1] for q in itens if q.get('scriptoriumUrl')})
for s in slugs:
    try:
        st = urllib.request.urlopen(f'https://api-scriptorium.narniano.com/api/v1/books/{s}', timeout=10).status
    except urllib.error.HTTPError as e:
        st = e.code
    print('OK   ' if st == 200 else 'FALHA', s)
EOF
```

## Ensaio antes do deploy

Nunca suba mudança de catálogo, seed ou migration sem ensaiar. O ensaio usa uma cópia
da produção num Postgres descartável e roda o `migrate` **duas vezes** (a segunda prova
que é idempotente):

```bash
ssh narniano@debian13-4gb-narniano \
  'docker exec postgres-shared pg_dump -U postgres --no-owner --no-privileges scriptorium_divinum_db' > /tmp/prod.sql
scripts/ensaiar-migrate.sh /tmp/prod.sql
```

Ele mostra obras e publicadas antes e depois, e roda o verificador. Confira que **o que
já estava publicado não mudou** sem você querer. Apague `/tmp/prod.sql` depois.

## Deploy

O push em `main` dispara o deploy (`.github/workflows/deploy.yml`): verifica, entra no VPS
com `set -e`, `git pull`, `make deploy` (com trava global contra builds simultâneos),
roda `migrate` (falha dele derruba o deploy) e faz um smoke test.

Antes do push:

1. O VPS está ocioso? `ssh narniano@debian13-4gb-narniano 'free -m; docker ps | wc -l'`
   (4 GB de RAM; um build pesado chegou a deixar 315 MB livres).
2. Nenhum outro repositório está em deploy (`gh run list --status in_progress`).
3. O ensaio passou.

Depois do push, **confira no destino, não só no CI** (um workflow verde já escondeu build
quebrado): data de criação do container, contagem de obras e de publicadas, uma obra
oculta devolvendo 404, uma obra nova abrindo no leitor.

## Armadilhas já vividas

- Seeds que reescrevem campos editados no painel (resolvido: seed só cria).
- `published` valia só na listagem; detalhe, texto e contagem por autor ignoravam
  (resolvido em 2026-10-16: oculta é 404).
- `migrate` engolia erro de seed, saía com código 0 e derrubava em cascata os seeds
  seguintes (resolvido: ROLLBACK e saída 1).
- Edição vinculada apontando para obra oculta levava a 404 (resolvido: o vínculo some).
- Seed gerado em lote com autores de nome de título, duplicatas e idioma trocado
  (resolvido; use `acervo:verificar`).
- Tabela criada à mão no banco como `postgres` (foi `quote_events`, na F1): a API, que
  entra como `scriptorium_app`, recebia `permission denied` e a tela mostrava "Erro interno
  do servidor" só no Histórico e no Ocultar, achado em 29/10/2026 no primeiro uso. Corrigido
  com `ALTER TABLE quote_events OWNER TO scriptorium_app;`. Regra: SQL aplicado à mão em
  produção entra como `scriptorium_app` (ou termina com `OWNER TO scriptorium_app`). O
  `migrate` agora confere a cada deploy e sai com 1 se alguma tabela do schema public não
  for acessível ao usuário da API.
- Link de citação para slug que nunca existiu (resolvido no Scriptorium; o Lecionário
  tem o seu próprio JSON).

## Pendências conhecidas

A lista viva, em ordem, está no `ROADMAP.md`, "Item 18". As maiores: auditar a
edição-fonte das 100 obras publicadas em 16/10, traduzir por inteiro as obras que
ficaram fora por terem trechos em inglês, estruturar com títulos os textos longos sem
sumário e decidir o que fazer com o `breve-catecismo-westminster` (publicado como
português, texto majoritariamente em inglês).
