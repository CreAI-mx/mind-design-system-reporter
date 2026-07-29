import Link from 'next/link'
import { readArtifacts } from '@/lib/artifacts'
import { readArchive } from '@/lib/archive'
import type { ArchiveEntry } from '@/lib/archive'
import { MODULES, MODULE_GROUPS } from '@/lib/modules'
import { STATUS_CONFIG } from '@/lib/types'
import { ArtifactRestoreButton } from '@/components/artifacts/artifact-restore-button'
import { ArrowLeft, Archive, Clock, Pencil, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const ACTION_CONFIG = {
  created: { label: 'Creado', icon: Plus, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
  updated: { label: 'Editado', icon: Pencil, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
  deleted: { label: 'Eliminado', icon: Trash2, color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' },
}

export default function ArchivePage() {
  const currentArtifacts = readArtifacts()
  const currentIds = new Set(currentArtifacts.map((a) => a.id))
  const entries = readArchive()

  /* ── Deleted & recoverable: latest deletion per ID not in current ── */
  const deletedMap = entries
    .filter((e) => e.action === 'deleted' && !currentIds.has(e.artifact.id))
    .reduce<Record<string, ArchiveEntry>>((acc, e) => {
      if (!acc[e.artifact.id] || e.archivedAt > acc[e.artifact.id].archivedAt) acc[e.artifact.id] = e
      return acc
    }, {})

  const recoverable = Object.values(deletedMap).sort((a, b) =>
    b.archivedAt.localeCompare(a.archivedAt)
  )

  /* ── Full changelog (newest first, cap at 100) ── */
  const changelog = [...entries]
    .sort((a, b) => b.archivedAt.localeCompare(a.archivedAt))
    .slice(0, 100)

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
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
          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-night-801 flex items-center justify-center">
            <Archive className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Archivo de Artifacts</h1>
            <p className="text-xs text-gray-400">{entries.length} entradas · {recoverable.length} artifact{recoverable.length !== 1 ? 's' : ''} eliminado{recoverable.length !== 1 ? 's' : ''} recuperable{recoverable.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Recoverable section */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Eliminados — recuperables
        </h2>

        {recoverable.length === 0 ? (
          <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-8 text-center">
            <p className="text-sm text-gray-400">No hay artifacts eliminados.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recoverable.map(({ artifact, archivedAt }) => {
              const mod = MODULES.find((m) => m.key === artifact.module)
              const group = mod?.group
              const groupConfig = group ? MODULE_GROUPS[group] : null
              const statusCfg = STATUS_CONFIG[artifact.status]

              return (
                <div
                  key={artifact.id}
                  className="flex items-center gap-4 px-4 py-3.5 bg-white dark:bg-night-802 rounded-xl border border-red-100 dark:border-red-900/30"
                >
                  {/* Module */}
                  <div className="w-36 shrink-0">
                    {mod ? (
                      <>
                        <p className={cn('text-[10px] font-semibold uppercase tracking-wider', groupConfig?.color)}>
                          {groupConfig?.label}
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{mod.label}</p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400">{artifact.module}</p>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{artifact.name || 'Sin nombre'}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Eliminado {new Date(archivedAt).toLocaleString('es-MX')}
                    </p>
                  </div>

                  {/* Status */}
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0', statusCfg.color)}>
                    {statusCfg.label}
                  </span>

                  {/* Restore */}
                  <ArtifactRestoreButton id={artifact.id} name={artifact.name} />
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Changelog */}
      {changelog.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Historial de cambios
            <span className="ml-2 text-xs font-normal text-gray-400">(últimas 100 entradas)</span>
          </h2>

          <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 divide-y divide-gray-100 dark:divide-night-801 overflow-hidden">
            {changelog.map((entry, i) => {
              const cfg = ACTION_CONFIG[entry.action]
              const ActionIcon = cfg.icon
              const mod = MODULES.find((m) => m.key === entry.artifact.module)
              const isInCurrent = currentIds.has(entry.artifact.id)

              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-night-801/50 transition-colors">
                  {/* Action badge */}
                  <span className={cn('flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full shrink-0', cfg.color)}>
                    <ActionIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    {isInCurrent ? (
                      <Link
                        href={`/artifacts/${entry.artifact.id}`}
                        className="text-sm text-gray-900 dark:text-white hover:text-lipu-500 transition-colors truncate block"
                      >
                        {entry.artifact.name || 'Sin nombre'}
                      </Link>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {entry.artifact.name || 'Sin nombre'}
                      </p>
                    )}
                    {mod && (
                      <p className="text-[10px] text-gray-400 truncate">{mod.label}</p>
                    )}
                  </div>

                  {/* Date */}
                  <p className="text-[10px] text-gray-400 shrink-0">
                    {new Date(entry.archivedAt).toLocaleString('es-MX')}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
