/**
 * Fixtures mínimas para a auditoria rodar com **DOM representativo**.
 *
 * Sem isto, cada página cairia no estado de erro e a auditoria
 * mediria um `<ErrorState>` em vez do catálogo — que passaria limpinho
 * e não provaria nada. O padrão `Padrão de Acessibilidade` é explícito:
 * auditoria que mede a página errada dá número bonito e falso.
 */

export const autor = {
  id: 'a1',
  slug: 'santo-agostinho',
  name: 'Santo Agostinho',
  birth_year: 354,
  death_year: 430,
  bioSummary: 'Bispo de Hipona e autor das Confissões.',
  portraitImageUrl: '/images/authors/santo-agostinho.jpg',
};

export const livro = {
  id: '8ceec7d1-c719-4eea-a3fc-a7bfd2a5a9da',
  slug: 'confissoes',
  title: 'Confissões de Santo Agostinho',
  originalTitle: 'Confessiones',
  description: 'Autobiografia espiritual de Santo Agostinho, em tradução brasileira.',
  language: 'Português',
  categories: ['Patrística'],
  author: autor,
  publicationYearOriginal: '397',
  textAvailable: true,
  onlineReadPath: '/texts/confissoes-garnier-1905-pt.md',
  coverImageUrl: '/covers/confissoes.svg',
  readingMinutes: 700,
};

export const textoObra = [
  'Prolegômenos. Servir a Deus é o único fim que devo buscar.',
  '',
  '## Capítulo I',
  '',
  'Retrai-te, em meu homem interior, e deixa que se ache em Ti.',
  '',
  '## Capítulo II',
  '',
  'Quando vim a Ti, Senhor, em outro tempo, estava cheio deﬁciência interior.',
  '',
  '> "Tua imagem é mais formosa do que a de qualquer homem."',
].join('\n');

export const settings = {
  maintenanceMode: false,
  siteName: 'Scriptorium Divinum',
  siteDescription: 'Biblioteca de textos teológicos clássicos em domínio público.',
};

export const categorias = [
  { id: 'c1', slug: 'patristica', name: 'Patrística', description: 'Os Padres da Igreja.' },
  { id: 'c2', slug: 'reforma', name: 'Reforma', description: 'Reformadores e suas obras.' },
];

const itemCitacao = (extra: Record<string, unknown>) => ({
  id: 'c0000000-0000-4000-8000-000000000001',
  author: 'C. S. Lewis',
  text: 'Não existe nenhuma coisa neutra no universo.',
  source: 'Cristianismo Puro e Simples',
  dominioPublico: false,
  scriptoriumUrl: null,
  theme: null,
  fonteUrl: null,
  verificadoEm: null,
  status: 'ativa',
  motivoOcultacao: null,
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.123Z',
  diasFixados: [],
  ...extra,
});

/** Resposta de `GET /api/v1/admin/quotes`: uma ativa sem verificação e fixada em 1 dia, uma oculta e um rascunho. */
export const listaAdminCitacoes = {
  itens: [
    itemCitacao({ diasFixados: ['2026-10-19'] }),
    itemCitacao({
      id: 'c0000000-0000-4000-8000-000000000002',
      author: 'Santo Agostinho',
      text: 'Fizeste-nos para ti, e inquieto está o nosso coração.',
      source: 'Confissões',
      dominioPublico: true,
      fonteUrl: 'https://exemplo.org/confissoes',
      verificadoEm: '2026-10-02',
      status: 'oculta',
      motivoOcultacao: 'Tradução a revisar',
    }),
    itemCitacao({
      id: 'c0000000-0000-4000-8000-000000000003',
      author: 'Santo Agostinho',
      text: 'Rascunho ainda sem fonte.',
      source: null,
      status: 'rascunho',
    }),
  ],
  total: 3,
  pagina: 1,
  porPagina: 50,
  contadores: {
    porStatus: { rascunho: 1, ativa: 1, oculta: 1 },
    porAutor: [
      { autor: 'Santo Agostinho', total: 2 },
      { autor: 'C. S. Lewis', total: 1 },
    ],
    semVerificacao: 1,
  },
};

export const adminLogado = { id: 'ad1', email: 'admin@teste.com', name: 'Admin' };
