import { NextResponse } from 'next/server'
import { readArtifacts, writeArtifacts } from '@/lib/artifacts'
import { addArchiveEntry } from '@/lib/archive'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const artifacts = readArtifacts()
  const artifact = artifacts.find((a) => a.id === id)
  if (!artifact) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(artifact)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const artifacts = readArtifacts()
  const index = artifacts.findIndex((a) => a.id === id)
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  artifacts[index] = {
    ...artifacts[index],
    ...body,
    id,
    updatedAt: new Date().toISOString(),
  }

  writeArtifacts(artifacts)
  addArchiveEntry(artifacts[index], 'updated')
  return NextResponse.json(artifacts[index])
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const artifacts = readArtifacts()
  const artifact = artifacts.find((a) => a.id === id)
  if (!artifact) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  writeArtifacts(artifacts.filter((a) => a.id !== id))
  addArchiveEntry(artifact, 'deleted')
  return NextResponse.json({ ok: true })
}
