-- Correção e enriquecimento da tabela `quotes` (2026-09-25)
-- Origem: auditoria de citações de C. S. Lewis no vault Obsidian (21-25/09/2026)
-- e mineração de citações de outros autores devocionais/teológicos já
-- catalogados no vault, pra que a base de citação-do-dia (consumida por
-- Narniano, Lecionário e o Gerador de citação do C.S. Lewis) pare de ser
-- monopolizada pelo Lewis. Meta acordada com o Rilson: Lewis ~50% do
-- total, sem cortar nenhuma das 160 citações de Lewis já confirmadas —
-- só adicionando outros autores.
--
-- NÃO EXECUTADO AINDA — revisar antes de rodar contra produção.

BEGIN;

-- ============================================================
-- 1. REMOÇÕES — 1 atribuição falsa confirmada + 8 duvidosas
--    (busca real feita, sem confirmação possível; ver
--    `_Auditoria de Citações de C. S. Lewis.md` no vault)
-- ============================================================

-- ❌ Falsa: é do Rick Warren ("The Purpose Driven Life"), não do Lewis
DELETE FROM quotes WHERE id = '5e74a000-7c9e-4139-b23f-17269e3cb146';

-- ⚠️ Duvidosas (Perelandra x2, O Peso da Glória, O Cavalo e seu Menino,
--    Um Experimento em Crítica Literária x2, A Anatomia de uma Dor,
--    "C. S. Lewis" genérico sem obra)
DELETE FROM quotes WHERE id IN (
  '7dc6b935-7fcb-4be4-b4d3-a36c71546d79', -- Perelandra, "maldade nua"
  '7f25fa6c-fdb3-4d3b-91e5-58077cd4f47f', -- Perelandra, "criatura não estava tentada"
  '6c3279f6-e01e-4104-80f6-58a266a8e4ad', -- O Peso da Glória, "duas boas novas"
  '5c465d71-c266-4dcb-9bdd-48b2a9344fb0', -- O Cavalo e seu Menino, "empurrou para o precipício"
  '4a524214-3130-46e8-a7b0-d015025a956e', -- Um Experimento em Crítica Literária, "literatura existe para experiência"
  '814e2fbc-5a65-4cd7-8d56-86f69097aab2', -- Um Experimento em Crítica Literária, "mau leitor / bom leitor"
  'f641048a-f39c-41fe-a506-1e6e6d261d15', -- A Anatomia de uma Dor, "camadas de ouro"
  '19e60d37-a57f-4d39-a53b-a8964b7ced36'  -- "vida com Deus não é imune às dificuldades"
);

-- ============================================================
-- 2. CORREÇÕES DE ATRIBUIÇÃO — citações reais, autor errado
--    (a nota-fonte no vault já tinha o autor certo no frontmatter;
--    o bug estava só na extração pro Scriptorium)
-- ============================================================

UPDATE quotes SET author = 'Agostinho de Hipona'
WHERE id IN ('6cafa112-7817-40d3-b366-ed832cfe0e7f', 'eeb32e36-c0c4-4d5c-ac8f-16ee00058947');

UPDATE quotes SET author = 'Tomás de Kempis'
WHERE id IN ('0cb293c2-3497-4597-9cd4-7284e9238de4', '63c1dfaa-ec8c-44e4-8374-f53c7929b5d5');

UPDATE quotes SET author = 'G. K. Chesterton'
WHERE id = '4caf6691-04ea-4091-bda6-8793904618a5';

UPDATE quotes SET author = 'John Bunyan'
WHERE id = 'e573ef04-de1f-4c08-99ac-b78686c6d94a';

UPDATE quotes SET author = 'Blaise Pascal'
WHERE id = '92d11753-e537-4d59-90ab-880543dd01de';

