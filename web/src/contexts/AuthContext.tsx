import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ApiError, apiClient } from '@/lib/api-client';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    apiClient<AdminUser>('/api/v1/admin/me')
      .then((data) => {
        if (!cancelled) setAdmin(data);
      })
      .catch(() => {
        if (!cancelled) setAdmin(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const data = await apiClient<{ admin: AdminUser }>('/api/v1/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAdmin(data.admin);
      return { error: null };
    } catch (err) {
      if (err instanceof ApiError) {
        return { error: err.message };
      }
      return { error: 'Ocorreu um erro inesperado ao entrar.' };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiClient<void>('/api/v1/admin/logout', { method: 'POST' });
    } finally {
      setAdmin(null);
    }
  }, []);

  const value: AuthContextType = {
    admin,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
