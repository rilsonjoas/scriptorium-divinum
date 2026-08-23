import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SlidersHorizontal, Type, Sun, Moon, Sparkles, BookOpen } from 'lucide-react';

export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
export type FontFamily = 'reading' | 'serif' | 'sans';
export type ReadingTheme = 'parchment' | 'light' | 'dark' | 'sepia';
export type LineHeight = 'normal' | 'relaxed' | 'loose';

export interface ReadingSettings {
  fontSize: FontSize;
  fontFamily: FontFamily;
  theme: ReadingTheme;
  lineHeight: LineHeight;
}

export const DEFAULT_READING_SETTINGS: ReadingSettings = {
  fontSize: 'md',
  fontFamily: 'reading',
  theme: 'parchment',
  lineHeight: 'relaxed',
};

interface ReadingToolbarProps {
  settings: ReadingSettings;
  onChangeSettings: (newSettings: ReadingSettings) => void;
}

export function ReadingToolbar({ settings, onChangeSettings }: ReadingToolbarProps) {
  const update = (patch: Partial<ReadingSettings>) => {
    onChangeSettings({ ...settings, ...patch });
  };

  const fontSizes: { label: string; value: FontSize }[] = [
    { label: 'A-', value: 'sm' },
    { label: 'A', value: 'md' },
    { label: 'A+', value: 'lg' },
    { label: 'A++', value: 'xl' },
  ];

  const fontFamilies: { label: string; value: FontFamily; className: string }[] = [
    { label: 'Merriweather', value: 'reading', className: 'font-reading' },
    { label: 'EB Garamond', value: 'serif', className: 'font-serif' },
    { label: 'Inter (Sans)', value: 'sans', className: 'font-sans' },
  ];

  const themes: { label: string; value: ReadingTheme; bgClass: string; textClass: string; icon: React.ReactNode }[] = [
    {
      label: 'Pergaminho',
      value: 'parchment',
      bgClass: 'bg-[#f4efe6] border-[#d8c8b0]',
      textClass: 'text-[#2b1f17]',
      icon: <BookOpen className="h-3.5 w-3.5" />,
    },
    {
      label: 'Claro',
      value: 'light',
      bgClass: 'bg-white border-gray-300',
      textClass: 'text-gray-900',
      icon: <Sun className="h-3.5 w-3.5" />,
    },
    {
      label: 'Sépia',
      value: 'sepia',
      bgClass: 'bg-[#f4ecd8] border-[#e2d5b6]',
      textClass: 'text-[#5b4636]',
      icon: <Sparkles className="h-3.5 w-3.5" />,
    },
    {
      label: 'Escuro',
      value: 'dark',
      bgClass: 'bg-[#1a1614] border-[#382e2b]',
      textClass: 'text-[#e5dcd3]',
      icon: <Moon className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2.5 gap-1.5 font-body text-xs text-library-wood border-library-bronze/50 hover:bg-library-gold/20"
          title="Preferências de Leitura"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-library-gold shrink-0" />
          <span className="hidden sm:inline">Ajustes</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-library-parchment border-library-bronze shadow-xl text-foreground z-50" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-library-bronze/30 pb-2">
            <h4 className="font-display font-semibold text-sm text-library-wood flex items-center gap-1.5">
              <Type className="h-4 w-4 text-library-gold" />
              Preferências de Leitura
            </h4>
            <button
              onClick={() => onChangeSettings(DEFAULT_READING_SETTINGS)}
              className="text-[11px] font-body text-library-bronze hover:underline"
            >
              Restaurar
            </button>
          </div>

          {/* Font Size Selector */}
          <div>
            <label className="text-xs font-body font-medium text-library-bronze mb-1.5 block">
              Tamanho do Texto
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-library-wood/5 p-1 rounded-md border border-library-bronze/30">
              {fontSizes.map((item) => (
                <button
                  key={item.value}
                  onClick={() => update({ fontSize: item.value })}
                  className={`py-1 text-xs font-medium font-body rounded transition-colors ${
                    settings.fontSize === item.value
                      ? 'bg-library-wood text-library-gold shadow-sm'
                      : 'text-library-wood hover:bg-library-gold/20'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family Selector */}
          <div>
            <label className="text-xs font-body font-medium text-library-bronze mb-1.5 block">
              Tipografia
            </label>
            <div className="flex flex-col gap-1">
              {fontFamilies.map((item) => (
                <button
                  key={item.value}
                  onClick={() => update({ fontFamily: item.value })}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-left ${item.className} ${
                    settings.fontFamily === item.value
                      ? 'bg-library-gold/25 text-library-wood font-semibold border border-library-gold/50'
                      : 'hover:bg-library-gold/10 text-library-wood'
                  }`}
                >
                  <span>{item.label}</span>
                  {settings.fontFamily === item.value && <span className="text-library-gold">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="text-xs font-body font-medium text-library-bronze mb-1.5 block">
              Tema de Fundo
            </label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => update({ theme: t.value })}
                  className={`flex items-center gap-2 p-2 rounded-md border text-xs font-body transition-all ${t.bgClass} ${t.textClass} ${
                    settings.theme === t.value ? 'ring-2 ring-library-gold font-semibold scale-[1.02]' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
