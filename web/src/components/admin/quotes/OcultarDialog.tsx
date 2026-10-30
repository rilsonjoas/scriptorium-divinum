import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ApiError } from '@/lib/api-client';
import { ehLewis } from '@/lib/gerador';
import { AvisoGerador } from './AvisoGerador';
import { adminQuotes, type AdminQuote, type AdminQuoteItem } from '@/services/adminQuotes';

interface Props {
  quote: AdminQuoteItem | null;
  onOpenChange: (open: boolean) => void;
  onDone: (quote: AdminQuote) => void;
  /** 409: a citação mudou desde que a lista foi carregada (ex.: já está oculta). O painel avisa, recarrega e o diálogo fecha. */
  onConflito?: (mensagem: string) => void;
}

const MOTIVO_MIN = 3;
const MOTIVO_MAX = 1000;

const dataBr = (iso: string) => iso.split('-').reverse().join('/');

export function OcultarDialog({ quote, onOpenChange, onDone, onConflito }: Props) {
  return (
    <Dialog open={quote !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-library-parchment-surface border-library-bronze">
        {quote && <Conteudo key={quote.id} quote={quote} onOpenChange={onOpenChange} onDone={onDone} onConflito={onConflito} />}
      </DialogContent>
    </Dialog>
  );
}

function Conteudo({ quote, onOpenChange, onDone, onConflito }: Omit<Props, 'quote'> & { quote: AdminQuoteItem }) {
  const [motivo, setMotivo] = useState('');
  const [pendente, setPendente] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const enviando = useRef(false);

  const tamanho = motivo.trim().length;
  const valido = tamanho >= MOTIVO_MIN && tamanho <= MOTIVO_MAX;
  const dias = quote.diasFixados;
  const destaca = ehLewis(quote.author);

  const ocultar = async () => {
    if (enviando.current || !valido) return;
    enviando.current = true;
    setPendente(true);
    setErro(null);
    try {
      const { quote: ocultada } = await adminQuotes.ocultar(quote.id, motivo.trim());
      onDone(ocultada);
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 409 && onConflito) {
        onConflito(err.message);
        onOpenChange(false);
        return;
      }
      setErro(err instanceof Error ? err.message : 'Não foi possível ocultar.');
    } finally {
      enviando.current = false;
      setPendente(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display text-library-wood-foreground">Ocultar citação</DialogTitle>
        <DialogDescription className="font-body text-library-bronze-foreground">
          {`${quote.author}: ${quote.text.length > 120 ? `${quote.text.slice(0, 120)}…` : quote.text}`}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-3 font-body text-sm text-library-wood-foreground">
        <p>
          {dias.length > 0
            ? `Está fixada em ${dias.length} ${dias.length === 1 ? 'dia' : 'dias'}: ${dias.map(dataBr).join(', ')}. Esses dias passam a mostrar outra citação.`
            : 'Não está fixada em nenhum dia.'}
        </p>
        <p>O Narniano pode continuar mostrando por até 6 horas e o Gerador C. S. Lewis por até 10 minutos.</p>
        {destaca && <AvisoGerador efeito="sair" id={quote.id} />}

        <div className="grid gap-1.5">
          <Label htmlFor="motivo-ocultar">Motivo *</Label>
          <Textarea
            id="motivo-ocultar"
            rows={3}
            maxLength={MOTIVO_MAX}
            aria-describedby="motivo-ocultar-dica"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
          <p id="motivo-ocultar-dica" className="text-xs text-library-bronze-foreground">
            {`De ${MOTIVO_MIN} a ${MOTIVO_MAX} caracteres. Fica registrado no histórico. ${tamanho} / ${MOTIVO_MAX}`}
          </p>
        </div>

        {erro && (
          <Alert role="alert" variant="destructive">
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="button" disabled={!valido || pendente} onClick={() => void ocultar()}>
          Ocultar citação
        </Button>
      </DialogFooter>
    </>
  );
}
