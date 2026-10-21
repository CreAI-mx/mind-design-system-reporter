import { NextResponse } from 'next/server'
import { adminClient, badRequest, unauthorized } from '../helpers'

export const dynamic = 'force-dynamic'

const TABLES: Record<string, string> = {
  groups: 'module_groups',
  modules: 'modules',
  statuses: 'statuses',
}

export async function PUT(request: Request) {
  const db = await adminClient()
  if (!db) return unauthorized()

  const { kind, keys } = await request.json() as { kind: string; keys: string[] }
  const table = TABLES[kind]
  if (!table) return badRequest('kind inválido')
  if (!Array.isArray(keys) || !keys.length) return badRequest('Faltan las keys')

  const results = await Promise.all(
    keys.map((key, i) => db.from(table).update({ sort_order: i + 1 }).eq('key', key))
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
