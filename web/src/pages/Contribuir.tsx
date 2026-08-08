import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Search, 
  Edit, 
  Upload, 
  Mail, 
  Github, 
  Heart,
  CheckCircle,
  Globe,
  Lightbulb
} from 'lucide-react';

export default function Contribuir() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-library-wood mb-4 golden-foil">
            Como Contribuir
          </h1>
          <p className="text-lg text-library-bronze font-body max-w-3xl mx-auto">
            Ajude-nos a expandir e preservar o tesouro da literatura teológica cristã. 
            Sua contribuição faz a diferença para gerações presentes e futuras.
          </p>
        </div>

        {/* Ways to Contribute */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-library-wood mb-6 golden-foil text-center">
            Formas de Contribuir
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
                  Indique textos teológicos clássicos que deveriam estar em nossa biblioteca
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-body text-library-bronze text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Obras em domínio público</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Textos teológicos clássicos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Autores históricos relevantes</span>
                  </li>
                </ul>
                <Button className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Sugestão
                </Button>
              </CardContent>
            </Card>

            {/* Digital Transcription */}
            <Card className="border-library-bronze bg-library-parchment hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-library-wood" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-library-wood">Digitalização</CardTitle>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Moderado</Badge>
                  </div>
                </div>
                <CardDescription className="font-body text-library-bronze">
                  Ajude a digitalizar e transcrever textos raros e manuscritos antigos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-body text-library-bronze text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Transcrição de textos históricos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Digitalização de obras raras</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Revisão de qualidade</span>
                  </li>
                </ul>
                <Button className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                  <Upload className="h-4 w-4 mr-2" />
                  Participar Projeto
                </Button>
              </CardContent>
            </Card>

            {/* Improve Translations */}
            <Card className="border-library-bronze bg-library-parchment hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center">
                    <Edit className="h-6 w-6 text-library-wood" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-library-wood">Melhorar Traduções</CardTitle>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">Avançado</Badge>
                  </div>
                </div>
                <CardDescription className="font-body text-library-bronze">
                  Revise e aprimore traduções existentes ou crie novas versões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-body text-library-bronze text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Revisão de traduções antigas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Novas traduções de textos latinos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Correção de erros</span>
                  </li>
                </ul>
                <Button className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                  <Edit className="h-4 w-4 mr-2" />
                  Começar Revisão
                </Button>
              </CardContent>
            </Card>

            {/* Research & Metadata */}
            <Card className="border-library-bronze bg-library-parchment hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center">
                    <Search className="h-6 w-6 text-library-wood" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-library-wood">Pesquisa Histórica</CardTitle>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">Moderado</Badge>
                  </div>
                </div>
                <CardDescription className="font-body text-library-bronze">
                  Complete informações sobre autores, obras e contexto histórico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 font-body text-library-bronze text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Biografias de autores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Contexto histórico das obras</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Categorização e tags</span>
                  </li>
                </ul>
                <Button className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body">
                  <Search className="h-4 w-4 mr-2" />
                  Iniciar Pesquisa
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-library-wood mb-6 golden-foil text-center">
            Diretrizes para Contribuição
          </h2>
          
          <Card className="border-library-bronze bg-library-parchment">
            <CardHeader>
              <CardTitle className="font-display text-library-wood flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-library-gold" />
                Critérios de Qualidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-display font-semibold text-library-wood mb-3">Obras Aceitas:</h4>
                  <ul className="space-y-2 font-body text-library-bronze text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Textos em domínio público</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Relevância teológica histórica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Autores reconhecidos academicamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Textos completos e íntegros</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-library-wood mb-3">Padrões Técnicos:</h4>
                  <ul className="space-y-2 font-body text-library-bronze text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Formato de texto limpo (Markdown)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Metadados completos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Fontes verificáveis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Citações adequadas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Needs */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-library-wood mb-6 golden-foil text-center">
            Prioridades Atuais
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-orange-300 bg-orange-50">
              <CardContent className="p-4">
                <h4 className="font-display font-semibold text-orange-800 mb-2">Patrística</h4>
                <p className="font-body text-orange-700 text-sm mb-3">
                  Textos dos Padres da Igreja ainda não digitalizados
                </p>
                <Badge className="bg-orange-200 text-orange-800">Alta Prioridade</Badge>
              </CardContent>
            </Card>
            
            <Card className="border-blue-300 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-display font-semibold text-blue-800 mb-2">Reforma</h4>
                <p className="font-body text-blue-700 text-sm mb-3">
                  Obras dos reformadores protestantes em português
                </p>
                <Badge className="bg-blue-200 text-blue-800">Média Prioridade</Badge>
              </CardContent>
            </Card>
            
            <Card className="border-green-300 bg-green-50">
              <CardContent className="p-4">
                <h4 className="font-display font-semibold text-green-800 mb-2">Teologia Medieval</h4>
                <p className="font-body text-green-700 text-sm mb-3">
                  Textos escolásticos e místicos medievais
                </p>
                <Badge className="bg-green-200 text-green-800">Média Prioridade</Badge>
              </CardContent>
            </Card>
          </div>
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
                Entre em contato conosco para discutir como você pode ajudar a preservar 
                e expandir este tesouro da literatura teológica cristã.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-library-gold hover:bg-library-gold/90 text-library-wood font-body">
                  <Mail className="h-4 w-4 mr-2" />
                  contato@scriptoriumdivinum.org
                </Button>
                <Button variant="outline" className="border-library-gold text-library-gold hover:bg-library-gold hover:text-library-wood font-body">
                  <Github className="h-4 w-4 mr-2" />
                  Projeto GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}