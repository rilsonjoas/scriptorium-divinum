/**
 * Curadoria de fontes de citação — trava do CTA de afiliado.
 *
 * `quotes.source` é texto livre (`varchar(500)`), e o CTA Amazon era montado
 * direto dele (`buildAmazonUrl`). Isso produzia link de compra para obras que
 * não existem: a citação "A fé caminha a passos largos no escuro..." apontava
 * para "Cheque-Livro do Banco da Fé", que não é livro do C. S. Lewis nem de
 * ninguém. Pior: 7 citações tinham `source = "C. S. Lewis"` (o nome do autor
 * no lugar da obra), gerando `?k=C. S. Lewis C. S. Lewis`.
 *
 * A regra: **CTA só quando a obra é conhecida.** `source` fora da curadoria
 * não gera link — o texto continua aparecendo, sem link de compra inventado.
 * Princípio 2 do Padrão de Qualidade de Conteúdo: buraco de dado > dado
 * inventado.
 *
 * A lista abaixo é allowlist de OBRAS, não de citações: ela não afirma que o
 * texto da citação é fiel, só que a obra existe. O texto continua dependendo
 * de verificação própria (`fonte_url`/`verificado_em`).
 *
 * FONTE DA LISTA DE LEWIS: frontmatter `Livros relacionados` da nota
 * `10 - Arte e literatura/Autores/C. S. Lewis.md` do vault (lista canônica do
 * Rilson) + os ensaios confirmados no banco de auditoria
 * `6 - Segundo cérebro/_Auditoria de Citações de C. S. Lewis.md`.
 *
 * OBRAS DE AUTORES SEM CURADORIA FICAM DE FORA DE PROPÓSITO: sem entrada aqui
 * a citação não ganha CTA, e o relatório de fontes pendentes aponta o buraco
 * para revisão em vez de inventar uma obra plausível.
 */

