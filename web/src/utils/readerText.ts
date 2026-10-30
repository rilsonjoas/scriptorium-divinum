/** só títulos, linhas horizontais e espaços (nenhum parágrafo) */
function soTitulos(trecho: string): boolean {
  return trecho.split('\n').every((l) => l.trim() === '' || /^#{1,6}\s/.test(l) || /^([-*_])\1{2,}\s*$/.test(l.trim()));
}

/**
 * Separa o ensaio de proveniência do texto de leitura.
 *
 * Os arquivos começam com frontmatter YAML (descartado) e um bloco de título
 * e autor; a seção `# Proveniência…` vem depois, terminada por `---`. Só ela é
 * o contexto da ficha: sem essa seção, nada é retirado do texto de leitura.
 */
export function splitProvenance(text: string): { provenance: string | null; content: string } {
  const semFrontmatter = text.replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  let resto = semFrontmatter;
  // o bloco de título (só títulos, até o `---`) é pulado se a Proveniência vier depois dele
  for (let tentativa = 0; tentativa < 2; tentativa++) {
    const marco = `\n${resto}`.indexOf('\n---\n');
    if (marco === -1) break;
    const antes = resto.slice(0, Math.max(0, marco - 1));
    const depois = resto.slice(marco - 1 + 5);
    if (/^\s*#{1,6}\s*Proveni[êe]ncia/i.test(antes)) {
      return { provenance: antes.trim(), content: depois.replace(/^\s*\n/, '') };
    }
    if (!soTitulos(antes)) break;
    resto = depois;
  }
  return { provenance: null, content: semFrontmatter };
}

/**
 * Os textos usam a sintaxe de "callout" do Obsidian/GitHub (`> [!NOTE]`) nas
 * notas editoriais. O markdown comum não a entende e mostraria o marcador cru:
 * tira o `[!NOTE]` e, se houver título na mesma linha, vira negrito.
 */
export function limparCallouts(markdown: string): string {
  return markdown.replace(/^>[ \t]*\[!NOTE\][ \t]*(.*)(\n|$)/gm, (_, titulo: string, quebra: string) =>
    titulo.trim() ? `> **${titulo.trim()}**\n>${quebra}` : '',
  );
}