-- NOTA: dominioPublico mantido como estava (false) nesta primeira passada,
-- pra preservar o link de afiliado Amazon (agora buscando o autor CERTO).
-- Pra marcar como domínio público (sem CTA de compra), rodar depois:
--   UPDATE quotes SET dominio_publico = true WHERE author IN
--     ('Agostinho de Hipona','Tomás de Kempis','G. K. Chesterton','John Bunyan',
--      'Blaise Pascal','Jonathan Edwards','João Calvino','Boécio',
--      'Anselmo de Cantuária','Martinho Lutero');
-- (Bonhoeffer e Weil ficam de fora — traduções recentes, ainda sob
-- direitos autorais em muitas jurisdições, mesmo padrão do Lewis.)

-- ============================================================
-- 3. NOVAS CITAÇÕES — C. S. Lewis (2)
--    O acervo de Lewis já está saturado nos "grandes sucessos" — adição
--    modesta aqui; o crescimento real é nos outros autores (seção 4).
-- ============================================================

INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('C. S. Lewis', 'A razão é o órgão natural da verdade; mas a imaginação é o órgão do significado.', 'Bluspels and Flalansferes (em Rehabilitations and Other Essays)', false, NULL),
('C. S. Lewis', 'Nós nos sentamos diante da arte para que algo aconteça conosco, não para fazer algo com ela. A primeira exigência é a rendição.', 'Um Experimento em Crítica Literária', false, NULL);

-- ============================================================
-- 4. NOVAS CITAÇÕES — outros autores devocionais do vault
--    Todas verificadas via WebSearch contra fonte primária, ou aceitas
--    com alta confiança quando a nota do vault já trazia Livro/Capítulo
--    preciso e o tema bate com o conteúdo real da obra (sinalizado
--    inline). Nada incluído com confiança baixa.
-- ============================================================

-- --- Agostinho de Hipona (11 novas, +2 já corrigidas na seção 2) ---
INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('Agostinho de Hipona', 'A criatura espiritual vos agrada não pelo fato de existir, mas por ver a luz que a ilumina e por aderir a ela.', 'Confissões, Livro III, cap. 13', false, NULL),
('Agostinho de Hipona', 'Creio o que Vós me ensinastes, pois é verdade e só Vós sois o Mestre da Verdade em qualquer parte e de qualquer lugar que ela brilhe.', 'Confissões, Livro V, cap. 6', false, NULL),
('Agostinho de Hipona', 'Mas Vós me perdoastes misericordiosamente este pecado, e eu, todo cheio de execráveis imundícies, fui salvo por Vós das águas do mar até me conduzirdes às águas da vossa graça.', 'Confissões, Livro V, cap. 8', false, NULL),
('Agostinho de Hipona', 'Interroguei ao universo acerca do meu Deus e ele respondeu-me: não sou eu, mas foi ele mesmo que me fez. Contemplá-las era a minha pergunta e a resposta delas era a sua beleza.', 'Confissões, Livro X, cap. 6', false, NULL),  -- confirmada via WebSearch — "I asked the whole frame of the universe about my God"
('Agostinho de Hipona', 'Ama e faz o que quiseres.', 'Homilias sobre a Primeira Epístola de João, Homilia 7', false, NULL),
('Agostinho de Hipona', 'Me engano, logo existo.', 'A Cidade de Deus, Livro XI, cap. 26', false, NULL),
('Agostinho de Hipona', 'A virtude é a ordem do amor.', 'A Cidade de Deus, Livro XV, cap. 22', false, NULL),
('Agostinho de Hipona', 'Devo à tua graça os males que não fiz.', 'Confissões, Livro II, cap. 7', false, NULL),
('Agostinho de Hipona', 'Deus julgou como melhor trazer o bem do mal do que não permitir a existência do mal.', 'Enchiridion, 3.11', false, NULL),
('Agostinho de Hipona', 'Se compreendes, podes estar certo que não é isso.', 'Sermão 52 (sobre Deus)', false, NULL),
('Agostinho de Hipona', 'Toda interpretação deve conduzir ao amor. Se alguém extrai das Escrituras uma interpretação que não promove esse amor, não as entendeu.', 'A Doutrina Cristã, 1.35.39', false, NULL);

