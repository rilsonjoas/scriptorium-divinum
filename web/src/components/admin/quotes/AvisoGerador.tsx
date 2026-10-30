import { Alert, AlertDescription } from '@/components/ui/alert';
import { GERADOR_COPIA_URL, type EfeitoNoGerador } from '@/lib/gerador';

interface Props {
  efeito: EfeitoNoGerador;
  id?: string;
  /** Campos que mudam na cópia (`camposDaCopia`); sem isto, a frase de sempre ("o texto muda"). */
  campos?: string[];
}

function listaEm(campos: string[]): string {
  return campos.length <= 1 ? (campos[0] ?? '') : `${campos.slice(0, -1).join(', ')} e ${campos[campos.length - 1]}`;
}

function fraseDoDiff(efeito: EfeitoNoGerador, id?: string, campos: string[] = []): string {
  if (efeito === 'entrar') return 'entra uma citação nova';
  if (efeito === 'sair') return id ? `o id ${id} sai do arquivo` : 'sai uma citação do arquivo';
  if (!id) return 'muda uma citação do arquivo';
  if (campos.length === 0 || (campos.length === 1 && campos[0] === 'texto')) return `o texto de ${id} muda`;
  if (campos.length === 1 && campos[0] === 'autor') return `muda autor de ${id} (entra no link de compra)`;
  return `mudam ${listaEm(campos)} de ${id}`;
}

// O canário (hetzner-infra/scripts/canario-api-cluster.py, de hora em hora): citação retirada ainda na cópia é ERRO
// (derruba o status até o PR ser mesclado); citação nova faltando e conteúdo diferente são AVISO, que só vai para o log
// do canário e para o resumo do Kuma, sem derrubar o status.
function fraseDoCanario(efeito: EfeitoNoGerador): string {
  if (efeito === 'sair') return 'Até o PR ser mesclado, o canário acusa erro de hora em hora (citação retirada ainda na cópia).';
  const motivo = efeito === 'entrar' ? 'cópia defasada' : 'conteúdo da cópia diferente da API';
  return `Se ninguém mesclar o PR, o canário registra um aviso a cada hora (${motivo}) no log e no resumo do Kuma, sem derrubar o status.`;
}

const codigo = 'rounded bg-library-parchment-surface px-1 py-0.5 font-mono text-xs';

/** Passos para a cópia embutida do Gerador C. S. Lewis voltar a ficar em dia depois de uma mudança que a afeta. */
export function AvisoGerador({ efeito, id, campos }: Props) {
  return (
    <Alert role="note" className="border-library-bronze/40 bg-library-parchment-surface font-body text-library-wood-foreground">
      <p className="font-display text-base font-medium leading-none tracking-tight">Depois, atualize a cópia do Gerador C. S. Lewis</p>
      <AlertDescription className="grid gap-2 text-sm">
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            {efeito === 'sair' ? 'Dispare o fluxo agora, que regera a cópia e abre o PR' : 'Dispare o fluxo que regera a cópia e abre o PR'}:{' '}
            <code className={codigo}>gh workflow run sync-quotes.yml --repo rilsonjoas/GeradorCSLewis</code>
            {efeito === 'sair' ? '.' : ' (ou espere o PR do dia, que sai por volta das 06:00 em Brasília; o GitHub às vezes atrasa).'}
          </li>
          <li>
            Abra o PR, confira o diff e mescle (o merge publica o Gerador). O esperado: {fraseDoDiff(efeito, id, campos)}.{' '}
            <a href={GERADOR_COPIA_URL} target="_blank" rel="noreferrer" className="underline">
              Ver o arquivo da cópia no GitHub (abre em outra aba)
            </a>
          </li>
        </ol>
        <details>
          <summary className="cursor-pointer">Se preferir fazer à mão</summary>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>
              <code className={codigo}>cd gerador-cslewis && git pull</code>
            </li>
            <li>
              <code className={codigo}>npm run quotes:sync</code>
            </li>
            <li>
              <code className={codigo}>git diff src/data/lewis-quotes.snapshot.json</code>, depois commit, PR e publicar.
            </li>
          </ol>
        </details>
        <p className="text-library-bronze-foreground">{fraseDoCanario(efeito)}</p>
      </AlertDescription>
    </Alert>
  );
}
