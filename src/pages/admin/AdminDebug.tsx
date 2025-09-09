import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDebug() {
  const [results, setResults] = useState<Array<{
    test: string;
    success: boolean;
    data: unknown;
    error: unknown;
    timestamp: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();

  const addResult = (test: string, success: boolean, data?: unknown, error?: unknown) => {
    setResults(prev => [...prev, { 
      test, 
      success, 
      data: data || null, 
      error: error || null, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const testBasicConnection = async () => {
    setLoading(true);
    setResults([]);
    
    // Test 1: Basic Supabase connection
    try {
      const { data, error } = await supabase.from('authors').select('count').limit(1);
      addResult('Conexão com Authors', !error, data, error);
    } catch (err) {
      addResult('Conexão com Authors', false, null, err);
    }

    // Test 2: Books table
    try {
      const { data, error } = await supabase.from('books').select('count').limit(1);
      addResult('Conexão com Books', !error, data, error);
    } catch (err) {
      addResult('Conexão com Books', false, null, err);
    }

    // Test 3: Current user
    try {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      addResult('Usuário Atual', !error, currentUser ? { email: currentUser.email, id: currentUser.id } : null, error);
    } catch (err) {
      addResult('Usuário Atual', false, null, err);
    }

    // Test 4: Profiles table
    try {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
  if (currentUser) {
    addResult('Metadados do Usuário', !error, {
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.user_metadata?.role || 'user',
      created_at: currentUser.created_at
    }, error);
  }
    } catch (err) {
      addResult('Tabela Profiles', false, null, err);
    }

    setLoading(false);
  };

  const testDataQueries = async () => {
    setLoading(true);
    setResults([]);
    
    // Test books with authors
    try {
      const { data, error } = await supabase
        .from('books')
        .select(`
          id,
          title,
          authors (name)
        `)
        .limit(3);
      addResult('Livros com Autores', !error, data, error);
    } catch (err) {
      addResult('Livros com Autores', false, null, err);
    }

    // Test authors count
    try {
      const { count, error } = await supabase
        .from('authors')
        .select('*', { count: 'exact', head: true });
      addResult('Contagem de Autores', !error, { count }, error);
    } catch (err) {
      addResult('Contagem de Autores', false, null, err);
    }

    // Test books count
    try {
      const { count, error } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true });
      addResult('Contagem de Livros', !error, { count }, error);
    } catch (err) {
      addResult('Contagem de Livros', false, null, err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-library-parchment p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Debug Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-library-gold/10 border border-library-bronze rounded">
              <h4 className="font-semibold text-library-wood mb-2">Status Atual:</h4>
              <div className="text-sm text-library-bronze space-y-1">
                <div>👤 Usuário: {user?.email || 'Não logado'}</div>
                <div>🔐 Admin: {isAdmin ? '✅ Sim' : '❌ Não'}</div>
                <div>🆔 ID: {user?.id || 'N/A'}</div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button onClick={testBasicConnection} disabled={loading}>
                Testar Conexão Básica
              </Button>
              <Button onClick={testDataQueries} disabled={loading} variant="outline">
                Testar Consultas de Dados
              </Button>
            </div>

            {results.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Resultados dos Testes:</h3>
                {results.map((result, index) => (
                  <Alert key={index} className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <strong>{result.test}</strong>
                          <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                            {result.success ? '✓ Sucesso' : '✗ Erro'}
                          </span>
                        </div>
                        {result.error && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-red-600 font-medium">Ver erro</summary>
                            <div className="mt-2 text-red-600 bg-red-100 p-2 rounded">
                              {JSON.stringify(result.error, null, 2)}
                            </div>
                          </details>
                        )}
                        {result.data && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-gray-600 font-medium">Ver dados</summary>
                            <div className="mt-2 text-gray-600 bg-gray-100 p-2 rounded">
                              {JSON.stringify(result.data, null, 2)}
                            </div>
                          </details>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}