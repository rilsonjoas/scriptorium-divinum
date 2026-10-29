import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GERADOR_COPIA_URL, type EfeitoNoGerador } from '@/lib/gerador';

interface Props {
  efeito: EfeitoNoGerador;
  id?: string;
}

function fraseDoDiff(efeito: EfeitoNoGerador, id?: string): string {
  if (efeito === 'entrar') return 'entra uma citação nova';
  if (efeito === 'sair') return id ? `o id ${id} sai do arquivo` : 'sai uma citação do arquivo';
  return id ? `o texto de ${id} muda` : 'muda uma citação do arquivo';
}

// O canário (hetzner-infra/scripts/canario-api-cluster.py, de hora em hora) compara a cópia com a API: citação retirada
// ainda na cópia é erro; citação nova faltando e conteúdo diferente (texto, obra, tema, link de compra) são aviso.
function fraseDoCanario(efeito: EfeitoNoGerador): string {
  if (efeito === 'sair') return 'Se ninguém mesclar o PR, o canário acusa erro em até 1 hora (citação retirada ainda na cópia).';
  if (efeito === 'entrar') return 'Se ninguém mesclar o PR, o canário só avisa, em até 1 hora, que a cópia está defasada.';
  return 'Se ninguém mesclar o PR, o canário avisa, em até 1 hora, que o conteúdo da cópia difere da API (aviso, não erro).';
}

const codigo = 'rounded bg-library-parchment-surface px-1 py-0.5 font-mono text-xs';

/** Passos para a cópia embutida do Gerador C. S. Lewis voltar a ficar em dia depois de uma mudança que a afeta. */
export function AvisoGerador({ efeito, id }: Props) {
  return (
    <Alert role="note" className="border-library-bronze/40 bg-library-parchment-surface font-body text-library-wood-foreground">
      <AlertTitle className="font-display text-base">Depois, atualize a cópia do Gerador C. S. Lewis</AlertTitle>
      <AlertDescription className="grid gap-2 text-sm">
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Dispare o fluxo que regera a cópia e abre o PR:{' '}
            <code className={codigo}>gh workflow run sync-quotes.yml --repo rilsonjoas/GeradorCSLewis</code> (ou espere o PR do dia, que sai às 06:00 em Brasília).
          </li>
          <li>
            Abra o PR, confira o diff e mescle (o merge publica o Gerador). O esperado: {fraseDoDiff(efeito, id)}.{' '}
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
