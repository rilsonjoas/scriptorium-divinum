import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AdminQuoteItem, QuoteListResponse, QuoteStatus } from '@/services/adminQuotes';

export type Filtros = {
  status?: QuoteStatus;
  author?: string;
  q?: string;
  semVerificacao?: boolean;
  page: number;
};

interface Props {
  dados?: QuoteListResponse;
  carregando: boolean;
  erro?: Error;
  filtros: Filtros;
  autoresExistentes: string[];
  onFiltros: (f: Filtros) => void;
  onEditar: (q: AdminQuoteItem) => void;
  onOcultar: (q: AdminQuoteItem) => void;
  onReativar: (q: AdminQuoteItem) => void;
  onHistorico: (q: AdminQuoteItem) => void;
  onNova: () => void;
}

const ROTULO_STATUS: Record<QuoteStatus, string> = { ativa: 'Ativa', oculta: 'Oculta', rascunho: 'Rascunho' };
const TRECHO = 120;
const DEBOUNCE_MS = 300;

const trecho = (texto: string) => (texto.length > TRECHO ? `${texto.slice(0, TRECHO)}…` : texto);
const dias = (n: number) => `Fixada em ${n} ${n === 1 ? 'dia' : 'dias'}`;

const selectClasse = 'h-10 rounded-md border border-library-bronze bg-background px-3 font-body text-sm';

function semVazios(f: Filtros): Filtros {
  return Object.fromEntries(Object.entries(f).filter(([, v]) => v !== undefined && v !== '' && v !== false)) as Filtros;
}

