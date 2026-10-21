import Link from 'next/link'
import { Layers, ArrowRight, Clock, BookOpen } from 'lucide-react'
import { readArtifacts } from '@/lib/artifacts'
import { getSessionUser } from '@/lib/supabase-server'
import { getTaxonomy } from '@/lib/taxonomy'
import { findGroup, findModule } from '@/lib/types'
import { colorClasses } from '@/lib/colors'
import { StatusBadge } from '@/components/artifacts/status-badge'
import { BusAnimation } from '@/components/dashboard/bus-animation'
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
  const [artifacts, taxonomy, user] = await Promise.all([readArtifacts(), getTaxonomy(), getSessionUser()])
  const total = artifacts.length
  const enRevision = artifacts.filter(a => a.status === 'en-revision').length
  const aprobados = artifacts.filter(a => a.status === 'aprobado').length
  const recent = artifacts.slice(0, 10)

  const heroStats = [
    total > 0 && `${total} artifact${total !== 1 ? 's' : ''}`,
    enRevision > 0 && `${enRevision} en revisión`,
    aprobados > 0 && `${aprobados} aprobado${aprobados !== 1 ? 's' : ''}`,
  ].filter(Boolean).join(' · ')

  return (
    <div className="max-w-2xl mx-auto px-6">

      {/* Hero */}
      <div className="pt-16 pb-10 space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1]">
            Design System<br />Reporter
          </h1>
          {heroStats && (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {heroStats}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/artifacts"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium transition-colors"
          >
            <Layers className="w-4 h-4" />
            Ver artifacts
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/design-system"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-night-801 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801 text-sm font-medium transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Design System
          </Link>
        </div>

        <BusAnimation />
      </div>

      {/* Activity feed */}
      {recent.length > 0 && (
        <div className="border-t border-gray-100 dark:border-night-801 pt-8 pb-16 space-y-1">
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Actividad reciente
            </h2>
            {artifacts.length > 10 && (
              <Link
                href="/artifacts"
                className="text-xs text-lipu-500 hover:text-lipu-600 font-medium transition-colors"
              >
                Ver todos →
              </Link>
            )}
          </div>

          <div className="divide-y divide-gray-100 dark:divide-night-801">
            {recent.map(artifact => {
              const mod = findModule(taxonomy, artifact.module)
              const group = findGroup(taxonomy, mod?.groupKey)
              return (
                <Link
                  key={artifact.id}
                  href={`/artifacts/${artifact.id}`}
                  className="flex items-center gap-4 py-3.5 -mx-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-night-801/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-lipu-600 dark:group-hover:text-lipu-400 transition-colors">
                      {artifact.name || 'Sin nombre'}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                      {group && (
                        <span className={cn('font-medium', colorClasses(group.color).text)}>{group.label} · </span>
                      )}
                      {mod?.label ?? artifact.module} · v{artifact.version}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={artifact.status} />
                    <span className="text-[11px] text-gray-400 tabular-nums w-11 text-right">
                      {timeAgo(artifact.updatedAt)}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

          {artifacts.length > 10 && (
            <div className="pt-4">
              <Link
                href="/artifacts"
                className="inline-flex items-center gap-1.5 text-xs text-lipu-500 hover:text-lipu-600 font-medium transition-colors"
              >
                Ver todos los {artifacts.length} artifacts
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}

      {total === 0 && (
        <div className="py-20 text-center space-y-4">
          <p className="text-sm text-gray-400">No hay artifacts todavía.</p>
          {user && (
            <Link
              href="/artifacts/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium transition-colors"
            >
              Crear primer artifact
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
