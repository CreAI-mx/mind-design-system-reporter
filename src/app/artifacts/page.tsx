import { Suspense } from 'react'
import { ArtifactList } from '@/components/artifacts/artifact-list'

export const metadata = { title: 'Artifacts — LIPU Mind DS Reporter' }

export default function ArtifactsPage() {
  // Suspense requerido por useSearchParams en ArtifactList.
  return (
    <Suspense>
      <ArtifactList />
    </Suspense>
  )
}