export function QuotesLista({
  dados,
  carregando,
  erro,
  filtros,
  autoresExistentes,
  onFiltros,
  onEditar,
  onOcultar,
  onReativar,
  onHistorico,
  onNova,
}: Props) {
  const [busca, setBusca] = useState(filtros.q ?? '');
  const topo = useRef<HTMLElement>(null);
  const ultimo = useRef({ filtros, onFiltros });
  ultimo.current = { filtros, onFiltros };

  useEffect(() => {
    if (busca === (ultimo.current.filtros.q ?? '')) return;
    const t = setTimeout(() => {
      const { filtros: f, onFiltros: muda } = ultimo.current;
      muda(semVazios({ ...f, q: busca, page: 1 }));
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [busca]);

  const totalPaginas = dados ? Math.max(1, Math.ceil(dados.total / dados.porPagina)) : 1;
  useEffect(() => {
    if (dados && !carregando && filtros.page > totalPaginas) {
      ultimo.current.onFiltros(semVazios({ ...ultimo.current.filtros, page: totalPaginas }));
    }
  }, [dados, carregando, filtros.page, totalPaginas]);

  const mudar = (parcial: Partial<Filtros>) => onFiltros(semVazios({ ...filtros, ...parcial, page: 1 }));
  // Trocar de página mantém a rolagem no rodapé; leva o início da lista de volta à tela.
  const irParaPagina = (page: number) => {
    onFiltros(semVazios({ ...filtros, page }));
    topo.current?.scrollIntoView?.({ block: 'start' });
  };
  const temFiltro = Boolean(filtros.status || filtros.author || filtros.q || filtros.semVerificacao);

  return (
    <section ref={topo} aria-label="Citações" className="grid gap-4 scroll-mt-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="f-status" className="font-body text-library-wood-foreground">
            Situação
          </Label>
          <select
            id="f-status"
            className={selectClasse}
            value={filtros.status ?? ''}
            onChange={(e) => mudar({ status: (e.target.value || undefined) as QuoteStatus | undefined })}
          >
            <option value="">Todas</option>
            <option value="ativa">Ativas</option>
            <option value="oculta">Ocultas</option>
            <option value="rascunho">Rascunhos</option>
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="f-autor" className="font-body text-library-wood-foreground">
            Autor
          </Label>
          <select
            id="f-autor"
            className={selectClasse}
            value={filtros.author ?? ''}
            onChange={(e) => mudar({ author: e.target.value || undefined })}
          >
            <option value="">Todos</option>
            {autoresExistentes.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="f-busca" className="font-body text-library-wood-foreground">
            Buscar
          </Label>
          <Input id="f-busca" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Texto ou obra" />
        </div>
        <div className="flex items-center gap-2 pb-2">
          <input
            id="f-sem-verificacao"
            type="checkbox"
            className="h-4 w-4"
            checked={Boolean(filtros.semVerificacao)}
            onChange={(e) => mudar({ semVerificacao: e.target.checked })}
          />
          <Label htmlFor="f-sem-verificacao" className="font-body text-library-wood-foreground">
            Só sem verificação
          </Label>
        </div>
        <Button type="button" className="ml-auto" onClick={onNova}>
          Nova citação
        </Button>
      </div>

      {erro && !dados ? (
        <div role="alert" className="rounded-md border border-destructive p-4 font-body text-destructive">
          {erro.message}
        </div>
      ) : !dados ? (
        <div aria-busy="true" className="grid gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : dados.itens.length === 0 ? (
        dados.total > 0 ? null : (
          <div className="rounded-md border border-library-bronze/40 p-6 text-center font-body text-library-wood-foreground">
            <p>{temFiltro ? 'Nenhuma citação com estes filtros' : 'Nenhuma citação cadastrada'}</p>
            {temFiltro && (
              <Button type="button" variant="outline" className="mt-3" onClick={() => {
                  setBusca('');
                  onFiltros({ page: 1 });
                }}>
                Limpar filtros
              </Button>
            )}
          </div>
        )
      ) : (
        <div
          role="region"
          aria-label="Tabela de citações"
          tabIndex={0}
          aria-busy={carregando || undefined}
          className="overflow-x-auto rounded-md border border-library-bronze/40"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Autor</TableHead>
                <TableHead>Citação</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.itens.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-body text-library-wood-foreground">{q.author}</TableCell>
                  <TableCell className="max-w-md font-body text-library-wood-foreground">{trecho(q.text)}</TableCell>
                  <TableCell className="font-body text-library-wood-foreground">{q.source ?? ''}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">{ROTULO_STATUS[q.status]}</Badge>
                      {q.status === 'ativa' && q.verificadoEm === null && <Badge variant="outline">Sem verificação</Badge>}
                      {q.diasFixados.length > 0 && <Badge variant="outline">{dias(q.diasFixados.length)}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Button type="button" size="sm" variant="outline" aria-label={`Editar citação de ${q.author}`} onClick={() => onEditar(q)}>
                        Editar
                      </Button>
                      {q.status !== 'oculta' && (
                        <Button type="button" size="sm" variant="outline" aria-label={`Ocultar citação de ${q.author}`} onClick={() => onOcultar(q)}>
                          Ocultar
                        </Button>
                      )}
                      {q.status === 'oculta' && (
                        <Button type="button" size="sm" variant="outline" aria-label={`Reativar citação de ${q.author}`} onClick={() => onReativar(q)}>
                          Reativar
                        </Button>
                      )}
                      <Button type="button" size="sm" variant="outline" aria-label={`Histórico da citação de ${q.author}`} onClick={() => onHistorico(q)}>
                        Histórico
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {dados && dados.total > 0 && (
        <nav aria-label="Paginação" className="flex items-center justify-between font-body text-library-wood-foreground">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Página anterior"
            disabled={filtros.page <= 1}
            onClick={() => irParaPagina(filtros.page - 1)}
          >
            Anterior
          </Button>
          <span>{`Página ${Math.min(filtros.page, totalPaginas)} de ${totalPaginas}`}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Próxima página"
            disabled={filtros.page >= totalPaginas}
            onClick={() => irParaPagina(filtros.page + 1)}
          >
            Próxima
          </Button>
        </nav>
      )}
    </section>
  );
}
