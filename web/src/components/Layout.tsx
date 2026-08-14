import { Header } from './Header';
import { Footer } from './Footer';
import { useSiteSettings } from '@/hooks/useDatabase';
import { Wrench } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { data: settings, isLoading } = useSiteSettings();

  if (!isLoading && settings?.maintenanceMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-library-wood via-library-leather to-library-emerald flex items-center justify-center px-4">
        <div className="text-center max-w-xl">
          <div className="w-20 h-20 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="h-10 w-10 text-library-gold" />
          </div>
          <h1 className="font-display text-4xl font-bold text-library-gold mb-4 golden-foil">
            Site em Manutenção
          </h1>
          <div className="chapter-divider max-w-xs mx-auto mb-6"></div>
          <p className="font-body text-lg text-library-gold/90 mb-4">
            Estamos realizando melhorias e o site estará de volta em breve.
          </p>
          <p className="font-body text-library-gold/70">
            Obrigado pela paciência.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}