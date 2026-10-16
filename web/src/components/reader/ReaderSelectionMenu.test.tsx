import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReaderSelectionMenu } from './ReaderSelectionMenu';

describe('ReaderSelectionMenu', () => {
  const defaultAnchor = { top: 100, bottom: 120, left: 50 };

  it('renderiza o botão Copiar e Grifar para qualquer seleção', () => {
    render(
      <ReaderSelectionMenu
        text="Graça e paz"
        normalizedWord={null}
        wordCount={3}
        anchor={defaultAnchor}
        onOpenGlossary={vi.fn()}
        onCreateCard={vi.fn()}
        onHighlight={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /copiar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /grifar/i })).toBeInTheDocument();
  });

  it('mostra botão Dicionário quando é uma palavra única com termo normalizado', () => {
    const onOpenGlossary = vi.fn();
    render(
      <ReaderSelectionMenu
        text="concupiscência"
        normalizedWord="concupiscência"
        wordCount={1}
        anchor={defaultAnchor}
        onOpenGlossary={onOpenGlossary}
        onCreateCard={vi.fn()}
        onHighlight={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const dictBtn = screen.getByRole('button', { name: /dicionário/i });
    expect(dictBtn).toBeInTheDocument();
    fireEvent.click(dictBtn);
    expect(onOpenGlossary).toHaveBeenCalledWith('concupiscência', defaultAnchor);
  });

  it('mostra botão Criar Card quando tem 2 ou mais palavras', () => {
    const onCreateCard = vi.fn();
    render(
      <ReaderSelectionMenu
        text="O justo viverá da fé"
        normalizedWord={null}
        wordCount={5}
        anchor={defaultAnchor}
        onOpenGlossary={vi.fn()}
        onCreateCard={onCreateCard}
        onHighlight={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const cardBtn = screen.getByRole('button', { name: /criar card/i });
    expect(cardBtn).toBeInTheDocument();
    fireEvent.click(cardBtn);
    expect(onCreateCard).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: /dicionário/i })).not.toBeInTheDocument();
  });

  it('aciona onHighlight ao clicar em Grifar', () => {
    const onHighlight = vi.fn();
    render(
      <ReaderSelectionMenu
        text="Trecho sagrado"
        normalizedWord={null}
        wordCount={2}
        anchor={defaultAnchor}
        onOpenGlossary={vi.fn()}
        onCreateCard={vi.fn()}
        onHighlight={onHighlight}
        onClose={vi.fn()}
      />
    );

    const highlightBtn = screen.getByRole('button', { name: /grifar/i });
    fireEvent.click(highlightBtn);
    expect(onHighlight).toHaveBeenCalledTimes(1);
  });
});