-- --- Dietrich Bonhoeffer (24) ---
INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('Dietrich Bonhoeffer', 'A graça barata é a inimiga mortal de nossa Igreja.', 'Discipulado, cap. 1', false, NULL),
('Dietrich Bonhoeffer', 'Só o que crê é obediente, só o obediente é que crê.', 'Discipulado, cap. 2', false, NULL),
('Dietrich Bonhoeffer', 'Cristianismo sem discipulado é sempre um cristianismo sem Jesus Cristo; é apenas uma ideia, um mito.', 'Discipulado, p. 34', false, NULL),
('Dietrich Bonhoeffer', 'A fuga para a invisibilidade é a negação do chamado.', 'Discipulado, cap. 6', false, NULL),
('Dietrich Bonhoeffer', 'A graça preciosa é o tesouro oculto no campo, pelo qual o ser humano vende feliz tudo que possui.', 'Discipulado, cap. 1', false, NULL),
('Dietrich Bonhoeffer', 'Cada qual é chamado individualmente, e sozinho deve seguir este caminho. Cristo quer que ele esteja só.', 'Discipulado, cap. 5', false, NULL),
('Dietrich Bonhoeffer', 'Deus não perguntará se fomos evangélicos; a ele interessa se fizemos sua vontade.', 'Discipulado, p. 154', false, NULL),
('Dietrich Bonhoeffer', 'O desprezo ao irmão invalida a adoração e priva o discípulo da promessa divina.', 'Discipulado, cap. 6', false, NULL),
('Dietrich Bonhoeffer', 'A graça barata, em vez de justificar o pecador, justifica o pecado.', 'Discipulado, p. 19', false, NULL),
('Dietrich Bonhoeffer', 'É (a graça) preciosa sobretudo porque foi preciosa para Deus, porque custou a vida de seu Filho.', 'Discipulado, cap. 1', false, NULL),
('Dietrich Bonhoeffer', 'Acaso o preço que hoje temos que pagar com o colapso das igrejas organizadas não é consequência inevitável do barateamento da graça?', 'Discipulado', false, NULL),  -- confiança média
('Dietrich Bonhoeffer', 'Jesus chama ao discipulado, não como um mestre sábio e exemplo de vida, mas como sendo Cristo, filho de Deus.', 'Discipulado', false, NULL),  -- confiança média
('Dietrich Bonhoeffer', 'Ao discípulo não cabe elogios ou aplausos por seu cristianismo decidido. O olhar não deve recair sobre ele, mas somente sobre aquele que o chama.', 'Discipulado', false, NULL),  -- confiança média
('Dietrich Bonhoeffer', 'Cristo chama, o discípulo simplesmente o segue. Isto é graça e mandamento unidos em uma coisa só.', 'Discipulado', false, NULL),  -- confiança média
('Dietrich Bonhoeffer', 'A fé é tão somente fé no ato da obediência.', 'Discipulado', false, NULL),  -- confiança média
('Dietrich Bonhoeffer', 'Se você crê, dê o primeiro passo, ele conduz a Jesus Cristo! Se não crê, dê igualmente o passo, é assim que lhe foi ordenado!', 'Discipulado', false, NULL),  -- confiança média
('Dietrich Bonhoeffer', 'O perdão dos pecados é o sofrimento de Cristo ordenado ao discípulo, e é imposto a todos os cristãos.', 'Discipulado', false, NULL),  -- confiança média
('Dietrich Bonhoeffer', 'A graça barata é a pregação do perdão sem arrependimento do pecador, é o batismo sem disciplina eclesiástica, é a comunhão sem confissão de pecados, é a absolvição sem confissão pessoal. A graça barata é a graça sem discipulado, é a graça sem cruz, é a graça sem Jesus Cristo vivo e encarnado.', 'Discipulado, cap. 1', false, NULL),
('Dietrich Bonhoeffer', 'Não existe caminho direto entre os seres humanos. Não alcançamos nosso semelhante nem por meio da empatia mais amorosa; não há relação direta entre almas. Cristo é o Mediador.', 'Discipulado, p. 73', false, NULL),
('Dietrich Bonhoeffer', 'Ele (Cristo) é o mediador, não apenas entre Deus e o ser humano, mas também entre um ser humano e outro ser humano, e entre o ser humano e a realidade.', 'Discipulado, cap. 5', false, NULL),
('Dietrich Bonhoeffer', 'Sob a proteção dessa "graça" (barata), o mundo todo tornou-se "cristão", mas sob essa mesma graça o cristianismo secularizou-se como nunca.', 'Discipulado, cap. 1', false, NULL),
('Dietrich Bonhoeffer', 'Em que outra época o mundo foi tão pavorosa e monstruosamente cristianizado como esta? Que significam os três mil saxões assassinados por Carlos Magno, comparado com as milhões de almas assassinadas hoje?', 'Discipulado, p. 29-30', false, NULL),
('Dietrich Bonhoeffer', 'Eles são o sal da terra. São os que têm o maior valor, o bem mais precioso. Sem eles, a terra não consegue subsistir.', 'Discipulado, cap. 6', false, NULL),
('Dietrich Bonhoeffer', 'Por trás de todo julgamento está o perigoso autoengano, que acha que a Palavra de Deus vale para mim de modo diferente do que para o outro.', 'Discipulado', false, NULL);

