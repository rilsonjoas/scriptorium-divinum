import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Download, Search, Users, Library, Heart, Mail, Globe, FileText, Eye, Share2 } from 'lucide-react';

export default function Ajuda() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-library-wood mb-4 golden-foil">
            Central de Ajuda
          </h1>
          <p className="text-lg text-library-bronze font-body">
            Encontre respostas para suas dúvidas sobre como navegar e usar nossa biblioteca teológica digital.
          </p>
        </div>

        {/* Navegação Rápida */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="border-library-bronze bg-library-parchment hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-library-gold rounded-lg flex items-center justify-center">
                  <Search className="h-5 w-5 text-library-wood" />
                </div>
                <CardTitle className="font-display text-lg text-library-wood">Busca</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-body text-library-bronze">
                Como encontrar livros, autores e temas específicos
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-library-bronze bg-library-parchment hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-library-gold rounded-lg flex items-center justify-center">
                  <Download className="h-5 w-5 text-library-wood" />
                </div>
                <CardTitle className="font-display text-lg text-library-wood">Downloads</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-body text-library-bronze">
                Formatos disponíveis e como baixar os textos
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-library-bronze bg-library-parchment hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-library-gold rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-library-wood" />
                </div>
                <CardTitle className="font-display text-lg text-library-wood">Domínio Público</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-body text-library-bronze">
                Entenda os direitos autorais e licenças dos textos
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Perguntas Frequentes */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-library-wood mb-6 golden-foil">
            Perguntas Frequentes
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border border-library-bronze rounded-lg px-6 bg-library-parchment">
              <AccordionTrigger className="font-body text-library-wood hover:text-library-bronze">
                Como posso buscar por livros específicos?
              </AccordionTrigger>
              <AccordionContent className="font-body text-library-bronze">
                <div className="space-y-3">
                  <p>Use a barra de busca no topo da página para procurar por:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Título da obra:</strong> Digite o nome completo ou parcial</li>
                    <li><strong>Nome do autor:</strong> "Agostinho", "Belarmino", etc.</li>
                    <li><strong>Palavras-chave:</strong> "confissões", "teologia", "patrística"</li>
                  </ul>
                  <p>Você também pode navegar pelas seções <strong>Catálogo</strong>, <strong>Autores</strong> e <strong>Categorias</strong> no menu principal.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-library-bronze rounded-lg px-6 bg-library-parchment">
              <AccordionTrigger className="font-body text-library-wood hover:text-library-bronze">
                Quais formatos de download estão disponíveis?
              </AccordionTrigger>
              <AccordionContent className="font-body text-library-bronze">
                <div className="space-y-3">
                  <p>Oferecemos os seguintes formatos para download:</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-red-100 text-red-800">PDF</Badge>
                      <span>Ideal para impressão e leitura offline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">EPUB</Badge>
                      <span>Para e-readers e aplicativos móveis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">MOBI</Badge>
                      <span>Compatível com dispositivos Kindle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">TXT</Badge>
                      <span>Texto simples, universal</span>
                    </div>
                  </div>
                  <p className="text-sm italic">Nem todos os formatos estão disponíveis para todas as obras.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-library-bronze rounded-lg px-6 bg-library-parchment">
              <AccordionTrigger className="font-body text-library-wood hover:text-library-bronze">
                Posso usar estes textos para fins comerciais?
              </AccordionTrigger>
              <AccordionContent className="font-body text-library-bronze">
                <div className="space-y-3">
                  <p><strong>Sim!</strong> Todas as obras em nossa biblioteca estão em domínio público, o que significa que você pode:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Baixar e redistribuir gratuitamente</li>
                    <li>Usar para fins educacionais e comerciais</li>
                    <li>Criar obras derivadas</li>
                    <li>Traduzir para outros idiomas</li>
                    <li>Publicar em outros formatos</li>
                  </ul>
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-4">
                    <p className="text-amber-700">
                      <strong>Importante:</strong> Embora as obras originais estejam em domínio público, 
                      algumas traduções modernas podem ter direitos autorais próprios. Sempre verifique 
                      as informações específicas de cada obra.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-library-bronze rounded-lg px-6 bg-library-parchment">
              <AccordionTrigger className="font-body text-library-wood hover:text-library-bronze">
                Como posso contribuir com novas obras?
              </AccordionTrigger>
              <AccordionContent className="font-body text-library-bronze">
                <div className="space-y-3">
                  <p>Adoraríamos receber sua contribuição! Você pode ajudar de várias formas:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Sugerir obras:</strong> Indique textos teológicos clássicos que deveriam estar em nossa biblioteca</li>
                    <li><strong>Melhorar traduções:</strong> Ajude a revisar e aprimorar textos existentes</li>
                    <li><strong>Digitalizar textos:</strong> Contribua com a digitalização de obras raras</li>
                    <li><strong>Verificar metadados:</strong> Ajude a completar informações sobre autores e obras</li>
                  </ul>
                  <p>Entre em contato conosco através do e-mail abaixo para saber como participar.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-library-bronze rounded-lg px-6 bg-library-parchment">
              <AccordionTrigger className="font-body text-library-wood hover:text-library-bronze">
                A leitura online funciona em dispositivos móveis?
              </AccordionTrigger>
              <AccordionContent className="font-body text-library-bronze">
                <div className="space-y-3">
                  <p><strong>Sim!</strong> Nossa plataforma é totalmente responsiva e funciona em:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Smartphones (Android e iOS)</li>
                    <li>Tablets de todos os tamanhos</li>
                    <li>Laptops e desktops</li>
                    <li>E-readers com navegador web</li>
                  </ul>
                  <p>Para a melhor experiência de leitura em dispositivos móveis, recomendamos usar o modo paisagem em tablets e baixar os arquivos EPUB para leitura offline.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Como Navegar */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-library-wood mb-6 golden-foil">
            Como Navegar na Biblioteca
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-library-bronze bg-library-parchment">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="h-6 w-6 text-library-gold" />
                  <CardTitle className="font-display text-library-wood">Catálogo</CardTitle>
                </div>
                <CardDescription className="font-body text-library-bronze">
                  Visualize todas as obras disponíveis em nossa biblioteca, com opções de filtro por período, idioma e tema.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-library-bronze bg-library-parchment">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-6 w-6 text-library-gold" />
                  <CardTitle className="font-display text-library-wood">Autores</CardTitle>
                </div>
                <CardDescription className="font-body text-library-bronze">
                  Explore biografias e obras organizadas por autor, desde os Padres da Igreja até teólogos modernos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-library-bronze bg-library-parchment">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Library className="h-6 w-6 text-library-gold" />
                  <CardTitle className="font-display text-library-wood">Categorias</CardTitle>
                </div>
                <CardDescription className="font-body text-library-bronze">
                  Navegue por áreas temáticas como Patrística, Filosofia Cristã, Espiritualidade e muito mais.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-library-bronze bg-library-parchment">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="h-6 w-6 text-library-gold" />
                  <CardTitle className="font-display text-library-wood">Leitura Online</CardTitle>
                </div>
                <CardDescription className="font-body text-library-bronze">
                  Leia diretamente no navegador com interface otimizada para diferentes dispositivos e tamanhos de tela.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Contato */}
        <div className="bg-gradient-leather rounded-lg p-8 text-center">
          <h3 className="font-display text-2xl font-semibold text-library-gold mb-4">
            Ainda precisa de ajuda?
          </h3>
          <p className="text-library-parchment font-body mb-6 max-w-2xl mx-auto">
            Nossa equipe está sempre disponível para ajudar você a aproveitar ao máximo nossa biblioteca teológica. 
            Não hesite em entrar em contato!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-library-parchment">
              <Mail className="h-5 w-5" />
              <span className="font-body">contato@scriptoriumdivinum.org</span>
            </div>
            <div className="flex items-center gap-2 text-library-parchment">
              <Share2 className="h-5 w-5" />
              <span className="font-body">Compartilhe nossa missão</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}