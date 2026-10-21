import { NextResponse } from 'next/server'
import { createSessionClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const supabase = await createSessionClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/login', request.url), { status: 303 })
}
