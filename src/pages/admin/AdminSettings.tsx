import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Settings, 
  Save, 
  Database, 
  Shield, 
  Mail, 
  Palette, 
  Globe,
  Users,
  BookOpen,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function AdminSettings() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  // Site settings state
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Scriptorium Divinum',
    siteDescription: 'Explore o vasto tesouro da teologia cristã em domínio público',
    contactEmail: 'contato@scriptorium-divinum.com',
    maintenanceMode: false,
    allowRegistrations: true,
    featuredBooksCount: 6,
    booksPerPage: 20,
  });

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    enableCache: true,
    cacheExpiration: 300, // 5 minutes
    enableAnalytics: false,
    analyticsId: '',
    backupFrequency: 'daily',
    logLevel: 'info',
  });

  // Content settings state
  const [contentSettings, setContentSettings] = useState({
    autoApproveBooks: false,
    allowGuestComments: false,
    moderateComments: true,
    enableDownloads: true,
    enableOnlineReading: true,
    defaultBookFormat: 'pdf',
  });

  const handleSaveSettings = async (section: string) => {
    setIsSaving(true);
    setSavedMessage('');

    try {
      // TODO: Implement actual save functionality
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSavedMessage(`Configurações de ${section} salvas com sucesso!`);
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      setSavedMessage(`Erro ao salvar configurações: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="font-display text-3xl font-bold text-library-wood">
            Configurações do Sistema
          </h2>
          <p className="font-body text-library-bronze mt-1">
            Gerencie as configurações gerais do Scriptorium Divinum
          </p>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 font-body">
              {savedMessage}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="site" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-library-parchment border border-library-bronze">
            <TabsTrigger value="site" className="font-body data-[state=active]:bg-library-gold data-[state=active]:text-library-wood">
              <Globe className="h-4 w-4 mr-2" />
              Site
            </TabsTrigger>
            <TabsTrigger value="system" className="font-body data-[state=active]:bg-library-gold data-[state=active]:text-library-wood">
              <Database className="h-4 w-4 mr-2" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="content" className="font-body data-[state=active]:bg-library-gold data-[state=active]:text-library-wood">
              <BookOpen className="h-4 w-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="security" className="font-body data-[state=active]:bg-library-gold data-[state=active]:text-library-wood">
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* Site Settings */}
          <TabsContent value="site">
            <Card className="border-library-bronze bg-library-parchment">
              <CardHeader>
                <CardTitle className="font-display text-library-wood flex items-center gap-2">
                  <Globe className="h-5 w-5 text-library-gold" />
                  Configurações do Site
                </CardTitle>
                <CardDescription className="font-body text-library-bronze">
                  Configure informações básicas e aparência do site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className="font-body text-library-wood">
                      Nome do Site
                    </Label>
                    <Input
                      id="siteName"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                      className="font-body border-library-bronze"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="font-body text-library-wood">
                      Email de Contato
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={siteSettings.contactEmail}
                      onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
                      className="font-body border-library-bronze"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription" className="font-body text-library-wood">
                    Descrição do Site
                  </Label>
                  <Textarea
                    id="siteDescription"
                    value={siteSettings.siteDescription}
                    onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                    className="font-body border-library-bronze"
                    rows={3}
                  />
                </div>

                <Separator className="bg-library-bronze/20" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="featuredBooksCount" className="font-body text-library-wood">
                      Livros em Destaque (Quantidade)
                    </Label>
                    <Input
                      id="featuredBooksCount"
                      type="number"
                      min="3"
                      max="12"
                      value={siteSettings.featuredBooksCount}
                      onChange={(e) => setSiteSettings({...siteSettings, featuredBooksCount: parseInt(e.target.value)})}
                      className="font-body border-library-bronze"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="booksPerPage" className="font-body text-library-wood">
                      Livros por Página
                    </Label>
                    <Input
                      id="booksPerPage"
                      type="number"
                      min="10"
                      max="50"
                      value={siteSettings.booksPerPage}
                      onChange={(e) => setSiteSettings({...siteSettings, booksPerPage: parseInt(e.target.value)})}
                      className="font-body border-library-bronze"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-body text-library-wood">Modo Manutenção</Label>
                    <p className="text-sm text-library-bronze font-body">
                      Coloca o site em modo manutenção para visitantes
                    </p>
                  </div>
                  <Switch
                    checked={siteSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSiteSettings({...siteSettings, maintenanceMode: checked})}
                  />
                </div>

                <Button 
                  onClick={() => handleSaveSettings('Site')}
                  disabled={isSaving}
                  className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
            <Card className="border-library-bronze bg-library-parchment">
              <CardHeader>
                <CardTitle className="font-display text-library-wood flex items-center gap-2">
                  <Database className="h-5 w-5 text-library-gold" />
                  Configurações do Sistema
                </CardTitle>
                <CardDescription className="font-body text-library-bronze">
                  Configure performance, cache e monitoramento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-body text-library-wood">Cache Habilitado</Label>
                    <p className="text-sm text-library-bronze font-body">
                      Melhora a performance do site
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.enableCache}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, enableCache: checked})}
                  />
                </div>

                {systemSettings.enableCache && (
                  <div className="space-y-2">
                    <Label htmlFor="cacheExpiration" className="font-body text-library-wood">
                      Expiração do Cache (segundos)
                    </Label>
                    <Input
                      id="cacheExpiration"
                      type="number"
                      min="60"
                      max="3600"
                      value={systemSettings.cacheExpiration}
                      onChange={(e) => setSystemSettings({...systemSettings, cacheExpiration: parseInt(e.target.value)})}
                      className="font-body border-library-bronze"
                    />
                  </div>
                )}

                <Separator className="bg-library-bronze/20" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-body text-library-wood">Analytics</Label>
                    <p className="text-sm text-library-bronze font-body">
                      Habilita monitoramento de acesso
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.enableAnalytics}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, enableAnalytics: checked})}
                  />
                </div>

                {systemSettings.enableAnalytics && (
                  <div className="space-y-2">
                    <Label htmlFor="analyticsId" className="font-body text-library-wood">
                      ID do Google Analytics
                    </Label>
                    <Input
                      id="analyticsId"
                      placeholder="G-XXXXXXXXXX"
                      value={systemSettings.analyticsId}
                      onChange={(e) => setSystemSettings({...systemSettings, analyticsId: e.target.value})}
                      className="font-body border-library-bronze"
                    />
                  </div>
                )}

                <Button 
                  onClick={() => handleSaveSettings('Sistema')}
                  disabled={isSaving}
                  className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Settings */}
          <TabsContent value="content">
            <Card className="border-library-bronze bg-library-parchment">
              <CardHeader>
                <CardTitle className="font-display text-library-wood flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-library-gold" />
                  Configurações de Conteúdo
                </CardTitle>
                <CardDescription className="font-body text-library-bronze">
                  Configure como o conteúdo é gerenciado e exibido
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-body text-library-wood">Downloads Habilitados</Label>
                    <p className="text-sm text-library-bronze font-body">
                      Permite download de livros pelos usuários
                    </p>
                  </div>
                  <Switch
                    checked={contentSettings.enableDownloads}
                    onCheckedChange={(checked) => setContentSettings({...contentSettings, enableDownloads: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-body text-library-wood">Leitura Online</Label>
                    <p className="text-sm text-library-bronze font-body">
                      Permite leitura online dos livros
                    </p>
                  </div>
                  <Switch
                    checked={contentSettings.enableOnlineReading}
                    onCheckedChange={(checked) => setContentSettings({...contentSettings, enableOnlineReading: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-body text-library-wood">Aprovação Automática</Label>
                    <p className="text-sm text-library-bronze font-body">
                      Novos livros são aprovados automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={contentSettings.autoApproveBooks}
                    onCheckedChange={(checked) => setContentSettings({...contentSettings, autoApproveBooks: checked})}
                  />
                </div>

                <Button 
                  onClick={() => handleSaveSettings('Conteúdo')}
                  disabled={isSaving}
                  className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card className="border-library-bronze bg-library-parchment">
              <CardHeader>
                <CardTitle className="font-display text-library-wood flex items-center gap-2">
                  <Shield className="h-5 w-5 text-library-gold" />
                  Configurações de Segurança
                </CardTitle>
                <CardDescription className="font-body text-library-bronze">
                  Configure autenticação e controle de acesso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-library-bronze bg-library-gold/10">
                  <Info className="h-4 w-4 text-library-wood" />
                  <AlertDescription className="text-library-wood font-body">
                    <strong>Usuário Admin Atual:</strong> {user?.email}
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-body text-library-wood">Permitir Registros</Label>
                    <p className="text-sm text-library-bronze font-body">
                      Novos usuários podem se registrar no sistema
                    </p>
                  </div>
                  <Switch
                    checked={siteSettings.allowRegistrations}
                    onCheckedChange={(checked) => setSiteSettings({...siteSettings, allowRegistrations: checked})}
                  />
                </div>

                <Separator className="bg-library-bronze/20" />

                <div className="space-y-4">
                  <h4 className="font-body text-library-wood font-medium">Ações de Segurança</h4>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-library-bronze text-library-bronze hover:bg-library-bronze hover:text-library-parchment font-body"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Limpar Cache de Sessões
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 font-body"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Forçar Logout de Todos os Usuários
                  </Button>
                </div>

                <Button 
                  onClick={() => handleSaveSettings('Segurança')}
                  disabled={isSaving}
                  className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}