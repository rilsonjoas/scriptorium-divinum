import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EdicaoFicha } from './EdicaoFicha';

const base = {
  language: 'Português',
  translationIsAi: true,
  humanReviewApprovedAt: null,
  licenseType: 'cc-by-sa-4.0',
  attributionText: 'Tradução gerada por IA. Revisão humana: pendente.',
  originalTitle: 'De Catechizandis Rudibus',
  originalLanguages: ['Latim'],
  publicationYearOriginal: '399',
  translator: 'Scriptorium Divinum',
};

const renderiza = (props: Parameters<typeof EdicaoFicha>[0]) =>
  render(
    <MemoryRouter>
      <EdicaoFicha {...props} />
    </MemoryRouter>,
  );

describe('EdicaoFicha', () => {
  it('mostra os blocos técnicos a partir do banco, sem precisar do ensaio do arquivo', () => {
    renderiza({ book: base, contexto: null, linkObra: '/livros/x' });
    expect(screen.getByText('Obra original')).toBeInTheDocument();
    expect(screen.getByText(/De Catechizandis Rudibus · em Latim · 399/)).toBeInTheDocument();
    expect(screen.getByText(/tradução gerada por inteligência artificial/)).toBeInTheDocument();
    expect(screen.getByText('Revisão humana: pendente.')).toBeInTheDocument();
    expect(screen.getByText('CC BY-SA 4.0')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Avise-nos' })).toHaveAttribute('href', '/sobre#contribuir');
  });

  it('recolhe o ensaio de abertura quando é tradução por IA sem revisão', () => {
    const { container } = renderiza({ book: base, contexto: 'Obra-prima inigualável.', linkObra: '/livros/x' });
    const detalhes = container.querySelector('details');
    expect(detalhes).not.toBeNull();
    expect(detalhes).not.toHaveAttribute('open');
    expect(screen.getByText(/sem revisão\)$/)).toBeInTheDocument();
  });

  it('mostra o ensaio aberto quando a revisão humana foi aprovada', () => {
    const { container } = renderiza({
      book: { ...base, humanReviewApprovedAt: '2026-09-29T12:00:00Z' },
      contexto: 'Contexto revisado.',
      linkObra: '/livros/x',
    });
    expect(container.querySelector('details')).toBeNull();
    expect(screen.getByText('Contexto revisado.')).toBeInTheDocument();
    expect(screen.getByText(/Revisão humana aprovada em/)).toBeInTheDocument();
  });

  it('obra que não é tradução por IA mostra o tradutor e não fala em revisão', () => {
    renderiza({
      book: { ...base, translationIsAi: false, translator: 'Texto original (sem tradução)', licenseType: 'public-domain', attributionText: null },
      contexto: null,
      linkObra: '/livros/x',
    });
    expect(screen.getByText(/Texto original \(sem tradução\)/)).toBeInTheDocument();
    expect(screen.queryByText('Revisão')).toBeNull();
    expect(screen.getByText('Domínio público')).toBeInTheDocument();
  });

  it('licença desconhecida aparece como veio, e sem licença o bloco some', () => {
    renderiza({ book: { ...base, licenseType: 'outra-licenca', attributionText: null }, contexto: null, linkObra: '/livros/x' });
    expect(screen.getByText('outra-licenca')).toBeInTheDocument();
    renderiza({ book: { ...base, licenseType: undefined, attributionText: null }, contexto: null, linkObra: '/livros/x' });
    expect(screen.getAllByText('Licença')).toHaveLength(1);
  });
});
