import { Layout } from '@/components/Layout';
import { useSiteSettings } from '@/hooks/useDatabase';
import { PixDonationCard } from '@/components/apoiar/PixDonationCard';

const Sobre = () => {
  const { data: settings } = useSiteSettings();
  const siteName = settings?.siteName ?? 'Scriptorium Divinum';
  const contactEmail = settings?.contactEmail ?? 'scriptorium@narniano.com';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">

        {/* ── Cabeçalho ── */}
        <header id="sobre" className="text-center mb-14 scroll-mt-20">
          <p className="font-heading text-sm tracking-widest text-library-bronze-foreground mb-3 opacity-70">
            Scriptorium Divinum
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-library-wood-foreground mb-5 leading-tight">
            A Grande Casa da<br />Tradição Cristã
          </h1>
          <div className="chapter-divider max-w-xs mx-auto mb-6" />
          <p className="font-heading text-lg text-library-bronze-foreground italic">
            "Sancta sanctis" — O sagrado para os santos
          </p>
        </header>

        {/* ── Manifesto ── */}
        <section aria-label="Manifesto" className="mb-14">
          <div className="bg-card/95 backdrop-blur-sm border border-library-bronze rounded-lg p-8 parchment-bg shadow-book">

            <blockquote className="border-l-4 border-library-dourado pl-5 italic my-6 text-library-wood-foreground bg-library-gold/5 py-4 rounded-r-md text-base leading-relaxed">
              "O cristianismo puro e simples é como um grande hall de entrada de onde se abrem portas para vários cômodos. É no hall que as pessoas esperam, conversam e se encontram; mas é nos quartos, onde há lareira, poltronas e mesas postas, que se vive de verdade."
              <footer className="mt-3 text-sm not-italic text-muted-foreground">— C. S. Lewis, <cite>Cristianismo Puro e Simples</cite></footer>
            </blockquote>

            <p className="font-body leading-relaxed text-muted-foreground mb-5">
              O <strong className="text-library-wood-foreground">{siteName}</strong> nasce para ser
              exatamente esse <em>Grande Hall</em> da cristandade em língua portuguesa: uma
              biblioteca clássica, sólida e acolhedora, onde a herança de dois milênios de fé
              está reunida sob o mesmo teto, sem divisões sectárias.
            </p>

            <p className="font-body leading-relaxed text-muted-foreground mb-5">
              Durante séculos, grande parte das obras fundamentais que moldaram a mente e o
              coração dos santos esteve inacessível ao leitor de língua portuguesa — confinada
              a edições raras ou guardada em arquivos estrangeiros em latim, grego e inglês antigo.
            </p>

            <p className="font-body leading-relaxed text-muted-foreground">
              Queremos que o seminarista em formação, o pastor no sertão, a líder comunitária,
              o acadêmico e o jovem leitor possam sentar-se à mesa com Santo Agostinho, Martinho
              Lutero, Teresa de Ávila e Padre António Vieira com apenas um clique — em uma
              interface bela, digna e <strong className="text-library-wood-foreground">100% gratuita</strong>.
            </p>
          </div>
        </section>

        <div className="ornament mb-14" />

        {/* ── Apoiar ── */}
        <section id="apoiar" aria-labelledby="apoiar-titulo" className="mb-14 scroll-mt-20">
          <h2 id="apoiar-titulo" className="font-heading text-2xl font-semibold text-library-wood-foreground mb-2 text-center">
            Apoiar o projeto
          </h2>
          <p className="font-body text-center text-muted-foreground mb-8 text-sm">
            Mantido de forma independente. Uma contribuição sustenta os servidores e o trabalho de curadoria.
          </p>

          <div className="bg-gradient-to-br from-library-gold/10 to-library-bronze/10 border border-library-bronze rounded-lg p-8">
            <PixDonationCard />
          </div>

          <p className="font-body text-center text-xs text-muted-foreground mt-4 opacity-60">
            Divulgar o Scriptorium também ajuda muito. Obrigado.
          </p>
        </section>

        {/* ── Contato ── */}
        <section id="contato" aria-labelledby="contato-titulo" className="text-center scroll-mt-20">
          <h2 id="contato-titulo" className="font-heading text-xl font-semibold text-library-wood-foreground mb-3">
            Contato
          </h2>
          <p className="font-body text-muted-foreground text-sm mb-4">
            Sugestões de obras, erros encontrados ou qualquer outro assunto:
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="font-body text-library-bronze-foreground hover:text-library-wood-foreground transition-colors underline underline-offset-4"
          >
            {contactEmail}
          </a>
        </section>

      </div>
    </Layout>
  );
};

export default Sobre;
