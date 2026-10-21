import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminClient, badRequest, conflict, isValidColor, slugify, unauthorized } from '../helpers'

export const dynamic = 'force-dynamic'

async function artifactCount(statusKey: string): Promise<number> {
  const { count } = await supabase
    .from('artifacts').select('id', { count: 'exact', head: true }).eq('status', statusKey)
  return count ?? 0
}

export async function POST(request: Request) {
  const db = await adminClient()
  if (!db) return unauthorized()

  const { label, color, countsAsDone } = await request.json()
  if (!label?.trim()) return badRequest('El nombre es obligatorio')
  if (!isValidColor(color)) return badRequest('Color inválido')

  const key = slugify(label)
  if (!key) return badRequest('El nombre debe incluir letras o números')

  const { data: last } = await supabase
    .from('statuses').select('sort_order').order('sort_order', { ascending: false }).limit(1)
  const sortOrder = (last?.[0]?.sort_order ?? 0) + 1

  const { error } = await db.from('statuses').insert({
    key,
    label: label.trim(),
    color,
    sort_order: sortOrder,
    counts_as_done: !!countsAsDone,
    is_default: false,
  })
  if (error) {
    if (error.code === '23505') return conflict('Ya existe un estado con esa key')
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, key })
}

export async function PATCH(request: Request) {
  const db = await adminClient()
  if (!db) return unauthorized()

  const { key, label, color, countsAsDone, isDefault } = await request.json()
  if (!key) return badRequest('Falta la key')

  // "Hacer default": primero se libera el default actual (índice único parcial).
  if (isDefault === true) {
    const { error: clearError } = await db.from('statuses').update({ is_default: false }).eq('is_default', true)
    if (clearError) return NextResponse.json({ error: clearError.message }, { status: 500 })
    const { error } = await db.from('statuses').update({ is_default: true }).eq('key', key)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const updates: Record<string, unknown> = {}
  if (label !== undefined) {
    if (!label.trim()) return badRequest('El nombre es obligatorio')
    updates.label = label.trim()
  }
  if (color !== undefined) {
    if (!isValidColor(color)) return badRequest('Color inválido')
    updates.color = color
  }
  if (countsAsDone !== undefined) updates.counts_as_done = !!countsAsDone

  if (Object.keys(updates).length) {
    const { error } = await db.from('statuses').update(updates).eq('key', key)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const db = await adminClient()
  if (!db) return unauthorized()

  const { key, reassignTo } = await request.json()
  if (!key) return badRequest('Falta la key')
  if (reassignTo === key) return badRequest('No puedes reasignar al mismo estado')

  const { data: status } = await supabase.from('statuses').select('key, is_default').eq('key', key).single()
  if (!status) return badRequest('El estado no existe')
  if (status.is_default) return conflict('No puedes borrar el estado por defecto. Marca otro como default primero.')

  const { count: totalStatuses } = await supabase
    .from('statuses').select('key', { count: 'exact', head: true })
  if ((totalStatuses ?? 0) <= 1) return conflict('No puedes borrar el último estado')

  const count = await artifactCount(key)
  if (count > 0) {
    if (!reassignTo) {
      return conflict(`${count} artifact${count !== 1 ? 's' : ''} tienen este estado. Reasígnalos para poder borrarlo.`, { count })
    }
    const { data: target } = await supabase.from('statuses').select('key').eq('key', reassignTo).single()
    if (!target) return badRequest('El estado destino no existe')
    const { error: reassignError } = await supabase
      .from('artifacts')
      .update({ status: reassignTo, updated_at: new Date().toISOString() })
      .eq('status', key)
    if (reassignError) return NextResponse.json({ error: reassignError.message }, { status: 500 })
  }

  const { error } = await db.from('statuses').delete().eq('key', key)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, reassigned: count })
}
