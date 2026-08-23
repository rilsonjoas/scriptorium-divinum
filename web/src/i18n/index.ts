import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const ptBR = {
  nav: {
    catalogo: 'Catálogo',
    autores: 'Autores',
    categorias: 'Categorias',
    buscaAvancada: 'Busca Avançada',
    dominioPublico: 'Domínio Público',
    sobre: 'Sobre',
    ajuda: 'Ajuda',
    comoContribuir: 'Como Contribuir',
  },
  busca: {
    placeholder: 'Buscar obras, autores...',
    buscando: 'Buscando...',
    livros: 'Livros',
    autores2: 'Autores',
    verTodos: 'Ver todos',
    nenhumResultado: 'Nenhum resultado encontrado para',
  },
  acoes: {
    lerOnline: 'Ler Online',
    favoritar: 'Favoritar',
    nosFavoritos: 'Nos favoritos',
    voltarCatalogo: 'Voltar ao Catálogo',
    downloads: 'Downloads:',
    editarImpressa: 'Edição impressa (Amazon)',
    verEscaneamento: 'Ler o escaneamento online',
  },
  rodape: {
    navegacao: 'Navegação',
    recursos: 'Recursos',
    contato: 'Contato',
    catalogoDeLivros: 'Catálogo de Livros',
    sobreOProjeto: 'Sobre o Projeto',
    centralDeAjuda: 'Central de Ajuda',
    conhecaTambem: 'Conheça também',
    direitos: 'Obras em domínio público ou sob licença aberta, com atribuição.',
  },
};

const en = {
  nav: {
    catalogo: 'Catalogue',
    autores: 'Authors',
    categorias: 'Categories',
    buscaAvancada: 'Advanced Search',
    dominioPublico: 'Public Domain',
    sobre: 'About',
    ajuda: 'Help',
    comoContribuir: 'How to Contribute',
  },
  busca: {
    placeholder: 'Search works and authors...',
    buscando: 'Searching...',
    livros: 'Books',
    autores2: 'Authors',
    verTodos: 'See all',
    nenhumResultado: 'No results found for',
  },
  acoes: {
    lerOnline: 'Read Online',
    favoritar: 'Add to favorites',
    nosFavoritos: 'In favorites',
    voltarCatalogo: 'Back to Catalogue',
    downloads: 'Downloads:',
    editarImpressa: 'Printed edition (Amazon)',
    verEscaneamento: 'Read the scanned copy online',
  },
  rodape: {
    navegacao: 'Navigation',
    recursos: 'Resources',
    contato: 'Contact',
    catalogoDeLivros: 'Book Catalogue',
    sobreOProjeto: 'About the Project',
    centralDeAjuda: 'Help Center',
    conhecaTambem: 'See also',
    direitos: 'Works in the public domain or under open licence, with attribution.',
  },
};

export const idiomas = [
  { codigo: 'pt-BR', rotulo: 'PT' },
  { codigo: 'en', rotulo: 'EN' },
] as const;

const idiomaSalvo = (() => {
  try {
    return localStorage.getItem('scriptorium:lang');
  } catch {
    return null;
  }
})();

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: ptBR },
    en: { translation: en },
  },
  lng: idiomaSalvo === 'en' ? 'en' : 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: { escapeValue: false },
});

export default i18n;
