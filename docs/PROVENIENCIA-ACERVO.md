# Proveniência das traduções por IA

Registro vivo da **edição-fonte** de cada tradução por IA do acervo. Gerado em 2026-10-17 a partir
do banco de produção (232 obras com `translation_is_ai = true`, 229 delas publicadas). A
classificação é uma **triagem automática por palavras-chave** na atribuição declarada; serve para
decidir por onde começar, não é parecer jurídico. Confirmar à mão obra a obra.

## Por que existe

Um texto de autor morto há séculos é de domínio público. O que decide o risco é **de qual texto a
tradução partiu**: uma **edição crítica moderna** (um editor reconstruiu o texto a partir de
manuscritos, com aparato) ou uma **tradução moderna** podem ter proteção própria, e uma tradução
feita a partir delas pode ser obra derivada. Em alguns países há até um direito específico sobre
edições críticas de obras em domínio público; como o Brasil trata isso é pergunta para o jurídico.
A regra 3 do README exige proveniência verificável; este arquivo é o controle dessa regra.

O texto exibido ao público diz só o essencial (tradução gerada por IA, licença). A proveniência
detalhada fica aqui e no verificador do acervo.

## Faixas de risco

| Faixa | O que significa | Obras | Ação sugerida |
|---|---|---:|---|
| **A, baixo** | Fonte nomeada e antiga (Migne, Corpus Reformatorum, Schaff/NPNF/ANF, edições do século XIX) | 24 | Conferir uma amostra e registrar como verificada |
| **B, médio** | Reimpressão moderna de texto antigo (Banner of Truth), Weimarer Ausgabe, Leonina/Quaracchi, Annecy, ou fonte nomeada a classificar | 28 | Identificar a edição original antiga por trás da reimpressão; se a tradução usou só o texto antigo, corrigir a atribuição para a edição antiga |
| **C, alto** | Edição crítica ou tradução moderna (Sources Chrétiennes, CCSL, CSEL, BAC, Quint, Yale, Lafuma/Sellier, Leclercq, "edição crítica" sem editor) | 60 | Prioridade da auditoria. Ver "O que fazer com a faixa C" |
| **D, sem fonte** | A atribuição não nomeia a edição-fonte | 120 | Descobrir de qual texto a tradução partiu e nomear; só então classificar em A, B ou C |

## O que fazer com a faixa C

1. **Descobrir a fonte real.** A atribuição pode ter sido escrita pelo pipeline sem que aquela edição tenha sido de fato usada. Quando houver registro do que entrou no pipeline, ele vale mais que a atribuição.
2. **Se a fonte real é antiga** (Migne, tradução inglesa do século XIX, edição de domínio público): corrigir a atribuição. Obra resolvida.
3. **Se a fonte real é a edição crítica moderna:** trocar a base por um texto antigo equivalente (Migne PG/PL, ANF/NPNF, edições do século XIX) e traduzir de novo; ou pedir autorização à editora; ou ocultar a obra pela chave "Publicada" enquanto isso. Ocultar é reversível e não perde nada.
4. **Enquanto a auditoria não termina:** manter o canal "Avise-nos" visível, responder rápido e ocultar na hora qualquer obra contestada. Registrar a contestação aqui.
5. **Perguntas para o jurídico:** (a) a edição crítica moderna gera direito sobre o texto reconstruído no Brasil? (b) uma tradução por IA a partir de domínio público tem titular? (c) a licença CC BY-SA é válida nesse caso? (d) o Amazon afiliado e o AdSense, se existirem no site, mudam a exposição?

## Como manter

Ao verificar uma obra, mude a faixa e anote aqui a fonte confirmada, quem confirmou e a data. O
verificador do acervo (`pnpm --filter server acervo:verificar`) lista como INFO as obras com
"edição-fonte não nomeada". Ao adicionar obra nova, nomear a edição-fonte já na atribuição (ver o
modelo em `docs/GERENCIAR-ACERVO.md`).


## Faixa C: risco alto (auditar primeiro)

