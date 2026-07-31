'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { Plus, Search, X, ExternalLink, Code2, ChevronRight, ChevronLeft, ArrowUpDown, Download, BarChart3, Loader2, LayoutList, Columns3 } from 'lucide-react'
import type { Artifact, ArtifactStatus, ModuleGroup } from '@/lib/types'
import { MODULES, MODULE_GROUPS } from '@/lib/modules'
import { StatusBadge } from './status-badge'
import { ArtifactKanban } from './artifact-kanban'
import { formatDate, cn } from '@/lib/utils'

const PAGE_SIZE = 20

type SortKey = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'status'

const STATUS_ORDER: ArtifactStatus[] = ['borrador', 'en-revision', 'aprobado', 'entregado', 'deprecado']

const STATUS_OPTIONS: { value: ArtifactStatus | ''; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'borrador', label: 'Borrador' },
  { value: 'en-revision', label: 'En revisión' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'deprecado', label: 'Deprecado' },
]

const GROUP_OPTIONS: { value: ModuleGroup | ''; label: string }[] = [
  { value: '', label: 'Todos los grupos' },
  { value: 'management', label: 'Management' },
  { value: 'operations', label: 'Operations' },
  { value: 'administration', label: 'Administration' },
]

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'date-desc', label: 'Más reciente' },
  { value: 'date-asc', label: 'Más antiguo' },
  { value: 'name-asc', label: 'Nombre A-Z' },
  { value: 'name-desc', label: 'Nombre Z-A' },
  { value: 'status', label: 'Por status' },
]

