import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY!

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  // getUser() también refresca la sesión expirada vía cookies.
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.search = ''
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  // Protege todas las páginas. Excluye /login, /auth/*, /api/* (las rutas
  // nuevas de taxonomía verifican sesión por su cuenta), assets de Next
  // y archivos estáticos (favicon, /uploads, svg, etc.).
  matcher: ['/((?!login|auth|api|_next/static|_next/image|.*\\..*).*)'],
}