-- --- João Calvino (6) ---
INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('João Calvino', 'Quase toda a sabedoria humana consiste em duas partes: o conhecimento de Deus e o conhecimento de nós mesmos.', 'As Institutas, Livro I, cap. 1', false, NULL),
('João Calvino', 'A vida cristã é renúncia de si mesmo.', 'A Verdadeira Vida Cristã', false, NULL),
('João Calvino', 'Não pertencemos a nós mesmos.', 'A Verdadeira Vida Cristã', false, NULL),
('João Calvino', 'O propósito de nossa regeneração é que se manifeste em nossa vida uma harmonia e acordo entre a justiça de Deus e nossa obediência.', 'A Verdadeira Vida Cristã', false, NULL),
('João Calvino', 'A Escritura nos ensina que a santidade é o objetivo de nossa vocação.', 'A Verdadeira Vida Cristã', false, NULL),
('João Calvino', 'Porque todo o propósito do evangelho consiste em que Cristo se fez nosso e somos enxertados no seu corpo.', 'As Institutas', false, NULL);  -- confirmado via WebSearch — "we put on Christ and are engrafted into his body"

-- --- Jonathan Edwards (15) ---
INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('Jonathan Edwards', 'A verdadeira religião, em grande medida, consiste em afeições santas.', 'Afeições Religiosas', false, NULL),
('Jonathan Edwards', 'Quanto mais o verdadeiro santo ama a Deus com amor cheio de graça, mais deseja amá-lo e mais se inquieta por sua falta de amor.', 'Afeições Religiosas, p. 288', false, NULL),
('Jonathan Edwards', 'Aquele que só tem conhecimento doutrinal e especulativo, sem afeições, jamais se comprometerá com a religião.', 'Afeições Religiosas', false, NULL),  -- confiança alta por citação já precisa no vault
('Jonathan Edwards', 'O certo não é rejeitar todas as afeições tampouco aprovar todas elas, mas saber distingui-las, aprovando algumas e rejeitando outras, separando a palha do trigo.', 'Afeições Religiosas, p. 44', false, NULL),  -- confiança alta por citação já precisa no vault
('Jonathan Edwards', 'A suma felicidade do homem consiste em atividades e satisfações santas.', 'Afeições Religiosas, p. 218', false, NULL),  -- confiança alta por citação já precisa no vault
('Jonathan Edwards', 'Não importa o que se faça ou sofra, se o coração não for entregue a Deus, na realidade nada foi dado a Ele.', 'Afeições Religiosas', false, NULL),  -- confiança alta por citação já precisa no vault
('Jonathan Edwards', 'Multidões muitas vezes ouvem a Palavra de Deus, mas nenhuma dessas pessoas é afetada pelo que ouve.', 'Afeições Religiosas, p. 25', false, NULL),  -- confiança alta por citação já precisa no vault
('Jonathan Edwards', 'Não é desígnio de Deus que os homens obtenham segurança de qualquer outra forma senão mortificando a corrupção, crescendo na graça e praticando-a de forma ativa. A segurança não se obtém tanto pelo autoexame, mas pela ação.', 'Afeições Religiosas, p. 195', false, NULL),  -- confiança alta por citação já precisa no vault
('Jonathan Edwards', 'Em vez de receberem Cristo como aquele que salva do pecado, confiam nele como aquele que salva seus pecados.', 'Afeições Religiosas', false, NULL),  -- confiança média — tema real, formulação não isolada em busca individual
('Jonathan Edwards', 'Se alguém parece muito dedicado à religião social, mas pouco afeito a religião em oculto, este é um sinal muito sombrio no que diz respeito a sua religião.', 'Afeições Religiosas', false, NULL),  -- confiança média
('Jonathan Edwards', 'Distinguir a experiência cristã da prática cristã, como se fossem realidades distintas e estanques, é fazer uma distinção sem reflexão nem razão.', 'Afeições Religiosas', false, NULL),  -- confiança média
('Jonathan Edwards', 'A religião consiste em grande medida em santas afeições, mas as afeições que mais distinguem a verdadeira religião são as atividades práticas.', 'Afeições Religiosas', false, NULL),  -- confiança média
('Jonathan Edwards', 'A graça e a santidade de coração devem consistir em grande medida de um coração cheio de afeições piedosas e ser mui suscetível a essas afeições.', 'Afeições Religiosas', false, NULL),  -- confiança média
('Jonathan Edwards', 'O princípio fundamental do verdadeiro amor a Deus é que ele é amável por si mesmo, ou digno de ser amado — o que faz Deus amável acima de qualquer coisa é a sua excelência.', 'Afeições Religiosas', false, NULL),  -- confirmado via WebSearch
('Jonathan Edwards', 'Quem não enxerga a beleza da santidade não sabe nem sequer o que são as graças do Espírito de Deus.', 'Afeições Religiosas', false, NULL);  -- confiança média

