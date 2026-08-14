import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { admin, signIn } = useAuth();

  // Redirect if already authenticated as admin
  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError);
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-library-wood via-library-leather to-library-emerald p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-library-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-golden">
            <Shield className="h-10 w-10 text-library-wood" />
          </div>
          <h1 className="font-display text-3xl font-bold text-library-gold mb-2">
            Painel Administrativo
          </h1>
          <p className="font-body text-library-gold/80">
            Scriptorium Divinum
          </p>
        </div>

        <Card className="border-library-bronze bg-library-parchment/95 backdrop-blur-sm shadow-deep">
          <CardHeader>
            <CardTitle className="font-display text-library-wood text-center">
              Acesso Restrito
            </CardTitle>
            <CardDescription className="font-body text-library-bronze text-center">
              Faça login para gerenciar o catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 font-body">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="font-body text-library-wood">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@email.com"
                  required
                  disabled={loading}
                  className="font-body"
                />
              </div>

              <div>
                <Label htmlFor="password" className="font-body text-library-wood">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="font-body"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-library-wood hover:bg-library-bronze text-library-gold font-body mb-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-library-bronze font-body">
                Problemas de acesso? Entre em contato com o administrador do sistema.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-library-gold/60 font-body">
            © 2025 Scriptorium Divinum - Sistema Administrativo
          </p>
        </div>
      </div>
    </div>
  );
}