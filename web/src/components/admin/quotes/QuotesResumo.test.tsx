import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuotesResumo } from './QuotesResumo';

const contadores = {
  porStatus: { rascunho: 5, ativa: 270, oculta: 3 },
  porAutor: [
    { autor: 'C. S. Lewis', total: 160 },
    { autor: 'Santo Agostinho', total: 30 },
  ],
  porAutorAtivas: [
    { autor: 'C. S. Lewis', total: 145 },
    { autor: 'Santo Agostinho', total: 30 },
  ],
  semVerificacao: 12,
};

describe('QuotesResumo', () => {
  it('concentração usa só as ativas: 145 de 270 é 54% mesmo com ocultas e rascunhos do autor', () => {
    render(<QuotesResumo contadores={contadores} />);
    expect(screen.getByText('278')).toBeInTheDocument();
    expect(screen.getByText('270')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('C. S. Lewis 145 (54%)')).toBeInTheDocument();
    expect(screen.getByText('Santo Agostinho 30 (11%)')).toBeInTheDocument();
  });

  it('mostra no máximo os 5 maiores autores', () => {
    const muitos = { ...contadores, porAutorAtivas: Array.from({ length: 8 }, (_, i) => ({ autor: `A${i}`, total: 10 - i })) };
    render(<QuotesResumo contadores={muitos} />);
    expect(screen.queryByText(/^A5 /)).toBeNull();
    expect(screen.getByText(/^A4 /)).toBeInTheDocument();
  });

  it('ativas zero não divide por zero', () => {
    render(
      <QuotesResumo
        contadores={{ porStatus: { rascunho: 1, ativa: 0, oculta: 0 }, porAutor: [{ autor: 'X', total: 1 }], porAutorAtivas: [{ autor: 'X', total: 1 }], semVerificacao: 0 }}
      />,
    );
    expect(screen.getByText('X 1 (0%)')).toBeInTheDocument();
  });
});
