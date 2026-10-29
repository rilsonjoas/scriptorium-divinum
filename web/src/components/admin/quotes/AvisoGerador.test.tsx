import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { GERADOR_COPIA_URL } from '@/lib/gerador';
import { AvisoGerador } from './AvisoGerador';

describe('AvisoGerador', () => {
  it('traz os quatro passos com os comandos exatos', () => {
    render(<AvisoGerador efeito="sair" id="abc" />);
    const aviso = screen.getByRole('note');
    expect(within(aviso).getByText('Depois, atualize a cópia do Gerador C. S. Lewis')).toBeInTheDocument();
    expect(within(aviso).getAllByRole('listitem')).toHaveLength(4);
    expect(within(aviso).getByText('cd gerador-cslewis && git pull')).toBeInTheDocument();
    expect(within(aviso).getByText('npm run quotes:sync')).toBeInTheDocument();
    expect(within(aviso).getByText('git diff src/data/lewis-quotes.snapshot.json')).toBeInTheDocument();
    expect(within(aviso).getByText(/o canário avisa em até 1 hora/i)).toBeInTheDocument();
  });

  it.each([
    ['sair', 'abc', /o id abc sai do arquivo/],
    ['mudar', 'abc', /o texto de abc muda/],
    ['entrar', undefined, /entra uma citação nova/],
    ['sair', undefined, /sai uma citação do arquivo/],
    ['mudar', undefined, /muda uma citação do arquivo/],
  ] as const)('efeito %s com id %s diz o diff esperado', (efeito, id, frase) => {
    render(<AvisoGerador efeito={efeito} id={id} />);
    expect(screen.getByText(frase)).toBeInTheDocument();
  });

  it('o link abre o arquivo da cópia em outra aba e diz isso', () => {
    render(<AvisoGerador efeito="entrar" />);
    const link = screen.getByRole('link', { name: /arquivo da cópia no GitHub.*outra aba/i });
    expect(link).toHaveAttribute('href', GERADOR_COPIA_URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });
});
