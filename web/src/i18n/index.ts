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
    favoritos: 'Favoritos',
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
  autor: {
    voltarAutores: 'Voltar aos Autores',
    carregando: 'Carregando detalhes do autor...',
    obrasDe: 'Obras de {{name}}',
    obrasNoAcervo: 'Obras no Acervo Scriptorium Divinum',
    obra: 'obra',
    obras: 'obras',
    vidaEContexto: 'Vida & Contexto Histórico',
    principaisContribuicoes: 'Principais Contribuições & Legado',
    legadoOcidental: 'Legado Ocidental:',
    semObras: 'Novas edições preservadas deste autor estão sendo catalogadas no acervo.',
  },
  reader: {
    fonte: 'Fonte',
    tamanho: 'Tamanho',
    tema: 'Tema',
    ouvir: 'Ouvir',
    pausar: 'Pausar',
    parar: 'Parar',
    comoCitar: 'Como Citar esta Obra',
    anotacoes: 'Minhas Anotações',
    sumario: 'Índice do Livro',
  },
  livros: {
    titulo: 'Catálogo de Obras Clássicas',
    obrasEncontradas: 'obras encontradas',
    deNoAcervo: 'de {{total}} no acervo',
    favoritosApenas: 'Exibindo apenas obras favoritadas',
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
    favoritos: 'Favorites',
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
  autor: {
    voltarAutores: 'Back to Authors',
    carregando: 'Loading author details...',
    obrasDe: 'Works by {{name}}',
    obrasNoAcervo: 'Works in Scriptorium Divinum Collection',
    obra: 'work',
    obras: 'works',
    vidaEContexto: 'Life & Historical Context',
    principaisContribuicoes: 'Key Contributions & Legacy',
    legadoOcidental: 'Western Legacy:',
    semObras: 'New preserved editions by this author are currently being catalogued in the collection.',
  },
  reader: {
    fonte: 'Font',
    tamanho: 'Size',
    tema: 'Theme',
    ouvir: 'Listen',
    pausar: 'Pause',
    parar: 'Stop',
    comoCitar: 'How to Cite this Work',
    anotacoes: 'My Notes',
    sumario: 'Table of Contents',
  },
  livros: {
    titulo: 'Classic Works Catalogue',
    obrasEncontradas: 'works found',
    deNoAcervo: 'out of {{total}} in collection',
    favoritosApenas: 'Showing favorited works only',
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

const es = {
  nav: {
    catalogo: 'Catálogo',
    autores: 'Autores',
    categorias: 'Categorías',
    buscaAvancada: 'Búsqueda Avanzada',
    dominioPublico: 'Dominio Público',
    sobre: 'Acerca de',
    ajuda: 'Ayuda',
    comoContribuir: 'Cómo Contribuir',
    favoritos: 'Favoritos',
  },
  busca: {
    placeholder: 'Buscar obras, autores...',
    buscando: 'Buscando...',
    livros: 'Libros',
    autores2: 'Autores',
    verTodos: 'Ver todos',
    nenhumResultado: 'No se encontraron resultados para',
  },
  acoes: {
    lerOnline: 'Leer en Línea',
    favoritar: 'Agregar a favoritos',
    nosFavoritos: 'En favoritos',
    voltarCatalogo: 'Volver al Catálogo',
    downloads: 'Descargas:',
    editarImpressa: 'Edición impresa (Amazon)',
    verEscaneamento: 'Leer el escaneo en línea',
  },
  autor: {
    voltarAutores: 'Volver a Autores',
    carregando: 'Cargando detalles del autor...',
    obrasDe: 'Obras de {{name}}',
    obrasNoAcervo: 'Obras en la Colección Scriptorium Divinum',
    obra: 'obra',
    obras: 'obras',
    vidaEContexto: 'Vida y Contexto Histórico',
    principaisContribuicoes: 'Principales Contribuciones y Legado',
    legadoOcidental: 'Legado Occidental:',
    semObras: 'Nuevas ediciones conservadas de este autor se están catalogando en la colección.',
  },
  reader: {
    fonte: 'Fuente',
    tamanho: 'Tamaño',
    tema: 'Tema',
    ouvir: 'Escuchar',
    pausar: 'Pausar',
    parar: 'Detener',
    comoCitar: 'Cómo Citar esta Obra',
    anotacoes: 'Mis Notas',
    sumario: 'Índice del Libro',
  },
  livros: {
    titulo: 'Catálogo de Obras Clásicas',
    obrasEncontradas: 'obras encontradas',
    deNoAcervo: 'de {{total}} en la colección',
    favoritosApenas: 'Mostrando solo obras favoritas',
  },
  rodape: {
    navegacao: 'Navegación',
    recursos: 'Recursos',
    contato: 'Contacto',
    catalogoDeLivros: 'Catálogo de Libros',
    sobreOProjeto: 'Acerca del Proyecto',
    centralDeAjuda: 'Centro de Ayuda',
    conhecaTambem: 'Conozca también',
    direitos: 'Obras en dominio público o bajo licencia abierta, con atribución.',
  },
};

export const idiomas = [
  { codigo: 'pt-BR', rotulo: 'PT' },
  { codigo: 'en', rotulo: 'EN' },
  { codigo: 'es', rotulo: 'ES' },
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
    es: { translation: es },
  },
  lng: idiomaSalvo || 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
