import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminDebug() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, success: boolean, data?: any, error?: any) => {
    setResults(prev => [...prev, { 
      test, 
      success, 
      data: data || null, 
      error: error || null, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    setResults([]);
    
    // Test 1: Basic connection
    try {
      const { data, error } = await supabase.from('authors').select('count').limit(1);
      addResult('Conexão Supabase', !error, data, error);
    } catch (err) {
      addResult('Conexão Supabase', false, null, err);
    }

    // Test 2: Auth status
    try {
      const { data: { user } } = await supabase.auth.getUser();
      addResult('Usuário Atual', true, user, null);
    } catch (err) {
      addResult('Usuário Atual', false, null, err);
    }

    // Test 3: Profiles table
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      addResult('Tabela Profiles', !error, data, error);
    } catch (err) {
      addResult('Tabela Profiles', false, null, err);
    }

    // Test 4: is_admin function
    try {
      const { data, error } = await supabase.rpc('is_admin');
      addResult('Função is_admin', !error, data, error);
    } catch (err) {
      addResult('Função is_admin', false, null, err);
    }

    setLoading(false);
  };

  const testSignUp = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'rilsonjoas10@gmail.com',
        password: 'test123456'
      });
      addResult('Sign Up Test', !error, data, error);
    } catch (err) {
      addResult('Sign Up Test', false, null, err);
    }

    setLoading(false);
  };

  const testSignIn = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'rilsonjoas10@gmail.com',
        password: 'test123456'
      });
      addResult('Sign In Test', !error, data, error);
      
      // If login successful, check profile
      if (!error && data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        addResult('Profile Check', !profileError, profile, profileError);
      }
    } catch (err) {
      addResult('Sign In Test', false, null, err);
    }

    setLoading(false);
  };

  const resetPassword = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        'rilsonjoas10@gmail.com',
        {
          redirectTo: `${window.location.origin}/admin/login`
        }
      );
      addResult('Reset Password', !error, data, error);
    } catch (err) {
      addResult('Reset Password', false, null, err);
    }

    setLoading(false);
  };

  const deleteUser = async () => {
    setLoading(true);
    
    try {
      // First sign in as the user to delete
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'rilsonjoas10@gmail.com',
        password: 'test123456'
      });

      if (signInError) {
        addResult('Delete User (Sign In First)', false, null, signInError);
        setLoading(false);
        return;
      }

      // Then delete the user
      const { error: deleteError } = await supabase.auth.admin.deleteUser(signInData.user.id);
      addResult('Delete User', !deleteError, null, deleteError);
      
    } catch (err) {
      addResult('Delete User', false, null, err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-library-parchment p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Debug Admin System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={testSupabaseConnection} disabled={loading}>
                Testar Conexão
              </Button>
              <Button onClick={testSignUp} disabled={loading} variant="outline">
                Sign Up
              </Button>
              <Button onClick={testSignIn} disabled={loading} variant="secondary">
                Sign In
              </Button>
              <Button onClick={resetPassword} disabled={loading} variant="destructive">
                Reset Senha
              </Button>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h4 className="font-semibold text-yellow-800 mb-2">Como resolver:</h4>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. Clique em "Reset Senha" para enviar email de recuperação</li>
                <li>2. Ou vá no painel do Supabase → Authentication → Users</li>
                <li>3. Encontre o usuário rilsonjoas10@gmail.com e delete</li>
                <li>4. Depois crie uma nova conta com senha conhecida</li>
              </ol>
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
                          <div className="text-sm text-red-600 bg-red-100 p-2 rounded">
                            <strong>Erro:</strong> {JSON.stringify(result.error, null, 2)}
                          </div>
                        )}
                        {result.data && (
                          <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                            <strong>Dados:</strong> {JSON.stringify(result.data, null, 2)}
                          </div>
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