import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading, isAdmin, isCheckingAdmin } = useAuth();

  if (loading || isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-library-parchment">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-library-gold" />
          <span className="text-library-bronze font-body text-lg">
            {loading ? 'Carregando...' : 'Verificando permissões...'}
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}