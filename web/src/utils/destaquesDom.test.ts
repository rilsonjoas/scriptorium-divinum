import { describe, it, expect } from 'vitest';
import { acharTrecho } from './destaquesDom';

function raiz(html: string): HTMLElement {
  const el = document.createElement('div');
  el.innerHTML = html;
  document.body.appendChild(el);
  return el;
}

describe('acharTrecho', () => {
  it('acha um trecho dentro de um parágrafo', () => {
    const r = raiz('<p>Já que cremos firmemente que Deus é a Verdade.</p>');
    const range = acharTrecho(r, 'cremos firmemente');
    expect(range?.toString()).toBe('cremos firmemente');
  });

  it('acha trecho que atravessa elementos e quebras de linha (seleção do navegador)', () => {
    const r = raiz('<p><strong>Mestre:</strong> Busquemos primeiro\n o que é a verdade.</p><p>Outro parágrafo.</p>');
    const range = acharTrecho(r, 'Mestre: Busquemos primeiro o que é a verdade.');
    expect(range).not.toBeNull();
    expect(range!.toString().replace(/\s+/g, ' ')).toBe('Mestre: Busquemos primeiro o que é a verdade.');
  });

  it('ignora diferença de espaços e quebras entre o salvo e o texto', () => {
    const r = raiz('<p>primeira linha</p><p>segunda linha</p>');
    expect(acharTrecho(r, 'primeira linha\n\nsegunda linha')).not.toBeNull();
  });

  it('devolve null quando o trecho não está na página', () => {
    const r = raiz('<p>Algo diferente.</p>');
    expect(acharTrecho(r, 'não existe aqui')).toBeNull();
  });

  it('devolve null para texto vazio', () => {
    expect(acharTrecho(raiz('<p>x</p>'), '   ')).toBeNull();
  });
});
