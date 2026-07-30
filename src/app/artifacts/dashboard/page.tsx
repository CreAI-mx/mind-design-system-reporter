import Link from 'next/link'
import { readArtifacts } from '@/lib/artifacts'
import { MODULES, MODULE_GROUPS } from '@/lib/modules'
import { STATUS_CONFIG } from '@/lib/types'
import type { ArtifactStatus } from '@/lib/types'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const STATUSES: ArtifactStatus[] = ['borrador', 'en-revision', 'aprobado', 'entregado', 'deprecado']

export default async function DashboardPage() {
  const artifacts = await readArtifacts()
  const total = artifacts.length

  /* ── Global status counts ──────────────────────────────────── */
  const byStatus = STATUSES.reduce<Record<ArtifactStatus, number>>(
    (acc, s) => ({ ...acc, [s]: artifacts.filter((a) => a.status === s).length }),
    {} as Record<ArtifactStatus, number>
  )

  /* ── Per-module stats ──────────────────────────────────────── */
  const moduleStats = MODULES.map((mod) => {
    const modArtifacts = artifacts.filter((a) => a.module === mod.key)
    const counts = STATUSES.reduce<Record<ArtifactStatus, number>>(
      (acc, s) => ({ ...acc, [s]: modArtifacts.filter((a) => a.status === s).length }),
      {} as Record<ArtifactStatus, number>
    )
    const done = counts.aprobado + counts.entregado
    const pct = modArtifacts.length ? Math.round((done / modArtifacts.length) * 100) : 0
    return { mod, total: modArtifacts.length, counts, done, pct }
  }).filter((r) => r.total > 0)

  /* ── Group stats ───────────────────────────────────────────── */
  const groupKeys = Object.keys(MODULE_GROUPS) as (keyof typeof MODULE_GROUPS)[]

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
        {STATUSES.map((s) => {
          const cfg = STATUS_CONFIG[s]
          const count = byStatus[s]
          const pct = total ? Math.round((count / total) * 100) : 0
          return (
            <div key={s} className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-4 space-y-2">
              <span className={cn('inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full', cfg.color)}>
                {cfg.label}
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
      {groupKeys.map((groupKey) => {
        const group = MODULE_GROUPS[groupKey]
        const rows = moduleStats.filter((r) => r.mod.group === groupKey)
        if (rows.length === 0) return null

        const groupTotal = rows.reduce((s, r) => s + r.total, 0)
        const groupDone = rows.reduce((s, r) => s + r.done, 0)
        const groupPct = groupTotal ? Math.round((groupDone / groupTotal) * 100) : 0

        return (
          <section key={groupKey} className="space-y-3">
            {/* Group header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn('text-xs font-semibold uppercase tracking-wider', group.color)}>
                  {group.label}
                </span>
                <span className="text-xs text-gray-400">· {groupTotal} artifacts</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{groupPct}% completado</span>
            </div>

            {/* Module rows */}
            <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-night-801">
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Módulo</th>
                    <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                    {STATUSES.map((s) => (
                      <th key={s} className="text-center px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                        {STATUS_CONFIG[s].label}
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
                      {STATUSES.map((s) => (
                        <td key={s} className="px-3 py-3 text-center hidden sm:table-cell">
                          {counts[s] > 0 ? (
                            <span className={cn('inline-block text-[11px] font-semibold px-1.5 py-0.5 rounded-full', STATUS_CONFIG[s].color)}>
                              {counts[s]}
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
