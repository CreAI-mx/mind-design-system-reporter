import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createSessionClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// Destino del magic link. Soporta los dos formatos de Supabase:
// `?code=...` (flujo PKCE, template por defecto) y `?token_hash=...&type=...`
// (template personalizado con /auth/confirm).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  const supabase = await createSessionClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}/`)
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) return NextResponse.redirect(`${origin}/`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
