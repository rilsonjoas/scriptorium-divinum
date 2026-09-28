import { describe, it, expect, afterEach } from 'vitest';
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
});
