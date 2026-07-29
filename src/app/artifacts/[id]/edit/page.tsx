import { notFound } from 'next/navigation'
import { readArtifacts } from '@/lib/artifacts'
import { ArtifactForm } from '@/components/artifacts/artifact-form'

export const dynamic = 'force-dynamic'

export default async function EditArtifactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const artifacts = readArtifacts()
  const artifact = artifacts.find((a) => a.id === id)
  if (!artifact) notFound()
  return <ArtifactForm mode="edit" initial={artifact} />
}