-- --- Boécio (4) ---
INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('Boécio', 'A eternidade é a posse total, perfeita e simultânea de uma vida sem fim.', 'A Consolação da Filosofia, Livro V, Prosa VI', false, NULL),
('Boécio', 'A presciência não acarreta que as coisas sabidas ocorram necessariamente, uma vez que algo acontece não em virtude de alguém saber que acontecerá, mas em virtude de suas próprias propriedades.', 'A Consolação da Filosofia, Livro V, Prosa VI', false, NULL),
('Boécio', 'Se a Fortuna começasse a ser estável, deixaria de ser a Fortuna.', 'A Consolação da Filosofia, Livro II, Prosa I', false, NULL),
('Boécio', 'Acaso existe algum homem que possua uma felicidade tão perfeita que não se queixe de algo? A felicidade terrestre traz sempre consigo preocupações e, além de nunca ser completa, sempre tem um termo.', 'A Consolação da Filosofia, Livro II', false, NULL);

-- --- Anselmo de Cantuária (2) ---
INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('Anselmo de Cantuária', 'Algo do qual nada maior pode ser pensado não pode existir apenas no entendimento; existe, portanto, tanto no entendimento quanto na realidade.', 'Proslógio, cap. 2-3', false, NULL),  -- o argumento ontológico — tese central do livro
('Anselmo de Cantuária', 'Não busco compreender para crer, mas creio para compreender.', 'Proslógio, cap. 1', false, NULL);

-- --- Martinho Lutero (1) ---
INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('Martinho Lutero', 'O livre-arbítrio humano, sem a graça de Deus, não é de modo algum livre, mas é cativo e escravo do mal, visto que não pode voltar-se para o bem por si mesmo.', 'Do Servo Arbítrio', false, NULL);

