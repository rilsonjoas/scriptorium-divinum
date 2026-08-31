export interface AuthorRichInfo {
  slug: string;
  signatureQuote: string;
  signatureQuoteSource: string;
  historicalPeriod: string;
  keyThemes: string[];
  historicalContext: string;
  majorContributions: string[];
  legacySummary: string;
}

export const AUTHORS_RICH_DATA: Record<string, AuthorRichInfo> = {
  'santo-agostinho': {
    slug: 'santo-agostinho',
    signatureQuote: 'Fizeste-nos para ti, Senhor, e o nosso coração está inquieto enquanto não descansar em ti.',
    signatureQuoteSource: 'Confissões, Livro I',
    historicalPeriod: 'Patrística Latina — Quarto Século (354–430 d.C.)',
    keyThemes: ['Doutrina da Graça', 'Filosofia da História', 'Autobiografia Espiritual', 'Neoplatonismo Cristão'],
    historicalContext: 
      'Nascido em Tagaste (atual Argélia), filho da devota Mônica. Professor de retórica em Cartago, Roma e Milão. Após anos no maniqueísmo, converteu-se em Milão em 386 ("Tolle, Lege") sob pregação de Ambrósio. Tornou-se Bispo de Hipona em 395, liderando a igreja norte-africana em meio às invasões vândalas e ao colapso do Império Romano.',
    majorContributions: [
      'Confissões: Obra-prima espiritual que inaugurou a autobiografia introspectiva no Ocidente.',
      'A Cidade de Deus: Defesa monumental do cristianismo após o saque de Roma (410), contrastando a Cidade Terrena com a Cidade de Deus.',
      'Combate ao Pelagianismo e Donatismo: Formulação rigorosa da necessidade absoluta da graça divina e da eficácia sacramental baseada em Cristo.'
    ],
    legacySummary: 'Considerado a figura máxima da Patrística ocidental. Suas doutrinas da graça e da providência moldaram o catolicismo medieval e inspiraram os reformadores do século XVI.'
  },
  'sao-tomas-de-aquino': {
    slug: 'sao-tomas-de-aquino',
    signatureQuote: 'A graça não destrói a natureza, mas a aperfeiçoa.',
    signatureQuoteSource: 'Suma Teológica, Ia, q. 1, a. 8',
    historicalPeriod: 'Escolástica Medieval (1225–1274 d.C.)',
    keyThemes: ['Harmonia entre Fé e Razão', 'As Cinco Vias (Quinque Viae)', 'Tomismo', 'Metafísica do Ser'],
    historicalContext:
      'Frade dominicano nascido em Roccasecca, Nápoles, e educado em Paris sob Santo Alberto Magno. Venceu a oposição familiar para seguir a Ordem dos Pregadores. Conhecido como o "Doutor Angélico", realizou a síntese máxima da Alta Escolástica ao harmonizar a filosofia de Aristóteles com a revelação cristã.',
    majorContributions: [
      'Suma Teológica: A catedral intelectual do pensamento ocidental, cobrindo Deus, a criação, a ética e a cristologia com exaustivo método de objeções e respostas.',
      'As Cinco Vias: Demonstrações racionais a posteriori da existência de Deus (Primeiro Motor, Causa Primeira, Ser Necessário, Graus de Perfeição, Causa Inteligente).',
      'Compêndio de Teologia: Síntese cristalina formulada sobre as virtudes teologais (Fé, Esperança e Caridade).'
    ],
    legacySummary: 'Expoente máximo do Tomismo e Doutor da Igreja. Estabeleceu que a razão e a fé provêm da mesma fonte divina e não entram em contradição.'
  },
  'martinho-lutero': {
    slug: 'martinho-lutero',
    signatureQuote: 'O cristão é um senhor livre sobre todas as coisas, não sujeito a ninguém. O cristão é um servo prestativo em todas as coisas, sujeito a todos.',
    signatureQuoteSource: 'A Liberdade do Cristão (1520)',
    historicalPeriod: 'Reforma Protestante — Século XVI (1483–1546 d.C.)',
    keyThemes: ['Justificação pela Fé (Sola Fide)', 'Sacerdócio de Todos os Crentes', 'Sola Scriptura', 'Vocação Secular'],
    historicalContext:
      'Monge agostiniano e professor de teologia bíblica em Wittenberg. Em 1517, afixou as 95 Teses na igreja do castelo contra a venda de indulgências. Condenado pela bula papal e levado à Dieta de Worms em 1521, traduziu a Bíblia para o alemão no Castelo de Wartburg, democratizando o acesso às Escrituras.',
    majorContributions: [
      'Tradutor da Bíblia de Wartburg: Fixou os alicerces do idioma alemão moderno ao traduzir o texto sagrado diretamente do grego e hebraico.',
      'Doutrina da Vocação (Beruf): Elevou o trabalho diário (do fazendeiro ao governante) ao status de louvor agradável a Deus.',
      'A Liberdade do Cristão & 95 Teses: Manifiesto da fé como confiança pessoal nas promessas divinas e libertação do legalismo espiritual.'
    ],
    legacySummary: 'Líder pioneiro da Reforma Protestante. Transformou a teologia, a cultura e a alfabetização na Europa Ocidental.'
  },
  'joao-calvino': {
    slug: 'joao-calvino',
    signatureQuote: 'Quase toda a sabedoria que possuímos constitui-se de duas partes: o conhecimento de Deus e o de nós mesmos.',
    signatureQuoteSource: 'As Institutas da Religião Cristã, Livro I, cap. 1',
    historicalPeriod: 'Reforma Reformada — Século XVI (1509–1564 d.C.)',
    keyThemes: ['Soberania de Deus', 'União com Cristo', 'Cosmovisão Cristã', 'Teologia Sistemática'],
    historicalContext:
      'Teólogo e humanista francês estabelecido em Genebra. Liderou a consolidação teológica e pastoral do protestantismo reformado, transformando Genebra em centro educacional e missionário para a Europa inteira.',
    majorContributions: [
      'Institutas da Religião Cristã: O tratado teológico mais influente da Reforma, sintetizando exegeticamente a soteriologia e a vida cristã.',
      'Comentários Bíblicos: Exegese minuciosa cobrindo quase todo o Cânon Bíblico com clareza e brevidade pastoral.',
      'Governo Eclesiástico & Mandato Cultural: Estruturou a cosmovisão que influenciaria a educação, a ética de trabalho e a democracia moderna.'
    ],
    legacySummary: 'Pai do pensamento reformado (Calvinismo). Suas ideias moldaram a teologia presbiteriana, puritana e o neocalvinismo moderno.'
  },
  'john-bunyan': {
    slug: 'john-bunyan',
    signatureQuote: 'Regozije-se, pois não importa os rumos que as coisas tomarem, a balança ainda está nas mãos de Deus.',
    signatureQuoteSource: 'Seasonable Counsel',
    historicalPeriod: 'Puritanismo & Século XVII (1628–1688 d.C.)',
    keyThemes: ['Alegoria Cristã', 'Peregrinação Espiritual', 'Fidelidade sob Perseguição'],
    historicalContext:
      'Pregador puritano batista e latoeiro inglês. Passou 12 anos encarcerado na prisão de Bedford por se recusar a parar de pregar sem licença oficial da Igreja da Inglaterra, período durante o qual redigiu sua obra imortal.',
    majorContributions: [
      'O Peregrino (The Pilgrim\'s Progress): A alegoria narrativa da jornada de Cristão da Cidade da Destruição até a Cidade Celestial, o livro mais lido do cristianismo após a Bíblia.',
      'Graça Abundante ao Principal dos Pecadores: Autobiografia espiritual revelando as tentações e consolações da fé sob provação.'
    ],
    legacySummary: 'O maior alegorista da língua inglesa. Sua representação da vida cristã como uma jornada de fé continua a consolar leitores no mundo todo.'
  },
  'blaise-pascal': {
    slug: 'blaise-pascal',
    signatureQuote: 'O coração tem razões que a própria razão desconhece.',
    signatureQuoteSource: 'Pensamentos (Pensées), nº 277',
    historicalPeriod: 'Filosofia & Apologética do Século XVII (1623–1662 d.C.)',
    keyThemes: ['Aposta de Pascal', 'Divertissement (Fuga do Vazio)', 'Miséria e Grandeza do Homem', 'Noite de Fogo'],
    historicalContext:
      'Prodígio francês em matemática e física, inventor da calculadora mecânica (Pascaline) e formulador da teoria das probabilidades. Em 1654 viveu uma experiência mística avassaladora ("Noite de Fogo"), dedicando o restante de seus 39 anos de vida ao combate ao ceticismo.',
    majorContributions: [
      'Pensamentos (Pensées): Coleção de fragmentos apologéticos que diagnosticam a psicologia humana, o tédio profundo (divertissement) e a necessidade de salvação em Cristo.',
      'A Aposta de Pascal: Argumento pragmático-racional convidando o homem a apostar a vida na existência de Deus diante do ganho infinito.',
      'Cartas Provinciais: Defesa brilhante da moral agostiniana contra o casuísmo laxista.'
    ],
    legacySummary: 'Gênio das ciências e da fé. Uniu o rigor da matemática à profundidade da mística agostiniana.'
  },
  'santo-anselmo-de-cantuaria': {
    slug: 'santo-anselmo-de-cantuaria',
    signatureQuote: 'Creio para compreender, e compreendo para crer.',
    signatureQuoteSource: 'Proslogion, cap. 1',
    historicalPeriod: 'Escolástica Inicial (1033–1109 d.C.)',
    keyThemes: ['Fides Quaerens Intellectum (Fé em busca de entendimento)', 'Argumento Ontológico', 'Teologia da Expiação'],
    historicalContext:
      'Abade beneditino nascido no Piemonte, na Itália, que se tornou Arcebispo de Cantuária na Inglaterra. Famoso por usar a razão pura para iluminar os mistérios revelados da fé.',
    majorContributions: [
      'Proslogion & Argumento Ontológico: Demonstração da existência de Deus como "Aquele do qual nada maior pode ser pensado".',
      'Cur Deus Homo (Por que Deus se fez homem?): A célebre doutrina da substituição penal e satisfação na expiação de Cristo.'
    ],
    legacySummary: 'Considerado o pai da Escolástica medieval por inaugurar a teologia fundamentada no princípio "Fé que busca o entendimento".'
  },
  'tomas-de-kempis': {
    slug: 'tomas-de-kempis',
    signatureQuote: 'Aquele a quem a Palavra Eterna fala é liberto de uma infinidade de opiniões.',
    signatureQuoteSource: 'Imitação de Cristo, Livro I, cap. 3',
    historicalPeriod: 'Devotio Moderna — Século XV (1380–1471 d.C.)',
    keyThemes: ['Humildade e Oração', 'Imitação de Cristo', 'Devotio Moderna', 'Renúncia ao Orgulho Intelectual'],
    historicalContext:
      'Monge e místico alemão membro dos Cônicos Regulares de Santo Agostinho no Mosteiro de Monte Santa Agnes. Expoente do movimento Devotio Moderna, focado na simplicidade espiritual e união pessoal com Cristo.',
    majorContributions: [
      'Imitação de Cristo: O clássico de devoção pessoal mais lido de toda a literatura ocidental, convidando à contemplação e pureza de coração.'
    ],
    legacySummary: 'Voz inesquecível da espiritualidade contemplativa. Ensinou gerações de cristãos a preferir o amor a Cristo sobre a vaidade das teorias humanas.'
  }
};

export function getAuthorRichInfo(slug: string): AuthorRichInfo | null {
  return AUTHORS_RICH_DATA[slug] || null;
}
