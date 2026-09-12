import Link from 'next/link'
import { BookOpen, Layers, ArrowRight, Sparkles, Clock, BarChart3 } from 'lucide-react'
import { readArtifacts } from '@/lib/artifacts'
import { getModule, MODULE_GROUPS } from '@/lib/modules'
import { STATUS_CONFIG } from '@/lib/types'
import { StatusBadge } from '@/components/artifacts/status-badge'
import { cn } from '@/lib/utils'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `hace ${days}d`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `hace ${weeks}sem`
  return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

export default async function HomePage() {
  const artifacts = await readArtifacts()

  const total = artifacts.length

  const byStatus = (Object.keys(STATUS_CONFIG) as Array<keyof typeof STATUS_CONFIG>).map(s => ({
    key: s,
    label: STATUS_CONFIG[s].label,
    color: STATUS_CONFIG[s].color,
    count: artifacts.filter(a => a.status === s).length,
  }))

  const groups = [
    { key: 'management',    ...MODULE_GROUPS.management,    count: artifacts.filter(a => getModule(a.module)?.group === 'management').length },
    { key: 'operations',    ...MODULE_GROUPS.operations,    count: artifacts.filter(a => getModule(a.module)?.group === 'operations').length },
    { key: 'administration',...MODULE_GROUPS.administration, count: artifacts.filter(a => getModule(a.module)?.group === 'administration').length },
  ]

  const recent = artifacts.slice(0, 8)

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">

      {/* Hero */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lipu-500/30 bg-lipu-500/5">
          <Sparkles className="w-3 h-3 text-lipu-500" />
          <span className="text-[11px] font-medium text-lipu-500 uppercase tracking-wider">LIPU Mind</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white leading-snug">
          Design System Reporter
        </h1>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/design-system"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Design System
          </Link>
          <Link
            href="/artifacts"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 text-sm font-medium transition-colors"
          >
            <Layers className="w-4 h-4" />
            Ver todos los artifacts
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <SectionTitle icon={<BarChart3 className="w-3.5 h-3.5" />}>Resumen</SectionTitle>

        {/* Total + status breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5 px-4 py-3 rounded-xl border border-lipu-500/30 bg-lipu-500/5 dark:bg-lipu-500/5 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-lipu-500">Total artifacts</span>
            <span className="text-3xl font-bold text-lipu-600 dark:text-lipu-400">{total}</span>
          </div>
          {byStatus.map(s => (
            <div key={s.key} className="flex flex-col gap-1.5 px-4 py-3 rounded-xl border border-gray-200 dark:border-night-801 bg-white dark:bg-night-802">
              <span className={cn('text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded self-start', s.color)}>
                {s.label}
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{s.count}</span>
            </div>
          ))}
        </div>

        {/* Groups */}
        <div className="grid grid-cols-3 gap-3">
          {groups.map(g => (
            <div key={g.key} className="flex flex-col gap-1.5 px-4 py-3 rounded-xl border border-gray-200 dark:border-night-801 bg-white dark:bg-night-802">
              <span className={cn('text-[10px] font-semibold uppercase tracking-wider', g.color)}>{g.label}</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{g.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      {recent.length > 0 && (
        <div className="space-y-3">
          <SectionTitle icon={<Clock className="w-3.5 h-3.5" />}>Actividad reciente</SectionTitle>

          <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 divide-y divide-gray-100 dark:divide-night-801 overflow-hidden">
            {recent.map(artifact => {
              const mod = getModule(artifact.module)
              const group = mod?.group ? MODULE_GROUPS[mod.group] : null
              return (
                <Link
                  key={artifact.id}
                  href={`/artifacts/${artifact.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-lipu-600 dark:group-hover:text-lipu-400 transition-colors">
                      {artifact.name || 'Sin nombre'}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                      {group && <span className={cn('font-medium', group.color)}>{group.label} · </span>}
                      {mod?.label ?? artifact.module} · v{artifact.version}
                    </p>
                  </div>
                  <StatusBadge status={artifact.status} />
                  <span className="text-[11px] text-gray-400 shrink-0 tabular-nums">
                    {timeAgo(artifact.updatedAt)}
                  </span>
                </Link>
              )
            })}
          </div>

          {artifacts.length > 8 && (
            <Link
              href="/artifacts"
              className="inline-flex items-center gap-1.5 text-xs text-lipu-500 hover:text-lipu-600 font-medium transition-colors"
            >
              Ver todos los {artifacts.length} artifacts
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}

      {/* Empty state */}
      {total === 0 && (
        <div className="text-center py-10 space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">No hay artifacts todavía.</p>
          <Link
            href="/artifacts/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium transition-colors"
          >
            Crear primer artifact
          </Link>
        </div>
      )}

      <p className="text-[11px] text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-night-801 pt-6">
        Sistema de referencia interno — LIPU Mind Design Team
      </p>
    </div>
  )
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {icon}
      {children}
    </h2>
  )
}
