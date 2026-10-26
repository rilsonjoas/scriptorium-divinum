import { useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ApiError, atualDe, issuesDe } from '@/lib/api-client';
import { TEXTO_MAX, validarCitacao } from '@/lib/validarCitacao';
import { adminQuotes, type AdminQuote, type QuoteFormValues } from '@/services/adminQuotes';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Sem `quote` cria; com `quote` edita. */
  quote?: AdminQuote;
  autoresExistentes: string[];
  onSaved: (r: { quote: AdminQuote; avisos: string[] }) => void;
}

const VAZIO: QuoteFormValues = {
  author: '',
  text: '',
  source: '',
  dominioPublico: false,
  scriptoriumUrl: '',
  theme: '',
  fonteUrl: '',
  verificadoEm: '',
  status: 'rascunho',
};

function deQuote(q?: AdminQuote): QuoteFormValues {
  if (!q) return VAZIO;
  return {
    author: q.author,
    text: q.text,
    source: q.source ?? '',
    dominioPublico: q.dominioPublico,
    scriptoriumUrl: q.scriptoriumUrl ?? '',
    theme: q.theme ?? '',
    fonteUrl: q.fonteUrl ?? '',
    verificadoEm: q.verificadoEm ?? '',
    // Ativa fica ativa; oculta é editada sem exigir fonte (a regra é da reativação).
    status: q.status === 'ativa' ? 'ativa' : 'rascunho',
  };
}

const CAMPOS_TEXTO = ['author', 'text', 'source', 'scriptoriumUrl', 'theme', 'fonteUrl', 'verificadoEm'] as const;

/** Só o que mudou em relação à citação aberta. */
function diferencas(base: AdminQuote, v: QuoteFormValues): Partial<QuoteFormValues> {
  const antes = deQuote(base);
  const d: Partial<QuoteFormValues> = {};
  for (const k of CAMPOS_TEXTO) if (v[k].trim() !== antes[k].trim()) d[k] = v[k];
  if (v.dominioPublico !== antes.dominioPublico) d.dominioPublico = v.dominioPublico;
  if (base.status === 'rascunho' && v.status !== antes.status) d.status = v.status;
  return d;
}

export function QuoteFormDialog(props: Props) {
  const { open, onOpenChange, quote } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-library-parchment-surface border-library-bronze">
        <DialogHeader>
          <DialogTitle className="font-display text-library-wood-foreground">
            {quote ? 'Editar citação' : 'Nova citação'}
          </DialogTitle>
          <DialogDescription className="font-body text-library-bronze-foreground">
            {quote
              ? 'Altere só o que precisa. O que não mudar não é enviado.'
              : 'Uma citação ativa precisa de obra, endereço de conferência e data. Sem isso, salve como rascunho.'}
          </DialogDescription>
        </DialogHeader>
        <Formulario {...props} />
      </DialogContent>
    </Dialog>
  );
}

