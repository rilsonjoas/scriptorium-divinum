import { Author } from '@/types';

export const authors: Author[] = [
  {
    slug: 'agostinho-de-hipona',
    name: 'Santo Agostinho de Hipona',
    birthYear: 354,
    deathYear: 430,
    bioSummary: 'Bispo, teólogo e filósofo cristão, considerado um dos Padres da Igreja e um dos maiores pensadores do cristianismo. Suas obras influenciaram profundamente a teologia ocidental.',
    portraitImageUrl: '/images/authors/agostinho.jpg',
    denominationOrTradition: ['Patrística', 'Igreja Católica']
  },
  {
    slug: 'roberto-belarmino',
    name: 'São Roberto Belarmino',
    birthYear: 1542,
    deathYear: 1621,
    bioSummary: 'Cardeal jesuíta, teólogo e Doutor da Igreja. Conhecido por suas controvérsias contra o protestantismo e por suas obras de espiritualidade.',
    portraitImageUrl: '/images/authors/belarmino.jpg',
    denominationOrTradition: ['Contra-Reforma', 'Companhia de Jesus']
  },
  {
    slug: 'joao-crisostomo',
    name: 'São João Crisóstomo',
    birthYear: 349,
    deathYear: 407,
    bioSummary: 'Arcebispo de Constantinopla e um dos maiores oradores da Igreja primitiva. Conhecido pela eloquência de seus sermões e comentários bíblicos.',
    portraitImageUrl: '/images/authors/crisostomo.jpg',
    denominationOrTradition: ['Patrística', 'Igreja Oriental']
  }
];