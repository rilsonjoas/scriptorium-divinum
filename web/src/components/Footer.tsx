import { Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useDatabase';
import { useTranslation } from 'react-i18next';
import { idiomas } from '@/i18n';

const CLUSTER_LINKS = [
  { label: 'Narniano', href: 'https://narniano.com' },
  { label: 'Bíblia na Arte', href: 'https://biblianaarte.narniano.com' },
  { label: 'Lecionário', href: 'https://lecionario.narniano.com' },
  { label: 'Gerador C.S. Lewis', href: 'https://cslewis.narniano.com' },
];

export function Footer() {
  const { t, i18n } = useTranslation();
  const { data: settings } = useSiteSettings();
  const siteName = settings?.siteName ?? 'Scriptorium Divinum';
  const contactEmail = settings?.contactEmail ?? 'scriptorium@narniano.com';

  return (
    <footer className="bg-gradient-leather text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="chapter-divider mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-library-gold mb-4">
              {siteName}
            </h3>
            <p className="text-sm text-library-gold/80 mb-4 font-body">
              {settings?.siteDescription ??
                'Preservando e disponibilizando o tesouro da literatura teológica cristã em domínio público para as gerações presentes e futuras.'}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-library-gold font-semibold mb-4">{t('rodape.navegacao')}</h4>
            <ul className="space-y-2 text-sm font-body">
              <li>
                <Link to="/livros" className="text-library-gold/80 hover:text-library-gold transition-colors">{t('rodape.catalogoDeLivros')}</Link>
              </li>
              <li>
                <Link to="/autores" className="text-library-gold/80 hover:text-library-gold transition-colors">
                  Autores
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="text-library-gold/80 hover:text-library-gold transition-colors">
                  Categorias
                </Link>
              </li>
              <li>
                <Link to="/busca" className="text-library-gold/80 hover:text-library-gold transition-colors">
                  Busca Avançada
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading text-library-gold font-semibold mb-4">{t('rodape.recursos')}</h4>
            <ul className="space-y-2 text-sm font-body">
              <li>
                <Link to="/sobre" className="text-library-gold/80 hover:text-library-gold transition-colors">{t('rodape.sobreOProjeto')}</Link>
              </li>
              <li>
                <Link to="/dominio-publico" className="text-library-gold/80 hover:text-library-gold transition-colors">
                  Domínio Público
                </Link>
              </li>
              <li>
                <Link to="/contribuir" className="text-library-gold/80 hover:text-library-gold transition-colors">
                  Como Contribuir
                </Link>
              </li>
              <li>
                <Link to="/ajuda" className="text-library-gold/80 hover:text-library-gold transition-colors">{t('rodape.centralDeAjuda')}</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-library-gold font-semibold mb-4">{t('rodape.contato')}</h4>
            <ul className="space-y-2 text-sm font-body">
              <li>
                <a 
                  href={`mailto:${contactEmail}`} 
                  className="flex items-center space-x-2 text-library-gold/80 hover:text-library-gold transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  <span>{contactEmail}</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/rilsonjoas/scriptorium-divinum" 
                  className="flex items-center space-x-2 text-library-gold/80 hover:text-library-gold transition-colors"
                >
                  <Github className="h-3 w-3" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="ornament"></div>

        <div className="mt-8 flex flex-col items-center gap-2.5 text-center">
          <span className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-library-gold/60">{t('rodape.conhecaTambem')}</span>
          <nav
            aria-label="Outros projetos do cluster A Biblioteca"
            className="flex max-w-md flex-wrap items-baseline justify-center gap-y-1.5 text-xs text-library-gold/70 font-body sm:max-w-none"
          >
            {CLUSTER_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-baseline whitespace-nowrap">
                {i > 0 && (
                  <span aria-hidden="true" className="mx-2.5 text-library-gold">
                    ✦
                  </span>
                )}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors underline-offset-2 hover:text-library-gold hover:underline"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </nav>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-body">
          {idiomas.map((idioma, idx) => (
            <span key={idioma.codigo} className="flex items-center gap-2">
              {idx > 0 && <span aria-hidden="true" className="text-library-gold/50">|</span>}
              <button
                type="button"
                onClick={() => {
                  i18n.changeLanguage(idioma.codigo);
                  try { localStorage.setItem('scriptorium:lang', idioma.codigo); } catch { /* sem storage */ }
                }}
                className={`uppercase tracking-wider transition-colors ${
                  i18n.language === idioma.codigo ? 'text-library-gold font-bold' : 'text-library-gold/60 hover:text-library-gold'
                }`}
              >
                {idioma.rotulo}
              </button>
            </span>
          ))}
        </div>

        <div className="text-center text-sm text-library-gold/70 font-body mt-6">
          <p>© {new Date().getFullYear()} {siteName}. {t('rodape.direitos')}</p>
        </div>
      </div>
    </footer>
  );
}