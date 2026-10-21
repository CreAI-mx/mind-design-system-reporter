import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY!

// Cliente de Supabase ligado a la sesión del usuario (cookies).
// Las escrituras hechas con este cliente pasan por RLS con el JWT del usuario.
export async function createSessionClient() {
  const cookieStore = await cookies()
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Llamado desde un Server Component: el middleware refresca la sesión.
        }
      },
    },
  })
}

export async function getSessionUser(): Promise<User | null> {
  const supabase = await createSessionClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

export function isAdmin(user: User | null): boolean {
  return (user?.app_metadata as Record<string, unknown> | undefined)?.role === 'admin'
}

// Guard para rutas API de escritura de artifacts: exige cualquier sesión.
// Devuelve el usuario o null.
export async function requireSession(): Promise<User | null> {
  return getSessionUser()
}

// Guard para rutas API de escritura: exige sesión con rol admin.
// Devuelve el cliente con sesión (RLS respalda la verificación) o null.
export async function requireAdmin() {
  const supabase = await createSessionClient()
  const { data } = await supabase.auth.getUser()
  if (!isAdmin(data.user)) return null
  return supabase
}
