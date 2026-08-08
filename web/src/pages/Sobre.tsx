import { Layout } from '@/components/Layout';

const Sobre = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-library-wood mb-4">
            Sobre o Scriptorium Divinum
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
              O **Scriptorium Divinum** é uma biblioteca digital dedicada a preservar e tornar acessível 
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
                <h3 className="font-heading text-lg font-semibold text-library-bronze mb-3">📚 Acervo Curado</h3>
                <p className="leading-relaxed">
                  Obras cuidadosamente selecionadas da Patrística, Idade Média, Reforma, 
                  Pós-Reforma e períodos subsequentes, todas verificadas quanto ao domínio público.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-library-bronze mb-3">🔍 Leitura Online</h3>
                <p className="leading-relaxed">
                  Interface de leitura otimizada com tipografia clássica, navegação por capítulos 
                  e configurações personalizáveis para uma experiência contemplativa.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-library-bronze mb-3">📥 Downloads Gratuitos</h3>
                <p className="leading-relaxed">
                  Formatos múltiplos (PDF, ePub, etc.) para leitura offline em qualquer dispositivo, 
                  sempre respeitando o domínio público.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-library-bronze mb-3">🔎 Busca Avançada</h3>
                <p className="leading-relaxed">
                  Ferramentas de pesquisa por autor, período histórico, tradição teológica 
                  e palavras-chave para facilitar o estudo acadêmico.
                </p>
              </div>
            </div>
          </div>

          {/* Methodology */}
          <div className="bg-card/95 backdrop-blur-sm border border-library-bronze rounded-lg p-8 parchment-bg shadow-book mb-8">
            <h2 className="font-heading text-2xl font-semibold text-library-wood mb-4">Metodologia e Domínio Público</h2>
            <p className="leading-relaxed mb-4">
              Seguimos critérios rigorosos para garantir que todas as obras disponibilizadas estão 
              em domínio público conforme a legislação brasileira (Lei 9.610/98). Isso inclui:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Obras cujos autores faleceram há mais de 70 anos</li>
              <li>Traduções cujos tradutores também atendem ao mesmo critério</li>
              <li>Obras publicadas antes das datas limite estabelecidas pela lei</li>
              <li>Verificação cuidadosa de direitos autorais para cada texto e tradução</li>
            </ul>
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
              <li>**Google AdSense** integrado de forma discreta para não interferir na leitura</li>
              <li>**Doações voluntárias** para manutenção, curadoria e expansão do acervo</li>
              <li>**Links de afiliados** para versões impressas quando disponíveis</li>
            </ul>
            <p className="leading-relaxed">
              Se este projeto tem sido útil para seus estudos ou devoção, considere fazer uma 
              doação para ajudar na preservação e expansão deste tesouro da literatura cristã.
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
              href="mailto:contato@teologiapublica.com.br"
              className="font-body text-library-bronze hover:text-library-wood transition-colors"
            >
              contato@teologiapublica.com.br
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sobre;