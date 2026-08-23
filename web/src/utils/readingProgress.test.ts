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

  describe('shouldResume', () => {
    it('retoma posições intermediárias', () => {
      expect(shouldResume(0.03)).toBe(true);
      expect(shouldResume(0.5)).toBe(true);
      expect(shouldResume(0.94)).toBe(true);
    });

    it('não retoma início nem fim', () => {
      expect(shouldResume(0)).toBe(false);
      expect(shouldResume(0.02)).toBe(false);
      expect(shouldResume(0.95)).toBe(false);
      expect(shouldResume(1)).toBe(false);
    });
  });
});
