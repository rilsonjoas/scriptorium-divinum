import type { FastifyInstance } from 'fastify';
import { db } from '../db/client.js';
import { listCategories } from '../db/queries.js';
import { env } from '../config.js';

const STATIC_PATHS = [
  '/',
  '/livros',
  '/autores',
  '/categorias',
  '/sobre',
  '/ajuda',
  '/dominio-publico',
  '/contribuir',
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
      const [books, categories] = await Promise.all([
        db.query.books.findMany({ columns: { id: true, slug: true } }),
        listCategories(),
      ]);

      const urls: string[] = [];
      for (const path of STATIC_PATHS) {
        urls.push(`${env.PUBLIC_ORIGIN}${path}`);
      }
      for (const book of books) {
        const ref = book.slug || book.id;
        urls.push(`${env.PUBLIC_ORIGIN}/livros/${ref}`);
      }
      for (const category of categories) {
        const ref = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        urls.push(`${env.PUBLIC_ORIGIN}/categorias/${ref}`);
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
