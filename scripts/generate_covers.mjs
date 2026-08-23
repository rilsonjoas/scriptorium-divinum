// Gera capas tipográficas (SVG) para todas as obras do catálogo.
// Uso: node scripts/generate_covers.mjs [--api URL] [--out DIR]
// Saída: {out}/{slug}.svg + scripts/add_covers_YYYY-MM-DD.sql

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const API = process.argv.includes('--api')
  ? process.argv[process.argv.indexOf('--api') + 1]
  : 'https://api-scriptorium.narniano.com';
const OUT = process.argv.includes('--out')
  ? process.argv[process.argv.indexOf('--out') + 1]
  : fileURLToPath(new URL('../web/public/covers/', import.meta.url));

const W = 600;
const H = 900;
const INK = '#2c1e13';
const BRONZE = '#8a6a3f';
const GOLD = '#b08d3e';
const BG = '#f4ecdc';

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrap(title, maxChars) {
  const words = title.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 6);
}

function coverSvg(slug, title, author) {
  const limpo = title.replace(/\([^)]*\)/g, '').trim() || title;
  const size =
    limpo.length <= 22 ? 46 :
    limpo.length <= 44 ? 38 :
    limpo.length <= 70 ? 32 : 27;
  const maxChars = Math.floor(340 / (size * 0.52));
  const lines = wrap(limpo, maxChars);
  const lineH = size * 1.25;
  const blockH = lines.length * lineH;

  const titleSpans = lines
    .map((l, i) => `<tspan x="${W / 2}" dy="${i === 0 ? 0 : lineH}">${esc(l)}</tspan>`)
    .join('');
  const titleY = H / 2 - blockH / 2 + size * 0.8;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Capa de ${esc(title)}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="18" y="18" width="${W - 36}" height="${H - 36}" fill="none" stroke="${BRONZE}" stroke-width="5"/>
  <rect x="30" y="30" width="${W - 60}" height="${H - 60}" fill="none" stroke="${GOLD}" stroke-width="1.5"/>
  <text x="${W / 2}" y="86" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="17" letter-spacing="7" font-weight="bold" fill="${GOLD}">SCRIPTORIUM DIVINUM</text>
  <line x1="${W / 2 - 55}" y1="104" x2="${W / 2 + 55}" y2="104" stroke="${BRONZE}" stroke-width="1.5"/>
  <text x="${W / 2}" y="${titleY}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" font-size="${size}" fill="${INK}">${titleSpans}</text>
  <text x="${W / 2}" y="${titleY + blockH + 10}" text-anchor="middle" font-size="26" fill="${GOLD}">&#10022;</text>
  <text x="${W / 2}" y="${titleY + blockH + 56}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="24" fill="${BRONZE}">${esc(author)}</text>
  <text x="${W / 2}" y="${H - 66}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="15" letter-spacing="4" fill="${BRONZE}">scriptorium.narniano.com</text>
</svg>
`;
}

async function main() {
  const res = await fetch(`${API}/api/v1/books?limit=100`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  const first = await res.json();
  const items = [...first.items];
  for (let p = 2; p <= (first.totalPages ?? 1); p++) {
    const r = await fetch(`${API}/api/v1/books?limit=100&page=${p}`);
    const d = await r.json();
    items.push(...d.items);
  }

  mkdirSync(OUT, { recursive: true });
  const updates = [];
  for (const b of items) {
    if (!b.slug) continue;
    const svg = coverSvg(b.slug, b.title, b.author?.name ?? '');
    writeFileSync(`${OUT}${b.slug}.svg`, svg, 'utf-8');
    updates.push(
      `UPDATE books SET cover_image_url = '/covers/${b.slug}.svg' WHERE slug = '${b.slug}' AND (cover_image_url IS NULL OR cover_image_url = '');`
    );
    console.log('✓', b.slug);
  }
  writeFileSync(
    fileURLToPath(new URL('./add_covers_2026-08-23.sql', import.meta.url)),
    `-- Capas tipográficas geradas em ${new Date().toISOString().slice(0, 10)}\n\nBEGIN;\n\n${updates.join('\n')}\n\nCOMMIT;\n`,
    'utf-8',
  );
  console.log(`\n${items.length} capas geradas + add_covers_2026-08-23.sql`);
}

main();
