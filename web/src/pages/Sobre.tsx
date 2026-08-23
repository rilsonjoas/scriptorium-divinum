import { Layout } from '@/components/Layout';
import { useSiteSettings } from '@/hooks/useDatabase';
import { BookOpen, Download, Library, Search } from 'lucide-react';

const Sobre = () => {
  const { data: settings } = useSiteSettings();
  const siteName = settings?.siteName ?? 'Scriptorium Divinum';
  const contactEmail = settings?.contactEmail ?? 'scriptorium@narniano.com';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-library-wood mb-4">
            Sobre o {siteName}
          </h1>
          <div className="chapter-divider max-w-md mx-auto mb-6"></div>
          <p className="font-heading text-xl text-library-bronze italic">
            "Sancta sanctis" - O sagrado para os santos
          </p>
        </div>

        {/* Mission */}
        <div className="prose prose-lg max-w-none font-body text-muted-foreground mb-12">
          <div className="bg-card/95 backdrop-blur-sm border border-library-bronze rounded-lg p-8 parchment-bg shadow-book mb-8">
            <h2 className="font-heading text-2xl font-semibold text-library-wood mb-4">Nossa Missão</h2>
            <p className="leading-relaxed mb-4">
              O <strong>Scriptorium Divinum</strong> é uma biblioteca digital dedicada a preservar e tornar acessível 
              o vasto tesouro da literatura teológica cristã em domínio público. Em um ambiente digital 
              que evoca a solenidade e a beleza das grandes bibliotecas clássicas, facilitamos o estudo, 
              a pesquisa e a devoção através dos séculos da tradição cristã.
            </p>
            <p className="leading-relaxed">
              Acreditamos que as grandes obras da teologia cristã — desde os escritos dos Padres da Igreja 
              até os tratados dos reformadores e puritanos — devem permanecer acessíveis às gerações presentes 
              e futuras, livres de barreiras financeiras ou geográficas.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-card/95 backdrop-blur-sm border border-library-bronze rounded-lg p-8 parchment-bg shadow-book mb-8">
            <h2 className="font-heading text-2xl font-semibold text-library-wood mb-4">O Que Oferecemos</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-heading text-lg font-semibold text-library-bronze mb-3 flex items-center gap-2">
                  <Library className="h-5 w-5" />
                  Acervo Curado
                </h3>
                <p className="leading-relaxed">
                  Obras cuidadosamente selecionadas da Patrística, Idade Média, Reforma, 
                  Pós-Reforma e períodos subsequentes, todas verificadas quanto ao domínio público.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-library-bronze mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Leitura Online
                </h3>
                <p className="leading-relaxed">
                  Interface de leitura otimizada com tipografia clássica, navegação por capítulos 
                  e configurações personalizáveis para uma experiência contemplativa.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-library-bronze mb-3 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Downloads Gratuitos
                </h3>
                <p className="leading-relaxed">
                  Download gratuito em formato de texto (.txt) e leitura online
                  com tipografia dedicada, sempre respeitando o domínio público.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-library-bronze mb-3 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Busca Avançada
                </h3>
                <p className="leading-relaxed">
                  Ferramentas de pesquisa por autor, período histórico, tradição teológica 
                  e palavras-chave para facilitar o estudo acadêmico.
                </p>
              </div>
            </div>
          </div>

          {/* Methodology */}
          <div className="bg-card/95 backdrop-blur-sm border border-library-bronze rounded-lg p-8 parchment-bg shadow-book mb-8">
            <h2 className="font-heading text-2xl font-semibold text-library-wood mb-4">Metodologia e Direitos Autorais</h2>
            <p className="leading-relaxed mb-4">
              A maioria das obras disponibilizadas está em domínio público conforme a legislação
              brasileira (Lei 9.610/98). Isso inclui:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Obras cujos autores faleceram há mais de 70 anos</li>
              <li>Traduções cujos tradutores também atendem ao mesmo critério</li>
              <li>Obras publicadas antes das datas limite estabelecidas pela lei</li>
              <li>Verificação cuidadosa de direitos autorais para cada texto e tradução</li>
            </ul>
            <p className="leading-relaxed mb-4">
              Algumas poucas obras não são domínio público, mas estão publicadas sob licença
              aberta que permite republicação com atribuição (ex. Creative Commons
              Atribuição-CompartilhaIgual) — nesse caso a página da obra mostra a atribuição
              exigida de forma explícita, e o texto não é tratado como domínio público.
            </p>
            <p className="leading-relaxed">
              Trabalhamos com fontes respeitáveis como Project Gutenberg, Internet Archive, 
              Christian Classics Ethereal Library e outras instituições dedicadas à preservação 
              do patrimônio literário.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-card/95 backdrop-blur-sm border border-library-bronze rounded-lg p-8 parchment-bg shadow-book mb-8">
            <h2 className="font-heading text-2xl font-semibold text-library-wood mb-4">Nossa Visão</h2>
            <p className="leading-relaxed mb-4">
              Vislumbramos um futuro onde qualquer pessoa interessada na rica tradição teológica 
              cristã possa acessar facilmente as obras fundamentais que moldaram a fé ao longo 
              dos séculos. Queremos ser uma ponte entre a sabedoria antiga e as necessidades 
              contemporâneas de estudo e devoção.
            </p>
            <p className="leading-relaxed">
              Através da tecnologia moderna e do respeito pela tradição, buscamos criar uma 
              experiência que honre tanto o conteúdo sagrado quanto a forma digna de apresentá-lo, 
              inspirando uma nova geração de estudantes, pastores, acadêmicos e fiéis.
            </p>
          </div>

          {/* Support */}
          <div className="bg-gradient-to-r from-library-gold/10 to-library-bronze/10 border border-library-bronze rounded-lg p-8 mb-8">
            <h2 className="font-heading text-2xl font-semibold text-library-wood mb-4">Como Apoiar</h2>
            <p className="leading-relaxed mb-4">
              Este projeto é mantido de forma independente e sustentado através de:
            </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Anúncios discretos</strong> via Google AdSense, sempre fora do leitor de textos
                </li>
                <li>
                  <strong>Links de afiliados</strong> para edições impressas na Amazon (comprar por eles não custa nada a mais ao leitor)
                </li>
              </ul>
              <p className="leading-relaxed">
                Doações voluntárias estão nos planos para o futuro. Se este projeto tem sido
                útil para seus estudos ou devoção, divulgar o Scriptorium já é uma grande ajuda.
              </p>
          </div>
        </div>

        <div className="ornament"></div>

        {/* Contact */}
        <div className="text-center">
          <h2 className="font-heading text-2xl font-semibold text-library-wood mb-4">
            Contato
          </h2>
          <p className="font-body text-muted-foreground mb-4">
            Tem sugestões de obras, encontrou algum erro, ou quer contribuir com o projeto?
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href={`mailto:${contactEmail}`}
              className="font-body text-library-bronze hover:text-library-wood transition-colors"
            >
              {contactEmail}
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sobre;