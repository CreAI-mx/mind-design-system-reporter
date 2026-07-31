import { notFound, redirect } from 'next/navigation'
import { getArtifact } from '@/lib/artifacts'
import { CompareView } from '@/components/artifacts/compare-view'

export const dynamic = 'force-dynamic'

export default async function ArtifactComparePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const artifact = await getArtifact(id)
  if (!artifact) notFound()
  if (!artifact.parentId) redirect(`/artifacts/${id}`)

  const parent = await getArtifact(artifact.parentId)
  if (!parent) notFound()

  return <CompareView artifact={artifact} parent={parent} />
}
