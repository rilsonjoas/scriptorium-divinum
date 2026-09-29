import type { ReactNode } from 'react';
import { Minus, Plus } from 'lucide-react';
import {
  AJUSTES_PADRAO,
  ESCALA_MAX,
  ESCALA_MIN,
  passoTamanho,
  type ReadingSettings,
} from '@/utils/readingSettings';

interface ReadingSettingsPanelProps {
  settings: ReadingSettings;
  onChange: (s: ReadingSettings) => void;
}

/** Grupo de opções exclusivas (botões com aria-pressed). */
function Opcoes<T extends string>({
  rotulo,
  valor,
  opcoes,
  onEscolher,
  colunas = 3,
}: {
  rotulo: string;
  valor: T;
  opcoes: { valor: T; rotulo: ReactNode; classe?: string }[];
  onEscolher: (v: T) => void;
  colunas?: number;
}) {
  const id = `aj-${rotulo.toLowerCase().replace(/\W+/g, '-')}`;
  return (
    <div>
      <p id={id} className="text-xs font-body font-medium text-library-bronze-foreground mb-1.5">
        {rotulo}
      </p>
      <div
        role="group"
        aria-labelledby={id}
        className="grid gap-1 bg-library-wood/5 p-1 rounded-md border border-library-bronze/30"
        style={{ gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))` }}
      >
        {opcoes.map(o => (
          <button
            key={o.valor}
            type="button"
            aria-pressed={valor === o.valor}
            onClick={() => onEscolher(o.valor)}
            className={`min-h-[36px] px-1 text-xs font-body rounded transition-colors ${o.classe ?? ''} ${
              valor === o.valor
                ? 'bg-library-wood text-library-gold font-semibold shadow-sm'
                : 'text-library-wood-foreground hover:bg-library-gold/20'
            }`}
          >
            {o.rotulo}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Painel "Aa" da barra do leitor. Decisões de 2026-09-29: tamanho em passos
 * finos (− / +), espaçamento, largura, fonte, tema, modo e 1/2 páginas.
 */
export function ReadingSettingsPanel({ settings, onChange }: ReadingSettingsPanelProps) {
  const set = (patch: Partial<ReadingSettings>) => onChange({ ...settings, ...patch });
  const pct = Math.round(settings.escala * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-display-sm font-semibold text-sm text-library-wood-foreground">Ajustes de leitura</p>
        <button
          type="button"
          onClick={() => onChange({ ...AJUSTES_PADRAO })}
          className="text-xs font-body text-library-bronze-foreground underline-offset-2 hover:underline"
        >
          Restaurar
        </button>
      </div>

      <div>
        <p className="text-xs font-body font-medium text-library-bronze-foreground mb-1.5">Tamanho do texto</p>
        <div className="flex items-center justify-between gap-2 bg-library-wood/5 p-1 rounded-md border border-library-bronze/30">
          <button
            type="button"
            aria-label="Diminuir o texto"
            disabled={settings.escala <= ESCALA_MIN}
            onClick={() => set({ escala: passoTamanho(settings.escala, -1) })}
            className="h-9 w-11 inline-flex items-center justify-center rounded text-library-wood-foreground hover:bg-library-gold/20 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span aria-live="polite" className="text-sm font-body text-library-wood-foreground tabular-nums">
            {pct}%
          </span>
          <button
            type="button"
            aria-label="Aumentar o texto"
            disabled={settings.escala >= ESCALA_MAX}
            onClick={() => set({ escala: passoTamanho(settings.escala, 1) })}
            className="h-9 w-11 inline-flex items-center justify-center rounded text-library-wood-foreground hover:bg-library-gold/20 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Opcoes
        rotulo="Espaçamento entre linhas"
        valor={settings.lineHeight}
        onEscolher={v => set({ lineHeight: v })}
        opcoes={[
          { valor: 'normal', rotulo: 'Justo' },
          { valor: 'relaxed', rotulo: 'Médio' },
          { valor: 'loose', rotulo: 'Amplo' },
        ]}
      />

      <Opcoes
        rotulo="Largura da coluna"
        valor={settings.largura}
        onEscolher={v => set({ largura: v })}
        opcoes={[
          { valor: 'estreita', rotulo: 'Estreita' },
          { valor: 'media', rotulo: 'Média' },
          { valor: 'larga', rotulo: 'Larga' },
        ]}
      />

      <Opcoes
        rotulo="Fonte"
        valor={settings.fontFamily}
        onEscolher={v => set({ fontFamily: v })}
        opcoes={[
          { valor: 'reading', rotulo: 'Merriweather', classe: 'font-reading' },
          { valor: 'serif', rotulo: 'Garamond', classe: 'font-serif' },
          { valor: 'sans', rotulo: 'Sem serifa', classe: 'font-sans' },
        ]}
      />

      <Opcoes
        rotulo="Tema"
        valor={settings.theme}
        colunas={4}
        onEscolher={v => set({ theme: v })}
        opcoes={[
          { valor: 'parchment', rotulo: 'Pergaminho' },
          { valor: 'light', rotulo: 'Claro' },
          { valor: 'sepia', rotulo: 'Sépia' },
          { valor: 'dark', rotulo: 'Escuro' },
        ]}
      />

      <Opcoes
        rotulo="Modo de leitura"
        valor={settings.layout}
        colunas={2}
        onEscolher={v => set({ layout: v })}
        opcoes={[
          { valor: 'pages', rotulo: 'Páginas' },
          { valor: 'flow', rotulo: 'Rolagem' },
        ]}
      />

      {settings.layout === 'pages' && (
        <Opcoes
          rotulo="Páginas lado a lado (telas largas)"
          valor={settings.paginas}
          colunas={2}
          onEscolher={v => set({ paginas: v })}
          opcoes={[
            { valor: 'auto', rotulo: 'Duas' },
            { valor: 'uma', rotulo: 'Uma' },
          ]}
        />
      )}
    </div>
  );
}
