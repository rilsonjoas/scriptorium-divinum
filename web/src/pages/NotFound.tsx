import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { BookOpen, Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-library-gold/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <BookOpen className="h-12 w-12 text-library-bronze" />
          </div>
          
          <h1 className="font-display text-6xl font-bold text-library-wood mb-4">404</h1>
          <h2 className="font-heading text-2xl font-semibold text-library-bronze mb-4">
            Página Não Encontrada
          </h2>
          
          <div className="chapter-divider max-w-md mx-auto mb-6"></div>
          
          <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
            Parece que você tentou acessar uma página que não existe em nosso scriptorium. 
            Esta obra pode ter sido movida para outro local ou o endereço pode estar incorreto.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-library-wood hover:bg-library-bronze text-library-gold font-body">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-library-bronze text-library-bronze hover:bg-library-bronze hover:text-primary-foreground font-body">
              <Link to="/livros">
                <BookOpen className="mr-2 h-4 w-4" />
                Explorar Catálogo
              </Link>
            </Button>
          </div>
          
          <div className="ornament mt-12"></div>
          
          <p className="font-body text-sm text-muted-foreground italic mt-6">
            "Errare humanum est" - Errar é humano
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
