import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Share2,
  FileCheck,
  Mail,
  Github,
  CheckCircle,
  Scale,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useSiteSettings } from '@/hooks/useDatabase';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Contribuir({ embutida = false }: { embutida?: boolean }) {
  usePageTitle("Como contribuir");
  const { data: settings } = useSiteSettings();
  const contactEmail = settings?.contactEmail ?? 'scriptorium@narniano.com';
  const githubUrl = 'https://github.com/rilsonjoas/scriptorium-divinum';

  const mailto = (subject: string, body?: string) =>
    `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;

  const pageUrl = typeof window !== 'undefined' ? window.location.origin : 'https://scriptorium.narniano.com';
  const shareText = 'Scriptorium Divinum — biblioteca clássica da tradição cristã em domínio público, aberta e gratuita.';
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`;
  const telegramShare = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;

  const conteudo = (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!embutida && (
          <header className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-library-wood-foreground mb-4">
              Colaboração e Diretrizes Editoriais
            </h1>
            <p className="text-lg text-library-bronze-foreground font-body max-w-3xl mx-auto leading-relaxed">
              O Scriptorium Divinum é uma biblioteca digital independente voltada à preservação,
              tradução e disponibilização pública de obras clássicas da tradição cristã.
              A colaboração da comunidade é bem-vinda em frentes técnicas e de curadoria documental.
            </p>
          </header>
        )}

        {/* Formas de Contribuir */}
        <section className="mb-14" aria-labelledby="frentes-colaboracao">
          <h2 id="frentes-colaboracao" className="font-display text-2xl font-semibold text-library-wood-foreground mb-6 text-center">
            Frentes de Participação
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Revisão Textual e Erratas */}
            <Card className="border-library-bronze bg-library-parchment-surface hover:shadow-book transition-shadow ease-[var(--ease-liturgico)]">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-library-gold/20 text-library-wood-foreground rounded-lg flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-library-wood-foreground" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-library-wood-foreground text-lg">Revisão e Erratas</CardTitle>
                    <Badge variant="secondary" className="bg-library-gold/15 text-library-bronze-foreground border border-library-bronze/30 text-xs">Editorial</Badge>
                  </div>
                </div>
                <CardDescription className="font-body text-library-bronze-foreground">
                  Apontamento de gralhas tipográficas, falhas de pontuação ou resíduos
                  de digitalização/OCR em textos do acervo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-body text-library-bronze-foreground text-sm mb-5">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-library-bronze-foreground mt-0.5 flex-shrink-0" />
                    <span>Identificação precisa do livro, capítulo e parágrafo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-library-bronze-foreground mt-0.5 flex-shrink-0" />
                    <span>Confronto opcional com a edição original de referência</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-library-bronze-foreground mt-0.5 flex-shrink-0" />
                    <span>Correção direta de referências e notas marginais</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                  <a href={mailto('Errata Editorial — Scriptorium', 'Obra:\nCapítulo/Seção:\nTexto atual com erro:\nSugestão de correção:\nFonte de apoio (se houver):')}>
                    <Mail className="h-4 w-4 mr-2" />
                    Apontar Errata por E-mail
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Indicação de Fontes Primárias */}
            <Card className="border-library-bronze bg-library-parchment-surface hover:shadow-book transition-shadow ease-[var(--ease-liturgico)]">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-library-gold/20 text-library-wood-foreground rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-library-wood-foreground" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-library-wood-foreground text-lg">Fontes Primárias</CardTitle>
                    <Badge variant="secondary" className="bg-library-gold/15 text-library-bronze-foreground border border-library-bronze/30 text-xs">Curadoria</Badge>
                  </div>
                </div>
                <CardDescription className="font-body text-library-bronze-foreground">
                  Indicação de escaneamentos históricos comprovadamente em domínio público
                  para futuras etapas de preservação e catalogação.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-body text-library-bronze-foreground text-sm mb-5">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-library-bronze-foreground mt-0.5 flex-shrink-0" />
                    <span>Edições históricas completas e não resumidas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-library-bronze-foreground mt-0.5 flex-shrink-0" />
                    <span>Domínio público auditável de autor e tradutor (Lei 9.610/98)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-library-bronze-foreground mt-0.5 flex-shrink-0" />
                    <span>Links de acervos públicos (Internet Archive, Bibliotecas Nacionais)</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                  <a href={mailto('Indicação de Fonte Primária', 'Título da Obra:\nAutor:\nAno/Edição da Tradução:\nLink do Escaneamento (Internet Archive, etc.):\nObservações sobre o domínio público:')}>
                    <Mail className="h-4 w-4 mr-2" />
                    Indicar Fonte Documental
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Engenharia e Código Aberto */}
            <Card className="border-library-bronze bg-library-parchment-surface hover:shadow-book transition-shadow ease-[var(--ease-liturgico)]">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-library-gold/20 text-library-wood-foreground rounded-lg flex items-center justify-center">
                    <Github className="h-5 w-5 text-library-wood-foreground" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-library-wood-foreground text-lg">Código Aberto</CardTitle>
                    <Badge variant="secondary" className="bg-library-gold/15 text-library-bronze-foreground border border-library-bronze/30 text-xs">Engenharia</Badge>
                  </div>
                </div>
                <CardDescription className="font-body text-library-bronze-foreground">
                  A infraestrutura do Scriptorium é aberta sob licença MIT. Melhorias
                  no leitor digital, acessibilidade e documentação técnica são bem-vindas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-body text-library-bronze-foreground text-sm mb-5">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-library-bronze-foreground mt-0.5 flex-shrink-0" />
                    <span>Stack: React 18, Vite, TypeScript, Fastify e PostgreSQL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-library-bronze-foreground mt-0.5 flex-shrink-0" />
                    <span>Adesão rigorosa a padrões WCAG 2.2 de acessibilidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-library-bronze-foreground mt-0.5 flex-shrink-0" />
                    <span>Submissão de pull requests e rastreamento de issues públicas</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    Acessar Repositório no GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Difusão Acadêmica e Formativa */}
            <Card className="border-library-bronze bg-library-parchment-surface hover:shadow-book transition-shadow ease-[var(--ease-liturgico)]">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-library-gold/20 text-library-wood-foreground rounded-lg flex items-center justify-center">
                    <Share2 className="h-5 w-5 text-library-wood-foreground" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-library-wood-foreground text-lg">Difusão e Pesquisa</CardTitle>
                    <Badge variant="secondary" className="bg-library-gold/15 text-library-bronze-foreground border border-library-bronze/30 text-xs">Comunidade</Badge>
                  </div>
                </div>
                <CardDescription className="font-body text-library-bronze-foreground">
                  Recomende a biblioteca para pesquisadores, seminários teológicos,
                  departamentos acadêmicos e grupos de formação histórica.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-body text-library-bronze-foreground text-sm mb-5">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-library-bronze-foreground mt-0.5 flex-shrink-0" />
                    <span>Utilização como fonte citável em monografias e teses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-library-bronze-foreground mt-0.5 flex-shrink-0" />
                    <span>Indicação em ementas de disciplinas de história da igreja</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-library-bronze-foreground mt-0.5 flex-shrink-0" />
                    <span>Acesso universal sem cadastro ou barreiras de assinatura</span>
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button asChild className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                    <a href={whatsappShare} target="_blank" rel="noopener noreferrer">
                      <Share2 className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-library-bronze text-library-bronze-foreground hover:bg-library-bronze hover:text-[hsl(35_25%_95%)] font-body">
                    <a href={telegramShare} target="_blank" rel="noopener noreferrer">
                      Telegram
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Diretrizes e Critérios Editoriais */}
        <section className="mb-14" aria-labelledby="diretrizes-titulo">
          <h2 id="diretrizes-titulo" className="font-display text-2xl font-semibold text-library-wood-foreground mb-6 text-center">
            Diretrizes e Critérios de Admissão
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-library-bronze bg-library-parchment-surface">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 text-library-wood-foreground">
                  <Scale className="h-5 w-5 text-library-gold" />
                  <CardTitle className="font-display text-base">Conformidade Legal</CardTitle>
                </div>
                <CardDescription className="font-body text-xs text-muted-foreground">
                  Legislação de Direitos Autorais
                </CardDescription>
              </CardHeader>
              <CardContent className="font-body text-sm text-library-bronze-foreground leading-relaxed">
                Toda obra e respectiva tradução deve atender estritamente ao prazo de domínio público
                (Lei Federal 9.610/1998, art. 41: 70 anos após a morte do autor e do tradutor)
                ou contar com licença aberta expressa (CC BY-SA).
              </CardContent>
            </Card>

            <Card className="border-library-bronze bg-library-parchment-surface">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 text-library-wood-foreground">
                  <ShieldCheck className="h-5 w-5 text-library-gold" />
                  <CardTitle className="font-display text-base">Integralidade Textual</CardTitle>
                </div>
                <CardDescription className="font-body text-xs text-muted-foreground">
                  Fidelidade Canônica
                </CardDescription>
              </CardHeader>
              <CardContent className="font-body text-sm text-library-bronze-foreground leading-relaxed">
                Priorizam-se obras completas, estruturadas com divisão canônica de capítulos
                e índices analíticos. Textos condensados, adaptados ou resumos não são admitidos no catálogo.
              </CardContent>
            </Card>

            <Card className="border-library-bronze bg-library-parchment-surface">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 text-library-wood-foreground">
                  <Compass className="h-5 w-5 text-library-gold" />
                  <CardTitle className="font-display text-base">Neutralidade Histórica</CardTitle>
                </div>
                <CardDescription className="font-body text-xs text-muted-foreground">
                  Cânon Teológico Amplo
                </CardDescription>
              </CardHeader>
              <CardContent className="font-body text-sm text-library-bronze-foreground leading-relaxed">
                O catálogo reflete a herança clássica comum da cristandade (Patrística, Escolástica,
                Reforma Magisterial, Avivamento Puritano e Espiritualidade Clássica), sem proselitismo
                ou exclusões de ordem sectária.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Canal de Contato Institucional */}
        <section aria-labelledby="contato-editorial">
          <Card className="border border-library-bronze bg-library-parchment-surface text-center shadow-book">
            <CardContent className="p-8">
              <h3 id="contato-editorial" className="font-display text-2xl font-semibold text-library-wood-foreground mb-3">
                Canal de Contato Editorial
              </h3>
              <p className="text-library-bronze-foreground font-body mb-6 max-w-xl mx-auto text-sm leading-relaxed">
                Para envio de apontamentos de revisão, links de acervos públicos ou esclarecimentos sobre
                as diretrizes editoriais da plataforma, entre em contato institucional:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                  <a href={mailto('Contato Editorial — Scriptorium Divinum')}>
                    <Mail className="h-4 w-4 mr-2" />
                    {contactEmail}
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-library-bronze text-library-wood-foreground hover:bg-library-gold/20 font-body">
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    Repositório no GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );

  if (embutida) return conteudo;

  return <Layout>{conteudo}</Layout>;
}
