'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACTION_CONFIG = {
  created: { label: 'Creado', icon: Plus, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
  updated: { label: 'Editado', icon: Pencil, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
  deleted: { label: 'Eliminado', icon: Trash2, color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' },
}

export interface ArchiveLogEntry {
  action: 'created' | 'updated' | 'deleted'
  archivedAt: string
  artifactId: string
  name: string
  moduleLabel: string
  inCurrent: boolean
}

const CHUNK = 50

export function ArchiveLog({ entries }: { entries: ArchiveLogEntry[] }) {
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(CHUNK)

  const q = search.trim().toLowerCase()
  const filtered = q
    ? entries.filter((e) => `${e.name} ${e.moduleLabel}`.toLowerCase().includes(q))
    : entries
  const visible = filtered.slice(0, limit)

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Historial de cambios
          <span className="ml-2 text-xs font-normal text-gray-400">
            {q ? `${filtered.length} de ${entries.length} entradas` : `${entries.length} entradas`}
          </span>
        </h2>
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setLimit(CHUNK) }}
            placeholder="Filtrar por artifact..."
            aria-label="Filtrar historial por artifact"
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 divide-y divide-gray-100 dark:divide-night-801 overflow-hidden">
        {visible.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-gray-400">
            {q ? `Sin entradas que coincidan con «${search}».` : 'Sin entradas.'}
          </p>
        )}
        {visible.map((entry, i) => {
          const cfg = ACTION_CONFIG[entry.action]
          const ActionIcon = cfg.icon

          return (
            <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-night-801/50 transition-colors">
              <span className={cn('flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full shrink-0', cfg.color)}>
                <ActionIcon className="w-3 h-3" />
                {cfg.label}
              </span>

              <div className="flex-1 min-w-0">
                {entry.inCurrent ? (
                  <Link
                    href={`/artifacts/${entry.artifactId}`}
                    className="text-sm text-gray-900 dark:text-white hover:text-lipu-500 transition-colors truncate block"
                  >
                    {entry.name || 'Sin nombre'}
                  </Link>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {entry.name || 'Sin nombre'}
                  </p>
                )}
                {entry.moduleLabel && (
                  <p className="text-[10px] text-gray-400 truncate">{entry.moduleLabel}</p>
                )}
              </div>

              <p className="text-[10px] text-gray-400 shrink-0">
                {new Date(entry.archivedAt).toLocaleString('es-MX')}
              </p>
            </div>
          )
        })}
      </div>

      {filtered.length > limit && (
        <div className="flex justify-center">
          <button
            onClick={() => setLimit((l) => l + CHUNK)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
          >
            Mostrar {Math.min(CHUNK, filtered.length - limit)} más
          </button>
        </div>
      )}
    </section>
  )
}
