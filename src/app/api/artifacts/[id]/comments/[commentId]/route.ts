import { NextResponse } from 'next/server'
import { deleteComment } from '@/lib/comments'

export const dynamic = 'force-dynamic'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; commentId: string }> }) {
  const { commentId } = await params
  const token = request.headers.get('x-comment-token') ?? ''
  try {
    await deleteComment(commentId, token)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
}
