'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight, Loader2 } from 'lucide-react'
import Fuse from 'fuse.js'
import { cn } from '@/lib/utils'
import { getModule, MODULE_GROUPS } from '@/lib/modules'
import { STATUS_CONFIG } from '@/lib/types'
import type { Artifact } from '@/lib/types'

interface Props {
  open: boolean
  onClose: () => void
}

export function GlobalSearch({ open, onClose }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (!open || fetchedRef.current) return
    fetchedRef.current = true
    setLoading(true)
    fetch('/api/artifacts')
      .then(r => r.json())
      .then(data => setArtifacts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [open])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const fuse = useMemo(
    () => new Fuse(artifacts, { keys: ['name', 'module', 'tags', 'description'], threshold: 0.35 }),
    [artifacts]
  )

  const results = useMemo(
    () => query.trim() ? fuse.search(query).slice(0, 8).map(r => r.item) : artifacts.slice(0, 8),
    [query, fuse, artifacts]
  )

  useEffect(() => setSelected(0), [query])

  function navigate(artifact: Artifact) {
    onClose()
    router.push(`/artifacts/${artifact.id}`)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    else if (e.key === 'Enter') { if (results[selected]) navigate(results[selected]) }
    else if (e.key === 'Escape') onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-night-802 rounded-2xl border border-gray-200 dark:border-night-801 shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-night-801">
          {loading
            ? <Loader2 className="w-4 h-4 text-gray-400 shrink-0 animate-spin" />
            : <Search className="w-4 h-4 text-gray-400 shrink-0" />
          }
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Buscar artifact…"
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
          {query
            ? <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><X className="w-3.5 h-3.5" /></button>
            : <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-100 dark:bg-night-801 text-gray-500 border border-gray-200 dark:border-night-801">Esc</kbd>
          }
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <ul className="max-h-[360px] overflow-y-auto py-1.5">
            {results.map((artifact, i) => {
              const mod = getModule(artifact.module)
              const group = mod?.group ? MODULE_GROUPS[mod.group] : null
              const status = STATUS_CONFIG[artifact.status]
              const active = i === selected
              return (
                <li key={artifact.id}>
                  <button
                    onClick={() => navigate(artifact)}
                    onMouseEnter={() => setSelected(i)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                      active ? 'bg-lipu-500/10 dark:bg-lipu-500/10' : 'hover:bg-gray-50 dark:hover:bg-night-801'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {artifact.name || 'Sin nombre'}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {group && <span className={cn('font-medium', group.color)}>{group.label} · </span>}
                        {mod?.label ?? artifact.module}
                        {artifact.version && ` · v${artifact.version}`}
                      </p>
                    </div>
                    <span className={cn('text-[10px] font-medium shrink-0 px-2 py-0.5 rounded-full', status?.color)}>
                      {status?.label}
                    </span>
                    {active && <ArrowRight className="w-3.5 h-3.5 text-lipu-500 shrink-0" />}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="py-10 text-center text-sm text-gray-400">
            {loading ? 'Cargando…' : query ? `Sin resultados para "${query}"` : 'Escribe para buscar'}
          </div>
        )}

        {/* Hint bar */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-night-801 flex items-center gap-4 text-[10px] text-gray-400">
          <span><kbd className="font-mono mr-1">↑↓</kbd>navegar</span>
          <span><kbd className="font-mono mr-1">↵</kbd>abrir</span>
          <span><kbd className="font-mono mr-1">Esc</kbd>cerrar</span>
          {artifacts.length > 0 && !query && (
            <span className="ml-auto">{artifacts.length} artifacts</span>
          )}
          {query && results.length > 0 && (
            <span className="ml-auto">{results.length} resultados</span>
          )}
        </div>
      </div>
    </div>
  )
}
