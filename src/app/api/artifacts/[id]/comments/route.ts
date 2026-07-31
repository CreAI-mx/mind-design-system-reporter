import { NextResponse } from 'next/server'
import { getComments, createComment } from '@/lib/comments'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const comments = await getComments(id)
  return NextResponse.json(comments)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { body, author, token } = await request.json()
  if (!body?.trim()) return NextResponse.json({ error: 'Body requerido' }, { status: 400 })
  if (!token) return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
  const comment = await createComment(id, body, author ?? 'Anónimo', token)
  return NextResponse.json(comment, { status: 201 })
}