function exportCsv(artifacts: Artifact[]) {
  const header = ['ID', 'Nombre', 'Módulo', 'Grupo', 'Status', 'Versión', 'Descripción', 'Etiquetas', 'Fecha', 'Links', 'Tiene código', 'Creado', 'Actualizado']
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  const rows = artifacts.map((a) => {
    const mod = MODULES.find((m) => m.key === a.module)
    return [
      escape(a.id),
      escape(a.name),
      escape(mod?.label ?? a.module),
      escape(mod?.group ?? ''),
      escape(a.status),
      escape(a.version),
      escape(a.description),
      escape(a.tags.join(', ')),
      escape(a.date),
      escape(a.links.join(', ')),
      a.code ? 'Sí' : 'No',
      escape(new Date(a.createdAt).toLocaleString('es-MX')),
      escape(new Date(a.updatedAt).toLocaleString('es-MX')),
    ].join(',')
  })
  const csv = [header.join(','), ...rows].join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `artifacts-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function ArtifactList() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ArtifactStatus | ''>('')
  const [groupFilter, setGroupFilter] = useState<ModuleGroup | ''>('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [sort, setSort] = useState<SortKey>('date-desc')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [applying, setApplying] = useState(false)
  const [view, setView] = useState<'list' | 'kanban'>('list')

  useEffect(() => {
    fetch('/api/artifacts')
      .then((r) => r.json())
      .then((data) => setArtifacts(data))
      .finally(() => setLoading(false))
    fetch('/api/tags')
      .then((r) => r.json())
      .then((tags: string[]) => setAllTags(tags))
      .catch(() => {})
  }, [])

  // Reset page on filter/sort change
  useEffect(() => { setPage(1) }, [query, statusFilter, groupFilter, moduleFilter, tagFilter, sort])

  const moduleOptions = useMemo(
    () => (groupFilter ? MODULES.filter((m) => m.group === groupFilter) : MODULES),
    [groupFilter]
  )

  const fuse = useMemo(
    () => new Fuse(artifacts, { keys: ['name', 'description', 'tags', 'module'], threshold: 0.35 }),
    [artifacts]
  )

  const filtered = useMemo(() => {
    let result = query ? fuse.search(query).map((r) => r.item) : [...artifacts]
    if (statusFilter) result = result.filter((a) => a.status === statusFilter)
    if (tagFilter) result = result.filter((a) => a.tags.includes(tagFilter))
    if (moduleFilter) result = result.filter((a) => a.module === moduleFilter)
    else if (groupFilter) {
      const keys = MODULES.filter((m) => m.group === groupFilter).map((m) => m.key)
      result = result.filter((a) => keys.includes(a.module))
    }
    return result
  }, [query, artifacts, fuse, statusFilter, tagFilter, groupFilter, moduleFilter])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    switch (sort) {
      case 'date-desc': return arr.sort((a, b) => b.date.localeCompare(a.date))
      case 'date-asc':  return arr.sort((a, b) => a.date.localeCompare(b.date))
      case 'name-asc':  return arr.sort((a, b) => a.name.localeCompare(b.name, 'es'))
      case 'name-desc': return arr.sort((a, b) => b.name.localeCompare(a.name, 'es'))
      case 'status':    return arr.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))
    }
  }, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilters = query || statusFilter || groupFilter || moduleFilter || tagFilter

  function clearFilters() {
    setQuery('')
    setStatusFilter('')
    setGroupFilter('')
    setModuleFilter('')
    setTagFilter('')
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const allPageSelected = paginated.length > 0 && paginated.every((a) => selectedIds.has(a.id))
  const somePageSelected = paginated.some((a) => selectedIds.has(a.id))

  function toggleSelectPage() {
    if (allPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        paginated.forEach((a) => next.delete(a.id))
        return next
      })
    } else {
      setSelectedIds((prev) => new Set([...prev, ...paginated.map((a) => a.id)]))
    }
  }

  async function handleKanbanStatusChange(id: string, status: ArtifactStatus) {
    await fetch(`/api/artifacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setArtifacts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  async function applyBulk(operation: 'status' | 'addTag', value: string) {
    if (!selectedIds.size || applying || !value) return
    setApplying(true)
    try {
      const res = await fetch('/api/artifacts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [...selectedIds], operation, value }),
      })
      if (!res.ok) throw new Error()
      setArtifacts((prev) =>
        prev.map((a) => {
          if (!selectedIds.has(a.id)) return a
          if (operation === 'status') return { ...a, status: value as ArtifactStatus }
          if (operation === 'addTag' && !a.tags.includes(value)) return { ...a, tags: [...a.tags, value] }
          return a
        })
      )
      setSelectedIds(new Set())
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 space-y-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-gray-200 dark:bg-night-801" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="px-6 py-4 bg-white dark:bg-night-802 border-b border-gray-200 dark:border-night-801 flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar artifacts..."
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors"
          />
        </div>

        {/* Filters */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ArtifactStatus | '')}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-night-801 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-lipu-500 transition-colors"
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          value={groupFilter}
          onChange={(e) => { setGroupFilter(e.target.value as ModuleGroup | ''); setModuleFilter('') }}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-night-801 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-lipu-500 transition-colors"
        >
          {GROUP_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-night-801 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-lipu-500 transition-colors"
        >
          <option value="">Todos los módulos</option>
          {moduleOptions.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
        </select>

        {allTags.length > 0 && (
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-night-801 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-lipu-500 transition-colors"
          >
            <option value="">Todas las etiquetas</option>
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}

        {/* Sort */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <ArrowUpDown className="w-3.5 h-3.5 shrink-0" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="py-2 text-sm bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none transition-colors"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <X className="w-3 h-3" />
            Limpiar
          </button>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* View toggle */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
            <button
              onClick={() => setView('list')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-2 text-sm transition-colors',
                view === 'list'
                  ? 'bg-lipu-500 text-lipu-text'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801'
              )}
              title="Vista lista"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView('kanban')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-2 text-sm border-l border-gray-200 dark:border-gray-600 transition-colors',
                view === 'kanban'
                  ? 'bg-lipu-500 text-lipu-text'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801'
              )}
              title="Vista kanban"
            >
              <Columns3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <Link
            href="/artifacts/dashboard"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Progreso
          </Link>
          <button
            onClick={() => exportCsv(sorted)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          <Link
            href="/artifacts/new"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nuevo
          </Link>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="px-6 py-2.5 bg-lipu-600/5 dark:bg-lipu-600/10 border-b border-lipu-500/20 flex items-center gap-3 flex-wrap">
          {applying && <Loader2 className="w-3.5 h-3.5 animate-spin text-lipu-500 shrink-0" />}
          <span className="text-xs font-semibold text-lipu-500 shrink-0">
            {selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}
          </span>
          <select
            defaultValue=""
            onChange={(e) => { if (e.target.value) { applyBulk('status', e.target.value); e.target.value = '' } }}
            disabled={applying}
            className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-night-801 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-lipu-500 disabled:opacity-50 transition-colors"
          >
            <option value="">Cambiar status...</option>
            {STATUS_OPTIONS.filter((o) => o.value).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {allTags.length > 0 && (
            <select
              defaultValue=""
              onChange={(e) => { if (e.target.value) { applyBulk('addTag', e.target.value); e.target.value = '' } }}
              disabled={applying}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-night-801 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-lipu-500 disabled:opacity-50 transition-colors"
            >
              <option value="">Agregar etiqueta...</option>
              {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-3 h-3" />
            Deseleccionar
          </button>
        </div>
      )}

      {view === 'kanban' ? (
        <ArtifactKanban artifacts={filtered} onStatusChange={handleKanbanStatusChange} />
      ) : (
        <>
          {/* Results count + select all */}
          <div className="px-6 py-2 flex items-center gap-3">
            {paginated.length > 0 && (
              <input
                type="checkbox"
                checked={allPageSelected}
                ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected }}
                onChange={toggleSelectPage}
                className="w-3.5 h-3.5 accent-lipu-500 cursor-pointer shrink-0"
                title={allPageSelected ? 'Deseleccionar página' : 'Seleccionar página'}
              />
            )}
            <span className="text-xs text-gray-400">
              {sorted.length === 0
                ? '0 artifacts'
                : totalPages > 1
                  ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, sorted.length)} de ${sorted.length} artifact${sorted.length !== 1 ? 's' : ''}`
                  : `${sorted.length} artifact${sorted.length !== 1 ? 's' : ''}`}
            </span>
            {hasFilters && <span className="text-xs text-gray-400">· filtrado de {artifacts.length}</span>}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            {paginated.length === 0 ? (
              <EmptyState hasFilters={!!hasFilters} onClear={clearFilters} />
            ) : (
              <div className="space-y-2">
                {paginated.map((artifact) => (
                  <ArtifactRow
                    key={artifact.id}
                    artifact={artifact}
                    onTagClick={setTagFilter}
                    selected={selectedIds.has(artifact.id)}
                    onToggleSelect={toggleSelect}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 dark:border-night-801 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-night-801 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Anterior
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | '…')[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('…')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    p === '…' ? (
                      <span key={`ellipsis-${i}`} className="px-1 text-xs text-gray-400">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={cn(
                          'w-7 h-7 rounded-lg text-xs font-medium transition-colors',
                          page === p
                            ? 'bg-lipu-500 text-lipu-text'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-night-801'
                        )}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-night-801 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ArtifactRow({
  artifact,
  onTagClick,
  selected,
  onToggleSelect,
}: {
  artifact: Artifact
  onTagClick?: (tag: string) => void
  selected?: boolean
  onToggleSelect?: (id: string) => void
}) {
  const mod = MODULES.find((m) => m.key === artifact.module)
  const group = mod?.group
  const groupConfig = group ? MODULE_GROUPS[group] : null

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={selected ?? false}
        onChange={() => onToggleSelect?.(artifact.id)}
        className="w-3.5 h-3.5 accent-lipu-500 shrink-0 cursor-pointer"
      />
    <Link
      href={`/artifacts/${artifact.id}`}
      className="flex-1 flex items-center gap-4 px-4 py-3 bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 hover:border-lipu-500/40 hover:shadow-light-sm transition-all group"
    >
      <div className="w-36 shrink-0">
        {mod ? (
          <>
            <p className={cn('text-[10px] font-semibold uppercase tracking-wider', groupConfig?.color)}>
              {MODULE_GROUPS[group!]?.label}
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{mod.label}</p>
          </>
        ) : (
          <p className="text-xs text-gray-400 truncate">{artifact.module}</p>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{artifact.name || 'Sin nombre'}</p>
        {artifact.tags.length > 0 && (
          <div className="flex gap-1 mt-0.5 flex-wrap">
            {artifact.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTagClick?.(tag) }}
                className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-night-801 text-gray-500 dark:text-gray-400 hover:bg-lipu-600/10 hover:text-lipu-500 transition-colors"
              >
                {tag}
              </button>
            ))}
            {artifact.tags.length > 3 && <span className="text-[10px] text-gray-400">+{artifact.tags.length - 3}</span>}
          </div>
        )}
      </div>

      <div className="w-14 shrink-0 text-center">
        <span className="text-xs text-gray-400">v{artifact.version}</span>
      </div>

      <div className="w-24 shrink-0 flex justify-center">
        <StatusBadge status={artifact.status} />
      </div>

      <div className="w-24 shrink-0 text-right">
        <span className="text-xs text-gray-400">{formatDate(artifact.date)}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {artifact.links.length > 0 && <ExternalLink className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />}
        {artifact.code && <Code2 className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />}
        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-lipu-500 transition-colors" />
      </div>
    </Link>
    </div>
  )
}

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-night-801 flex items-center justify-center mb-3">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        {hasFilters ? 'Sin resultados' : 'Sin artifacts'}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        {hasFilters ? 'Prueba con otros filtros o términos.' : 'Crea el primer artifact.'}
      </p>
      {hasFilters ? (
        <button onClick={onClear} className="text-xs text-lipu-500 hover:text-lipu-600 font-medium">
          Limpiar filtros
        </button>
      ) : (
        <Link href="/artifacts/new" className="flex items-center gap-1 text-xs text-lipu-500 hover:text-lipu-600 font-medium">
          <Plus className="w-3 h-3" />
          Crear artifact
        </Link>
      )}
    </div>
  )
}
