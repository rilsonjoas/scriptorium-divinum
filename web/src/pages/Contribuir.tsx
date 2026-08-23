import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Share2,
  FileText,
  Search,
  Mail,
  Github,
  Heart,
  CheckCircle,
  Bug,
  Lightbulb
} from 'lucide-react';
import { useSiteSettings } from '@/hooks/useDatabase';

export default function Contribuir() {
  const { data: settings } = useSiteSettings();
  const contactEmail = settings?.contactEmail ?? 'scriptorium@narniano.com';
  const githubUrl = 'https://github.com/rilsonjoas/scriptorium-divinum';

  const mailto = (subject: string, body?: string) =>
    `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;

  const pageUrl = typeof window !== 'undefined' ? window.location.origin : 'https://scriptorium.narniano.com';
  const shareText = 'Scriptorium Divinum — clássicos da teologia cristã em domínio público, gratuitos e com leitor online.';
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`;
  const telegramShare = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-library-wood mb-4 golden-foil">
            Como Contribuir
          </h1>
          <p className="text-lg text-library-bronze font-body max-w-3xl mx-auto">
            Este é um projeto mantido por uma única pessoa. Não há equipe de
            digitalização nem sistema de envio de textos — mas há formas reais
            e simples de ajudar.
          </p>
        </div>

        {/* Ways to Contribute */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-library-wood mb-6 golden-foil text-center">
            Formas de Ajudar
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Suggest Works */}
            <Card className="border-library-bronze bg-library-parchment hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-library-wood" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-library-wood">Sugerir Obras</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Fácil</Badge>
                  </div>
                </div>
                <CardDescription className="font-body text-library-bronze">
                  Indique clássicos teológicos em domínio público que deveriam estar aqui
                  — quanto mais específico (autor, tradução, fonte), melhor.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-body text-library-bronze text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Obras em domínio público verificável</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Traduções antigas também em domínio público</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Fonte conhecida (Gutenberg, Wikisource, Internet Archive...)</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                  <a href={mailto('Sugestão de obra', 'Obra:\nAutor:\nTradução/fonte:\nPor que ela importa:')}>
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Sugestão
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Report Errors */}
            <Card className="border-library-bronze bg-library-parchment hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center">
                    <Bug className="h-6 w-6 text-library-wood" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-library-wood">Corrigir Erros</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Fácil</Badge>
                  </div>
                </div>
                <CardDescription className="font-body text-library-bronze">
                  Encontrou um erro de transcrição, link quebrado ou problema no site?
                  Reportar é uma das contribuições mais valiosas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-body text-library-bronze text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Erros de digitação ou OCR nos textos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Links de download quebrados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Problemas visuais ou de usabilidade</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                  <a href={mailto('Erro no Scriptorium', 'Página:\nO que aconteceu:\nO que era esperado:')}>
                    <Mail className="h-4 w-4 mr-2" />
                    Reportar Erro
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Spread the word */}
            <Card className="border-library-bronze bg-library-parchment hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-library-wood" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-library-wood">Divulgar</CardTitle>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Simples</Badge>
                  </div>
                </div>
                <CardDescription className="font-body text-library-bronze">
                  Compartilhe com quem estuda teologia, prega sermões ou pesquisa
                  história da igreja. Bibliotecas crescem por boca a boca.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-body text-library-bronze text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Grupos de estudo e seminários</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Redes sociais e comunidades de leitura</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Citação como fonte em trabalhos acadêmicos</span>
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button asChild className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                    <a href={whatsappShare} target="_blank" rel="noopener noreferrer">
                      <Share2 className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-library-bronze text-library-bronze hover:bg-library-bronze hover:text-primary-foreground font-body">
                    <a href={telegramShare} target="_blank" rel="noopener noreferrer">
                      Telegram
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Code */}
            <Card className="border-library-bronze bg-library-parchment hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center">
                    <Github className="h-6 w-6 text-library-wood" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-library-wood">Código</CardTitle>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">Avançado</Badge>
                  </div>
                </div>
                <CardDescription className="font-body text-library-bronze">
                  O projeto é open source (MIT). Bugs, melhorias de interface e
                  documentação são bem-vindos via issues e pull requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-body text-library-bronze text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>React + Vite no frontend, Fastify + Postgres na API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Issues abertas para primeiro contato</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Licença MIT</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    Ver no GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What we are looking for */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-library-wood mb-6 golden-foil text-center">
            O Que Estamos Buscando Agora
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-orange-300 bg-orange-50">
              <CardContent className="p-4">
                <h4 className="font-display font-semibold text-orange-800 mb-2">Patrística</h4>
                <p className="font-body text-orange-700 text-sm mb-3">
                  Textos dos Padres da Igreja em português, com tradução antiga em domínio público
                </p>
                <Badge className="bg-orange-200 text-orange-800">Alta Prioridade</Badge>
              </CardContent>
            </Card>

            <Card className="border-blue-300 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-display font-semibold text-blue-800 mb-2">Reforma</h4>
                <p className="font-body text-blue-700 text-sm mb-3">
                  Obras dos reformadores protestantes em traduções PT-BR livres
                </p>
                <Badge className="bg-blue-200 text-blue-800">Média Prioridade</Badge>
              </CardContent>
            </Card>

            <Card className="border-green-300 bg-green-50">
              <CardContent className="p-4">
                <h4 className="font-display font-semibold text-green-800 mb-2">Teologia Medieval</h4>
                <p className="font-body text-green-700 text-sm mb-3">
                  Textos escolásticos e místicos medievais acessíveis em português
                </p>
                <Badge className="bg-green-200 text-green-800">Média Prioridade</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-library-wood mb-6 golden-foil text-center">
            Critérios de Qualidade
          </h2>

          <Card className="border-library-bronze bg-library-parchment">
            <CardHeader>
              <CardTitle className="font-display text-library-wood flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-library-gold" />
                O que torna uma sugestão viável
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-display font-semibold text-library-wood mb-3">Critérios Legais:</h4>
                  <ul className="space-y-2 font-body text-library-bronze text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Autor falecido há mais de 70 anos (Lei 9.610/98)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Tradutor também falecido há mais de 70 anos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Ou licença aberta com atribuição</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-library-wood mb-3">Critérios Editoriais:</h4>
                  <ul className="space-y-2 font-body text-library-bronze text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Relevância teológica histórica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Texto completo e íntegro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Fonte verificável (não inventada)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <div className="text-center">
          <Card className="border-library-bronze bg-gradient-leather text-center">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-library-gold rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-library-wood" />
                </div>
              </div>
              <h3 className="font-display text-2xl font-semibold text-library-gold mb-4">
                Pronto para Contribuir?
              </h3>
              <p className="text-library-parchment font-body mb-6 max-w-2xl mx-auto">
                Toda contribuição começa com uma conversa. Entre em contato —
                resposta garantida, afinal, quem atende o e-mail é o próprio bibliotecário.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-library-gold hover:bg-library-gold/90 text-library-wood font-body">
                  <a href={mailto('Contato — Scriptorium Divinum')}>
                    <Mail className="h-4 w-4 mr-2" />
                    {contactEmail}
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-library-gold text-library-gold hover:bg-library-gold hover:text-library-wood font-body">
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    Projeto GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
