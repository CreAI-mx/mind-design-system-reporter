'use client'

import { cn } from '@/lib/utils'
import { colorClasses } from '@/lib/colors'
import { findStatus, type ArtifactStatus } from '@/lib/types'
import { useTaxonomy } from '@/components/taxonomy-provider'

export function StatusBadge({ status }: { status: ArtifactStatus }) {
  const taxonomy = useTaxonomy()
  const config = findStatus(taxonomy, status)
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', colorClasses(config?.color).badge)}>
      {config?.label ?? status}
    </span>
  )
}
