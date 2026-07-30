import { NextResponse } from 'next/server'
import { getArtifact, updateArtifact, deleteArtifact } from '@/lib/artifacts'
import { addArchiveEntry } from '@/lib/archive'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const artifact = await getArtifact(id)
  if (!artifact) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(artifact)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  const existing = await getArtifact(id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await updateArtifact(id, body)
  await addArchiveEntry(updated, 'updated')
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const artifact = await getArtifact(id)
  if (!artifact) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await addArchiveEntry(artifact, 'deleted')
  await deleteArtifact(id)
  return NextResponse.json({ ok: true })
}
