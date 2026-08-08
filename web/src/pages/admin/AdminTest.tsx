import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, AlertTriangle, Database, Users, FolderOpen } from 'lucide-react';

export default function AdminTest() {
  const [tests, setTests] = useState<Array<{
    name: string;
    status: 'pending' | 'success' | 'error';
    message: string;
    details?: any;
  }>>([]);
  
  const [isRunning, setIsRunning] = useState(false);

  const addTest = (name: string, status: 'success' | 'error', message: string, details?: any) => {
    setTests(prev => [...prev, { name, status, message, details }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTests([]);

    // Test 1: Basic connection
    try {
      console.log('Testing basic connection...');
      const { data, error } = await supabase.from('authors').select('count').limit(1);
      if (error) throw error;
      addTest('Conexão Básica', 'success', 'Supabase conectado com sucesso', data);
    } catch (error: any) {
      addTest('Conexão Básica', 'error', `Erro: ${error.message}`, error);
    }

    // Test 2: Check profiles table
    try {
      console.log('Testing profiles table...');
      const { data, error } = await supabase.from('profiles').select('*').limit(1);
      if (error) throw error;
      addTest('Tabela Profiles', 'success', `Tabela existe. ${data.length} registros encontrados`, data);
    } catch (error: any) {
      addTest('Tabela Profiles', 'error', `Erro: ${error.message}`, error);
    }

    // Test 3: Check current user
    try {
      console.log('Testing current user...');
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error('No user logged in');
      addTest('Usuário Atual', 'success', `Usuário logado: ${user.email}`, user);
    } catch (error: any) {
      addTest('Usuário Atual', 'error', `Erro: ${error.message}`, error);
    }

    // Test 4: Check if user has profile
    try {
      console.log('Testing user profile...');
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error && error.code === 'PGRST116') {
          addTest('Profile do Usuário', 'error', 'Profile não encontrado - precisa ser criado', error);
        } else if (error) {
          throw error;
        } else {
          addTest('Profile do Usuário', 'success', `Profile encontrado. Role: ${data.role}`, data);
        }
      }
    } catch (error: any) {
      addTest('Profile do Usuário', 'error', `Erro: ${error.message}`, error);
    }

    // Test 5: Test insert capability
    try {
      console.log('Testing insert capability...');
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            role: 'admin'
          }, { onConflict: 'id' })
          .select();
        
        if (error) throw error;
        addTest('Capacidade de Insert', 'success', 'Profile criado/atualizado com sucesso', data);
      }
    } catch (error: any) {
      addTest('Capacidade de Insert', 'error', `Erro: ${error.message}`, error);
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-library-wood">
            Teste de Conexão - Supabase
          </h2>
          <p className="font-body text-library-bronze mt-1">
            Diagnóstico completo da conexão com o banco de dados
          </p>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={runTests}
            disabled={isRunning}
            className="bg-library-wood hover:bg-library-bronze text-library-gold font-body"
          >
            <Database className="h-4 w-4 mr-2" />
            {isRunning ? 'Executando Testes...' : 'Executar Testes'}
          </Button>
        </div>

        <Card className="border-library-bronze bg-library-parchment">
          <CardHeader>
            <CardTitle className="font-display text-library-wood flex items-center gap-2">
              <Database className="h-5 w-5 text-library-gold" />
              Resultados dos Testes
            </CardTitle>
            <CardDescription className="font-body text-library-bronze">
              Status de cada componente testado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tests.length === 0 && !isRunning ? (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-library-bronze mx-auto mb-4" />
                <p className="text-library-bronze font-body">
                  Clique em "Executar Testes" para diagnosticar a conexão
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-library-gold/5 border border-library-bronze/20">
                    <div className="mt-0.5">
                      {getStatusIcon(test.status)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-library-wood font-body">
                        {test.name}
                      </h4>
                      <p className="text-sm text-library-bronze font-body mt-1">
                        {test.message}
                      </p>
                      {test.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-library-bronze cursor-pointer font-body">
                            Ver detalhes
                          </summary>
                          <pre className="text-xs bg-library-wood/5 p-2 rounded mt-2 overflow-auto font-mono">
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
                
                {isRunning && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-library-gold"></div>
                    <span className="ml-3 text-library-bronze font-body">
                      Executando testes...
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}