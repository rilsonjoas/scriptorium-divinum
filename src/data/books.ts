import { Book } from '@/types';
import { authors } from './authors';

export const books: Book[] = [
  {
    id: 'agostinho-confissoes',
    title: 'Confissões',
    originalTitle: 'Confessiones',
    author: authors[0], // Santo Agostinho
    publicationYearOriginal: '397-400',
    publicationYearTranslation: 1890,
    translator: 'J. Oliveira Santos',
    language: 'Português',
    originalLanguages: ['Latim'],
    description: 'Uma das obras mais influentes da literatura cristã, as Confissões de Santo Agostinho narram sua conversão ao cristianismo e exploram temas profundos sobre a natureza humana, o tempo e a relação com Deus.',
    categories: ['Patrística', 'Autobiografia Espiritual', 'Filosofia Cristã'],
    tags: ['conversão', 'filosofia', 'tempo', 'memória', 'pecado', 'graça'],
    coverImageUrl: '/images/covers/confissoes.jpg',
    onlineReadPath: '/texts/agostinho-confissoes.md',
    downloadLinks: [
      { format: 'pdf', url: '/downloads/agostinho/confissoes.pdf', source: 'Internet Archive' },
      { format: 'epub', url: '/downloads/agostinho/confissoes.epub' }
    ],
    featured: true
  },
  {
    id: 'agostinho-epistola-joao',
    title: 'A Primeira Epístola de São João Comentada',
    author: authors[0], // Santo Agostinho
    publicationYearOriginal: 407,
    publicationYearTranslation: 1920,
    language: 'Português',
    originalLanguages: ['Latim'],
    description: 'Comentários profundos de Santo Agostinho sobre a Primeira Epístola de São João, explorando temas como o amor divino, a comunhão cristã e a natureza do pecado.',
    categories: ['Patrística', 'Comentário Bíblico', 'Teologia'],
    tags: ['amor', 'comunhão', 'epístolas', 'exegese'],
    coverImageUrl: '/images/covers/epistola-joao.jpg',
    onlineReadPath: '/texts/agostinho-epistola-joao.md',
    downloadLinks: [
      { format: 'pdf', url: '/downloads/agostinho/epistola-joao.pdf', source: 'Internet Archive' }
    ],
    featured: true
  },
  {
    id: 'belarmino-sete-palavras',
    title: 'As Sete Palavras de Cristo na Cruz',
    author: authors[1], // São Roberto Belarmino
    publicationYearOriginal: 1618,
    publicationYearTranslation: 1925,
    language: 'Português',
    originalLanguages: ['Latim'],
    description: 'Meditações profundas sobre as sete últimas palavras de Jesus Cristo na cruz, oferecendo reflexões espirituais sobre o significado da Paixão.',
    categories: ['Espiritualidade', 'Meditações', 'Contra-Reforma'],
    tags: ['crucificação', 'paixão', 'meditação', 'Jesus Cristo'],
    coverImageUrl: '/images/covers/sete-palavras.jpg',
    onlineReadPath: '/texts/belarmino-sete-palavras.md',
    downloadLinks: [
      { format: 'pdf', url: '/downloads/belarmino/sete-palavras.pdf', source: 'Internet Archive' }
    ],
    featured: false
  }
];