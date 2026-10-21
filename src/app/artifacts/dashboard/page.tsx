import Link from 'next/link'
import { readArtifacts } from '@/lib/artifacts'
import { getTaxonomy } from '@/lib/taxonomy'
import { colorClasses } from '@/lib/colors'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [artifacts, taxonomy] = await Promise.all([readArtifacts(), getTaxonomy()])
  const total = artifacts.length
  const statuses = taxonomy.statuses
  const doneKeys = new Set(statuses.filter((s) => s.countsAsDone).map((s) => s.key))

  /* ── Global status counts ──────────────────────────────────── */
  const byStatus = statuses.reduce<Record<string, number>>(
    (acc, s) => ({ ...acc, [s.key]: artifacts.filter((a) => a.status === s.key).length }),
    {}
  )

  /* ── Per-module stats ──────────────────────────────────────── */
  const moduleStats = taxonomy.modules.map((mod) => {
    const modArtifacts = artifacts.filter((a) => a.module === mod.key)
    const counts = statuses.reduce<Record<string, number>>(
      (acc, s) => ({ ...acc, [s.key]: modArtifacts.filter((a) => a.status === s.key).length }),
      {}
    )
    const done = modArtifacts.filter((a) => doneKeys.has(a.status)).length
    const pct = modArtifacts.length ? Math.round((done / modArtifacts.length) * 100) : 0
    return { mod, total: modArtifacts.length, counts, done, pct }
  }).filter((r) => r.total > 0)

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/artifacts"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a Artifacts
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-lipu-600/15 flex items-center justify-center">
            <BarChart3 className="w-4.5 h-4.5 text-lipu-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Progreso de Artifacts</h1>
            <p className="text-xs text-gray-400">{total} artifact{total !== 1 ? 's' : ''} en total</p>
          </div>
        </div>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statuses.map((s) => {
          const count = byStatus[s.key]
          const pct = total ? Math.round((count / total) * 100) : 0
          return (
            <div key={s.key} className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-4 space-y-2">
              <span className={cn('inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full', colorClasses(s.color).badge)}>
                {s.label}
              </span>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <div className="h-1.5 rounded-full bg-gray-100 dark:bg-night-801 overflow-hidden">
                <div
                  className="h-full rounded-full bg-lipu-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400">{pct}% del total</p>
            </div>
          )
        })}
      </div>

      {/* Per-group progress */}
      {taxonomy.groups.map((group) => {
        const rows = moduleStats.filter((r) => r.mod.groupKey === group.key)
        if (rows.length === 0) return null

        const groupTotal = rows.reduce((s, r) => s + r.total, 0)
        const groupDone = rows.reduce((s, r) => s + r.done, 0)
        const groupPct = groupTotal ? Math.round((groupDone / groupTotal) * 100) : 0

        return (
          <section key={group.key} className="space-y-3">
            {/* Group header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn('text-xs font-semibold uppercase tracking-wider', colorClasses(group.color).text)}>
                  {group.label}
                </span>
                <span className="text-xs text-gray-400">· {groupTotal} artifacts</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{groupPct}% completado</span>
            </div>

            {/* Module rows */}
            <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-night-801">
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Módulo</th>
                    <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                    {statuses.map((s) => (
                      <th key={s.key} className="text-center px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                        {s.label}
                      </th>
                    ))}
                    <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-40">Progreso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-night-801">
                  {rows.map(({ mod, total: modTotal, counts, pct }) => (
                    <tr key={mod.key} className="hover:bg-gray-50 dark:hover:bg-night-801/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{mod.label}</p>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{modTotal}</span>
                      </td>
                      {statuses.map((s) => (
                        <td key={s.key} className="px-3 py-3 text-center hidden sm:table-cell">
                          {counts[s.key] > 0 ? (
                            <span className={cn('inline-block text-[11px] font-semibold px-1.5 py-0.5 rounded-full', colorClasses(s.color).badge)}>
                              {counts[s.key]}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-night-801 overflow-hidden min-w-16">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                pct >= 80 ? 'bg-green-500' : pct >= 40 ? 'bg-lipu-500' : 'bg-gray-300 dark:bg-gray-600'
                              )}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right shrink-0">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}

      {moduleStats.length === 0 && (
        <div className="text-center py-16 text-sm text-gray-400">
          No hay artifacts todavía.{' '}
          <Link href="/artifacts/new" className="text-lipu-500 hover:text-lipu-600 font-medium">
            Crear el primero
          </Link>
        </div>
      )}
    </div>
  )
}
