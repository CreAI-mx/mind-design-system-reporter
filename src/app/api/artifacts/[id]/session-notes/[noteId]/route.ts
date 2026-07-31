import { NextRequest, NextResponse } from 'next/server'
import { deleteSessionNote } from '@/lib/session-notes'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  const { noteId } = await params
  const token = req.headers.get('x-session-token') ?? ''
  const deleted = await deleteSessionNote(noteId, token)
  if (!deleted) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  return new NextResponse(null, { status: 204 })
}
