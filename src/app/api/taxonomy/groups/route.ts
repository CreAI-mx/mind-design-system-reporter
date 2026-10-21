import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminClient, badRequest, conflict, isValidColor, slugify, unauthorized } from '../helpers'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const db = await adminClient()
  if (!db) return unauthorized()

  const { label, color } = await request.json()
  if (!label?.trim()) return badRequest('El nombre es obligatorio')
  if (!isValidColor(color)) return badRequest('Color inválido')

  const key = slugify(label)
  if (!key) return badRequest('El nombre debe incluir letras o números')

  const { data: last } = await supabase
    .from('module_groups').select('sort_order').order('sort_order', { ascending: false }).limit(1)
  const sortOrder = (last?.[0]?.sort_order ?? 0) + 1

  const { error } = await db
    .from('module_groups')
    .insert({ key, label: label.trim(), color, sort_order: sortOrder })
  if (error) {
    if (error.code === '23505') return conflict('Ya existe un grupo con esa key')
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, key })
}

export async function PATCH(request: Request) {
  const db = await adminClient()
  if (!db) return unauthorized()

  const { key, label, color } = await request.json()
  if (!key) return badRequest('Falta la key')

  const updates: Record<string, unknown> = {}
  if (label !== undefined) {
    if (!label.trim()) return badRequest('El nombre es obligatorio')
    updates.label = label.trim()
  }
  if (color !== undefined) {
    if (!isValidColor(color)) return badRequest('Color inválido')
    updates.color = color
  }
  if (!Object.keys(updates).length) return badRequest('Nada que actualizar')

  const { error } = await db.from('module_groups').update(updates).eq('key', key)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const db = await adminClient()
  if (!db) return unauthorized()

  const { key } = await request.json()
  if (!key) return badRequest('Falta la key')

  const { count } = await supabase
    .from('modules').select('key', { count: 'exact', head: true }).eq('group_key', key)
  if (count && count > 0) {
    return conflict(`El grupo tiene ${count} módulo${count !== 1 ? 's' : ''}. Muévelos a otro grupo primero.`, { count })
  }

  const { error } = await db.from('module_groups').delete().eq('key', key)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
