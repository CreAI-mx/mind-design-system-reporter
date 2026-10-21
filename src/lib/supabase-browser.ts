import { createBrowserClient } from '@supabase/ssr'

// Cliente de Supabase para componentes cliente (login, logout).
// Usa las variables NEXT_PUBLIC_*, que sí llegan al navegador.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
