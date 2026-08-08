import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '../src/config.js';
import { authors, books, downloadLinks, tableOfContents } from '../src/db/schema.js';

async function seed() {
  const client = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  console.log('🌱 Iniciando seed de autores e obras clássicas...');

  // Limpar tabelas
  await client.unsafe('TRUNCATE table_of_contents, download_links, books, authors RESTART IDENTITY CASCADE');

  // Inserir Autores
  const [agostinho, tomas, calvino, lutero, belarmino, bunyan, pascal, anselmo] = await db
    .insert(authors)
    .values([
      {
        slug: 'santo-agostinho',
        name: 'Santo Agostinho de Hipona',
        birthYear: 354,
        deathYear: 430,
        bioSummary:
          'Bispo de Hipona, teólogo e filósofo. Considerado um dos mais importantes Padres da Igreja Latina e figura central no desenvolvimento do pensamento cristão ocidental.',
        portraitImageUrl: '/images/authors/agostinho.jpg',
        denominationOrTradition: ['Patrística', 'Católica', 'Tradição Latina'],
      },
      {
        slug: 'sao-tomas-de-aquino',
        name: 'São Tomás de Aquino',
        birthYear: 1225,
        deathYear: 1274,
        bioSummary:
          'Frade dominicano, filósofo e Doutor da Igreja. Autor da monumental Suma Teológica, principal expoente da Escolástica medieval.',
        portraitImageUrl: '/images/authors/tomas-aquino.jpg',
        denominationOrTradition: ['Escolástica', 'Católica', 'Dominicano'],
      },
      {
        slug: 'joao-calvino',
        name: 'João Calvino',
        birthYear: 1509,
        deathYear: 1564,
        bioSummary:
          'Teólogo, pastor e reformador francês radicado em Genebra. Principal figura do desenvolvimento da teologia reformada (calvinismo).',
        portraitImageUrl: '/images/authors/calvino.jpg',
        denominationOrTradition: ['Reforma Protestante', 'Tradição Reformada', 'Presbiteriana'],
      },
      {
        slug: 'martinho-lutero',
        name: 'Martinho Lutero',
        birthYear: 1483,
        deathYear: 1546,
        bioSummary:
          'Monge agostiniano, professor de teologia bíblica e líder pioneiro da Reforma Protestante do século XVI.',
        portraitImageUrl: '/images/authors/lutero.jpg',
        denominationOrTradition: ['Reforma Protestante', 'Luterana'],
      },
      {
        slug: 'sao-roberto-belarmino',
        name: 'São Roberto Belarmino',
        birthYear: 1542,
        deathYear: 1621,
        bioSummary:
          'Cardeal jesuíta italiano, teólogo e Doutor da Igreja, célebre por suas controvérsias e escritos espirituais durante a Contra-Reforma.',
        portraitImageUrl: '/images/authors/belarmino.jpg',
        denominationOrTradition: ['Contra-Reforma', 'Católica', 'Jesuíta'],
      },
      {
        slug: 'john-bunyan',
        name: 'John Bunyan',
        birthYear: 1628,
        deathYear: 1688,
        bioSummary:
          'Pregador puritano e escritor inglês, autor de O Peregrino, uma das alegorias cristãs mais lidas e traduzidas de todos os tempos.',
        portraitImageUrl: '/images/authors/bunyan.jpg',
        denominationOrTradition: ['Puritanismo', 'Batista', 'Tradição Reformada'],
      },
      {
        slug: 'blaise-pascal',
        name: 'Blaise Pascal',
        birthYear: 1623,
        deathYear: 1662,
        bioSummary:
          'Matemático, físico, filósofo e teólogo cristão francês, autor dos célebres Pensamentos (Pensées).',
        portraitImageUrl: '/images/authors/pascal.jpg',
        denominationOrTradition: ['Jansenismo', 'Católica', 'Filosofia Cristã'],
      },
      {
        slug: 'santo-anselmo-de-cantuaria',
        name: 'Santo Anselmo de Cantuária',
        birthYear: 1033,
        deathYear: 1109,
        bioSummary:
          'Arcebispo de Cantuária e Doutor da Igreja. Famoso pelo argumento ontológico e pela obra Cur Deus Homo.',
        portraitImageUrl: '/images/authors/anselmo.jpg',
        denominationOrTradition: ['Escolástica Inicial', 'Beneditino', 'Católica'],
      },
    ])
    .returning();

  if (!agostinho || !tomas || !calvino || !lutero || !belarmino || !bunyan || !pascal || !anselmo) {
    throw new Error('Falha ao inserir autores');
  }

  // Inserir Livros
  const [bConfissoes, bCidadeDeDeus, bSuma, bInstitutas, b95Teses, bPeregrino, bPensamentos, bCurDeusHomo] =
    await db
      .insert(books)
      .values([
        {
          slug: 'confissoes',
          title: 'Confissões',
          originalTitle: 'Confessiones',
          authorId: agostinho.id,
          publicationYearOriginal: '397-400',
          publicationYearTranslation: 1890,
          translator: 'J. Oliveira Santos',
          language: 'Português',
          originalLanguages: ['Latim'],
          description:
            'Obra-prima espiritual e autobiográfica de Santo Agostinho, que narra sua juventude conturbada, a busca incansável pela verdade e sua dramática conversão a Cristo.',
          categories: ['Patrística', 'Autobiografia Espiritual', 'Filosofia Cristã'],
          tags: ['conversão', 'graça', 'tempo', 'memória', 'oração', 'filosofia'],
          coverImageUrl: '/images/covers/confissoes.jpg',
          onlineReadPath: '/texts/agostinho-confissoes.md',
          featured: true,
        },
        {
          slug: 'a-cidade-de-deus',
          title: 'A Cidade de Deus',
          originalTitle: 'De Civitate Dei contra Paganos',
          authorId: agostinho.id,
          publicationYearOriginal: '426',
          publicationYearTranslation: 1910,
          translator: 'Oscar Paes Leme',
          language: 'Português',
          originalLanguages: ['Latim'],
          description:
            'Monumento do pensamento teológico da história, escrito em resposta ao saque de Roma pelos visigodos, contrastando a Cidade Terrena com a Cidade Celestial.',
          categories: ['Patrística', 'Teologia da História', 'Filosofia Política'],
          tags: ['escatologia', 'sociedade', 'história', 'providência', 'igreja'],
          coverImageUrl: '/images/covers/cidade-de-deus.jpg',
          onlineReadPath: '/texts/agostinho-cidade-de-deus.md',
          featured: true,
        },
        {
          slug: 'compendio-da-suma-teologica',
          title: 'Compêndio de Teologia',
          originalTitle: 'Compendium Theologiae',
          authorId: tomas.id,
          publicationYearOriginal: '1273',
          publicationYearTranslation: 1935,
          translator: 'D. Odilão Moura',
          language: 'Português',
          originalLanguages: ['Latim'],
          description:
            'Síntese clara e profunda dos principais mistérios da fé cristã escrita por Santo Tomás de Aquino, estruturada sobre as três virtudes teologais: Fé, Esperança e Caridade.',
          categories: ['Escolástica', 'Teologia Sistemática', 'Dogmática'],
          tags: ['fé', 'trindade', 'encarnação', 'virtudes', 'deus'],
          coverImageUrl: '/images/covers/compendio-tomas.jpg',
          onlineReadPath: '/texts/tomas-compendio.md',
          featured: true,
        },
        {
          slug: 'institutas-da-religiao-crista',
          title: 'As Institutas da Religião Cristã',
          originalTitle: 'Institutio Christianae Religionis',
          authorId: calvino.id,
          publicationYearOriginal: '1536-1559',
          publicationYearTranslation: 1957,
          translator: 'Waldyr Carvalho Luz',
          language: 'Português',
          originalLanguages: ['Latim', 'Francês'],
          description:
            'Tratado teológico monumental que definiu os fundamentos bíblicos da teologia reformada, abordando o conhecimento de Deus, a redenção em Cristo e a vida cristã.',
          categories: ['Reforma Protestante', 'Teologia Sistemática', 'Eclesiologia'],
          tags: ['escrituras', 'salvação', 'predestinação', 'sacramentos', 'graça'],
          coverImageUrl: '/images/covers/institutas-calvino.jpg',
          onlineReadPath: '/texts/calvino-institutas.md',
          featured: true,
        },
        {
          slug: 'as-95-teses',
          title: 'As 95 Teses sobre as Indulgências',
          originalTitle: 'Disputatio pro declaratione virtutis indulgentiarum',
          authorId: lutero.id,
          publicationYearOriginal: '1517',
          publicationYearTranslation: 1917,
          translator: 'Ernesto Lindemann',
          language: 'Português',
          originalLanguages: ['Latim'],
          description:
            'O célebre manifesto afixado na porta da igreja do castelo de Wittenberg, desencadeando a Reforma Protestante ao questionar a eficácia e comércio das indulgências.',
          categories: ['Reforma Protestante', 'História da Igreja', 'Documentos Históricos'],
          tags: ['indulgências', 'arrependimento', 'justificação', 'wittenberg'],
          coverImageUrl: '/images/covers/95-teses.jpg',
          onlineReadPath: '/texts/lutero-95-teses.md',
          featured: false,
        },
        {
          slug: 'o-peregrino',
          title: 'O Peregrino',
          originalTitle: "The Pilgrim's Progress",
          authorId: bunyan.id,
          publicationYearOriginal: '1678',
          publicationYearTranslation: 1880,
          translator: 'Eduardo Carlos Pereira',
          language: 'Português',
          originalLanguages: ['Inglês'],
          description:
            'A clássica alegoria da jornada cristã de Cristão da Cidade da Destruição até a Cidade Celestial, retratando provações, tentações e o triunfo da fé.',
          categories: ['Puritanismo', 'Literatura Devocional', 'Alegoria'],
          tags: ['jornada', 'fé', 'salvação', 'perseverança', 'vida cristã'],
          coverImageUrl: '/images/covers/o-peregrino.jpg',
          onlineReadPath: '/texts/bunyan-o-peregrino.md',
          featured: true,
        },
        {
          slug: 'pensamentos',
          title: 'Pensamentos',
          originalTitle: 'Pensées',
          authorId: pascal.id,
          publicationYearOriginal: '1670',
          publicationYearTranslation: 1922,
          translator: 'Mário Barreto',
          language: 'Português',
          originalLanguages: ['Francês'],
          description:
            'Coleção de fragmentos e aforismos teológicos e filosóficos em defesa do cristianismo, contendo reflexões imortais sobre a condição humana e a Aposta de Pascal.',
          categories: ['Apologética', 'Filosofia Cristã', 'Espiritualidade'],
          tags: ['apologética', 'razão', 'coração', 'graça', 'humano'],
          coverImageUrl: '/images/covers/pensamentos-pascal.jpg',
          onlineReadPath: '/texts/pascal-pensamentos.md',
          featured: false,
        },
        {
          slug: 'por-que-deus-se-fez-homem',
          title: 'Por que Deus se fez Homem?',
          originalTitle: 'Cur Deus Homo',
          authorId: anselmo.id,
          publicationYearOriginal: '1098',
          publicationYearTranslation: 1940,
          translator: 'Antônio Pinto de Carvalho',
          language: 'Português',
          originalLanguages: ['Latim'],
          description:
            'O clássico diálogo teológico que formulou a doutrina da satisfação na expiação, demonstrando a necessidade lógica e moral da Encarnação do Verbo.',
          categories: ['Escolástica', 'Cristologia', 'Soteriologia'],
          tags: ['expiação', 'encarnação', 'redenção', 'justiça', 'cristo'],
          coverImageUrl: '/images/covers/cur-deus-homo.jpg',
          onlineReadPath: '/texts/anselmo-cur-deus-homo.md',
          featured: false,
        },
      ])
      .returning();

  if (!bConfissoes || !bCidadeDeDeus || !bSuma || !bInstitutas || !bPeregrino) {
    throw new Error('Falha ao inserir livros');
  }

  // Inserir Links de Download
  await db.insert(downloadLinks).values([
    {
      bookId: bConfissoes.id,
      format: 'pdf',
      url: '/downloads/agostinho/confissoes.pdf',
      source: 'Domínio Público / Internet Archive',
      fileSize: 2450000,
    },
    {
      bookId: bConfissoes.id,
      format: 'epub',
      url: '/downloads/agostinho/confissoes.epub',
      source: 'Scriptorium Digital',
      fileSize: 850000,
    },
    {
      bookId: bCidadeDeDeus.id,
      format: 'pdf',
      url: '/downloads/agostinho/cidade-de-deus.pdf',
      source: 'Internet Archive',
      fileSize: 5200000,
    },
    {
      bookId: bSuma.id,
      format: 'pdf',
      url: '/downloads/tomas/compendio-teologia.pdf',
      source: 'Internet Archive',
      fileSize: 1800000,
    },
    {
      bookId: bInstitutas.id,
      format: 'pdf',
      url: '/downloads/calvino/institutas.pdf',
      source: 'CCEL / Domínio Público',
      fileSize: 4100000,
    },
    {
      bookId: bPeregrino.id,
      format: 'pdf',
      url: '/downloads/bunyan/o-peregrino.pdf',
      source: 'Gutenberg Project',
      fileSize: 1500000,
    },
  ]);

  // Inserir Sumários (Table of Contents)
  await db.insert(tableOfContents).values([
    {
      bookId: bConfissoes.id,
      title: 'Livro I — Infância e Primeiros Anos',
      anchor: 'livro-1',
      level: 1,
      orderIndex: 1,
    },
    {
      bookId: bConfissoes.id,
      title: 'Livro II — A Adolescência e os Desvios',
      anchor: 'livro-2',
      level: 1,
      orderIndex: 2,
    },
    {
      bookId: bConfissoes.id,
      title: 'Livro VIII — A Conversão no Jardim de Milão',
      anchor: 'livro-8',
      level: 1,
      orderIndex: 3,
    },
    {
      bookId: bConfissoes.id,
      title: 'Livro XI — O Tempo e a Eternidade',
      anchor: 'livro-11',
      level: 1,
      orderIndex: 4,
    },
  ]);

  console.log('✅ Seed concluído com sucesso!');
  await client.end();
}

seed().catch((err) => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
