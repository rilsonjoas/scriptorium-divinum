import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DownloadBar } from './DownloadBar';

const texto = '# Capítulo I\n\nConteúdo da obra para exportar.';

describe('DownloadBar — downloads de primeira classe', () => {
  it('esconde tudo quando não há nem link hospedado nem texto', () => {
    const { container } = render(<DownloadBar title="Obra" author="Autor" />);
    expect(container.querySelector('section')).toBeNull();
  });

  it('lista PDF quando o banco tem o link hospedado', () => {
    render(
      <DownloadBar
        title="Obra"
        author="Autor"
        content={texto}
        downloadLinks={[{ format: 'pdf', url: '/downloads/obra.pdf', source: 'Internet Archive' }]}
      />,
    );
    expect(screen.getByRole('link', { name: /PDF/ })).toBeDefined();
  });

  it('oferece ePub, TXT e Markdown quando há texto no cliente', () => {
    render(<DownloadBar title="Obra" author="Autor" slug="obra" content={texto} />);
    expect(screen.getByRole('button', { name: /ePub/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /TXT/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Markdown/i })).toBeDefined();
  });

  it('não oferece ePub/TXT/Markdown quando a obra não tem texto', () => {
    render(
      <DownloadBar
        title="Obra"
        author="Autor"
        content={null}
        downloadLinks={[{ format: 'pdf', url: '/downloads/obra.pdf' }]}
      />,
    );
    expect(screen.queryByRole('button', { name: /ePub/i })).toBeNull();
    expect(screen.getByRole('link', { name: /PDF/ })).toBeDefined();
  });

  it('não duplica epub/txt hospedados (geramos no cliente)', () => {
    render(
      <DownloadBar
        title="Obra"
        author="Autor"
        content={texto}
        downloadLinks={[
          { format: 'epub', url: '/downloads/obra.epub' },
          { format: 'txt', url: '/downloads/obra.txt' },
          { format: 'pdf', url: '/downloads/obra.pdf' },
        ]}
      />,
    );
    // só um PDF hospedado + os 3 gerados no cliente
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('button', { name: /ePub/i })).toBeDefined();
  });

  it('gera o arquivo de verdade ao clicar (TXT)', () => {
    const criar = vi.fn(() => 'blob:mock');
    globalThis.URL.createObjectURL = criar as unknown as typeof URL.createObjectURL;
    globalThis.URL.revokeObjectURL = vi.fn();

    render(<DownloadBar title="Obra" author="Autor" slug="obra" content={texto} />);
    screen.getByRole('button', { name: /TXT/i }).click();

    // o download realmente acontece: um blob é criado
    expect(criar).toHaveBeenCalled();
  });
});
