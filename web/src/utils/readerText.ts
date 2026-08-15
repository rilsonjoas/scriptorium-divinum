export function splitProvenance(text: string): { provenance: string | null; content: string } {
  const index = text.indexOf('\n---\n');
  if (index === -1) return { provenance: null, content: text };
  return {
    provenance: text.slice(0, index),
    content: text.slice(index + 5),
  };
}