function Formulario({ onOpenChange, quote, autoresExistentes, onSaved }: Props) {
  const uid = useId();
  const [base, setBase] = useState<AdminQuote | undefined>(quote);
  const [v, setV] = useState<QuoteFormValues>(() => deQuote(quote));
  const [tocados, setTocados] = useState<Set<string>>(new Set());
  const [doServidor, setDoServidor] = useState<Record<string, string[]>>({});
  const [conflito, setConflito] = useState<AdminQuote | null>(null);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);
  const enviando = useRef(false);

  const novo = !base || base.status === 'rascunho';
  const erros = useMemo(() => validarCitacao(v, { autoresExistentes, novo }), [v, autoresExistentes, novo]);
  const mudancas = base ? diferencas(base, v) : null;
  const semMudancas = mudancas !== null && Object.keys(mudancas).length === 0;

  const mudar = <K extends keyof QuoteFormValues>(campo: K, valor: QuoteFormValues[K]) => {
    setV((atual) => ({ ...atual, [campo]: valor }));
    setTocados((t) => new Set(t).add(campo));
    setDoServidor((s) => {
      if (!(campo in s)) return s;
      const { [campo]: _, ...resto } = s;
      return resto;
    });
  };

  const mensagemDe = (campo: string): string | undefined =>
    doServidor[campo]?.join(' ') ?? (tocados.has(campo) ? erros[campo] : undefined);

  const salvar = async () => {
    if (enviando.current) return;
    enviando.current = true;
    setPendente(true);
    setErroGeral(null);
    try {
      const resultado = base ? await adminQuotes.update(base.id, mudancas!, base.updatedAt) : await adminQuotes.create(v);
      onSaved(resultado);
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 409) {
        setConflito(atualDe<AdminQuote>(err) ?? null);
        setErroGeral(null);
      } else if (err instanceof ApiError && err.statusCode === 400) {
        const issues = issuesDe(err);
        const campos = Object.keys(issues).filter((k) => k in VAZIO);
        setDoServidor(Object.fromEntries(campos.map((k) => [k, issues[k]!])));
        if (campos.length < Object.keys(issues).length || campos.length === 0) {
          setErroGeral(err.message);
        }
      } else {
        setErroGeral(err instanceof Error ? err.message : 'Não foi possível salvar.');
      }
    } finally {
      enviando.current = false;
      setPendente(false);
    }
  };

  const carregarAtual = () => {
    if (!conflito) return;
    setBase(conflito);
    setV(deQuote(conflito));
    setTocados(new Set());
    setDoServidor({});
    setConflito(null);
  };

  const desabilitado = pendente || Object.keys(erros).length > 0 || semMudancas;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!desabilitado) void salvar();
      }}
      className="grid gap-4"
    >
      {conflito !== null && (
        <Alert role="alert" variant="destructive">
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>Esta citação mudou desde que você a abriu. O que você digitou continua aqui.</span>
            <Button type="button" variant="outline" size="sm" onClick={carregarAtual}>
              Carregar a versão atual
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {erroGeral && (
        <Alert role="alert" variant="destructive">
          <AlertDescription>{erroGeral}</AlertDescription>
        </Alert>
      )}

      <Campo id={`${uid}-author`} rotulo="Autor *" erro={mensagemDe('author')}>
        {(ligar) => (
          <>
            <Input {...ligar} list={`${uid}-autores`} value={v.author} onChange={(e) => mudar('author', e.target.value)} />
            <datalist id={`${uid}-autores`}>
              {autoresExistentes.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          </>
        )}
      </Campo>

      <Campo
        id={`${uid}-text`}
        rotulo="Texto *"
        erro={mensagemDe('text')}
        dica={`${v.text.length} / ${TEXTO_MAX}`}
      >
        {(ligar) => <Textarea {...ligar} rows={5} value={v.text} onChange={(e) => mudar('text', e.target.value)} />}
      </Campo>

      <Campo id={`${uid}-source`} rotulo={v.status === 'ativa' ? 'Obra ou fonte *' : 'Obra ou fonte'} erro={mensagemDe('source')}>
        {(ligar) => <Input {...ligar} value={v.source} onChange={(e) => mudar('source', e.target.value)} />}
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id={`${uid}-fonteUrl`} rotulo={v.status === 'ativa' && novo ? 'Endereço da conferência *' : 'Endereço da conferência'} erro={mensagemDe('fonteUrl')}>
          {(ligar) => (
            <Input {...ligar} inputMode="url" placeholder="https://" value={v.fonteUrl} onChange={(e) => mudar('fonteUrl', e.target.value)} />
          )}
        </Campo>
        <Campo id={`${uid}-verificadoEm`} rotulo={v.status === 'ativa' && novo ? 'Conferida em *' : 'Conferida em'} erro={mensagemDe('verificadoEm')}>
          {(ligar) => (
            <Input {...ligar} placeholder="AAAA-MM-DD" value={v.verificadoEm} onChange={(e) => mudar('verificadoEm', e.target.value)} />
          )}
        </Campo>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id={`${uid}-scriptoriumUrl`} rotulo="Endereço da obra no Scriptorium" erro={mensagemDe('scriptoriumUrl')}>
          {(ligar) => (
            <Input {...ligar} inputMode="url" value={v.scriptoriumUrl} onChange={(e) => mudar('scriptoriumUrl', e.target.value)} />
          )}
        </Campo>
        <Campo id={`${uid}-theme`} rotulo="Tema" erro={mensagemDe('theme')}>
          {(ligar) => <Input {...ligar} value={v.theme} onChange={(e) => mudar('theme', e.target.value)} />}
        </Campo>
      </div>

      <div className="flex items-center gap-2">
        <input
          id={`${uid}-dominio`}
          type="checkbox"
          className="h-4 w-4"
          checked={v.dominioPublico}
          onChange={(e) => mudar('dominioPublico', e.target.checked)}
        />
        <Label htmlFor={`${uid}-dominio`} className="font-body text-library-wood-foreground">
          Obra em domínio público
        </Label>
      </div>

      {novo && (
        <Campo id={`${uid}-status`} rotulo="Situação" erro={mensagemDe('status')}>
          {(ligar) => (
            <select
              {...ligar}
              className="h-10 rounded-md border border-library-bronze bg-background px-3 font-body text-sm"
              value={v.status}
              onChange={(e) => mudar('status', e.target.value as QuoteFormValues['status'])}
            >
              <option value="rascunho">Rascunho (não aparece no site)</option>
              <option value="ativa">Ativa (aparece no site)</option>
            </select>
          )}
        </Campo>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="submit" disabled={desabilitado}>
          Salvar
        </Button>
      </DialogFooter>
    </form>
  );
}

interface CampoProps {
  id: string;
  rotulo: string;
  erro?: string;
  dica?: string;
  children: (ligar: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true }) => ReactNode;
}

/** Rótulo, controle e mensagem de erro ligados por `aria-describedby`. */
function Campo({ id, rotulo, erro, dica, children }: CampoProps) {
  const ids = [dica ? `${id}-dica` : null, erro ? `${id}-erro` : null].filter(Boolean).join(' ');
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="font-body text-library-wood-foreground">
        {rotulo}
      </Label>
      {children({ id, 'aria-describedby': ids || undefined, 'aria-invalid': erro ? true : undefined })}
      {dica && (
        <p id={`${id}-dica`} className="text-xs font-body text-library-bronze-foreground">
          {dica}
        </p>
      )}
      {erro && (
        <p id={`${id}-erro`} className="text-sm font-body text-destructive">
          {erro}
        </p>
      )}
    </div>
  );
}
