import { describe, it, expect } from 'vitest';
import { createAuthorSchema, createBookSchema } from './admin.schema.js';

const livro = { title: 'T', authorId: '00000000-0000-4000-8000-000000000001', description: 'd' };
const muitos = (n: number) => Array.from({ length: n }, (_, i) => `x${i}`);

/** Defesa em profundidade contra o GHSA-mrhx-c7xc-m3w5 (zod): array vindo do cliente sempre com teto de tamanho. */
describe('arrays do corpo do admin têm teto de tamanho', () => {
  it.each([
    ['denominationOrTradition', () => createAuthorSchema.safeParse({ name: 'A', denominationOrTradition: muitos(201) })],
    ['originalLanguages', () => createBookSchema.safeParse({ ...livro, originalLanguages: muitos(201) })],
    ['categories', () => createBookSchema.safeParse({ ...livro, categories: muitos(201) })],
    ['tags', () => createBookSchema.safeParse({ ...livro, tags: muitos(201) })],
    [
      'downloadLinks',
      () => createBookSchema.safeParse({ ...livro, downloadLinks: Array.from({ length: 101 }, () => ({ format: 'pdf', url: 'u' })) }),
    ],
    [
      'tableOfContents',
      () => createBookSchema.safeParse({ ...livro, tableOfContents: Array.from({ length: 5001 }, (_, i) => ({ title: 't', orderIndex: i })) }),
    ],
  ])('recusa %s acima do teto', (_campo, parse) => {
    expect(parse().success).toBe(false);
  });

  it('aceita no teto', () => {
    expect(createBookSchema.safeParse({ ...livro, tags: muitos(200), categories: muitos(200) }).success).toBe(true);
    expect(createBookSchema.safeParse({ ...livro, tableOfContents: Array.from({ length: 5000 }, (_, i) => ({ title: 't', orderIndex: i })) }).success).toBe(true);
  });
});
