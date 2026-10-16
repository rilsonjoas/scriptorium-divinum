import { describe, it, expect, afterEach, vi } from 'vitest';
import i18n from './index';

describe('i18n', () => {
  afterEach(async () => {
    await i18n.changeLanguage('pt-BR');
  });

  it('atualiza o <html lang> quando o idioma muda', async () => {
    await i18n.changeLanguage('en');
    expect(document.documentElement.lang).toBe('en');
    await i18n.changeLanguage('es');
    expect(document.documentElement.lang).toBe('es');
  });

  it('tem tradução de "Favoritos" nas três línguas', () => {
    expect(i18n.getFixedT('pt-BR')('nav.favoritos')).toBe('Favoritos');
    expect(i18n.getFixedT('en')('nav.favoritos')).toBe('Favorites');
    expect(i18n.getFixedT('es')('nav.favoritos')).toBe('Favoritos');
  });

  it('oferece só português por enquanto, sem perder os textos de EN e ES', async () => {
    const { idiomasDisponiveis, IDIOMAS_ATIVOS, idiomas } = await import('./index');
    expect(IDIOMAS_ATIVOS).toEqual(['pt-BR']);
    expect(idiomasDisponiveis.map((i) => i.codigo)).toEqual(['pt-BR']);
    // a base para internacionalizar continua montada
    expect(idiomas.map((i) => i.codigo)).toEqual(['pt-BR', 'en', 'es']);
  });

  it('ignora uma preferência antiga de idioma que já não é oferecido', async () => {
    vi.resetModules();
    localStorage.setItem('scriptorium:lang', 'en');
    const novo = await import('./index');
    expect(novo.default.language).toBe('pt-BR');
    localStorage.removeItem('scriptorium:lang');
  });
});
