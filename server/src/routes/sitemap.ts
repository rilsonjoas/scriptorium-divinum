import type { FastifyInstance } from 'fastify';
import { db } from '../db/client.js';
import { listCategories } from '../db/queries.js';
import { textAvailable } from '../texts.js';
import { env } from '../config.js';

const STATIC_PATHS = [
  '/',
  '/livros',
  '/autores',
  '/categorias',
  // Consolidação 2026-09-26: /ajuda, /dominio-publico e /contribuir
  // viraram seções de /sobre (âncoras #uso, #dominio-publico,
  // #contribuir). Não entram mais no sitemap de propósito: são
  // redirect, e listar uma URL que redireciona no sitemap é pedir
  // para o Google indexar um salto em vez de uma página. As URLs
  // antigas continuam respondendo para link externo e para quem
  // digitou o endereço na barra.
  '/sobre',
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function sitemapRoutes(app: FastifyInstance) {
  app.get(
    '/sitemap.xml',
    {
      schema: {
        response: { 200: { type: 'string' } },
      },
    },
    async (_request, reply) => {
      const [books, categories, authors] = await Promise.all([
        db.query.books.findMany({ columns: { id: true, slug: true, onlineReadPath: true, authorId: true, published: true } }),
        listCategories(),
        db.query.authors.findMany({ columns: { id: true, slug: true } }),
      ]);

      // Obra sem leitura online não é indexada (2026-09-29): a ficha existe,
      // mas não tem o que o Google mandaria alguém ler.
      const readableBooks = books.filter((book) => book.published !== false && textAvailable(book.onlineReadPath));
      const authorsWithReadableBook = new Set(readableBooks.map((book) => book.authorId));

      const urls: string[] = [];
      for (const path of STATIC_PATHS) {
        urls.push(`${env.PUBLIC_ORIGIN}${path}`);
      }
      for (const book of readableBooks) {
        const ref = book.slug || book.id;
        urls.push(`${env.PUBLIC_ORIGIN}/livros/${ref}`);
      }
      for (const category of categories) {
        const ref = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        urls.push(`${env.PUBLIC_ORIGIN}/categorias/${ref}`);
      }
      for (const author of authors) {
        if (!authorsWithReadableBook.has(author.id)) continue;
        const ref = author.slug || author.id;
        urls.push(`${env.PUBLIC_ORIGIN}/autores/${ref}`);
      }

      const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`).join('\n')}
</urlset>
`;

      return reply.header('content-type', 'application/xml; charset=utf-8').send(body);
    },
  );
}
