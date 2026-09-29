import { Layout } from '@/components/Layout';
import { useSiteSettings } from '@/hooks/useDatabase';
import { PixDonationCard } from '@/components/apoiar/PixDonationCard';
import { BookOpen, Download, Library, Search } from 'lucide-react';
import Ajuda from './Ajuda';
import DominioPublico from './DominioPublico';
import Contribuir from './Contribuir';

const SECOES = [
  { id: 'sobre', rotulo: 'O projeto' },
  { id: 'uso', rotulo: 'Como usar' },
  { id: 'dominio-publico', rotulo: 'Domínio público' },
  { id: 'contribuir', rotulo: 'Como contribuir' },
  { id: 'apoiar', rotulo: 'Apoiar' },
  { id: 'contato', rotulo: 'Contato' },
];

const Sobre = () => {
  const { data: settings } = useSiteSettings();
  const siteName = settings?.siteName ?? 'Scriptorium Divinum';
  const contactEmail = settings?.contactEmail ?? 'scriptorium@narniano.com';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-library-wood-foreground mb-4">
            Sobre o {siteName}
          </h1>
          <div className="chapter-divider max-w-md mx-auto mb-6"></div>

          {/* Navegação interna. Uma página só com quatro assuntos
              precisa de índice: sem isto, quem chega de um link
              compartilhado rola 900 linhas procurando o que veio ler. */}
          <nav
            aria-label="Seções desta página"
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {SECOES.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3 py-1.5 rounded-full border border-library-bronze/70 text-sm font-body text-library-wood-foreground hover:bg-library-gold/15 transition-colors"
              >
                {s.rotulo}
              </a>
            ))}
          </nav>
          <p className="font-heading text-xl text-library-bronze-foreground italic">
            "Sancta sanctis" - O sagrado para os santos
          </p>
        </div>

        {/* Mission / Manifesto da Grande Casa */}
        <div className="prose prose-lg prose-leitor max-w-none font-body text-muted-foreground mb-12">
          <div className="bg-card/95 backdrop-blur-sm border border-library-bronze rounded-lg p-8 parchment-bg shadow-book mb-8">
            <h2 className="font-heading text-2xl font-semibold text-library-wood-foreground mb-4">
              A Grande Casa da Tradição Cristã
            </h2>
            <p className="leading-relaxed mb-4">
              No prefácio de <em>Cristianismo Puro e Simples</em>, C. S. Lewis compara a fé comum dos cristãos a uma grande casa:
            </p>
            <blockquote className="border-l-4 border-library-dourado pl-4 italic my-4 text-library-wood-foreground bg-library-gold/5 py-3 rounded-r-md">
              "O cristianismo puro e simples é como um grande hall de entrada de onde se abrem portas para vários cômodos. É no hall que as pessoas esperam, conversam e se encontram; mas é nos quartos, onde há lareira, poltronas e mesas postas, que se vive de verdade... O hall é o lugar de onde se tem acesso a todos os aposentos. E quando você entrar no seu quarto particular, seja gentil com aqueles que escolheram outros cômodos e com aqueles que ainda estão no hall."
            </blockquote>
            <p className="leading-relaxed mb-4">
              O <strong>Scriptorium Divinum</strong> nasce para ser exatamente esse <em>Grande Hall</em> da cristandade em língua portuguesa: uma biblioteca clássica, sólida e acolhedora, onde a herança de dois milênios de fé está reunida sob o mesmo teto, sem divisões sectárias e com profunda reverência à obra do Espírito Santo através dos séculos.
            </p>
            <p className="leading-relaxed">
              Cremos que a tradição cristã — da riqueza litúrgica e contemplativa <strong>católica e ortodoxa</strong>, passando pelo rigor exegético da <strong>Reforma luterana e calvinista</strong>, pela piedade ardente dos <strong>puritanos e anglicanos</strong>, até o zelo missionário e o fogo dos <strong>avivamentos históricos que moldaram a igreja evangélica e pentecostal</strong> — não pertence a um grupo isolado, mas é a herança e o tesouro de todo o Corpo de Cristo.
            </p>
          </div>

          {/* Um Presente para a Igreja Brasileira */}
          <div className="bg-card/95 backdrop-blur-sm border border-library-bronze rounded-lg p-8 parchment-bg shadow-book mb-8">
            <h2 className="font-heading text-2xl font-semibold text-library-wood-foreground mb-4">
              Um Presente para a Igreja no Brasil
            </h2>
            <p className="leading-relaxed mb-4">
              Durante séculos, grande parte das obras fundamentais que moldaram a mente e o coração dos santos esteve inacessível ao leitor de língua portuguesa — ou confinada a edições raras e esgotadas, ou guardada em arquivos estrangeiros em latim, grego, francês e inglês antigo.
            </p>
            <p className="leading-relaxed mb-4">
              O Scriptorium Divinum é um <strong>presente permanente e 100% gratuito para a Igreja brasileira e para todo o mundo lusófono</strong>. Queremos que o seminarista em formação, o pastor no sertão, a líder comunitária, o acadêmico e o jovem leitor que busca aprofundar sua vida de oração possam sentar-se à mesa com Santo Agostinho, São Tomás de Aquino, Martinho Lutero, João Calvino, Teresa de Ávila, John Bunyan e Padre António Vieira com apenas um clique, em uma interface bela, digna e livre de barreiras comerciais.
            </p>
            <p className="leading-relaxed">
              Conhecer as nossas raízes não enfraquece a nossa identidade denominacional; pelo contrário: enraíza a nossa fé na rocha dos séculos, cura o provincianismo do nosso tempo e nos ensina a amar mais profundamente a Cristo e ao nosso próximo.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-card/95 backdrop-blur-sm border border-library-bronze rounded-lg p-8 parchment-bg shadow-book mb-8">
            <h2 className="font-heading text-2xl font-semibold text-library-wood-foreground mb-4">O Que Oferecemos</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-heading text-lg font-semibold text-library-bronze-foreground mb-3 flex items-center gap-2">
                  <Library className="h-5 w-5" />
                  Acervo Curado
                </h3>
                <p className="leading-relaxed">
                  Obras cuidadosamente selecionadas da Patrística, Idade Média, Reforma, 
                  Pós-Reforma e períodos subsequentes, todas verificadas quanto ao domínio público.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-library-bronze-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Leitura Online
                </h3>
                <p className="leading-relaxed">
                  Interface de leitura otimizada com tipografia clássica, navegação por capítulos 
                  e configurações personalizáveis para uma experiência contemplativa.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-library-bronze-foreground mb-3 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Downloads Gratuitos
                </h3>
                <p className="leading-relaxed">
                  Download gratuito em formato de texto (.txt) e leitura online
                  com tipografia dedicada, sempre respeitando o domínio público.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-library-bronze-foreground mb-3 flex items-center gap-2">
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
            <h2 className="font-heading text-2xl font-semibold text-library-wood-foreground mb-4">Metodologia e Direitos Autorais</h2>
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
            <h2 className="font-heading text-2xl font-semibold text-library-wood-foreground mb-4">Nossa Visão</h2>
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
          <div id="apoiar" className="scroll-mt-20 bg-gradient-to-r from-library-gold/10 to-library-bronze/10 border border-library-bronze rounded-lg p-8 mb-8">
            <h2 className="font-heading text-2xl font-semibold text-library-wood-foreground mb-4">Como Apoiar</h2>
            <p className="leading-relaxed mb-4">
              Este projeto é mantido de forma independente e sustentado através de:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>
                <strong>Doações voluntárias</strong> via Pix — sustenta o custo dos servidores e do curador
              </li>
              <li>
                <strong>Anúncios discretos</strong> via Google AdSense, sempre fora do leitor de textos
              </li>
              <li>
                <strong>Links de afiliados</strong> para edições impressas na Amazon (comprar por eles não custa nada a mais ao leitor)
              </li>
            </ul>
            <p className="leading-relaxed mb-6">
              Se este projeto tem sido útil para seus estudos ou devoção, uma contribuição é bem-vinda
              — e divulgar o Scriptorium também ajuda muito.
            </p>
            <div className="bg-card/95 backdrop-blur-sm border border-library-bronze rounded-lg p-6">
              <h3 className="font-heading text-lg font-semibold text-library-wood-foreground mb-4 text-center">
                Doe via Pix em segundos
              </h3>
              <PixDonationCard />
            </div>
          </div>
        </div>

        <div className="ornament"></div>

        {/* ==== Como usar ==== */}
        <section id="uso" aria-labelledby="uso-titulo" className="mb-12 scroll-mt-20">
          <h2 id="uso-titulo" className="font-heading text-2xl font-semibold text-library-wood-foreground mb-4">
            Como usar a biblioteca
          </h2>
          <Ajuda embutida />
        </section>

        {/* ==== Domínio público ==== */}
        <section id="dominio-publico" aria-labelledby="dp-titulo" className="mb-12 scroll-mt-20">
          <h2 id="dp-titulo" className="font-heading text-2xl font-semibold text-library-wood-foreground mb-4">
            Domínio público e direitos autorais
          </h2>
          <DominioPublico embutida />
        </section>

        {/* ==== Como contribuir ==== */}
        <section id="contribuir" aria-labelledby="con-titulo" className="mb-12 scroll-mt-20">
          <h2 id="con-titulo" className="font-heading text-2xl font-semibold text-library-wood-foreground mb-4">
            Como contribuir
          </h2>
          <Contribuir embutida />
        </section>

        {/* Contact */}
        <div id="contato" className="text-center scroll-mt-20">
          <h2 className="font-heading text-2xl font-semibold text-library-wood-foreground mb-4">
            Contato
          </h2>
          <p className="font-body text-muted-foreground mb-4">
            Tem sugestões de obras, encontrou algum erro, ou quer contribuir com o projeto?
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href={`mailto:${contactEmail}`}
              className="font-body text-library-bronze-foreground hover:text-library-wood-foreground transition-colors"
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