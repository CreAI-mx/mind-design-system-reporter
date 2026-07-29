import { NextResponse } from 'next/server'
import { readArtifacts, writeArtifacts } from '@/lib/artifacts'
import { readArchive } from '@/lib/archive'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Find the most recent 'deleted' snapshot for this artifact
  const entries = readArchive()
  const snapshot = entries
    .filter((e) => e.action === 'deleted' && e.artifact.id === id)
    .sort((a, b) => b.archivedAt.localeCompare(a.archivedAt))[0]

  if (!snapshot) return NextResponse.json({ error: 'No snapshot found' }, { status: 404 })

  const artifacts = readArtifacts()
  if (artifacts.find((a) => a.id === id))
    return NextResponse.json({ error: 'Artifact already exists' }, { status: 409 })

  const restored = { ...snapshot.artifact, updatedAt: new Date().toISOString() }
  writeArtifacts([...artifacts, restored])

  return NextResponse.json(restored)
}
