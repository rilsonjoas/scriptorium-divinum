import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { GERADOR_COPIA_URL } from '@/lib/gerador';
import { AvisoGerador } from './AvisoGerador';

describe('AvisoGerador', () => {
  it('o caminho principal são dois passos: disparar o fluxo e conferir o PR', () => {
    render(<AvisoGerador efeito="mudar" id="abc" />);
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

  it('sair não oferece esperar o PR do dia: o canário acusa erro de hora em hora até o merge', () => {
    render(<AvisoGerador efeito="sair" />);
    const passos = within(screen.getAllByRole('list')[0]!).getAllByRole('listitem');
    expect(passos[0]).toHaveTextContent(/agora/i);
    expect(passos[0]).not.toHaveTextContent(/espere o PR do dia/i);
    expect(screen.getByText(/até o PR ser mesclado, o canário acusa erro de hora em hora/i)).toBeInTheDocument();
  });

  it.each([
    ['entrar', /cópia defasada/],
    ['mudar', /conteúdo da cópia diferente da API/],
  ] as const)('%s oferece esperar o PR do dia e diz o que o canário faz: registra aviso, sem derrubar o status', (efeito, motivo) => {
    render(<AvisoGerador efeito={efeito} />);
    const passos = within(screen.getAllByRole('list')[0]!).getAllByRole('listitem');
    expect(passos[0]).toHaveTextContent(/espere o PR do dia/i);
    expect(passos[0]).toHaveTextContent(/às vezes atrasa/i);
    const frase = screen.getByText(/o canário registra um aviso a cada hora/i);
    expect(frase).toHaveTextContent(motivo);
    expect(frase).toHaveTextContent(/log e no resumo do Kuma, sem derrubar o status/i);
    expect(screen.queryByText(/acusa erro|não percebe/i)).toBeNull();
  });

  it('o link abre o arquivo da cópia em outra aba e diz isso', () => {
    render(<AvisoGerador efeito="entrar" />);
    const link = screen.getByRole('link', { name: /arquivo da cópia no GitHub.*outra aba/i });
    expect(link).toHaveAttribute('href', GERADOR_COPIA_URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });

  it('o título não é um cabeçalho solto (h5 dentro do diálogo quebraria a hierarquia)', () => {
    render(<AvisoGerador efeito="mudar" id="abc" />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('só o texto mudou: "o texto de abc muda" (frase de sempre)', () => {
    render(<AvisoGerador efeito="mudar" id="abc" campos={['texto']} />);
    expect(screen.getByRole('note')).toHaveTextContent('o texto de abc muda');
  });

  it('outros campos: nomeia cada um em vez de dizer que o texto muda', () => {
    render(<AvisoGerador efeito="mudar" id="abc" campos={['obra', 'tema']} />);
    const nota = screen.getByRole('note');
    expect(nota).toHaveTextContent('mudam obra e tema de abc');
    expect(nota).not.toHaveTextContent('o texto de abc muda');
  });

  it('três campos: vírgulas e "e" no fim', () => {
    render(<AvisoGerador efeito="mudar" id="abc" campos={['texto', 'obra', 'domínio público']} />);
    expect(screen.getByRole('note')).toHaveTextContent('mudam texto, obra e domínio público de abc');
  });

  it('autor corrigido: avisa que muda o link de compra', () => {
    render(<AvisoGerador efeito="mudar" id="abc" campos={['autor']} />);
    expect(screen.getByRole('note')).toHaveTextContent('muda autor de abc (entra no link de compra)');
  });

  it('sem campos informados, mantém a frase de antes', () => {
    render(<AvisoGerador efeito="mudar" id="abc" />);
    expect(screen.getByRole('note')).toHaveTextContent('o texto de abc muda');
  });
});
