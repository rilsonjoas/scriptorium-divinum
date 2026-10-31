import { describe, it, expect } from 'vitest';
import { marcarEdicao } from './marcasDeEdicao';

type No = { type: string; value?: string; children?: No[]; data?: { hProperties?: { className?: string[] } } };
const texto = (value: string): No => ({ type: 'text', value });
const para = (...filhos: No[]): No => ({ type: 'root', children: [{ type: 'paragraph', children: filhos }] });
const filhosDoParagrafo = (arvore: No) => arvore.children![0]!.children!;

describe('marcarEdicao', () => {
  it('destaca marca de coluna [960A] e de página |18 sem tirar nada do texto', () => {
    const arvore = para(texto('contar a história [960C] de sua nobre |19 carreira'));
    marcarEdicao(arvore);
    const filhos = filhosDoParagrafo(arvore);
    const marcas = filhos.filter((n) => n.type === 'emphasis');
    expect(marcas.map((n) => n.children![0]!.value)).toEqual(['[960C]', '|19']);
    expect(marcas[0]!.data!.hProperties!.className).toContain('marca-edicao');
    // o texto, lido em ordem, continua idêntico
    const junto = filhos.map((n) => (n.type === 'text' ? n.value : n.children![0]!.value)).join('');
    expect(junto).toBe('contar a história [960C] de sua nobre |19 carreira');
  });

  it('não mexe em chamada de nota [1], em versículo [12] nem em colchete comum', () => {
    const arvore = para(texto('como disse,[1] e [12] ou [AO MONGE] e a | b'));
    marcarEdicao(arvore);
    expect(filhosDoParagrafo(arvore)).toHaveLength(1);
  });

  it('não mexe em código', () => {
    const arvore: No = { type: 'root', children: [{ type: 'inlineCode', value: '[960A]' }] };
    marcarEdicao(arvore);
    expect(arvore.children![0]!.type).toBe('inlineCode');
  });
});
