// Confere o conteúdo real do arquivo, não só o nome e o Content-Type que o cliente declara.
// SVG fica de fora de propósito: é XML com script e, servido da origem da API, vira XSS armazenado.

export type ImageExt = '.jpg' | '.jpeg' | '.png' | '.webp';

export function sniffImage(buf: Buffer): ImageExt | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return '.jpg';
  if (
    buf.length >= 8 &&
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return '.png';
  }
  if (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString('latin1') === 'RIFF' &&
    buf.subarray(8, 12).toString('latin1') === 'WEBP'
  ) {
    return '.webp';
  }
  return null;
}

/** A extensão declarada precisa ser compatível com o formato detectado. */
export function extensaoCombina(ext: string, detectado: ImageExt): boolean {
  if (detectado === '.jpg') return ext === '.jpg' || ext === '.jpeg';
  return ext === detectado;
}
