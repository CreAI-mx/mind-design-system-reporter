import { NextRequest, NextResponse } from 'next/server'
import { getSessionNotes, createSessionNote } from '@/lib/session-notes'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const notes = await getSessionNotes(id)
  return NextResponse.json(notes)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { sessionName, sessionDate, notes } = body

  if (!sessionName?.trim() || !sessionDate || !notes?.trim()) {
    return NextResponse.json({ error: 'sessionName, sessionDate y notes son requeridos' }, { status: 400 })
  }

  const note = await createSessionNote(id, { sessionName: sessionName.trim(), sessionDate, notes: notes.trim() })
  return NextResponse.json(note, { status: 201 })
}
