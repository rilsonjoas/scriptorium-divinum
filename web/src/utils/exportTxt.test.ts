import { describe, it, expect } from 'vitest';
import { generateCleanTxt } from './exportTxt';

describe('generateCleanTxt', () => {
  const base = {
    title: 'Confissões',
    author: 'Santo Agostinho',
    content: '# Livro I\n\n**Texto forte.**\n\n> Citação importante\n\n- item um\n- item dois',
  };

  it('gera cabeçalho com título, autor e fonte', () => {
    const out = generateCleanTxt({ ...base, slug: 'confissoes' });
    expect(out).toContain('CONFISSÕES');
    expect(out).toContain('Por Santo Agostinho');
    expect(out).toContain('https://scriptoriumdivinum.com/ler/confissoes');
  });

  it('remover markdown do corpo (negrito, citação, lista)', () => {
    const out = generateCleanTxt(base);
    expect(out).not.toContain('**');
    expect(out).not.toContain('> ');
    expect(out).not.toContain('# ');
    expect(out).toContain('Texto forte.');
    expect(out).toContain('Citação importante');
    expect(out).toContain('- item um');
  });

  it('adiciona proveniência quando informada', () => {
    const out = generateCleanTxt({
      ...base,
      provenance: '**Domínio público**: autor falecido há +70 anos',
    });
    expect(out).toContain('Proveniência Editorial:');
    expect(out).not.toContain('**Domínio público**');
    expect(out).toContain('Domínio público: autor falecido há +70 anos');
  });
});