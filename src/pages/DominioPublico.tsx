import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Globe, BookOpen, Scale, Users, Download, Share2, AlertTriangle } from 'lucide-react';

export default function DominioPublico() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-library-wood mb-4 golden-foil">
            Obras em Domínio Público
          </h1>
          <p className="text-lg text-library-bronze font-body max-w-3xl">
            Entenda o que significa domínio público e como você pode usar livremente 
            as obras teológicas clássicas em nossa biblioteca.
          </p>
        </div>

        {/* O que é Domínio Público */}
        <div className="mb-12">
          <Card className="border-library-bronze bg-library-parchment">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-library-wood" />
                </div>
                <div>
                  <CardTitle className="font-display text-2xl text-library-wood">
                    O que é Domínio Público?
                  </CardTitle>
                  <CardDescription className="font-body text-library-bronze">
                    Conhecimento livre para toda a humanidade
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 font-body text-library-bronze">
              <p>
                <strong>Domínio público</strong> refere-se ao conjunto de obras criativas que não estão protegidas 
                por direitos autorais, seja porque estes expiraram, foram renunciados pelo autor, ou porque 
                a obra nunca foi elegível para proteção de direitos autorais.
              </p>
              <p>
                Quando uma obra está em domínio público, ela pertence ao patrimônio cultural comum da humanidade, 
                podendo ser usada, copiada, modificada e distribuída livremente por qualquer pessoa, 
                para qualquer propósito, sem necessidade de permissão ou pagamento de royalties.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Como funciona */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-library-wood mb-6 golden-foil">
            Como as Obras Entram em Domínio Público
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-library-bronze bg-library-parchment">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="font-display text-library-wood">Expiração dos Direitos</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="font-body text-library-bronze">
                <p>
                  No Brasil, os direitos autorais duram 70 anos após a morte do autor. 
                  Após esse período, a obra automaticamente entra em domínio público.
                </p>
                <div className="mt-3 p-3 bg-green-50 rounded border-l-4 border-green-400">
                  <p className="text-sm text-green-700">
                    <strong>Exemplo:</strong> Santo Agostinho (354-430 d.C.) - suas obras estão 
                    em domínio público há mais de 1.500 anos.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-library-bronze bg-library-parchment">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Scale className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="font-display text-library-wood">Obras Históricas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="font-body text-library-bronze">
                <p>
                  Textos antigos, especialmente obras teológicas clássicas dos primeiros 
                  séculos do cristianismo, nunca estiveram sob proteção de direitos autorais modernos.
                </p>
                <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <p className="text-sm text-blue-700">
                    <strong>Exemplo:</strong> Escritos patrísticos e obras medievais são 
                    naturalmente de domínio público.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* O que você pode fazer */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-library-wood mb-6 golden-foil">
            O que Você Pode Fazer com Obras em Domínio Público
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-library-bronze bg-library-parchment text-center p-6">
              <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-library-wood" />
              </div>
              <h3 className="font-display font-semibold text-library-wood mb-2">Ler Gratuitamente</h3>
              <p className="font-body text-sm text-library-bronze">
                Acesse e leia todas as obras sem restrições ou custos
              </p>
            </Card>

            <Card className="border-library-bronze bg-library-parchment text-center p-6">
              <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center mx-auto mb-3">
                <Download className="h-6 w-6 text-library-wood" />
              </div>
              <h3 className="font-display font-semibold text-library-wood mb-2">Baixar e Imprimir</h3>
              <p className="font-body text-sm text-library-bronze">
                Faça download em vários formatos e imprima quantas cópias quiser
              </p>
            </Card>

            <Card className="border-library-bronze bg-library-parchment text-center p-6">
              <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center mx-auto mb-3">
                <Share2 className="h-6 w-6 text-library-wood" />
              </div>
              <h3 className="font-display font-semibold text-library-wood mb-2">Compartilhar</h3>
              <p className="font-body text-sm text-library-bronze">
                Distribua livremente para amigos, estudantes e comunidades
              </p>
            </Card>

            <Card className="border-library-bronze bg-library-parchment text-center p-6">
              <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-library-wood" />
              </div>
              <h3 className="font-display font-semibold text-library-wood mb-2">Uso Comercial</h3>
              <p className="font-body text-sm text-library-bronze">
                Use em projetos comerciais, cursos pagos e publicações
              </p>
            </Card>

            <Card className="border-library-bronze bg-library-parchment text-center p-6">
              <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-library-wood" />
              </div>
              <h3 className="font-display font-semibold text-library-wood mb-2">Traduzir</h3>
              <p className="font-body text-sm text-library-bronze">
                Crie traduções para outros idiomas e dialetos
              </p>
            </Card>

            <Card className="border-library-bronze bg-library-parchment text-center p-6">
              <div className="w-12 h-12 bg-library-gold rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-library-wood" />
              </div>
              <h3 className="font-display font-semibold text-library-wood mb-2">Criar Obras Derivadas</h3>
              <p className="font-body text-sm text-library-bronze">
                Adapte, compile e crie novas versões baseadas nos textos
              </p>
            </Card>
          </div>
        </div>

        {/* Considerações Importantes */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-library-wood mb-6 golden-foil">
            Considerações Importantes
          </h2>
          
          <div className="space-y-6">
            <Card className="border-orange-300 bg-orange-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <CardTitle className="font-display text-orange-800">Traduções Modernas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="font-body text-orange-700">
                <p>
                  Embora as obras originais estejam em domínio público, <strong>traduções modernas</strong> podem ter seus próprios direitos autorais. Sempre verifique:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Data da tradução</li>
                  <li>Informações sobre o tradutor</li>
                  <li>Editora ou fonte da tradução</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-300 bg-blue-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Scale className="h-6 w-6 text-blue-600" />
                  <CardTitle className="font-display text-blue-800">Leis Diferentes por País</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="font-body text-blue-700">
                <p>
                  As leis de direitos autorais variam entre países. O que está em domínio público 
                  no Brasil pode não estar em outros países. Se você planeja distribuir 
                  internacionalmente, verifique as leis locais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status das Obras */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-library-wood mb-6 golden-foil">
            Status das Obras em Nossa Biblioteca
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-display font-semibold text-library-wood flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Totalmente em Domínio Público
              </h3>
              <ul className="space-y-2 font-body text-library-bronze">
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Patrística</Badge>
                  <span>Padres da Igreja (séc. I-VIII)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Medieval</Badge>
                  <span>Teólogos medievais (séc. IX-XV)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Reforma</Badge>
                  <span>Reformadores (séc. XVI-XVII)</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-display font-semibold text-library-wood flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Verificar Traduções
              </h3>
              <ul className="space-y-2 font-body text-library-bronze">
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">Séc. XIX</Badge>
                  <span>Traduções do século 19</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">Séc. XX</Badge>
                  <span>Traduções modernas (verificar data)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">Contemporâneas</Badge>
                  <span>Traduções recentes (direitos reservados)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Nossa Missão */}
        <div className="bg-gradient-leather rounded-lg p-8 text-center">
          <h3 className="font-display text-2xl font-semibold text-library-gold mb-4">
            Nossa Missão: Conhecimento Livre
          </h3>
          <p className="text-library-parchment font-body mb-6 max-w-3xl mx-auto leading-relaxed">
            Acreditamos que o patrimônio teológico e espiritual da humanidade deve estar acessível 
            a todos, sem barreiras econômicas ou geográficas. Por isso, dedicamos nossos esforços 
            para digitalizar, organizar e disponibilizar gratuitamente estas obras preciosas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-library-parchment">
              <Globe className="h-5 w-5" />
              <span className="font-body">Acesso universal e gratuito</span>
            </div>
            <div className="flex items-center gap-2 text-library-parchment">
              <BookOpen className="h-5 w-5" />
              <span className="font-body">Preservação digital</span>
            </div>
            <div className="flex items-center gap-2 text-library-parchment">
              <Users className="h-5 w-5" />
              <span className="font-body">Educação para todos</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}