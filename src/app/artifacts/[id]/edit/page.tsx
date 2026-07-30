import { notFound } from 'next/navigation'
import { getArtifact } from '@/lib/artifacts'
import { ArtifactForm } from '@/components/artifacts/artifact-form'

export const dynamic = 'force-dynamic'

export default async function EditArtifactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const artifact = await getArtifact(id)
  if (!artifact) notFound()
  return <ArtifactForm mode="edit" initial={artifact} />
}
