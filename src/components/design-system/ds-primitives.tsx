import { cn } from '@/lib/utils'

export function SectionHeader({
  title,
  description,
  source,
}: {
  title: string
  description?: string
  source?: string
}) {
  return (
    <div className="border-b border-gray-200 dark:border-night-801 pb-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">{description}</p>
      )}
      {source && (
        <p className="mt-1.5 text-xs font-mono text-gray-400 dark:text-gray-500">{source}</p>
      )}
    </div>
  )
}

export function Token({ name, value, note }: { name: string; value: string; note?: string }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-night-801 last:border-0">
      <code className="text-xs font-mono text-lipu-500 dark:text-lipu-600 shrink-0 w-36">{name}</code>
      <code className="text-xs font-mono text-gray-600 dark:text-gray-300 flex-1">{value}</code>
      {note && <p className="text-xs text-gray-400 flex-1">{note}</p>}
    </div>
  )
}

export function DemoCard({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('rounded-xl border border-gray-200 dark:border-night-801 overflow-hidden', className)}>
      <div className="px-4 py-6 bg-white dark:bg-night-802 flex items-center justify-center min-h-24">
        {children}
      </div>
      <div className="px-4 py-2 bg-gray-50 dark:bg-night-803 border-t border-gray-200 dark:border-night-801">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  )
}

export function InconsistencyBadge({ note }: { note: string }) {
  return (
    <div className="flex gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30">
      <span className="text-yellow-500 text-sm shrink-0">⚠</span>
      <p className="text-xs text-yellow-700 dark:text-yellow-400">{note}</p>
    </div>
  )
}
