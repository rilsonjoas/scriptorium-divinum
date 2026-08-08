import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
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