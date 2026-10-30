import { BookOpen, Briefcase, Download, Globe, GraduationCap, Languages, Library, PenLine, Share2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function DominioPublico({ embutida = false }: { embutida?: boolean }) {
  usePageTitle("Domínio público");
  const conteudo = (
    <>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {!embutida && (
          <header className="mb-10">
            <p className="font-heading text-sm tracking-widest text-library-bronze-foreground mb-3 opacity-70">
              Scriptorium Divinum
            </p>
            <h1 className="font-display text-4xl font-bold text-library-wood-foreground mb-4">
              Obras em Domínio Público
            </h1>
            <div className="chapter-divider max-w-xs mb-6" />
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Entenda o que significa domínio público e como você pode usar livremente
              as obras teológicas clássicas em nossa biblioteca.
            </p>
          </header>
        )}

        {/* O que é Domínio Público */}
        <section className="mb-10">
          <div className="bg-card/95 backdrop-blur-sm border border-library-bronze rounded-lg p-8 parchment-bg shadow-book">
            <h2 className="font-heading text-2xl font-semibold text-library-wood-foreground mb-4">
              O que é Domínio Público?
            </h2>
            <p className="font-body leading-relaxed text-muted-foreground mb-4">
              <strong className="text-library-wood-foreground">Domínio público</strong> refere-se ao conjunto de obras criativas que não estão
              protegidas por direitos autorais, seja porque estes expiraram, foram renunciados
              pelo autor, ou porque a obra nunca foi elegível para proteção.
            </p>
            <p className="font-body leading-relaxed text-muted-foreground">
              Quando uma obra está em domínio público, ela pertence ao patrimônio cultural
              comum da humanidade — podendo ser usada, copiada, modificada e distribuída
              livremente por qualquer pessoa, para qualquer propósito, sem necessidade de
              permissão ou pagamento de royalties.
            </p>
          </div>
        </section>

        {/* Como as obras entram */}
        <section className="mb-10">
          <h2 className="font-heading text-xl font-semibold text-library-wood-foreground mb-6">
            Como as Obras Entram em Domínio Público
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="bg-card/95 border border-library-bronze rounded-lg p-6 parchment-bg shadow-book">
              <h3 className="font-heading text-base font-semibold text-library-wood-foreground mb-3">
                Expiração dos Direitos
              </h3>
              <p className="font-body text-sm leading-relaxed text-muted-foreground mb-4">
                No Brasil, os direitos autorais duram 70 anos após a morte do autor.
                Após esse período, a obra automaticamente entra em domínio público.
              </p>
              <blockquote className="border-l-4 border-library-dourado pl-4 bg-library-gold/5 py-2 rounded-r-md text-sm italic text-library-wood-foreground">
                Santo Agostinho (354–430 d.C.) — suas obras estão em domínio público há mais de 1.500 anos.
              </blockquote>
            </div>

            <div className="bg-card/95 border border-library-bronze rounded-lg p-6 parchment-bg shadow-book">
              <h3 className="font-heading text-base font-semibold text-library-wood-foreground mb-3">
                Obras Históricas
              </h3>
              <p className="font-body text-sm leading-relaxed text-muted-foreground mb-4">
                Textos antigos — especialmente obras teológicas clássicas dos primeiros
                séculos do cristianismo — nunca estiveram sob proteção de direitos autorais modernos.
              </p>
              <blockquote className="border-l-4 border-library-dourado pl-4 bg-library-gold/5 py-2 rounded-r-md text-sm italic text-library-wood-foreground">
                Escritos patrísticos e obras medievais são naturalmente de domínio público.
              </blockquote>
            </div>
          </div>
        </section>

        {/* O que você pode fazer */}
        <section className="mb-10">
          <h2 className="font-heading text-xl font-semibold text-library-wood-foreground mb-6">
            O que Você Pode Fazer com Obras em Domínio Público
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { Icone: BookOpen, titulo: 'Ler Gratuitamente', desc: 'Acesse e leia todas as obras sem restrições ou custos' },
              { Icone: Download, titulo: 'Baixar e Imprimir', desc: 'Faça download em vários formatos e imprima quantas cópias quiser' },
              { Icone: Share2, titulo: 'Compartilhar', desc: 'Distribua livremente para amigos, estudantes e comunidades' },
              { Icone: Briefcase, titulo: 'Uso Comercial', desc: 'Use em projetos comerciais, cursos pagos e publicações' },
              { Icone: Languages, titulo: 'Traduzir', desc: 'Crie traduções para outros idiomas e dialetos' },
              { Icone: PenLine, titulo: 'Criar Obras Derivadas', desc: 'Adapte, compile e crie novas versões baseadas nos textos' },
            ].map((item) => (
              <div key={item.titulo} className="bg-card/80 border border-library-bronze/60 rounded-lg p-5 text-center">
                <item.Icone aria-hidden className="h-6 w-6 mb-2 mx-auto text-library-gold" />
                <h3 className="font-heading text-sm font-semibold text-library-wood-foreground mb-1">{item.titulo}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Considerações */}
        <section className="mb-10">
          <h2 className="font-heading text-xl font-semibold text-library-wood-foreground mb-6">
            Considerações Importantes
          </h2>
          <div className="space-y-4">
            <div className="bg-card/95 border border-library-bronze rounded-lg p-6 parchment-bg shadow-book">
              <h3 className="font-heading text-base font-semibold text-library-wood-foreground mb-3">
                Traduções Modernas
              </h3>
              <p className="font-body text-sm leading-relaxed text-muted-foreground mb-3">
                Embora as obras originais estejam em domínio público, <strong className="text-library-wood-foreground">traduções modernas</strong> podem ter seus próprios direitos autorais. Sempre verifique:
              </p>
              <ul className="list-disc list-inside font-body text-sm text-muted-foreground space-y-1 pl-2">
                <li>Data da tradução</li>
                <li>Informações sobre o tradutor</li>
                <li>Editora ou fonte da tradução</li>
              </ul>
            </div>

            <div className="bg-card/95 border border-library-bronze rounded-lg p-6 parchment-bg shadow-book">
              <h3 className="font-heading text-base font-semibold text-library-wood-foreground mb-3">
                Leis Diferentes por País
              </h3>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">
                As leis de direitos autorais variam entre países. O que está em domínio
                público no Brasil pode não estar em outros países. Se você planeja distribuir
                internacionalmente, verifique as leis locais.
              </p>
            </div>
          </div>
        </section>

        {/* Status das obras */}
        <section className="mb-10">
          <h2 className="font-heading text-xl font-semibold text-library-wood-foreground mb-6">
            Status das Obras em Nossa Biblioteca
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card/95 border border-library-bronze rounded-lg p-6 parchment-bg shadow-book">
              <h3 className="font-heading text-base font-semibold text-library-wood-foreground mb-4">
                Totalmente em Domínio Público
              </h3>
              <ul className="space-y-2 font-body text-sm text-muted-foreground">
                {[
                  { badge: 'Patrística', desc: 'Padres da Igreja (séc. I–VIII)' },
                  { badge: 'Medieval', desc: 'Teólogos medievais (séc. IX–XV)' },
                  { badge: 'Reforma', desc: 'Reformadores (séc. XVI–XVII)' },
                ].map((item) => (
                  <li key={item.badge} className="flex items-center gap-3">
                    <span className="inline-block px-2 py-0.5 text-xs font-body rounded border border-library-bronze/40 text-library-bronze-foreground bg-library-gold/5">
                      {item.badge}
                    </span>
                    <span>{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card/95 border border-library-bronze rounded-lg p-6 parchment-bg shadow-book">
              <h3 className="font-heading text-base font-semibold text-library-wood-foreground mb-4">
                Verificar Traduções
              </h3>
              <ul className="space-y-2 font-body text-sm text-muted-foreground">
                {[
                  { badge: 'Séc. XIX', desc: 'Traduções do século 19' },
                  { badge: 'Séc. XX', desc: 'Traduções modernas (verificar data)' },
                  { badge: 'Contemporâneas', desc: 'Traduções recentes (direitos reservados)' },
                ].map((item) => (
                  <li key={item.badge} className="flex items-center gap-3">
                    <span className="inline-block px-2 py-0.5 text-xs font-body rounded border border-library-bronze/40 text-library-bronze-foreground bg-library-gold/5">
                      {item.badge}
                    </span>
                    <span>{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Fontes */}
        <section className="mb-10">
          <h2 className="font-heading text-xl font-semibold text-library-wood-foreground mb-6">
            Fontes dos Nossos Textos
          </h2>
          <div className="bg-card/95 border border-library-bronze rounded-lg p-8 parchment-bg shadow-book">
            <p className="font-body leading-relaxed text-muted-foreground mb-4">
              Para garantir a integridade legal e histórica de nosso catálogo, importamos e
              adaptamos textos de bibliotecas digitais que realizam rigoroso processo de auditoria
              de direitos autorais:
            </p>
            <ul className="list-disc list-inside space-y-2 font-body text-sm text-muted-foreground pl-2">
              <li>
                <a href="https://www.gutenberg.org" target="_blank" rel="noopener noreferrer"
                  className="font-semibold text-library-wood-foreground hover:text-library-bronze-foreground underline underline-offset-4 transition-colors">
                  Project Gutenberg
                </a>: A maior e mais antiga biblioteca digital de livros em domínio público do mundo.
              </li>
              <li>
                <a href="https://pt.wikisource.org" target="_blank" rel="noopener noreferrer"
                  className="font-semibold text-library-wood-foreground hover:text-library-bronze-foreground underline underline-offset-4 transition-colors">
                  Wikisource em Português
                </a>: Biblioteca livre da Wikimedia Foundation com traduções e textos históricos em português.
              </li>
            </ul>
            <p className="font-body text-sm leading-relaxed text-muted-foreground mt-4">
              Todas as obras mantêm uma seção explícita de <strong className="text-library-wood-foreground">Proveniência</strong> com
              a edição original, o tradutor e a base legal de domínio público.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-leather rounded-lg p-8 text-center">
          <h3 className="font-display text-2xl font-semibold text-library-gold mb-4">
            Nossa Missão: Conhecimento Livre
          </h3>
          <p className="text-library-parchment font-body mb-6 max-w-2xl mx-auto leading-relaxed">
            Acreditamos que o patrimônio teológico e espiritual da humanidade deve estar
            acessível a todos, sem barreiras econômicas ou geográficas.
          </p>
          <div className="flex flex-wrap gap-6 justify-center font-body text-sm text-library-parchment">
            <span className="inline-flex items-center gap-2"><Globe aria-hidden className="h-4 w-4" />Acesso universal e gratuito</span>
            <span className="inline-flex items-center gap-2"><Library aria-hidden className="h-4 w-4" />Preservação digital</span>
            <span className="inline-flex items-center gap-2"><GraduationCap aria-hidden className="h-4 w-4" />Educação para todos</span>
          </div>
        </div>
      </div>
    </>
  );

  if (embutida) return conteudo;

  return <Layout>{conteudo}</Layout>;
}
