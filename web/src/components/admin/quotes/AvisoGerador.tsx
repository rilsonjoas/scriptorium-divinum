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

const codigo = 'rounded bg-library-parchment-surface px-1 py-0.5 font-mono text-xs';

/** Passos para regerar a cópia embutida do Gerador C. S. Lewis depois de uma mudança que a afeta. */
export function AvisoGerador({ efeito, id }: Props) {
  return (
    <Alert role="note" className="border-library-bronze/40 bg-library-parchment-surface font-body text-library-wood-foreground">
      <AlertTitle className="font-display text-base">Depois, atualize a cópia do Gerador C. S. Lewis</AlertTitle>
      <AlertDescription className="grid gap-2 text-sm">
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            <code className={codigo}>cd gerador-cslewis && git pull</code>
          </li>
          <li>
            <code className={codigo}>npm run quotes:sync</code>
          </li>
          <li>
            Conferir <code className={codigo}>git diff src/data/lewis-quotes.snapshot.json</code>. O esperado: {fraseDoDiff(efeito, id)}.{' '}
            <a href={GERADOR_COPIA_URL} target="_blank" rel="noreferrer" className="underline">
              Ver o arquivo da cópia no GitHub (abre em outra aba)
            </a>
          </li>
          <li>Fazer o commit, abrir o PR e publicar.</li>
        </ol>
        <p className="text-library-bronze-foreground">Se você esquecer, o canário avisa em até 1 hora.</p>
      </AlertDescription>
    </Alert>
  );
}
