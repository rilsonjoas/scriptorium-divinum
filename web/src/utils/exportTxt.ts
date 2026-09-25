export interface ExportTxtOptions {
  title: string;
  author: string;
  content: string;
  slug?: string;
  provenance?: string;
  publicationYear?: string | number;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^---\s*$/gm, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*\n{3,}/gm, '\n\n')
    .trim();
}

export function generateCleanTxt({
  title,
  author,
  content,
  slug,
  provenance,
  publicationYear,
}: ExportTxtOptions): string {
  const header = [
    title.toUpperCase(),
    `Por ${author}${publicationYear ? ` (${publicationYear})` : ''}`,
    'Domínio público — Distribuído gratuitamente por Scriptorium Divinum',
    slug ? `Fonte: https://scriptoriumdivinum.com/ler/${slug}` : 'Fonte: https://scriptoriumdivinum.com',
    new Date().toISOString().split('T')[0],
  ].join('\n');

  const footer = [
    '',
    '---',
    'Exportado de Scriptorium Divinum — Biblioteca Teológica Clássica',
    'https://scriptoriumdivinum.com',
  ].join('\n');

  const body = provenance
    ? `Proveniência Editorial:\n${stripMarkdown(provenance)}\n\n---\n\n${stripMarkdown(content)}`
    : stripMarkdown(content);

  return `${header}\n\n${'='.repeat(60)}\n\n${body}${footer}`;
}

export function downloadTxtFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}