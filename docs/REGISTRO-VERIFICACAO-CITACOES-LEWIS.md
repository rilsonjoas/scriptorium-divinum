# Registro da verificação das citações de C. S. Lewis (para não voltar aos mesmos lugares)

**Regra deste arquivo:** tudo o que foi verificado, onde, com qual busca e com qual resultado fica escrito aqui,
inclusive o que **não** foi achado. Antes de pesquisar qualquer citação de Lewis, procure o id (8 primeiros caracteres)
ou um trecho do texto neste arquivo. Se já está aqui, **não repita a busca**: só reabra se for obter uma fonte
melhor que a listada em "Como subir o nível". Atualize este arquivo no mesmo commit de qualquer verificação nova.

Contexto e plano: [`AUDITORIA-RETROATIVA-CITACOES-LEWIS.md`](AUDITORIA-RETROATIVA-CITACOES-LEWIS.md).
Protocolo para entradas novas: [`PROTOCOLO-VERIFICACAO-DE-CITACOES.md`](PROTOCOLO-VERIFICACAO-DE-CITACOES.md).
Decisões e datas: [`DECISOES.md`](DECISOES.md).

## 1. Onde já existe verificação (reaproveitar, não refazer)

1. **O vault do autor** (`6 - Segundo cérebro/_Auditoria de Citações de C. S. Lewis.md`, blocos 1 a 7, 21 a 27/09/2026)
   tem um "banco reutilizável" de vereditos (✅ ❌ ⚠️) com a fonte real de cada citação checada, e tags inline nas notas.
   Das 156 citações de Lewis que a API tinha em 18/10/2026, o cruzamento (`scripts/cruzar-citacoes-com-vault.py`) achou:
   14 com ✅ individual, **122 com procedência rastreável por amostragem/deduplicação do bloco** (livro e página na nota,
   sem marca individual: **aceitas, não refazer**), 3 ⚠️, 1 ❌ e 16 não localizadas.
2. **Retiradas em 18/10/2026 (migration 0013)**, com o motivo: `4c765bb2` (❌ fala do filme *Terra de Sombras*, 1993),
   `15cc0baa`, `208426db`, `033cd665` (⚠️ não localizadas em fonte primária pelo vault). Ver `DECISOES.md`.
3. **Fonte registrada em 18/10/2026 (migration 0014)** a partir do vault: `65e113b5` e `86587b88` (*Cristianismo Puro e Simples*),
   `67b54cc0` (carta a Sheldon Vanauken, 23/12/1950), `b50e13d4` (*The Collected Letters*, vol. 3, p. 119).
4. **Limpeza de 25/09/2026** (1 falsa e 20 duvidosas retiradas, 8 atribuições corrigidas): detalhes na nota de projeto do vault
   `9 - TI/08 - Carreira e Aprendizagem/Projetos/Scriptorium Divinum.md`.

## 2. As 17 que o vault não resolvia: busca de 18/10/2026

**Método e limite (leia):** `WebSearch` (modo padrão), em inglês, com o trecho original provável entre aspas. Cada resposta
é um resumo de resultados; **não li o texto primário do livro**. "✅ confirmada" aqui quer dizer: a frase aparece, com a mesma
atribuição, em fontes de boa qualidade (trechos com aviso de direitos autorais, devocionais da Bible Gateway, PBS, bases de citações com
livro e capítulo). É nível de evidência **B** (secundária boa), não **A** (texto primário lido). "⚠️ não localizada" quer dizer:
a busca não achou a formulação em lugar nenhum, e em alguns casos achou o que a frase provavelmente parafraseia.

Legenda de nível: **A** = texto primário lido (só `139977f6`, e para mostrar que a frase NÃO está); **B** = vários trechos secundários de qualidade concordando; **—** = nada achado.

