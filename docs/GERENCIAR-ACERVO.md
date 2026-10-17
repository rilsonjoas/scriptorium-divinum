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
| **Painel de admin** | **Gerencia o dia a dia**: publicar, ocultar, destaque, descrição, categorias, capa, atribuição, excluir. | `/admin/livros`, `/admin/autores`, `/admin/categorias` |

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
- `server/scripts/seed-quotes.ts` (restaurar do zero) apaga `quotes` e, em cascata, `daily_quotes`. Nunca em produção.
- Para forçar outra frase num dia específico (raro): `UPDATE daily_quotes SET quote_id = '<id>' WHERE date_key = 'AAAA-MM-DD';`.
  Faça backup antes; quem consultar o dia depois disso recebe a nova frase.
- Decisão e motivos: `docs/adr/001-citacao-do-dia-api-central.md`, atualização de 17/10/2026 (2).

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
- Link de citação para slug que nunca existiu (resolvido no Scriptorium; o Lecionário
  tem o seu próprio JSON).

## Pendências conhecidas

A lista viva, em ordem, está no `ROADMAP.md`, "Item 18". As maiores: auditar a
edição-fonte das 100 obras publicadas em 16/10, traduzir por inteiro as obras que
ficaram fora por terem trechos em inglês, estruturar com títulos os textos longos sem
sumário e decidir o que fazer com o `breve-catecismo-westminster` (publicado como
português, texto majoritariamente em inglês).
