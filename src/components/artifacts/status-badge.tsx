import { cn } from '@/lib/utils'
import { STATUS_CONFIG, type ArtifactStatus } from '@/lib/types'

export function StatusBadge({ status }: { status: ArtifactStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', config.color)}>
      {config.label}
    </span>
  )
}
