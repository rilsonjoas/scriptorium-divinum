import { useTranslation } from 'react-i18next';
import i18n, { idiomas } from '@/i18n';

interface LanguageSwitcherProps {
  /** 'compact': pílula do cabeçalho (desktop). 'menu': botões maiores, no menu do celular. */
  variant?: 'compact' | 'menu';
  className?: string;
}

/**
 * Seletor PT/EN/ES. No celular ele fica dentro do menu: no cabeçalho, junto
 * com logo, tema, busca e menu, a linha passava de 480px e empurrava a busca
 * e o menu para fora de telas de 360–430px.
 */
export function LanguageSwitcher({ variant = 'compact', className = '' }: LanguageSwitcherProps) {
  const { t } = useTranslation();
  const menu = variant === 'menu';

  return (
    <div
      role="group"
      aria-label={t('nav.idioma')}
      className={`flex items-center bg-library-wood/80 border border-library-bronze rounded-full p-0.5 font-body shadow-xs ${
        menu ? 'text-sm w-full' : 'text-xs'
      } ${className}`}
    >
      {idiomas.map((item) => {
        const isActive = (i18n.language || 'pt-BR').startsWith(item.codigo.split('-')[0]);
        return (
          <button
            key={item.codigo}
            type="button"
            lang={item.codigo}
            aria-label={item.nome}
            aria-pressed={isActive}
            onClick={() => {
              i18n.changeLanguage(item.codigo);
              try {
                localStorage.setItem('scriptorium:lang', item.codigo);
              } catch {
                // ignore localStorage write errors in private mode
              }
            }}
            className={`rounded-full font-bold transition-colors ${
              menu ? 'flex-1 min-h-[44px] px-3' : 'px-2 py-0.5'
            } ${
              isActive
                ? 'bg-library-gold text-library-wood shadow-xs'
                : 'text-library-gold/70 hover:text-library-gold'
            }`}
          >
            {menu ? item.nome : item.rotulo}
          </button>
        );
      })}
    </div>
  );
}
