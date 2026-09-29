import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  saveReadingProgress,
  getReadingProgress,
  listReadingProgress,
  removeReadingProgress,
  shouldResume,
} from './readingProgress';

describe('readingProgress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('salva e recupera posição por slug', () => {
    saveReadingProgress({ slug: 'confissoes', title: 'Confissões', ratio: 0.42 });
    const r = getReadingProgress('confissoes');
    expect(r?.ratio).toBeCloseTo(0.42);
    expect(r?.title).toBe('Confissões');
  });

  it('atualiza entrada existente mantendo uma só', () => {
    saveReadingProgress({ slug: 'confissoes', title: 'Confissões', ratio: 0.1 });
    saveReadingProgress({ slug: 'confissoes', title: 'Confissões', ratio: 0.5 });
    const all = listReadingProgress();
    expect(all).toHaveLength(1);
    expect(all[0].ratio).toBeCloseTo(0.5);
  });

  it('limita ratio entre 0 e 1', () => {
    saveReadingProgress({ slug: 'a', title: 'A', ratio: 2 });
    expect(getReadingProgress('a')?.ratio).toBe(1);
    saveReadingProgress({ slug: 'b', title: 'B', ratio: -3 });
    expect(getReadingProgress('b')?.ratio).toBe(0);
  });

  it('lista do mais recente ao mais antigo', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
    saveReadingProgress({ slug: 'a', title: 'A', ratio: 0.1 });
    vi.setSystemTime(2000);
    saveReadingProgress({ slug: 'b', title: 'B', ratio: 0.2 });
    const all = listReadingProgress();
    expect(all[0].slug).toBe('b');
    expect(all[1].slug).toBe('a');
    vi.useRealTimers();
  });

  it('remove entrada', () => {
    saveReadingProgress({ slug: 'a', title: 'A', ratio: 0.1 });
    removeReadingProgress('a');
    expect(getReadingProgress('a')).toBeNull();
  });

  it('tolera JSON corrompido', () => {
    localStorage.setItem('scriptorium:reading-progress', '{quebrado');
    expect(listReadingProgress()).toEqual([]);
    saveReadingProgress({ slug: 'a', title: 'A', ratio: 0.1 });
    expect(getReadingProgress('a')).not.toBeNull();
  });

  it('ignora registros do formato antigo (progresso só do capítulo aberto)', () => {
    // bug real: abrir só o 1º capítulo das Confissões gravava 100%, porque o
    // leitor antigo media a rolagem do capítulo, não a posição na obra
    localStorage.setItem(
      'scriptorium:reading-progress',
      JSON.stringify({ confissoes: { slug: 'confissoes', title: 'Confissões', ratio: 1, updatedAt: 1 } }),
    );
    expect(getReadingProgress('confissoes')).toBeNull();
    expect(listReadingProgress()).toEqual([]);
  });

  it('um registro novo substitui o antigo', () => {
    localStorage.setItem(
      'scriptorium:reading-progress',
      JSON.stringify({ confissoes: { slug: 'confissoes', title: 'Confissões', ratio: 1, updatedAt: 1 } }),
    );
    saveReadingProgress({ slug: 'confissoes', title: 'Confissões', ratio: 0.004 });
    expect(listReadingProgress().map(e => e.ratio)).toEqual([0.004]);
  });

  describe('shouldResume', () => {
    // o progresso é da obra inteira: numa obra de 171 capítulos, o capítulo
    // 4 é 1,8% e os 9 últimos passam de 95%
    it('retoma qualquer posição depois do início', () => {
      expect(shouldResume(3 / 171)).toBe(true);
      expect(shouldResume(0.5)).toBe(true);
      expect(shouldResume(165 / 171)).toBe(true);
      expect(shouldResume(0.998)).toBe(true);
    });

    it('não retoma o início nem uma obra terminada', () => {
      expect(shouldResume(0)).toBe(false);
      expect(shouldResume(1)).toBe(false);
    });
  });
});
