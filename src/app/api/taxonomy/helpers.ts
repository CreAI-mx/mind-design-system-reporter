import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase-server'
import { COLOR_TOKENS } from '@/lib/colors'

/** Slug para keys nuevas: minúsculas, sin acentos, guiones. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function isValidColor(color: unknown): color is string {
  return typeof color === 'string' && color in COLOR_TOKENS
}

export const unauthorized = () =>
  NextResponse.json({ error: 'Se requiere sesión de admin' }, { status: 401 })

export const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 })

export const conflict = (error: string, extra?: Record<string, unknown>) =>
  NextResponse.json({ error, ...extra }, { status: 409 })

/** Cliente con la sesión del admin, o null (la RLS respalda el guard). */
export async function adminClient() {
  return requireAdmin()
}