/** Normaliza para comparação: sem acento, sem pontuação, espaço colapsado. */
export function normalizeSource(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Obras curadas por autor. Prefere-se o prefixo da obra para casar a parte de
 * capítulo/página que a curadoria acrescenta ("Discipulado, cap. 1").
 *
 * As entradas são escritas em português legível, com a grafia oficial do
 * título, e normalizadas em tempo de carga. NÃO escrever a forma já
 * normalizada: um erro de digitação nesse formato é invisível e corta o CTA de
 * uma obra legítima em silêncio. Foi assim que "A Consolação da Filosofia"
 * entrou como `a consolao da filosofia` e parou de casar com o banco.
 *
 * Acompanhe de `quote-sources.test.ts`, que roda os pares autor/fonte reais
 * de produção: é o que pega obra faltando, não o teste de examples.
 */
const CURATED_WORKS: Record<string, string[]> = {
  'C. S. Lewis': [
    'a abolicao do homem',
    'a alegoria do amor',
    'a anatomia de uma dor',
    'a cadeira de prata',
    'a imagem descartada',
    'a torre sombria',
    'a ultima batalha',
    'a ultima noite do mundo',
    'alem do planeta silencioso',
    'aquela fortaleza medonha',
    'as cronicas de narnia',
    'ate que tenhamos rostos',
    'bluspels and flalansferes',
    'boxen',
    'cartas a malcolm',
    'cartas a uma senhora americana',
    'cartas de c s lewis',
    'cartas latinas',
    'como cultivar uma vida de leitura',
    'como orar',
    'como ser cristao',
    'cristianismo puro e simples',
    'deus no banco dos reus',
    'etica para viver melhor',
    'fern-seed and elephants',
    'george macdonald',
    'introducao a sobre a encarnacao de atanasio',
    'mestres dos mitos',
    'milagres',
    'o assunto do ceu',
    'o cavalo e o seu menino',
    'o cavalo e seu menino',
    'o grande abismo',
    'o leao a feiticeira e o guarda roupa',
    'o peregrino regresso',
    'o peso da gloria',
    'o problema do sofrimento',
    'o sobrinho do mago',
    'oracao cartas a malcolm',
    'os quatro amores',
    'perelandra',
    'prefacio a paraiso perdido',
    'preparando-se a pascoa',
    'preparando-se para a pascoa',
    'principe caspian',
    'reflexoes cristas',
    'reflexoes sobre os salmos',
    'sobre escrever',
    'sobre historias',
    'spirits in bondage',
    'surpreendido pela alegria',
    'todo meu caminho diante de mim',
    // Grafia do acervo de produção — conferidas contra os pares reais:
    'a viagem do peregrino da alvorada',
    'um experimento em critica literaria',
    'cartas de um diabo ao seu aprendiz',
  ],
  'Dietrich Bonhoeffer': ['discipulado'],
  'Agostinho de Hipona': [
    'a cidade de deus',
    'confissoes',
    // Grafia do acervo: "A Doutrina Cristã" -> "a doutrina crista"
    'a doutrina crista',
    'homilias sobre a primeira epistola de joao',
    'enchiridion',
    'sermao',
    'de vera religione',
  ],
  'Tomás de Kempis': ['imitacao de cristo'],
  'Jonathan Edwards': ['afeicoes religiosas'],
  'Søren Kierkegaard': [
    'temor e tremor',
    'o conceito de ironia',
    'attack upon christendom',
    'ponto de vista explicativo da minha obra como escritor',
    'diarios',
    'provocations',
    'cartas',
  ],
  'João Calvino': [
    'as institutas',
    'a vida cristiana',
    // Grafia do acervo: "A Verdadeira Vida Cristã"
    'a verdadeira vida crista',
  ],
  'G. K. Chesterton': ['ortodoxia', 'illustrated london news'],
  'John Bunyan': ['o peregrino', 'o progresso do peregrino'],
  'Blaise Pascal': ['pensamentos'],
  'Martinho Lutero': [
    'do servo arbitrio',
    'castelo forte e o nosso deus',
    'as 95 teses',
    'a liberdade do cristao',
  ],
  'Simone Weil': ['a gravidade e a graca', 'o enraizamento', 'carta a joe bousquet'],
  'Boécio': ['a consolacao da filosofia'],
  'Anselmo de Cantuária': [
    'por que deus se fez homem',
    // O acervo escreve "Proslógio"; a grafia correta seria "Prólogo". As duas
    // entram porque o casamento é com o texto do banco, não com o dicionário.
    'proslogio',
    'prologo',
  ],
  'Tomás de Aquino': ['suma teologica'],
};

/**
 * Obras de produção que ficam DE PROPÓSITO sem CTA, cada uma com o motivo.
 *
 * Sem esta lista, "sem CTA" é indistinguível de "esqueci de curar" — e o
 * teste de cobertura trataria as duas como erro. A lista transforma a omissão
 * em decisão registrada.
 */
export const PENDING_NO_CTA: { author: string; source: string | null; why: string }[] = [
  {
    author: 'C. S. Lewis',
    source: null,
    why: '7+1 citações com fonte zerada pelo reparo de 01/10/2026. A citation continua no ar, sem link.',
  },
  {
    author: 'G. K. Chesterton',
    source:
      'peça teatral de Chesterton (formulação popular; original usa "discorda" em vez de "desobedece")',
    why: 'O campo source guarda uma nota de curadoria, não um título. A citação é duvidosa — link de compra seria endosso.',
  },
  {
    author: 'Søren Kierkegaard',
    source: 'Carta a Henriette Lund, 1847',
    why: 'Carta, não livro. Busca na Amazon não acha a obra; link seria enganoso.',
  },
];

/** Índice normalizado, montado uma vez. */
const WORKS_BY_AUTHOR = new Map<string, string[]>(
  Object.entries(CURATED_WORKS).map(([author, works]) => [
    normalizeSource(author),
    [...new Set(works.map(normalizeSource).filter((work) => work.length > 0))],
  ]),
);

/**
 * A obra de `source` pertence à curadoria do autor?
 *
 * Aceita três formas, porque a curadoria mistura formatos:
 *  - igual exato ("Milagres")
 *  - `source` começa pela obra — sufixo de capítulo/página ("Discipulado, cap. 1")
 *  - a obra começa pelo `source` — títulos parciais legítimos ("Príncipe
 *    Caspian" dentro de "As crônicas de Nárnia: Príncipe Caspian")
 *
 * `source` vazio, `source` igual ao nome do autor e `source` fora da lista
 * retornam `false` — e portanto nenhum CTA.
 */
export function isCuratedSource(author: string, source: string | null): boolean {
  if (!source) return false;
  const normalizedSource = normalizeSource(source);
  if (normalizedSource.length === 0) return false;

  // `source` igual ao nome do autor não é obra: é o defeito mais frequente no
  // acervo (7 casos) e o que gerava `?k=C. S. Lewis C. S. Lewis`.
  if (normalizedSource === normalizeSource(author)) return false;

  const works = WORKS_BY_AUTHOR.get(normalizeSource(author));
  if (!works) return false;

  return works.some(
    (work) =>
      normalizedSource === work ||
      normalizedSource.startsWith(`${work} `) ||
      work.startsWith(`${normalizedSource} `),
  );
}

/** Autores com curadoria de fontes — usado no relatório de fontes pendentes. */
export function curatedAuthors(): string[] {
  return Object.keys(CURATED_WORKS);
}