import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { readArtifacts, writeArtifacts } from '@/lib/artifacts'
import { addArchiveEntry } from '@/lib/archive'
import type { Artifact } from '@/lib/types'

export async function GET() {
  const artifacts = readArtifacts()
  return NextResponse.json(artifacts)
}

export async function POST(request: Request) {
  const body = await request.json()
  const artifacts = readArtifacts()
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

  artifacts.push(artifact)
  writeArtifacts(artifacts)
  addArchiveEntry(artifact, 'created')
  return NextResponse.json(artifact, { status: 201 })
}
