import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { readTags, ensureTags } from '@/lib/tags'
import { requireAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const tags = await readTags()
  return NextResponse.json(tags)
}

export async function POST(request: Request) {
  const { names } = await request.json()
  await ensureTags(names as string[])
  return NextResponse.json({ ok: true })
}

/** Reemplaza (o quita, si newTag es null) una etiqueta en todos los artifacts. */
async function replaceTagInArtifacts(oldTag: string, newTag: string | null): Promise<number> {
  const { data, error } = await supabase
    .from('artifacts')
    .select('id, tags')
    .contains('tags', [oldTag])
  if (error) throw new Error(error.message)

  const now = new Date().toISOString()
  await Promise.all(
    (data ?? []).map((row) => {
      const tags = (row.tags as string[]).filter((t) => t !== oldTag)
      if (newTag && !tags.includes(newTag)) tags.push(newTag)
      return supabase.from('artifacts').update({ tags, updated_at: now }).eq('id', row.id)
    })
  )
  return data?.length ?? 0
}

// Renombrar (fusiona si el nuevo nombre ya existe).
export async function PATCH(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Se requiere sesión de admin' }, { status: 401 })

  const { name, newName } = await request.json()
  const normalized = (newName ?? '').trim().toLowerCase()
  if (!name || !normalized) return NextResponse.json({ error: 'Faltan name y newName' }, { status: 400 })
  if (normalized === name) return NextResponse.json({ ok: true, updated: 0 })

  try {
    const updated = await replaceTagInArtifacts(name, normalized)
    await ensureTags([normalized])
    await supabase.from('tags').delete().eq('name', name)
    return NextResponse.json({ ok: true, updated })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Se requiere sesión de admin' }, { status: 401 })

  const { name } = await request.json()
  if (!name) return NextResponse.json({ error: 'Falta name' }, { status: 400 })

  try {
    const updated = await replaceTagInArtifacts(name, null)
    await supabase.from('tags').delete().eq('name', name)
    return NextResponse.json({ ok: true, updated })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
