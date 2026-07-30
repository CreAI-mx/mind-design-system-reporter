import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { readArtifacts, createArtifact } from '@/lib/artifacts'
import { addArchiveEntry } from '@/lib/archive'
import type { Artifact } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const artifacts = await readArtifacts()
  return NextResponse.json(artifacts)
}

export async function POST(request: Request) {
  const body = await request.json()
  const now = new Date().toISOString()

  const artifact: Artifact = {
    id: uuidv4(),
    name: body.name ?? '',
    module: body.module ?? '',
    version: body.version ?? '1.0',
    versionNote: body.versionNote ?? '',
    status: body.status ?? 'borrador',
    description: body.description ?? '',
    tags: body.tags ?? [],
    links: body.links ?? [],
    code: body.code ?? '',
    codeUrl: body.codeUrl ?? '',
    imageUrls: body.imageUrls ?? [],
    date: body.date ?? now.split('T')[0],
    createdAt: now,
    updatedAt: now,
  }

  const saved = await createArtifact(artifact)
  await addArchiveEntry(saved, 'created')
  return NextResponse.json(saved, { status: 201 })
}
