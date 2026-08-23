export function markdownToSpeechText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/[*_~`]+/g, '')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function splitIntoChunks(text: string, max = 200): string[] {
  const sentences = text.match(/[^.!?…]+[.!?…]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if ((current + sentence).length > max && current) {
      chunks.push(current.trim());
      current = '';
    }
    current += sentence;
    while (current.length > max * 1.5) {
      chunks.push(current.slice(0, max).trim());
      current = current.slice(max);
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.filter(Boolean);
}

export function pickPortugueseVoice(
  synth: Pick<SpeechSynthesis, 'getVoices'>,
): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  return (
    voices.find(v => v.lang?.toLowerCase().startsWith('pt-br')) ??
    voices.find(v => v.lang?.toLowerCase().startsWith('pt')) ??
    null
  );
}