| id | Texto no banco (resumo) | Veredito | Nível | Fonte (obra, localização) | O que foi consultado / observação |
|---|---|---|---|---|---|
| `24a89d75` | "Nenhum homem sabe o quanto é mau, até se esforçar para ser bom... força do vento" | ✅ | B | *Mere Christianity* (capítulo não confirmado pela busca) | Lista de citações (joshuarogers.com) atribui a primeira frase; a imagem do vento só apareceu em agregador (libquotes.com/c-s-lewis/works/mere-christianity/7). Reaberto só se for citar capítulo. |
| `58505dc8` | "Nárnia, Nárnia, desperte! Ame! Pense! Fale!..." | ✅ | B | *O Sobrinho do Mago*, cena da criação | Bible Gateway C.S. Lewis Daily (2023/04/21 e 2024/04/20) reproduz com aviso de direitos; Tor.com comenta a cena. |
| `8c1f9b59` | "A porta para o inferno está trancada por dentro." | ✅ | B | *O Problema do Sofrimento*, capítulo sobre o inferno | Bible Gateway (devocional 2024/04/27), wist.info/lewis-cs/32000, vários. Número do capítulo **não confirmado** pela busca. Texto mais completo: "They enjoy forever the horrible freedom they have demanded". |
| `ae09ee63` | "Somos como um ovo... pássaro novo ou apodrecemos" | ✅ | B | *Mere Christianity* (capítulo não confirmado) | Bible Gateway Daily 2024/04/24, kwize.com/quote/10020. Variantes de redação em sites. |
| `b4225c84` | "Um jovem que deseja permanecer um ateu convicto..." | ✅ | B- | *Surprised by Joy*, passagem sobre Chesterton/MacDonald | Resumo da busca confirma o contexto; fontes eram páginas de loja/edição, evidência fraca. Real e muito conhecida; se for citar página, conferir no livro. |
| `c0d7c0f2` | "Coragem, querido coração." | ✅ | B | *A Viagem do Peregrino da Alvorada*, cap. 12 (albatroz) | Shmoop (12.59), Episcopal Church, Lorehaven. |
| `cb29a240` | "Deus não pode dar-nos paz e felicidade à parte dele..." | ✅ | B | *Mere Christianity*, Livro II, cap. 3, par. 7 (p. 54 na edição citada) | kwize.com/Mere-Christianity/453-69, epm.org, reformedperspective.ca. |
| `dd05a5a9` | "O que você vê e o que você ouve depende muito de onde você está." | ✅ | B | *O Sobrinho do Mago* | Goodreads, litcharts, crc.sa.utoronto.ca. Edições variam: "a good deal" / "a great deal". Capítulo não confirmado. |
| `f3754c5c` | "Todos dizem que o perdão é uma ideia maravilhosa até que tenham algo a perdoar." | ✅ | **B+** | *Mere Christianity*, Livro III, cap. 7 ("Forgiveness") | Trecho do capítulo em pbs.org/wgbh/questionofgod/ownwords/mere2.html; kwize.com/quote/10099; restlesspilgrim.net. |
| `0e70882b` | "Se você está no caminho errado, voltar atrás significa progresso." | ✅ (paráfrase fiel) | B | *Mere Christianity*, Livro I, cap. 5 ("We Have Cause to Be Uneasy"), pp. 28-29 | wist.info/lewis-cs/52179, apologetics315.com. O original: "if I am on the wrong road, progress means doing an about-turn and walking back to the right road". **Sem `source` no banco: preencher com *Cristianismo Puro e Simples*.** |
| `139977f6` | "Uma coisa boa de ler livros velhos é que as modas não os afetam." (Introdução a *Sobre a Encarnação*) | ⚠️ **(paráfrase, não é a formulação de Lewis)** | **A** (texto lido) | Introdução real de Lewis à tradução de Sister Penelope Lawson de *De Incarnatione* | **Li o texto da introdução (cópia em gwern.net/docs/www/www.worldinvisible.com/3d416e1414fe6e12a5d6f9affcb3c99ce0a30404.html, 18/10/2026): a frase NÃO existe.** A ideia é real, em outras palavras: "Every age has its own outlook\... specially liable to make certain mistakes"; "The only palliative is to keep the clean sea breeze of the centuries blowing through our minds, and this can be done only by reading old books"; "[old books] will not flatter us in the errors we are already committing". "Fashion" aparece só no trecho do Credo Atanasiano ("sloth or of fashion"), em outro sentido. Se quiser manter a ideia, a citação certa é a da "brisa limpa do mar dos séculos". **Não buscar de novo.** |
| `17f74df7` | "A paixão é o que nos leva a prometer. O amor é o que nos leva a cumprir as promessas." | ⚠️ | — | (sem `source` no banco) | Não localizada. O mais próximo em Lewis é *Mere Christianity*, Livro III, cap. 6 (casamento): estar apaixonado leva a prometer, o amor mais calmo leva a cumprir; palavras diferentes (via quotewise.io). Parece condensação posterior. No vault só aparece nota de Balthasar com assunto parecido, não essa frase. |
| `73cf6ff3` | "Se tentarmos encontrar algo neste mundo que satisfaça nosso desejo mais profundo... eco fugaz da alegria" (*Surpreendido pela Alegria*) | ⚠️ | — | A ideia está em *Mere Christianity*, Livro III, cap. 10 ("Hope") | Não localizada em *Surprised by Joy*. O capítulo "Hope" tem "made for another world" e prazeres terrenos como "cópia ou eco"; o texto do banco parece **síntese em palavras de outro**, com livro errado. |
| `913c5eef` | "A educação sem valores, por mais útil que seja, parece apenas fazer do homem um demônio mais esperto." (*A Abolição do Homem*) | ⚠️ | — | — | graciousquotes.com lista como **disputada**: nenhuma fonte nos escritos de Lewis (o original circulante diz "religion", não "values"). **A lista de falsas da C.S. Lewis Foundation (cslewis.org/aboutus/faq/quotes-misattributed/, lida em 18/10/2026) tem só 8 itens e esta NÃO está nela**; portanto não está declarada falsa pela Foundation, apenas sem fonte. Não buscar de novo. |
| `a3dfbe3b` | "O medo de ser 'fora' é mais forte que qualquer convicção moral." (*Aquela Fortaleza Medonha*) | ⚠️ | — | O tema é real: ensaio "The Inner Ring" (1944) e o personagem Mark em *That Hideous Strength* | Não localizada. Frases reais do ensaio: "Of all the passions, the passion for the Inner Ring is most skillful in making a man who is not yet a very bad man do very bad things". Pode ser paráfrase de comentador. |
| `d5518bea` | "O céu não é silencioso — nós é que aprendemos a não ouvir." (*Aquela Fortaleza Medonha*) | ⚠️ | — | — | Não localizada em lugar nenhum; sem rastro em listas de falsas consultadas (cslewis.org/aboutus/faq/quotes-misattributed, stephenjbedard.com "Top 10 Lines Falsely Attributed", EPM/Alcorn). Padrão de frase inspiracional genérica. |
| `fef40aff` | "A obediência é o remédio para a cegueira espiritual." (*Cartas de um diabo ao seu aprendiz*) | ⚠️ | — | O tema de obediência existe em *The Screwtape Letters* (a carta sobre obedecer quando Deus parece ausente) | Não localizada. Resultados com sourcing fraco: "Obedience is the road to freedom, humility the road to pleasure, unity the road to personality" (blog, sem livro). |

