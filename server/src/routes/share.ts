import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getBookByIdOrSlug } from '../db/queries.js';

const SITE_URL = 'https://scriptorium.narniano.com';
const SITE_NAME = 'Scriptorium Divinum';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function plainTextSummary(text: string, maxLength = 200): string {
  const plain = text.replace(/\n+/g, ' ').trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trimEnd()}…`;
}

/** Rota só pra bots de preview de link (WhatsApp, Facebook, Telegram
 *  etc.) — nginx proxeia /livros/:idOrSlug pra cá quando o User-Agent
 *  bate com bot conhecido (ver web/nginx.conf). Esses bots não rodam JS,
 *  então nunca viam a meta tag certa do livro, só a genérica do
 *  index.html (mesmo achado/padrão do biblia-na-arte, 2026-09-19 — ver
 *  hetzner-infra/PADRAO-DE-ENGENHARIA.md, checklist "preview de link em
 *  app compartilhável"). Navegador de verdade nunca bate aqui. */
export async function shareRoutes(app: FastifyInstance) {
  app.get('/share/livros/:idOrSlug', async (request, reply) => {
    const parsed = z.object({ idOrSlug: z.string() }).safeParse(request.params);
    const idOrSlug = parsed.success ? parsed.data.idOrSlug : '';
    const targetUrl = `${SITE_URL}/livros/${idOrSlug}`;

    const book = idOrSlug ? await getBookByIdOrSlug(idOrSlug) : undefined;

    const title = book
      ? `${book.title}${book.author?.name ? ` — ${book.author.name}` : ''} | ${SITE_NAME}`
      : `${SITE_NAME} — Biblioteca Teológica Clássica`;
    const description = book
      ? plainTextSummary(book.description)
      : 'Biblioteca digital de obras teológicas clássicas em domínio público.';
    const image = book?.coverImageUrl
      ? book.coverImageUrl.startsWith('http')
        ? book.coverImageUrl
        : `${SITE_URL}${book.coverImageUrl}`
      : `${SITE_URL}/android-chrome-512x512.png`;

    const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">
<meta property="og:type" content="book">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${escapeHtml(image)}">
<meta property="og:url" content="${escapeHtml(targetUrl)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${escapeHtml(image)}">
<meta http-equiv="refresh" content="0; url=${escapeHtml(targetUrl)}">
<link rel="canonical" href="${escapeHtml(targetUrl)}">
</head>
<body>
<p>Redirecionando para <a href="${escapeHtml(targetUrl)}">${escapeHtml(title)}</a>…</p>
</body>
</html>`;

    reply.header('Cache-Control', 'public, max-age=600, stale-while-revalidate=120');
    return reply.type('text/html; charset=utf-8').send(html);
  });
}
