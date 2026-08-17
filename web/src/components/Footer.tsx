import { Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useDatabase';

export function Footer() {
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
            <h4 className="font-heading text-library-gold font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm font-body">
              <li>
                <Link to="/livros" className="text-library-gold/80 hover:text-library-gold transition-colors">
                  Catálogo de Livros
                </Link>
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
            <h4 className="font-heading text-library-gold font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm font-body">
              <li>
                <Link to="/sobre" className="text-library-gold/80 hover:text-library-gold transition-colors">
                  Sobre o Projeto
                </Link>
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
                <Link to="/ajuda" className="text-library-gold/80 hover:text-library-gold transition-colors">
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-library-gold font-semibold mb-4">Contato</h4>
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

        <div className="text-center text-sm text-library-gold/70 font-body">
          <p>© 2025 {siteName}. Obras em domínio público ou sob licença aberta, com atribuição.</p>
        </div>
      </div>
    </footer>
  );
}