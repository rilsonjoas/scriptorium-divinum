import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { GERADOR_COPIA_URL } from '@/lib/gerador';
import { AvisoGerador } from './AvisoGerador';

describe('AvisoGerador', () => {
  it('o caminho principal são dois passos: disparar o fluxo e conferir o PR', () => {
    render(<AvisoGerador efeito="sair" id="abc" />);
    const aviso = screen.getByRole('note');
    expect(within(aviso).getByText('Depois, atualize a cópia do Gerador C. S. Lewis')).toBeInTheDocument();
    const passos = within(screen.getAllByRole('list')[0]!).getAllByRole('listitem');
    expect(passos).toHaveLength(2);
    expect(within(passos[0]!).getByText('gh workflow run sync-quotes.yml --repo rilsonjoas/GeradorCSLewis')).toBeInTheDocument();
    expect(passos[0]).toHaveTextContent(/espere o PR do dia/i);
    expect(passos[1]).toHaveTextContent(/confira o diff/i);
    expect(passos[1]).toHaveTextContent(/mescle/i);
  });

  it('o caminho manual continua à mão, recolhido, com os comandos exatos', () => {
    render(<AvisoGerador efeito="entrar" />);
    const manual = screen.getByText(/Se preferir fazer à mão/i).closest('details');
    expect(manual).not.toBeNull();
    expect(manual).not.toHaveAttribute('open');
    expect(within(manual!).getByText('cd gerador-cslewis && git pull')).toBeInTheDocument();
    expect(within(manual!).getByText('npm run quotes:sync')).toBeInTheDocument();
    expect(within(manual!).getByText('git diff src/data/lewis-quotes.snapshot.json')).toBeInTheDocument();
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

  it('o que o canário faz depende do efeito: sair é erro, entrar e mudar são aviso', () => {
    const { unmount } = render(<AvisoGerador efeito="sair" />);
    expect(screen.getByText(/o canário acusa erro em até 1 hora/i)).toBeInTheDocument();
    unmount();
    const entrar = render(<AvisoGerador efeito="entrar" />);
    expect(screen.getByText(/o canário só avisa, em até 1 hora, que a cópia está defasada/i)).toBeInTheDocument();
    entrar.unmount();
    render(<AvisoGerador efeito="mudar" />);
    expect(screen.getByText(/o canário avisa, em até 1 hora, que o conteúdo da cópia difere/i)).toBeInTheDocument();
    expect(screen.queryByText(/acusa erro|não percebe/i)).toBeNull();
  });

  it('o link abre o arquivo da cópia em outra aba e diz isso', () => {
    render(<AvisoGerador efeito="entrar" />);
    const link = screen.getByRole('link', { name: /arquivo da cópia no GitHub.*outra aba/i });
    expect(link).toHaveAttribute('href', GERADOR_COPIA_URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });
});