| Slug | Título | Publicada | Fonte declarada |
|---|---|---|---|
| `caminho-de-perfeicao-teresa-de-avila` | Caminho de Perfeição | sim | manuscrito do Escorial/BAC |
| `cantico-espiritual-joao-da-cruz` | Cântico Espiritual | sim | manuscrito de Sanlúcar e da edição clássica da BAC |
| `livro-da-vida-teresa-de-avila` | Livro da Vida | sim | manuscrito autógrafo do Escorial (BAC) |
| `noite-escura-da-alma-joao-da-cruz` | Noite Escura da Alma | sim | edições críticas do Pe. Silverio de Santa Teresa e Lucinio del Santísimo Sacramento (BAC) |
| `o-castelo-interior-teresa-de-avila` | O Castelo Interior: As Sete Moradas | sim | autógrafo de El Escorial e da edição crítica do Pe. Silverio de Santa Teresa (BAC) |
| `subida-do-monte-carmelo-joao-da-cruz` | Subida do Monte Carmelo | sim | Biblioteca de Autores Cristianos (BAC) |
| `a-unidade-da-igreja-catolica` | A Unidade da Igreja Católica | sim | texto latino clássico da edição crítica do CSEL (ed. G. Hartel) |
| `sobre-a-oracao-dominical` | Sobre a Oração Dominical | sim | texto latino clássico do CSEL (ed. G. Hartel) e Patrologia Latina (PL 4) |
| `a-consolacao-da-filosofia-boecio` | A Consolação da Filosofia | sim | CCSL 94 |
| `a-doutrina-crista-agostinho` | A Doutrina Cristã | sim | edição crítica de J. Martin (CCSL 32) e Bibliothèque Augustinienne (BA 11/2) |
| `a-trindade-santo-agostinho` | A Trindade (De Trinitate) | sim | edição crítica do CCSL (vols. 50 e 50A) e PL 42 |
| `a-utilidade-da-fe-agostinho` | A Utilidade da Fé | sim | Corpus Christianorum Series Latina (CCSL 25) |
| `apologetico-tertuliano` | Apologético | sim | Corpus Christianorum Series Latina (CCSL 1) |
| `enchiridion-agostinho` | Enquirídio: Sobre a Fé, a Esperança e a Caridade | sim | edição crítica latina do CCSL (vol. 46, ed. E. Evans) e PL 40 |
| `sobre-a-paciencia-agostinho` | Sobre a Paciência | sim | Corpus Christianorum Series Latina (CCSL 41) |
| `sobre-o-mestre-agostinho` | Sobre o Mestre (De Magistro) | sim | texto crítico do CCSL (vol. 29) e PL 32 |
| `tratado-primeira-epistola-sao-joao-agostinho` | Tratado sobre a Primeira Epístola de São João | sim | CCSL 36 e PL 35 |
| `a-encarnacao-do-verbo` | A Encarnação do Verbo | sim | grego clássico (De Incarnatione Verbi Dei), cotejada com a edição crítica de Archibald Robertson (NPNF, vol. 4 |
| `cartas-a-nestorio-cirilo-alexandria` | Cartas Dogmáticas a Nestório e os Doze Anátemas | sim | texto crítico de Éfeso em domínio público |
| `cartas-de-inacio-de-antioquia` | Cartas de Santo Inácio de Antioquia | sim | texto grego clássico da recensão média (J. B. Lightfoot, The Apostolic Fathers, 1889/1891) |
| `compendio-de-teologia-tomas-de-aquino` | Compêndio de Teologia | sim | edição crítica leonina e Corpus Thomisticum |
| `epistola-e-martirio-de-policarpo` | Epístola aos Filipenses e o Martírio de São Policarpo | sim | texto grego clássico da recensão crítica de J. B. Lightfoot (The Apostolic Fathers, 1889/1891) |
| `introducao-a-vida-devota-francisco-de-sales` | Introdução à Vida Devota (Filoteia) | sim | edição crítica definitiva da Ordem da Visitação de Annecy |
| `itinerario-da-mente-para-deus-boaventura` | O Itinerário da Mente para Deus | sim | edição crítica de Quaracchi (S. Bonaventurae Opera Omnia, Tomo V) |
| `o-catecismo-menor-martinho-lutero` | O Catecismo Menor | sim | texto crítico de Weimarer Ausgabe (WA 30) e Concordia Triglotta |
| `o-dialogo-catarina-de-sena` | O Diálogo da Divina Providência | sim | edição crítica de G. Cavallini |
| `preces-privatae-lancelot-andrewes` | Preces Privatae (Orações Privadas) | sim | edição crítica de F. E. Brightman |
| `primeira-epistola-de-clemente` | Primeira Epístola aos Coríntios (1 Clemente) | sim | texto grego clássico da recensão crítica de J. B. Lightfoot (The Apostolic Fathers, 1890) |
| `proslogion` | Proslogion: A Fé em Busca de Compreensão | não | edição crítica latina de F. S. Schmitt (Opera Omnia) e Patrologia Latina (PL 158) |
| `tomo-a-flaviano-sao-leao-magno` | Tomo a Flaviano | sim | texto crítico de Calcedônia em domínio público |
| `do-amor-de-deus-bernardo-de-claraval` | Do Amor de Deus | sim | edição crítica de J. Leclercq e H. Rochais (S. Bernardi Opera) e PL 182 |
| `sermoes-cantico-dos-canticos-bernardo-claraval` | Sermões sobre o Cântico dos Cânticos | sim | edição crítica de Jean Leclercq em domínio público |
| `pensamentos-e-memorial-blaise-pascal` | Memorial e Pensamentos Escolhidos | sim | autógrafo da BNF e das edições de Louis Lafuma e Philippe Sellier |
| `sermoes-do-homem-interior-mestre-eckhart` | Sermões do Homem Interior | sim | edição crítica de Josef Quint em domínio público |
| `tratados-do-desapego-mestre-eckhart` | Tratado do Desapego e do Homem Nobre | sim | edição crítica de Josef Quint (Kohlhammer) |
| `a-vida-de-moises-gregorio-de-nissa` | A Vida de Moisés | sim | edição crítica de W. Jaeger e Sources Chrétiennes (SC 1bis) |
| `aos-jovens-sobre-a-literatura-classica` | Aos Jovens: Como Tirar Proveito da Literatura Clássica | sim | texto grego clássico de Sources Chrétiennes (SC 28bis, ed. F. Boulenger) e PG 31 |
| `catequeses-mistagogicas-cirilo-de-jerusalem` | Catequeses Mistagógicas | sim | edição crítica de Sources Chrétiennes (SC 126bis) e PG 33 |
| `centurias-sobre-a-caridade-maximo-confessor` | Centúrias sobre a Caridade | sim | Sources Chrétiennes (SC 9) |
| `conferencias-dos-padres-joao-cassiano` | Conferências dos Padres do Deserto | sim | Sources Chrétiennes (SC 42) |
| `cur-deus-homo-anselmo` | Por que Deus se fez Homem? (Cur Deus Homo) | sim | edição crítica de F. S. Schmitt (Opera Omnia) e Sources Chrétiennes (SC 91) |
| `demonstracao-da-pregacao-apostolica` | Demonstração da Pregação Apostólica | sim | edição clássica de J. Armitage Robinson e Sources Chrétiennes (SC 406) |
| `didascalicon-hugo-de-sao-vitor` | Didascalicon: Da Arte de Ler | sim | edição crítica de C. H. Buttimer e Sources Chrétiennes (SC 372) |
| `discurso-sobre-a-pascoa-gregorio-nazianzo` | Discurso sobre a Páscoa | sim | Sources Chrétiennes (SC 358) |
| `discursos-teologicos-gregorio-de-nazianzo` | Os Cinco Discursos Teológicos | sim | edição crítica de Paul Gallay e Sources Chrétiennes (SC 250) |
| `exposicao-da-fe-ortodoxa-damasceno` | Exposição Exata da Fé Ortodoxa | sim | edição crítica de B. Kotter e Sources Chrétiennes |
| `historia-eclesiastica-eusebio-de-cesareia` | História Eclesiástica (Livro I: A Origem Divina de Cristo) | sim | Sources Chrétiennes (SC 31) |
| `o-pastor-de-hermas` | O Pastor de Hermas | sim | Sources Chrétiennes (SC 172) |
| `peticao-pelos-cristaos-atenagoras` | Petição em Favor dos Cristãos | sim | Sources Chrétiennes (SC 379) |
| `primeira-apologia-justino-martir` | Primeira Apologia em Defesa dos Cristãos | sim | edição crítica de E. J. Goodspeed e Sources Chrétiennes (SC 507) |
| `regra-pastoral-gregorio-magno` | Regra Pastoral | sim | edição crítica de Sources Chrétiennes (SC 381-382) e PL 77 |
| `sobre-o-espirito-santo-basilio-magno` | Tratado sobre o Espírito Santo | sim | Sources Chrétiennes (SC 17bis) |
| `sobre-o-sacerdocio-joao-crisostomo` | Sobre o Sacerdócio | sim | texto grego crítico de Sources Chrétiennes (SC 272) e PG 48 |
| `sobre-os-misterios-ambrosio-de-milao` | Sobre os Mistérios (De Mysteriis) | sim | texto latino crítico do CSEL (vol. 73) e Sources Chrétiennes (SC 25bis) |
| `soliloquio-arras-da-alma-hugo-de-sao-vitor` | Solilóquio sobre o Arras da Alma | sim | Sources Chrétiennes (SC 155) |
| `teologia-mistica-pseudo-dionisio` | A Teologia Mística | sim | Sources Chrétiennes (SC 412) |
| `vida-de-santo-antao-atanasio` | Vida de Santo Antão do Deserto | sim | Sources Chrétiennes (SC 400) |
| `vida-de-sao-bento-dialogos-gregorio-magno` | Vida e Milagres de São Bento (Diálogos Livro II) | sim | Sources Chrétiennes (SC 260) e PL 66 |
| `as-afeicoes-religiosas-jonathan-edwards` | Tratado sobre as Afeições Religiosas | sim | edição crítica da Yale University Press (Vol. 2) |
| `pecadores-nas-maos-de-um-deus-irado` | Pecadores nas Mãos de um Deus Irado | sim | edição canônica de The Works of Jonathan Edwards (Yale / Banner of Truth) |

## Faixa B: risco médio

| Slug | Título | Publicada | Fonte declarada |
|---|---|---|---|
| `cantico-das-criaturas-sao-francisco` | Cântico das Criaturas e Admoestações | sim | Fontes Franciscanae em domínio público |
| `commonitorium-vicente-de-lerins` | Commonitorium: A Regra da Fé Apostólica | sim | texto latino clássico de Florilegium Patristicum (ed. B. Rauschen) e PL 50 |
| `tratado-do-amor-de-deus-francisco-de-sales` | Tratado do Amor de Deus | sim | Édition d'Annecy em domínio público |
| `a-cana-quebrada-richard-sibbes` | A Cana Quebrada e o Pavio Fumegante | sim | edição de Alexander Grosart (Banner of Truth) |
| `a-doutrina-do-arrependimento-thomas-watson` | A Doutrina do Arrependimento | sim | edição clássica de 1668 (Banner of Truth) |
| `a-existencia-e-os-atributos-de-deus-charnock` | A Existência e os Atributos de Deus | sim | edição clássica puritana (Banner of Truth) |
| `a-gloria-de-cristo-john-owen` | A Glória de Cristo | sim | edição clássica de William H. Goold (Banner of Truth) |
| `a-guarda-do-coracao-john-flavel` | A Guarda do Coração | sim | edição clássica de 1668 (Banner of Truth) |
| `a-mortificacao-do-pecado-john-owen` | A Mortificação do Pecado nos Crentes | sim | edição clássica de William H. Goold (Banner of Truth) |
| `o-coracao-de-cristo-thomas-goodwin` | O Coração de Cristo no Céu | sim | edição clássica puritana (Banner of Truth) |
| `o-descanso-eterno-dos-santos-richard-baxter` | O Descanso Eterno dos Santos | sim | edição clássica puritana (Banner of Truth) |
| `o-misterio-da-providencia-john-flavel` | O Mistério da Providência | sim | edição clássica puritana (Banner of Truth) |
| `o-pastor-reformado-richard-baxter` | O Pastor Reformado | sim | edição clássica de William Orme e Banner of Truth Trust |
| `remedios-preciosos-contra-satanas-thomas-brooks` | Remédios Preciosos contra as Ciladas de Satanás | sim | edição clássica puritana (Banner of Truth) |
| `arvore-da-vida-boaventura` | A Árvore da Vida | sim | Opera Omnia de Quaracchi (Tomus VIII) |
| `as-seis-asas-do-serafim-boaventura` | As Seis Asas do Serafim | sim | Opera Omnia de Quaracchi em domínio público |
| `suma-contra-os-gentios-tomas-de-aquino` | Suma contra os Gentios (Livro I: A Verdade da Fé e a Razão) | sim | Editio Leonina em domínio público |
| `a-oracao-no-espirito-john-bunyan` | A Oração no Espírito e com Entendimento | sim | edição clássica puritana em domínio público |
| `a-pratica-da-presenca-de-deus-irmao-lourenco` | A Prática da Presença de Deus | sim | edição clássica francesa em domínio público |
| `carta-a-diogneto` | A Carta a Diogneto | sim | original grego em domínio público, conferida com a tradução inglesa de J. B. Lightfoot (The Apostolic Fathers, |
| `guia-de-pecadores-luis-de-granada` | Guia de Pecadores | sim | edição clássica em domínio público |
| `monologion-anselmo` | Monologion | sim | edição de F. S. Schmitt |
| `soliloquio-da-alma-tomas-de-kempis` | O Solilóquio da Alma | sim | edição clássica de M. J. Pohl (Opera Omnia) |
| `tratado-do-purgatorio-catarina-de-genova` | Tratado do Purgatório | sim | texto clássico genovês em domínio público |
| `cativeiro-babilonico-da-igreja-lutero` | Do Cativeiro Babilônico da Igreja | sim | Weimarer Ausgabe (WA 6) |
| `comentario-ao-magnificat-lutero` | Comentário ao Magnificat | sim | Weimarer Ausgabe (WA 7) |
| `comentario-aos-galatas-lutero` | Comentário à Carta aos Gálatas | sim | Weimarer Ausgabe (WA 40/I) |
| `da-liberdade-do-cristao` | Da Liberdade do Cristão | sim | texto latino clássico de 1520 (Tractatus de Libertate Christiana), cotejada com a edição alemã de Weimar (WA 7 |

## Faixa A: risco baixo

| Slug | Título | Publicada | Fonte declarada |
|---|---|---|---|
| `a-vida-do-cristao-calvino` | A Vida do Cristão | sim | edição definitiva de 1559 das Institutas (Opera Calvini) |
| `loci-communes-melancton` | Lugares Comuns Teológicos (Loci Communes) | sim | Corpus Reformatorum (CR 21) |
| `necessidade-de-reformar-a-igreja-calvino` | A Necessidade de Reformar a Igreja | sim | Corpus Reformatorum (CR 34) |
| `pequeno-tratado-sobre-a-santa-ceia-calvino` | Pequeno Tratado sobre a Santa Ceia | sim | texto clássico de Ioannis Calvini Opera Omnia (CR) |
| `resposta-ao-cardeal-sadoleto-calvino` | Resposta ao Cardeal Sadoleto | sim | Corpus Reformatorum em domínio público |
| `tratado-sobre-a-santa-ceia-calvino` | Pequeno Tratado sobre a Santa Ceia | sim | Corpus Reformatorum em domínio público |
| `a-guerra-santa-john-bunyan` | A Guerra Santa | sim | edição de George Offor em domínio público |
| `coletas-livro-de-oracao-comum-1662` | As Coletas do Livro de Oração Comum (1662) | sim | edição oficial de 1662 em domínio público |
| `didaque` | Didaquê: O Ensino dos Doze Apóstolos | sim | original grego em domínio público (edição Bryennios / Hitchcock & Brown, 1884), cotejada com a tradução ingles |
| `graca-abundante-john-bunyan` | Graça Abundante ao Principal dos Pecadores | sim | Obras Completas de George Offor |
| `o-homem-eterno-chesterton` | O Homem Eterno | sim | edição original britânica de Hodder & Stoughton (1925) em domínio público |
| `ortodoxia-chesterton` | Ortodoxia | sim | edição original de John Lane (1908) em domínio público |
| `santo-morrer-jeremy-taylor` | Regras e Exercícios do Santo Morrer | sim | edição clássica de Heber/Eden |
| `santo-viver-jeremy-taylor` | Regras e Exercícios do Santo Viver | sim | edição clássica de Heber/Eden |
| `a-escada-do-paraiso-joao-climaco` | A Escada do Paraíso | sim | Patrologia Graeca (PG 88) |
| `a-regra-de-sao-bento` | A Regra de São Bento | sim | texto latino clássico das edições críticas de Dom Cuthbert Butler e Dom Germain Morin (PL 66) |
| `homilias-sermao-da-montanha-crisostomo` | Homilias sobre o Sermão da Montanha | sim | Patrologia Graeca (PG 57/58) |
| `tratado-sobre-a-oracao-crisostomo` | Tratado sobre a Oração | sim | Patrologia Graeca (PG 50) |
| `breve-catecismo-westminster` | O Breve Catecismo de Westminster | não | original em inglês de 1647 (The Westminster Shorter Catechism), conforme Philip Schaff, The Creeds of Christen |
| `canones-de-dort` | Cânones de Dort | sim | atas oficiais em latim (Canones Synodi Dordrechtanae, 1619), cotejada com a edição de Philip Schaff (The Creed |
| `catecismo-de-heidelberg` | O Catecismo de Heidelberg | sim | original em alemão e latim de 1563, conforme Philip Schaff, The Creeds of Christendom, vol. III |
| `confissao-de-fe-de-westminster` | A Confissão de Fé de Westminster | sim | original em inglês de 1646 (The Westminster Confession of Faith), conforme Philip Schaff, The Creeds of Christ |
| `credos-ecumenicos` | Os Credos Ecumênicos | sim | originais em domínio público, conferida com a tradução inglesa de Philip Schaff (The Creeds of Christendom, vo |
| `trinta-e-nove-artigos-da-religiao` | Os Trinta e Nove Artigos da Religião | sim | edições canônicas latinas e inglesas de 1571 (Philip Schaff, The Creeds of Christendom) |

## Faixa D: sem fonte nomeada (120 obras)

A atribuição não diz de qual edição a tradução partiu. Slugs, por ordem alfabética:

`a-catequese-dos-nao-instruidos-agostinho`, `a-cidade-de-deus-agostinho`, `a-criacao-do-homem-gregorio-de-nissa`, `a-demetriano-cipriano`, `a-donato-cipriano`, `a-escapula-tertuliano`, `a-fe-e-o-simbolo-agostinho`, `a-nobreza-crista-da-nacao-alema-lutero`, `a-oracao-do-senhor-cipriano`, `a-tradicao-apostolica-hipolito`, `aos-jovens-sobre-a-literatura-grega-basilio`, `as-instituicoes-cenobiticas-joao-cassiano`, `breviloquio-suma-breve-boaventura`, `carta-de-ouro-guilherme-saint-thierry`, `cartas-sobre-sao-martinho-sulpicio-severo`, `catequeses-batismais-parte-1-cirilo-de-jerusalem`, `catequeses-batismais-parte-2-cirilo-de-jerusalem`, `clareza-e-certeza-palavra-de-deus-zuinglio`, `comentario-sobre-galatas-joao-crisostomo`, `commonitorium-canon-ortodoxia-vicente-lerins`, `comunhao-com-deus-trindade-john-owen`, `contra-a-mentira-agostinho`, `contra-as-heresias-livro-3-ireneu`, `contra-as-heresias-livro-4-ireneu`, `contra-as-heresias-livro-5-ireneu`, `contra-helvidio-perpetua-virgindade-de-maria-jeronimo`, `contra-praxeas-tertuliano`, `da-continencia-agostinho`, `da-fe-nas-coisas-invisiveis-agostinho`, `da-idolatria-tertuliano`, `da-maneira-de-orar-e-meditar-hugo-sao-vitor`, `da-mentira-agostinho`, `da-natureza-do-bem-agostinho`, `da-oracao-e-vida-contemplativa-tomas-de-aquino`, `da-paciencia-tertuliano`, `da-santa-virgindade-agostinho`, `de-magistro`, `devocoes-para-ocasioes-emergentes-donne`, `dialogo-contra-os-luciferianos-jeronimo`, `dialogos-sobre-sao-martinho-sulpicio-severo`, `didaque-doutrina-dos-doze-apostolos`, `discurso-aos-gregos-taciano`, `do-bem-da-viuvez-agostinho`, `do-bem-do-matrimonio-agostinho`, `do-cuidado-devido-aos-mortos-agostinho`, `do-trabalho-dos-monges-agostinho`, `dos-espetaculos-tertuliano`, `exortacao-ao-martirio-cipriano`, `exposicao-do-simbolo-dos-apostolos-rufino`, `hexaemeron-homilias-sobre-a-criacao-basilio-magno`, `hinos-do-amor-divino-simeao-novo-teologo`, `hinos-sobre-a-natividade-efrem-siria`, `homilias-e-escritos-espirituais-crisostomo`, `homilias-sobre-as-estatuas-parte-1-joao-crisostomo`, `homilias-sobre-as-estatuas-parte-2-joao-crisostomo`, `homilias-sobre-colossenses-joao-crisostomo`, `homilias-sobre-efesios-joao-crisostomo`, `homilias-sobre-filemom-joao-crisostomo`, `homilias-sobre-filipenses-joao-crisostomo`, `homilias-sobre-hebreus-parte-1-joao-crisostomo`, `homilias-sobre-hebreus-parte-2-joao-crisostomo`, `homilias-sobre-primeira-tessalonicenses-joao-crisostomo`, `homilias-sobre-primeira-timoteo-joao-crisostomo`, `homilias-sobre-segunda-tessalonicenses-joao-crisostomo`, `homilias-sobre-segunda-timoteo-joao-crisostomo`, `homilias-sobre-tito-joao-crisostomo`, `institutas-da-religiao-crista`, `instrucoes-espirituais-doroteu-de-gaza`, `metodo-para-a-oracao-matthew-henry`, `mistagogia-maximo-confessor`, `o-bem-da-paciencia-cipriano`, `o-catecismo-maior-martinho-lutero`, `o-conflito-da-alma-richard-sibbes`, `o-grande-discurso-catequetico-gregorio-de-nissa`, `o-habito-das-virgens-cipriano`, `o-padre-do-campo-george-herbert`, `o-tratado-da-oracao-do-senhor-thomas-watson`, `paginas-douradas-sao-joao-crisostomo`, `pensamentos-blaise-pascal`, `prefacio-aos-romanos-lutero`, `resposta-aos-judeus-tertuliano`, `segunda-apologia-justino-martir`, `sermoes-sobre-a-natividade-sao-leao-magno`, `sermoes-sobre-o-misterio-pascal-sao-leao-magno`, `sermoes-sobre-pentecostes-e-os-santos-sao-leao-magno`, `sobre-a-alma-e-a-ressurreicao-gregorio-de-nissa`, `sobre-a-alma-e-a-ressurreicao-gregorio-nissa`, `sobre-a-carne-de-cristo-tertuliano`, `sobre-a-criacao-do-homem-gregorio-de-nissa`, `sobre-a-mortalidade-cipriano`, `sobre-a-oracao-e-a-vida-contemplativa-tomas-de-aquino`, `sobre-a-oracao-tertuliano`, `sobre-a-ressurreicao-da-carne-tertuliano`, `sobre-a-verdade-de-veritate-anselmo`, `sobre-a-virgindade-gregorio-de-nissa`, `sobre-as-boas-obras-e-as-esmolas-cipriano`, `sobre-as-virgens-ambrosio-de-milao`, `sobre-as-viuvas-ambrosio-de-milao`, `sobre-homens-ilustres-jeronimo`, `sobre-o-batismo-tertuliano`, `sobre-o-espirito-santo-ambrosio-de-milao`, `sobre-o-zelo-e-a-inveja-cipriano`, `sobre-os-caidos-cipriano`, `sobre-os-deveres-do-clero-livro-1-ambrosio-de-milao`, `sobre-os-deveres-do-clero-livros-2-e-3-ambrosio-de-milao`, `sobre-os-sinodos-hilario-de-poitiers`, `suma-teologica-primeira-parte`, `suma-teologica-primeira-parte-da-segunda-parte`, `suma-teologica-terceira-parte`, `tradicao-apostolica-hipolito`, `tratado-a-autolico-teofilo-antioquia`, `tratado-sobre-as-reliquias-calvino`, `tratados-patristicos-parte-1-cipriano-de-cartago`, `tratados-patristicos-parte-2-cipriano-de-cartago`, `vida-de-santa-macrina-gregorio-nissa`, `vida-de-santo-hilariao-jeronimo`, `vida-de-sao-malaquias-bernardo-de-claraval`, `vida-de-sao-malaquias-jeronimo`, `vida-de-sao-martinho-sulpicio-severo`, `vida-de-sao-paulo-eremita-jeronimo`