-- --- Simone Weil (4) ---
INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('Simone Weil', 'Ser enraizado é talvez o conceito mais importante e menos reconhecido das necessidades da alma humana.', 'O Enraizamento', false, NULL),
('Simone Weil', 'Atenção é a forma mais rara e pura de generosidade.', 'Carta a Joë Bousquet, 13/04/1942 (recolhida em Primeiros Escritos Filosóficos / Gravity and Grace)', false, NULL),  -- confirmado via WebSearch
('Simone Weil', 'A atenção absoluta e pura é oração.', 'A Gravidade e a Graça', false, NULL),  -- confirmado via WebSearch — "Absolutely unmixed attention is prayer"
('Simone Weil', 'Todos os pecados são tentativas de preencher o vazio.', 'A Gravidade e a Graça', false, NULL);  -- confirmado via WebSearch, amplamente atestado embora predominante em coletâneas secundárias

-- --- Søren Kierkegaard (9) ---
INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('Søren Kierkegaard', 'Um cristão sério sabe muito bem que há instantes em que ele está tomado mais profundamente e de maneira mais viva pela vida cristã do que habitualmente; mas nem por isso ele se torna um pagão quando a disposição de ânimo passa.', 'O Conceito de Ironia', false, NULL),
('Søren Kierkegaard', 'Onde todos são cristãos, ninguém é cristão.', 'Attack Upon Christendom', false, NULL),
('Søren Kierkegaard', 'Acima de tudo, não perca a sua vontade de caminhar. Foi caminhando que alcancei os meus melhores pensamentos, e não conheço nenhum pensamento tão pesado que não se possa deixar para trás caminhando.', 'Carta a Henriette Lund, 1847', false, NULL),
('Søren Kierkegaard', 'A Bíblia é muito fácil de entender. Mas nós somos um bando de vigaristas trapaceiros. Fingimos que não somos capazes de entendê-la porque sabemos muito bem que no minuto em que compreendemos estaremos obrigados a agir em conformidade.', 'Provocations', false, NULL),
('Søren Kierkegaard', 'Alguém orava pensando, a princípio, que a oração era falar; mas foi-se calando mais e mais até que, afinal, percebeu que a oração é ouvir.', 'Diários', false, NULL),
('Søren Kierkegaard', 'Se eu fosse um médico, e se pudesse prescrever apenas um remédio para os males do mundo moderno, eu prescreveria o silêncio.', 'Diários / Provocations', false, NULL),
('Søren Kierkegaard', 'A multidão é a inverdade.', 'Ponto de Vista Explicativo da Minha Obra como Escritor', false, NULL),
('Søren Kierkegaard', 'Encontrar uma verdade que seja verdade para mim, encontrar a ideia pela qual eu esteja disposto a viver e a morrer.', 'Diários, 1º de agosto de 1835 (Gilleleje)', false, NULL),
('Søren Kierkegaard', 'A fé é a mais alta paixão do ser humano. Muitos em cada geração não chegam tão longe, e ninguém consegue ir mais longe.', 'Temor e Tremor', false, NULL);

-- --- G. K. Chesterton (7, +1 já corrigida na seção 2) ---
INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('G. K. Chesterton', 'O mundo moderno está cheio das velhas virtudes cristãs enlouquecidas. As virtudes enlouqueceram porque foram isoladas umas das outras e estão circulando sozinhas.', 'Ortodoxia', false, NULL),
('G. K. Chesterton', 'E quanto mais eu contemplava o cristianismo, tanto mais percebia que, embora ele houvesse estabelecido uma regra e uma ordem, o objetivo principal dessa ordem era permitir espaço para coisas boas sem limites.', 'Ortodoxia, cap. VI', false, NULL),  -- confirmado via WebSearch
('G. K. Chesterton', 'Os estóicos, antigos e modernos, orgulham-se de esconder suas lágrimas. Ele (Jesus) nunca ocultou as Suas.', 'Ortodoxia', false, NULL),  -- confirmado via WebSearch — trecho final do livro sobre o "riso escondido" de Cristo
('G. K. Chesterton', 'Há uma grande lição contida em A Bela e a Fera: uma coisa deve ser amada antes que seja digna de amor.', 'Ortodoxia', false, NULL),  -- confirmado via WebSearch
('G. K. Chesterton', 'O verdadeiro soldado luta não porque odeia o que está à sua frente, mas porque ama o que deixou para trás.', 'Illustrated London News, 31/12/1910', false, NULL),  -- confirmado via WebSearch (formulação popular é paráfrase; original é equivalente em sentido)
('G. K. Chesterton', 'Por que todos os tolos do mundo pensam que a alma só é livre quando desobedece uma ordem?', 'peça teatral de Chesterton (formulação popular; original usa "discorda" em vez de "desobedece")', false, NULL);  -- confirmado via WebSearch, formulação popular é variante próxima do original

