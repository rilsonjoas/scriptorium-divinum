import { ExternalLink, Palette, BookMarked, Quote } from 'lucide-react';

interface ClusterConnectionsProps {
  term: string;
  type: 'author' | 'book';
}

export function ClusterConnections({ term, type }: ClusterConnectionsProps) {
  if (!term) return null;

  const encodedTerm = encodeURIComponent(term);

  const links = [
    {
      name: 'Bíblia na Arte',
      description: type === 'author' 
        ? `Explorar representações artísticas e sacras de ${term}`
        : `Buscar obras de arte sacra inspiradas por ${term}`,
      url: `https://biblianaarte.narniano.com/?q=${encodedTerm}`,
      icon: Palette,
      badge: 'Arte & Iconografia',
    },
    {
      name: 'Lecionário',
      description: `Consultar leituras diárias e patristica associada`,
      url: `https://lecionario.narniano.com/?q=${encodedTerm}`,
      icon: BookMarked,
      badge: 'Liturgia & Leitura',
    },
    {
      name: 'Gerador C.S. Lewis',
      description: `Citações clássicas dos Inklings e apologética cristã`,
      url: `https://cslewis.narniano.com`,
      icon: Quote,
      badge: 'Apologética',
    },
  ];

  return (
    <div className="bg-card/95 backdrop-blur-sm border border-library-bronze/60 rounded-xl p-5 md:p-6 parchment-bg shadow-sm my-6">
      <div className="flex items-center gap-2 mb-3 border-b border-library-bronze/30 pb-3">
        <span className="text-library-gold text-sm font-bold">✦</span>
        <h3 className="font-heading text-lg font-semibold text-library-wood-foreground">
          A Biblioteca — Recursos Relacionados no Cluster
        </h3>
      </div>
      
      <p className="font-body text-xs md:text-sm text-muted-foreground mb-4">
        Explore mais conteúdos relacionados a <strong className="text-library-wood-foreground font-semibold">{term}</strong> nos outros projetos do ecossistema Narniano:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3.5 rounded-lg border border-library-bronze/40 bg-card/60 hover:bg-library-wood/5 hover:border-library-dourado/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-body font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-library-gold/15 text-library-wood-foreground border border-library-dourado/30">
                    {link.badge}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-library-bronze-foreground group-hover:text-library-gold transition-colors" />
                </div>
                <h4 className="font-heading text-sm font-semibold text-library-wood-foreground flex items-center gap-1.5 mb-1 group-hover:text-library-gold transition-colors">
                  <Icon className="h-4 w-4 text-library-gold shrink-0" />
                  {link.name}
                </h4>
                <p className="font-body text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {link.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
