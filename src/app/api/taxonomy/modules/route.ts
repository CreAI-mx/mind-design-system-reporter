import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminClient, badRequest, conflict, slugify, unauthorized } from '../helpers'

export const dynamic = 'force-dynamic'

async function artifactCount(moduleKey: string): Promise<number> {
  const { count } = await supabase
    .from('artifacts').select('id', { count: 'exact', head: true }).eq('module', moduleKey)
  return count ?? 0
}

export async function POST(request: Request) {
  const db = await adminClient()
  if (!db) return unauthorized()

  const { groupKey, label, description } = await request.json()
  if (!label?.trim()) return badRequest('El nombre es obligatorio')
  if (!groupKey) return badRequest('Falta el grupo')

  const slug = slugify(label)
  if (!slug) return badRequest('El nombre debe incluir letras o números')
  const key = `${groupKey}/${slug}`

  const { data: last } = await supabase
    .from('modules').select('sort_order').order('sort_order', { ascending: false }).limit(1)
  const sortOrder = (last?.[0]?.sort_order ?? 0) + 1

  const { error } = await db.from('modules').insert({
    key,
    group_key: groupKey,
    label: label.trim(),
    description: (description ?? '').trim(),
    sort_order: sortOrder,
  })
  if (error) {
    if (error.code === '23505') return conflict('Ya existe un módulo con esa key')
    if (error.code === '23503') return badRequest('El grupo no existe')
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, key })
}

export async function PATCH(request: Request) {
  const db = await adminClient()
  if (!db) return unauthorized()

  const { key, label, description, groupKey } = await request.json()
  if (!key) return badRequest('Falta la key')

  const updates: Record<string, unknown> = {}
  if (label !== undefined) {
    if (!label.trim()) return badRequest('El nombre es obligatorio')
    updates.label = label.trim()
  }
  if (description !== undefined) updates.description = description.trim()
  // La key es inmutable: mover de grupo solo cambia group_key.
  if (groupKey !== undefined) updates.group_key = groupKey
  if (!Object.keys(updates).length) return badRequest('Nada que actualizar')

  const { error } = await db.from('modules').update(updates).eq('key', key)
  if (error) {
    if (error.code === '23503') return badRequest('El grupo no existe')
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const db = await adminClient()
  if (!db) return unauthorized()

  const { key, reassignTo } = await request.json()
  if (!key) return badRequest('Falta la key')
  if (reassignTo === key) return badRequest('No puedes reasignar al mismo módulo')

  const count = await artifactCount(key)
  if (count > 0) {
    if (!reassignTo) {
      return conflict(`${count} artifact${count !== 1 ? 's' : ''} usan este módulo. Reasígnalos para poder borrarlo.`, { count })
    }
    const { data: target } = await supabase.from('modules').select('key').eq('key', reassignTo).single()
    if (!target) return badRequest('El módulo destino no existe')
    const { error: reassignError } = await supabase
      .from('artifacts')
      .update({ module: reassignTo, updated_at: new Date().toISOString() })
      .eq('module', key)
    if (reassignError) return NextResponse.json({ error: reassignError.message }, { status: 500 })
  }

  const { error } = await db.from('modules').delete().eq('key', key)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, reassigned: count })
}
