import Link from 'next/link'
import { readArtifacts } from '@/lib/artifacts'
import { readArchive } from '@/lib/archive'
import type { ArchiveEntry } from '@/lib/archive'
import { getSessionUser } from '@/lib/supabase-server'
import { getTaxonomy } from '@/lib/taxonomy'
import { findGroup, findModule, findStatus } from '@/lib/types'
import { colorClasses } from '@/lib/colors'
import { ArtifactRestoreButton } from '@/components/artifacts/artifact-restore-button'
import { ArchiveLog, type ArchiveLogEntry } from '@/components/artifacts/archive-log'
import { ArrowLeft, Archive, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ArchivePage() {
  const [currentArtifacts, entries, taxonomy, user] = await Promise.all([
    readArtifacts(), readArchive(), getTaxonomy(), getSessionUser(),
  ])
  const canEdit = !!user
  const currentIds = new Set(currentArtifacts.map((a) => a.id))

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

  /* ── Full changelog (newest first, cap at 500; the client paginates) ── */
  const changelog: ArchiveLogEntry[] = [...entries]
    .sort((a, b) => b.archivedAt.localeCompare(a.archivedAt))
    .slice(0, 500)
    .map((entry) => ({
      action: entry.action,
      archivedAt: entry.archivedAt,
      artifactId: entry.artifact.id,
      name: entry.artifact.name,
      moduleLabel: findModule(taxonomy, entry.artifact.module)?.label ?? '',
      inCurrent: currentIds.has(entry.artifact.id),
    }))

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
              const mod = findModule(taxonomy, artifact.module)
              const group = findGroup(taxonomy, mod?.groupKey)
              const statusCfg = findStatus(taxonomy, artifact.status)

              return (
                <div
                  key={artifact.id}
                  className="flex items-center gap-4 px-4 py-3.5 bg-white dark:bg-night-802 rounded-xl border border-red-100 dark:border-red-900/30"
                >
                  {/* Module */}
                  <div className="w-36 shrink-0">
                    {mod ? (
                      <>
                        <p className={cn('text-[10px] font-semibold uppercase tracking-wider', colorClasses(group?.color).text)}>
                          {group?.label}
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
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0', colorClasses(statusCfg?.color).badge)}>
                    {statusCfg?.label ?? artifact.status}
                  </span>

                  {/* Restore */}
                  {canEdit && <ArtifactRestoreButton id={artifact.id} name={artifact.name} />}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Changelog */}
      {changelog.length > 0 && <ArchiveLog entries={changelog} />}
    </div>
  )
}
