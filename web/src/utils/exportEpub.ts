import { zipSync, strToU8 } from 'fflate';

export interface ExportEpubOptions {
  title: string;
  author: string;
  content: string;
  slug?: string;
  provenance?: string;
  publicationYear?: string | number;
}

const EPUB_NS = 'http://www.idpf.org/2007/ops';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMarkdown(line: string): string {
  return escapeHtml(line)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let inQuote = false;
  let inList = false;

  const closeQuote = () => {
    if (inQuote) {
      html.push('</blockquote>');
      inQuote = false;
    }
  };
  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      closeQuote();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeQuote();
      closeList();
      const level = Math.min(heading[1].length, 6);
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    if (line.startsWith('>')) {
      if (!inQuote) {
        closeList();
        html.push('<blockquote>');
        inQuote = true;
      }
      html.push(`<p>${inlineMarkdown(line.replace(/^>\s?/, ''))}</p>`);
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      closeQuote();
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(line.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    }

    if (line === '---') {
      closeQuote();
      closeList();
      html.push('<hr/>');
      continue;
    }

    closeQuote();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  closeQuote();
  closeList();

  return html.join('\n');
}

export function buildEpub({ title, author, content, slug, provenance, publicationYear }: ExportEpubOptions): Uint8Array {
  const bookId = slug || 'scriptorium';
  const coverTitle = escapeHtml(title);
  const coverAuthor = escapeHtml(author);
  const yearText = publicationYear ? ` (${publicationYear})` : '';
  const bodyText = provenance ? `<blockquote>\n<p><strong>Proveniência Editorial:</strong></p>\n${markdownToHtml(provenance)}\n</blockquote>\n\n${markdownToHtml(content)}` : markdownToHtml(content);

  const chapterHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="${EPUB_NS}" lang="pt-BR" xml:lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>${coverTitle}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <section epub:type="chapter">
    <h1>${coverTitle}</h1>
    <p class="subtitle">Por ${coverAuthor}${yearText}</p>
    ${bodyText}
  </section>
</body>
</html>`;

  const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

  const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="book-id">urn:uuid:00000000-0000-4000-8000-${bookId.slice(0, 12).padEnd(12, '0')}</dc:identifier>
    <dc:title>${coverTitle}</dc:title>
    <dc:creator>${coverAuthor}</dc:creator>
    <dc:language>pt-BR</dc:language>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z</meta>
  </metadata>
  <manifest>
    <item id="chapter" href="chapter.xhtml" media-type="application/xhtml+xml"/>
    <item id="css" href="style.css" media-type="text/css"/>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
  </manifest>
  <spine>
    <itemref idref="chapter"/>
  </spine>
</package>`;

  const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="${EPUB_NS}" lang="pt-BR" xml:lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>Navegação</title>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Sumário</h1>
    <ol>
      <li><a href="chapter.xhtml">${coverTitle}</a></li>
    </ol>
  </nav>
</body>
</html>`;

  const styleCss = `body {
  font-family: Georgia, 'Times New Roman', serif;
  margin: 5% 6% 5% 6%;
  line-height: 1.6;
  color: #1a1208;
}
h1 { font-size: 1.6em; margin-bottom: 0.2em; }
.subtitle { font-style: italic; color: #6b4a1f; margin-bottom: 1.5em; }
blockquote { border-left: 3px solid #b8860b; margin-left: 0; padding-left: 1em; color: #4a3c28; }
p { text-align: justify; }
hr { border: none; border-top: 1px solid #b8860b; margin: 2em 0; }
`;

  const files: Record<string, [Uint8Array, { level: number }] | Uint8Array> = {
    // mimetype deve ficar SEM compressão (STORED) por exigência do formato EPUB
    'mimetype': [strToU8('application/epub+zip'), { level: 0 }],
    'META-INF/container.xml': strToU8(containerXml),
    'OEBPS/content.opf': strToU8(contentOpf),
    'OEBPS/nav.xhtml': strToU8(navXhtml),
    'OEBPS/chapter.xhtml': strToU8(chapterHtml),
    'OEBPS/style.css': strToU8(styleCss),
  };

  return zipSync(files as Record<string, Uint8Array>, { level: 6 });
}

export function downloadEpubFile(filename: string, data: Uint8Array) {
  const blob = new Blob([data.slice().buffer], { type: 'application/epub+zip' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.epub') ? filename : `${filename}.epub`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}