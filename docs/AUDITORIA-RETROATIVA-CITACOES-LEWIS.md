# Auditoria retroativa das citações de C. S. Lewis (análise de 18/10/2026)

> **Atualização 18/10/2026:** as 4 citações dos itens 1 e 2 foram **retiradas** (migration `0013_retira_4_citacoes_lewis`, decisão do autor). A API passa de 281 para 277 citações (156 para 152 de Lewis). Os números abaixo descrevem o estado **antes** da retirada.

**Pergunta:** a questão das fontes das citações já estava resolvida? As não verificadas já saíram da API?

**Resposta curta:** em grande parte sim, mas não por inteiro. A limpeza de 25/09/2026 retirou 1 atribuição falsa e 20
duvidosas e corrigiu 8 atribuições; das 156 citações de Lewis que a API serve hoje, **a maioria tem procedência rastreável
no vault, mas só 18 têm veredito individual registrado**, e entre elas há **1 que o próprio vault marca como falsa e 3 como duvidosas, todas ainda no ar**.
Nenhuma citação aqui é afirmada falsa sem a evidência do vault: onde a evidência não existe, o texto diz "não localizada", não "falsa".

Esta análise só **leu** o vault e a API. Nada foi alterado no banco, no vault, nem no Gerador.

## Método (reproduzível)

`python3 -I scripts/cruzar-citacoes-com-vault.py <pasta-do-vault> > cruza.json` baixa as citações do autor na API e,
para cada uma, acha a linha mais parecida em todas as notas do vault (trechos de 4 palavras, sem acento e sem pontuação),
lendo ao lado o veredito que a auditoria do vault registrou. A auditoria do vault é a nota
`6 - Segundo cérebro/_Auditoria de Citações de C. S. Lewis.md` (blocos 1 a 7, 21 a 27/09/2026): ela verificou as citações **das notas do vault**
(artigos, notas-livro, roteiros), não o banco do Scriptorium. Este cruzamento junta as duas coisas.

## Resultado (156 citações de Lewis na API)

| Situação | Qtd | Leitura |
|---|---|---|
| Achada no vault com ✅ (confirmada contra fonte primária) | 14 | Procedência individual comprovada |
| Achada no vault, com fonte/livro, sem marca individual | 122 | Coberta pela auditoria por amostragem ou deduplicação do bloco; **procedência rastreável, não conferida uma a uma** |
| Achada no vault com ⚠️ (duvidosa) | 3 | Vault não localizou a formulação em fonte primária |
| Achada no vault com ❌ (atribuição falsa) | 1 | Vault diz que é fala de filme |
| Não localizada no vault | 16 | Sem veredito: pode ser tradução diferente da nota ou citação nunca anotada |
| **Total** | **156** | |

(Os 5 casos "parciais" entram na linha correspondente: o texto do banco é uma versão mais curta ou traduzida de forma diferente da nota.)

## Achados que pedem decisão

### 1. Marcada como falsa pelo vault e ainda no ar
| id | texto | fonte no banco |
|---|---|---|
| `4c765bb2` | Eu oro, porque eu não posso me ajudar. Isso não muda Deus, isso me muda. | (sem fonte) |

O vault registra: fala do filme *Terra de Sombras* (1993), dita pelo personagem Lewis, roteiro de William Nicholson. Está na API
(e, portanto, na cópia embutida do Gerador) sem fonte. A limpeza de 25/09 removeu "1 atribuição falsa", mas não foi esta.

### 2. Marcadas como duvidosas pelo vault e ainda no ar
| id | texto | fonte no banco |
|---|---|---|
| `033cd665` | Quando acontece algo que nos destrói a vida tal como ela é, e nos força a parar de viver assim, é isso que eu chamo de dor. | A Anatomia de uma Dor |
| `15cc0baa` | A coisa mais perigosa que podemos fazer é apanhar uma fração da verdade e não perceber que ela é apenas uma fração. | (sem fonte) |
| `208426db` | O cristianismo não é doutrina que devemos acreditar, mas uma vida que devemos viver. | O Peso da Glória |

"Duvidosa" no vault significa que houve busca real e a formulação não foi localizada em fonte primária; não prova que é falsa.
A política de 25/09 foi retirar as duvidosas; estas três ficaram.

