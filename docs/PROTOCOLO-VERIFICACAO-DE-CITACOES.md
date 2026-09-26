# Protocolo de Verificação de Citações

Regra única: **nenhuma citação entra na tabela `quotes` sem fonte primária
checada de verdade.** Isto existe porque uma não teve — e sobreviveu mais
de um mês em produção, servida em três apps diferentes, até alguém notar
que soava estranha.

## O caso que motivou isto (2026-09-26)

O Gerador de Citações mostrou esta citação, atribuída a C. S. Lewis, "O
Cavalo e seu Menino":

> "Não há obra de literatura que eu poderia escrever, por mais longa que
> seja a vida que me é concedida, que expressaria para vocês um milésimo
> das coisas que estão dentro de mim."

Nunca existiu confirmação nenhuma dela. Checado contra: a página do
Wikiquote dedicada a esse livro (nenhuma ocorrência — as citações reais de
lá são só diálogo entre personagens), Goodreads (zero), Marginalia Search
(zero), Brave Search em português e inglês, frase exata (zero rastro real
nas duas línguas — nem em quote-mill nenhum). O estilo também denuncia:
é reflexão confessional em 1ª pessoa sobre "escrever" e "o que há dentro de
mim" — *O Cavalo e seu Menino* é narrativa infantil em 3ª pessoa, sem
nenhuma passagem parecida com isso em lugar nenhum do livro.

**Por que passou pela auditoria de 21-25/09/2026 sem ser pega:** aquela
auditoria caçava citações que batiam com um banco de **fraudes já
catalogadas** (as do filme *Terra de Sombras*, Rick Warren, Zig Ziglar,
etc.) — fingerprint contra fraude conhecida, não verificação individual de
cada citação contra fonte primária. Uma fabricação nova, sem histórico de
circular por aí, não bate com nenhum fingerprint e passa reto.

**Como ela entrou:** o arquivo `server/scripts/data/quotes-canonical.json`
(seed original da tabela) não tem — e nunca teve — nenhum campo de fonte.
Foi montado por `merge-quotes.ts` a partir de dois arquivos hardcoded de
outros repos (`lecionario-web`, `gerador-cslewis`), sem exigir link de
fonte pra nenhuma entrada. O processo de entrada em si nunca teve o
requisito — não foi um lapso pontual, foi a ausência de um portão.

## A regra, na prática

Antes de rodar qualquer `INSERT INTO quotes`:

1. **Busque a fonte primária de verdade.** Pra citação de livro: confirme
   que o texto exato aparece naquele livro específico — não "parece
   plausível pro estilo do autor", o texto literal precisa bater. Pra
   citação de carta/entrevista/discurso: ache a transcrição/publicação
   real, não um site agregador que também não cita fonte.
2. **Cruze pelo menos 2 fontes independentes quando possível.** Uma
   citação genuína de autor conhecido normalmente aparece em: (a) o texto
   original digitalizado/página do livro, (b) uma página de citações
   curada com rigor acadêmico (Wikiquote é o melhor caso — tem processo de
   remoção de fraude e costuma citar capítulo/edição), (c) uma biografia
   ou coletânea de cartas publicada. Zero dessas três é sinal forte de
   fabricação, não só "raridade".
3. **Desconfie de registro que soa "citação de inspiração" genérica.**
   Frases sobre "as coisas que estão dentro de mim", "seguir seu coração",
   "cada dia é um presente" — sem contexto textual específico — são o
   padrão clássico de fabricação atribuída a autor famoso. Quanto mais
   universal/vaga a frase, mais peso a verificação precisa ter, não menos.
4. **Confira se o registro bate com o gênero da fonte alegada.** Uma
   citação atribuída a um romance/conto precisa soar como aquele
   romance — narrativa, diálogo de personagem, voz do narrador daquele
   livro específico. Reflexão confessional em 1ª pessoa do autor sobre a
   própria obra não pertence a um romance, pertence (quando existe) a uma
   carta, prefácio ou ensaio.
5. **Preencha `fonte_url` e `verificado_em`** no INSERT com a URL real que
   confirma a citação e a data da checagem. Sem URL real pra colocar aí, a
   citação não entra — não existe meio-termo de "confio no meu instinto".
6. **Não confirmou com certeza real?** Não insere. Isto aqui é um banco de
   produção citado por três apps públicos, não um rascunho de vault onde
   dá pra marcar ⚠️ duvidosa e revisar depois. Fora do vault, o padrão é
   binário: entra com fonte real, ou não entra.
7. **Nunca gere citações em lote sem checar cada uma individualmente.**
   Pedir "20 citações do autor X sobre o tema Y" pra qualquer ferramenta
   (IA, agregador, memória) e inserir o resultado direto é exatamente o
   processo que produziu o incidente deste documento. Cada citação nova,
   mesmo vindo de uma lista maior, passa pelos passos 1-5 uma por uma.

## Depois de qualquer mudança na tabela `quotes`

Rodar `pnpm --filter server exec tsx scripts/export-quotes-canonical.ts`
contra o banco de produção, pra manter `quotes-canonical.json` fiel ao
estado real. Esse export existe porque o JSON ficou um mês desatualizado
depois da diversificação de autores de 25/09/2026 (174→284 citações) — se
`seed-quotes.ts` fosse rodado de novo nesse meio tempo por qualquer
motivo, teria apagado tudo aquilo e ressuscitado a citação fabricada.
`merge-quotes.ts` está marcado como histórico — não gera mais o JSON, só
existe como referência de como o merge original foi feito.

## Migração de produção

Segue o mesmo padrão já estabelecido no projeto: backup (`pg_dump`) →
dry-run (`ROLLBACK` no lugar de `COMMIT`) → execução real dentro de
`BEGIN...COMMIT` via `psql -v ON_ERROR_STOP=1`. Ver histórico de scripts em
`scripts/*.sql` pra exemplos reais já aplicados.

## Pendência conhecida, fora do escopo deste protocolo

As ~740 citações já existentes na tabela (a maioria da leva original, sem
`fonte_url` preenchido) não foram retroauditadas — isso é um projeto
separado, maior, já registrado como pendência. Este protocolo vale pra
**entrada nova** a partir de 26/09/2026; não é uma promessa retroativa de
que tudo que já está lá tem fonte confirmada.
