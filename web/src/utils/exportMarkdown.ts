export interface ExportMarkdownOptions {
  title: string;
  author: string;
  content: string;
  slug?: string;
  provenance?: string;
  categories?: string[];
  publicationYear?: string | number;
}

export function generateObsidianMarkdown({
  title,
  author,
  content,
  slug,
  provenance,
  categories,
  publicationYear,
}: ExportMarkdownOptions): string {
  const frontmatterLines = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `author: "${author.replace(/"/g, '\\"')}"`,
    publicationYear ? `year: ${publicationYear}` : null,
    categories && categories.length > 0 ? `categories: [${categories.map(c => `"${c}"`).join(', ')}]` : null,
    'source: "Scriptorium Divinum - Biblioteca Teológica Clássica"',
    slug ? `url: "https://scriptoriumdivinum.com/ler/${slug}"` : null,
    `exported_at: "${new Date().toISOString().split('T')[0]}"`,
    '---',
    '',
  ].filter((line): line is string => line !== null);

  const frontmatter = frontmatterLines.join('\n');

  let body = content;
  if (provenance) {
    body = `> **Proveniência Editorial:**\n> ${provenance.replace(/\n/g, '\n> ')}\n\n---\n\n${body}`;
  }

  return `${frontmatter}# ${title}\n*Por ${author}*\n\n${body}`;
}

export function downloadMarkdownFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
