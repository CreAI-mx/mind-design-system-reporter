import { NextResponse } from 'next/server'
import { getArtifact, createArtifact } from '@/lib/artifacts'
import { readArchive } from '@/lib/archive'

export const dynamic = 'force-dynamic'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const entries = await readArchive()
  const snapshot = entries
    .filter((e) => e.action === 'deleted' && e.artifact.id === id)
    .sort((a, b) => b.archivedAt.localeCompare(a.archivedAt))[0]

  if (!snapshot) return NextResponse.json({ error: 'No snapshot found' }, { status: 404 })

  const existing = await getArtifact(id)
  if (existing) return NextResponse.json({ error: 'Artifact already exists' }, { status: 409 })

  const restored = { ...snapshot.artifact, updatedAt: new Date().toISOString() }
  const saved = await createArtifact(restored)
  return NextResponse.json(saved)
}
