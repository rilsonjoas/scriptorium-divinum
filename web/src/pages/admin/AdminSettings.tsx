import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { settingsService } from '@/services/database';
import { adminService } from '@/services/admin';
import { useAuth } from '@/contexts/AuthContext';
import type { SiteSettings } from '@/types';
import { Save, Loader2, Globe, Shield, Info, CheckCircle, AlertTriangle } from 'lucide-react';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Scriptorium Divinum',
  siteDescription: 'Explore o vasto tesouro da teologia cristã em domínio público',
  contactEmail: 'contato@scriptorium-divinum.com',
  featuredBooksCount: 3,
  booksPerPage: 20,
  maintenanceMode: false,
};

export default function AdminSettings() {
  const { admin } = useAuth();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    settingsService
      .get()
      .then((data) => {
        if (active) setSettings(data);
      })
      .catch(() => {
        if (active) toast.error('Não foi possível carregar as configurações');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const setField = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminService.updateSettings(settings);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-library-wood">
            Configurações do Sistema
          </h2>
          <p className="font-body text-library-bronze mt-1">
            Gerencie as configurações gerais do Scriptorium Divinum
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-library-gold mr-3" />
            <span className="font-body text-library-bronze">Carregando configurações...</span>
          </div>
        ) : (
          <Card className="border-library-bronze bg-library-parchment">
            <CardHeader>
              <CardTitle className="font-display text-library-wood flex items-center gap-2">
                <Globe className="h-5 w-5 text-library-gold" />
                Configurações do Site
              </CardTitle>
              <CardDescription className="font-body text-library-bronze">
                Estas configurações são usadas pelo site público em tempo real
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
                    value={settings.siteName}
                    onChange={(e) => setField('siteName', e.target.value)}
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
                    value={settings.contactEmail}
                    onChange={(e) => setField('contactEmail', e.target.value)}
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
                  value={settings.siteDescription}
                  onChange={(e) => setField('siteDescription', e.target.value)}
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
                    value={settings.featuredBooksCount}
                    onChange={(e) => setField('featuredBooksCount', parseInt(e.target.value))}
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
                    value={settings.booksPerPage}
                    onChange={(e) => setField('booksPerPage', parseInt(e.target.value))}
                    className="font-body border-library-bronze"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-body text-library-wood">Modo Manutenção</Label>
                  <p className="text-sm text-library-bronze font-body">
                    Bloqueia o site público (a API responde 503 e o site exibe aviso de manutenção)
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setField('maintenanceMode', checked)}
                />
              </div>

              {settings.maintenanceMode && (
                <Alert className="border-orange-300 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-700 font-body">
                    O site público ficará indisponível para visitantes enquanto o modo manutenção
                    estiver ativo. O painel admin continua acessível.
                  </AlertDescription>
                </Alert>
              )}

              <Separator className="bg-library-bronze/20" />

              <Alert className="border-library-bronze bg-library-gold/10">
                <Info className="h-4 w-4 text-library-wood" />
                <AlertDescription className="text-library-wood font-body">
                  <Shield className="inline h-4 w-4 mr-1" />
                  <strong>Usuário Admin Atual:</strong> {admin?.email ?? '—'}
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
                <CheckCircle className="h-5 w-5 text-library-bronze/40" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
