import { describe, it, expect } from 'vitest';
import { sniffImage, extensaoCombina } from './image-sniff.js';

const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);
const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0]);
const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.from([1, 0, 0, 0]), Buffer.from('WEBPVP8 ')]);

describe('sniffImage', () => {
  it('reconhece png, jpg e webp', () => {
    expect(sniffImage(png)).toBe('.png');
    expect(sniffImage(jpg)).toBe('.jpg');
    expect(sniffImage(webp)).toBe('.webp');
  });
  it('recusa svg, html e arquivo vazio', () => {
    expect(sniffImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'))).toBeNull();
    expect(sniffImage(Buffer.from('<html></html>'))).toBeNull();
    expect(sniffImage(Buffer.alloc(0))).toBeNull();
  });
  it('recusa RIFF que não é webp (ex.: wav)', () => {
    expect(sniffImage(Buffer.concat([Buffer.from('RIFF'), Buffer.from([1, 0, 0, 0]), Buffer.from('WAVEfmt ')]))).toBeNull();
  });
});

describe('extensaoCombina', () => {
  it('jpg aceita .jpg e .jpeg; os demais exigem a própria extensão', () => {
    expect(extensaoCombina('.jpeg', '.jpg')).toBe(true);
    expect(extensaoCombina('.png', '.jpg')).toBe(false);
    expect(extensaoCombina('.png', '.png')).toBe(true);
    expect(extensaoCombina('.jpg', '.webp')).toBe(false);
  });
});
