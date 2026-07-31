import { NextRequest, NextResponse } from 'next/server'
import { deleteSessionNote } from '@/lib/session-notes'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  const { noteId } = await params
  await deleteSessionNote(noteId)
  return new NextResponse(null, { status: 204 })
}
