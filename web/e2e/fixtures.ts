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