### 3. Não localizadas no vault (16)
| id | texto | fonte no banco |
|---|---|---|
| `139977f6` | Uma coisa boa de ler livros velhos é que as modas não os afetam. | Introdução a Sobre a encarnação de Atanásio |
| `17f74df7` | A paixão é o que nos leva a prometer. O amor é o que nos leva a cumprir as promessas. | (sem fonte) |
| `24a89d75` | Nenhum homem sabe o quanto é mau, até se esforçar para ser bom. Só conhecemos a força do vento quando caminhamos contra ele. | Cristianismo Puro e Simples |
| `58505dc8` | Nárnia, Nárnia, desperte! Ame! Pense! Fale! Que as árvores caminhem! Que os animais falem! Que as águas sejam divinas! | O Sobrinho do Mago |
| `73cf6ff3` | Se tentarmos encontrar algo neste mundo que satisfaça nosso desejo mais profundo, perceberemos que a satisfação deste mundo é apenas um eco fugaz d... | Surpreendido pela Alegria |
| `8c1f9b59` | A porta para o inferno está trancada por dentro. | O Problema do Sofrimento |
| `913c5eef` | A educação sem valores, por mais útil que seja, parece apenas fazer do homem um demônio mais esperto. | A Abolição do Homem |
| `a3dfbe3b` | O medo de ser 'fora' é mais forte que qualquer convicção moral. | Aquela Fortaleza Medonha |
| `ae09ee63` | Somos como um ovo. E não podemos continuar indefinidamente sendo apenas um ovo intacto e comum. Ou nos tornamos um pássaro novo, ou apodrecemos. | Cristianismo Puro e Simples |
| `b4225c84` | Um jovem que deseja permanecer um ateu convicto precisa ser muito cuidadoso com sua leitura. | Surpreendido pela Alegria |
| `c0d7c0f2` | Coragem, querido coração. | A Viagem do Peregrino da Alvorada |
| `cb29a240` | Deus não pode dar-nos paz e felicidade à parte dele, pois não existe tal coisa. | Cristianismo Puro e Simples |
| `d5518bea` | O céu não é silencioso — nós é que aprendemos a não ouvir. | Aquela Fortaleza Medonha |
| `dd05a5a9` | O que você vê e o que você ouve depende muito de onde você está. | O Sobrinho do Mago |
| `f3754c5c` | Todos dizem que o perdão é uma ideia maravilhosa até que tenham algo a perdoar. | Cristianismo Puro e Simples |
| `fef40aff` | A obediência é o remédio para a cegueira espiritual. | Cartas de um diabo ao seu aprendiz |

Várias são citações muito conhecidas (por exemplo "Coragem, querido coração", de *A Viagem do Peregrino da Alvorada*); outras têm cara de
frase inspiracional genérica. **Nenhum veredito sai desta lista sem busca em fonte primária.**

### 4. As 8 sem `source` no banco
| id | texto | fonte no banco |
|---|---|---|
| `0e70882b` | Se você está no caminho errado, voltar atrás significa progresso. | (sem fonte) |
| `15cc0baa` | A coisa mais perigosa que podemos fazer é apanhar uma fração da verdade e não perceber que ela é apenas uma fração. | (sem fonte) |
| `17f74df7` | A paixão é o que nos leva a prometer. O amor é o que nos leva a cumprir as promessas. | (sem fonte) |
| `4c765bb2` | Eu oro, porque eu não posso me ajudar. Isso não muda Deus, isso me muda. | (sem fonte) |
| `65e113b5` | O menor ato de bondade hoje é a captura de um ponto estratégico a partir do qual se poderá ser capaz de seguir para vitórias que você nunca sonhou. | (sem fonte) |
| `67b54cc0` | Se você é produto de um universo materialista, porque não se sente em casa aqui? O peixe reclama de o mar ser molhado? | (sem fonte) |
| `86587b88` | Não podemos confiar em nós mesmos nem em nossos melhores momentos. A única atitude fatal é se dar por satisfeito com qualquer coisa que não a perfe... | (sem fonte) |
| `b50e13d4` | Ele nos amou, não porque somos amáveis, mas porque Ele é o amor. | (sem fonte) |

Para estas, o vault acha: uma ❌ (item 1), uma ⚠️ (item 2), quatro ✅ com fonte (juros compostos, carta a Vanauken, *Mere Christianity*, *Collected Letters*),
uma sem marca ("voltar atrás significa progresso") e uma não localizada (a que o banco atribui a Lewis e o vault só acha em nota de Balthasar). Mesmo as confirmadas deveriam ganhar o campo `source`.

## Plano (sem retrabalho)

Princípio: **reaproveitar o veredito do vault; só buscar fonte nova onde o vault não tem veredito.**

1. **FEITO em 18/10/2026 (migration 0013):** retirar a ❌ (item 1) e, pela política de 25/09, as 3 ⚠️ (item 2)? Pelo procedimento "Retirar uma citação" do protocolo
   (apagar no banco, regerar a cópia do Gerador com `npm run quotes:sync`, conferir o canário). São 4 de 156.
2. **FEITO em 18/10/2026 (migration 0014, 4 das 6 que restavam; as outras 2 vão para o item 3):** preencher `source` das 8 sem fonte usando o que o vault já confirma (sem busca nova).
3. **Itens "não localizados" (16)**: uma passada de busca em fonte primária, no mesmo padrão do vault (✅ / ⚠️ / ❌ com a fonte); o que ficar ⚠️ segue a política de retirar.
4. **Itens "sem marca" (122)**: aceitar o veredito de amostragem do vault como "procedência rastreável"; **não refazer**. Registrar no banco `fonte_url`/`verificado_em` apenas
   para as que ganharem página e edição (não inventar fonte para preencher campo).
5. **Corrigir o "~740"** do protocolo: são 281 citações no total (156 de Lewis), não ~740.
6. **Depois**: as 125 de outros autores (281 menos 156) não têm cobertura da auditoria do vault (ela é de Lewis); as 93 adicionadas em 25/09 foram verificadas na hora (WebSearch), as demais (cerca de 32) são legado.
   Mesmo cruzamento, com as notas de cada autor, quando houver interesse.

## O que este relatório NÃO faz

- Não retira nem altera nenhuma citação (decisão do autor, plano item 1).
- Não afirma que as citações "não localizadas" sejam falsas.
- Não substitui a verificação em fonte primária: o vault é o registro, a fonte primária é a prova.
