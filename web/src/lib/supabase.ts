import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Achado real, 2026-08-09: isto lançava (`throw`) na carga do módulo se
// as env vars estivessem ausentes — e como AuthContext importa este
// arquivo e envolve o app inteiro (App.tsx), isso derrubava o site
// PÚBLICO inteiro pra qualquer visitante, não só quem tentasse acessar
// /admin. A migração pra API própria (Fastify+Drizzle) tirou a
// dependência de Supabase do catálogo, mas deixou o admin/auth ainda
// preso — sem decisão tomada ainda sobre reconstruir ou descartar (ver
// P0 do ROADMAP.md). Até essa decisão, o app não pode travar por causa
// disso: exporta um client desabilitado em vez de lançar erro.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn(
    '[scriptorium] Supabase não configurado — funcionalidades de admin/login ' +
    'desabilitadas. O catálogo público não depende disso.'
  )
}

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'X-Client-Info': 'scriptorium-divinum@1.0.0'
        }
      }
    })
  : null

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: unknown) => {
  console.error('Supabase Error:', error)
  
  if (error && typeof error === 'object' && 'code' in error) {
    if (error.code === 'PGRST301') {
      throw new Error('Recurso não encontrado')
    }
    
    if (error.code === 'PGRST204') {
      throw new Error('Nenhum resultado encontrado')  
    }
  }
  
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    throw new Error(error.message)
  }
  
  throw new Error('Erro inesperado no banco de dados')
}

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('authors').select('count').limit(1)
    if (error) throw error
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}