**Contagem:** 10 ✅ (nível B), 7 ⚠️ não localizadas. Nenhuma foi declarada falsa; "⚠️" segue a definição do vault: busca real feita, formulação não localizada.

## 3. Decisões pendentes (do autor)

- **Preencher `source`** de `0e70882b` (*Cristianismo Puro e Simples*): sem risco, sai com a próxima migration.
- **7 ⚠️ acima:** pela política de 25/09 (e pelo que se fez em 18/10 com as 4), "duvidosa sai". Duas são paráfrases de ideias reais atribuídas a
  livro errado ou sem formulação localizável (`139977f6`, `73cf6ff3`); cinco não têm rastro (`17f74df7`, `913c5eef`, `a3dfbe3b`, `d5518bea`, `fef40aff`).
  Decisão registrada em `DECISOES.md` quando tomada. A lista da C.S. Lewis Foundation já foi conferida (18/10/2026): `913c5eef` não consta dela.

## 4. Como subir o nível (de B para A) sem repetir busca

1. Texto integral em domínio público ou acesso institucional: as obras de Lewis ainda têm direitos; *Mere Christianity* e *Surprised by Joy* têm
   cópias para empréstimo no Internet Archive (acesso por empréstimo, não busca livre: foi o que travou duas pendências do vault).
2. Para a introdução de Atanásio (`139977f6`): a cópia do texto em `globalchristians.org/downloads/Church History Documents/Athanasius On The Incarnation CS Lewis.htm` é lida em segundos, melhor que buscar.
3. Só então preencher `fonte_url` e `verificado_em` (o protocolo exige fonte real conferida).

## 5. O que NÃO fazer de novo

- Não rebuscar as 10 ✅ acima nem as 122 "rastreáveis por amostragem": já têm veredito.
- Não buscar as frases da seção 2 em português; a busca útil é no original em inglês, entre aspas, com o trecho distintivo.
- Não usar agregadores de citações (Goodreads, libquotes, kwize) como prova isolada: serviram aqui só como pista, junto com fonte melhor.
