import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ensureTags } from '@/lib/tags'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { ids, operation, value } = await request.json() as {
    ids: string[]
    operation: 'status' | 'addTag'
    value: string
  }

  if (!ids?.length || !operation || !value) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const now = new Date().toISOString()

  if (operation === 'status') {
    const { error } = await supabase
      .from('artifacts')
      .update({ status: value, updated_at: now })
      .in('id', ids)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (operation === 'addTag') {
    const { data, error } = await supabase
      .from('artifacts')
      .select('id, tags')
      .in('id', ids)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const toUpdate = (data ?? []).filter((row) => !(row.tags ?? []).includes(value))
    await Promise.all(
      toUpdate.map((row) =>
        supabase
          .from('artifacts')
          .update({ tags: [...(row.tags ?? []), value], updated_at: now })
          .eq('id', row.id)
      )
    )
    await ensureTags([value])
  }

  return NextResponse.json({ ok: true })
}