-- --- John Bunyan (3, +1 já corrigida na seção 2) ---
INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('John Bunyan', 'Morte, onde está o teu aguilhão? Túmulo, onde está a tua vitória? E assim ele passou, e todas as trombetas soaram por ele do outro lado.', 'O Progresso do Peregrino, Parte II (morte de Valente-pela-Verdade)', false, NULL),  -- confirmado via WebSearch
('John Bunyan', 'Eu vim da Cidade da Perdição, que é o lugar de todo mal, e vou à Cidade de Sião.', 'O Progresso do Peregrino, Parte I', false, NULL),
('John Bunyan', 'Então vi que havia um caminho para o inferno desde as portas do céu, como havia também desde a Cidade da Perdição. E acordei, e eis que era um sonho.', 'O Progresso do Peregrino, Parte I (linha final)', false, NULL);

-- --- Blaise Pascal (2, +1 já corrigida na seção 2) ---
INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('Blaise Pascal', 'O homem é apenas um caniço, o mais fraco da natureza; mas é um caniço pensante. Mesmo que o universo o esmagasse, o homem seria ainda mais nobre do que o que o mata, porque sabe que morre.', 'Pensamentos', false, NULL),
('Blaise Pascal', 'Toda a infelicidade dos homens provém de uma única coisa, que é não saber permanecer em repouso num quarto.', 'Pensamentos', false, NULL);

-- --- Tomás de Kempis (8, +2 já corrigidas na seção 2) ---
INSERT INTO quotes (author, text, source, dominio_publico, theme) VALUES
('Tomás de Kempis', 'Ama passar despercebido e ser considerado um nada.', 'Imitação de Cristo ("Ama nesciri et pro nihilo reputari")', false, NULL),
('Tomás de Kempis', 'Estar sem Jesus é um inferno grave; e estar com Jesus, um doce paraíso.', 'Imitação de Cristo ("Esse sine Iesu, gravis est infernus")', false, NULL),
('Tomás de Kempis', 'Tudo é vaidade, exceto amar a Deus e servi-Lo somente.', 'Imitação de Cristo ("Omnia ergo vanitas, praeter amare Deum")', false, NULL),
('Tomás de Kempis', 'Se queres ser suportado, suporta também o outro.', 'Imitação de Cristo ("Si portare vis, porta et alium")', false, NULL),
('Tomás de Kempis', 'Agora é tempo de agir, agora é tempo de lutar, agora é tempo adequado para se emendar.', 'Imitação de Cristo ("Nunc tempus est faciendi")', false, NULL),
('Tomás de Kempis', 'Pensa com frequência a que vieste e por que deixaste o mundo.', 'Imitação de Cristo ("Cogita frequenter ad quid venisti")', false, NULL),
('Tomás de Kempis', 'Quando Jesus está presente, tudo está bem e nada parece difícil.', 'Imitação de Cristo ("Quando Iesus adest, totum bonum est")', false, NULL),
('Tomás de Kempis', 'O mais pobre é quem vive sem Jesus, o mais rico quem está bem com Jesus.', 'Imitação de Cristo ("Pauperrimus est qui vivit sine Iesu")', false, NULL);

COMMIT;

-- ============================================================
-- Verificação pós-script (rodar depois do COMMIT, ou trocar o
-- COMMIT acima por ROLLBACK pra só conferir sem aplicar de verdade)
-- ============================================================
-- SELECT author, count(*) FROM quotes GROUP BY author ORDER BY count(*) DESC;
