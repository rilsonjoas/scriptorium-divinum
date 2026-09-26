export interface Chapter {
  id: string;
  title: string;
  level: number;
  /** markdown do capítulo, incluindo o heading */
  body: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Segmenta o markdown da obra em capítulos pelos headings markdown.
 *
 * Existe para resolver o gargalo medido no Reader: uma obra longa
 * (Confissões tem ~579KB de markdown) era inteira passada ao
 * `react-markdown` de uma vez, travando ~23s a primeira pintura. Com a
 * divisão, só o capítulo visível é processado a cada vez.
 *
 * Capítulos de nível 1 (`#`) são as partes; subtítulos (`##`, `###`)
 *ficam aninhados dentro do capítulo que os precede.
 */
export function splitIntoChapters(markdown: string): Chapter[] {
  const lines = markdown.split('\n');
  const chapters: Chapter[] = [];

  let atual: { id: string; title: string; level: number; body: string[] } | null = null;
  const preludio: string[] = [];
  let i = 0;

  const flush = () => {
    if (atual) {
      chapters.push({ ...atual, body: atual.body.join('\n').trim() });
      atual = null;
    }
  };

  while (i < lines.length) {
    const linha = lines[i];
    const m = linha.match(/^(#{1,6})\s+(.*)$/);

    // heading markdown no inicio da linha
    if (m) {
      const level = m[1].length;
      const title = m[2].trim();
      // Abre capítulo novo em nível 1 e 2. As obras do acervo usam
      // `## Capítulo I` como unidade de leitura (Confissões tem 170
      // deles e só 2 de nível 1), então aceitar só `#` não segmentaria
      // quase nada. Níveis 3+ ficam dentro do capítulo corrente.
      if (level <= 2) {
        flush();
        atual = { id: slugify(title) || `cap-${chapters.length + 1}`, title, level, body: [linha] };
      } else if (atual) {
        atual.body.push(linha);
      } else {
        preludio.push(linha);
      }
    } else if (atual) {
      atual.body.push(linha);
    } else {
      preludio.push(linha);
    }
    i += 1;
  }
  flush();

  // texto antes do primeiro heading fica como um capitulo inicial
  const preludioTexto = preludio.join('\n').trim();
  if (preludioTexto && chapters.length > 0) {
    chapters.unshift({ id: 'inicio', title: 'Início', level: 1, body: preludioTexto });
  }

  // obra sem nenhum heading: um capitulo so
  if (chapters.length === 0) {
    return [{ id: 'obra', title: 'Obra', level: 1, body: markdown.trim() }];
  }

  return chapters;
}

/** encontra o indice do primeiro capitulo cujo corpo contem o heading `id` */
export function chapterIndexById(chapters: Chapter[], id: string): number {
  return chapters.findIndex((c) => c.id === id);
}
