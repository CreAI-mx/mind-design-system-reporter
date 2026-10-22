'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Fuse from 'fuse.js'
import { Plus, Search, X, ExternalLink, Code2, ChevronRight, ChevronLeft, ArrowUpDown, Download, BarChart3, Loader2, LayoutList, Columns3, Table2, ChevronUp, ChevronDown } from 'lucide-react'
import { findGroup, findModule, type Artifact, type ArtifactStatus, type Taxonomy } from '@/lib/types'
import { colorClasses } from '@/lib/colors'
import { useTaxonomy } from '@/components/taxonomy-provider'
import { useSessionEmail } from '@/components/session-provider'
import { useToast } from '@/components/ui/toast'
import { StatusBadge } from './status-badge'
import { ArtifactKanban } from './artifact-kanban'
import { formatDate, cn } from '@/lib/utils'

const PAGE_SIZES = [20, 50, 100]
const VIEW_KEY = 'mind_artifacts_view'

type SortKey = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'status' | 'version-asc' | 'version-desc'
type View = 'list' | 'kanban' | 'table'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'date-desc', label: 'Más reciente' },
  { value: 'date-asc', label: 'Más antiguo' },
  { value: 'name-asc', label: 'Nombre A-Z' },
  { value: 'name-desc', label: 'Nombre Z-A' },
  { value: 'status', label: 'Por status' },
]

function exportCsv(artifacts: Artifact[], taxonomy: Taxonomy) {
  const header = ['ID', 'Nombre', 'Módulo', 'Grupo', 'Status', 'Versión', 'Descripción', 'Etiquetas', 'Fecha', 'Links', 'Tiene código', 'Creado', 'Actualizado']
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  const rows = artifacts.map((a) => {
    const mod = findModule(taxonomy, a.module)
    return [
      escape(a.id),
      escape(a.name),
      escape(mod?.label ?? a.module),
      escape(mod?.groupKey ?? ''),
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

const SORT_KEYS: SortKey[] = ['date-desc', 'date-asc', 'name-asc', 'name-desc', 'status', 'version-asc', 'version-desc']
const VIEWS: View[] = ['list', 'kanban', 'table']

export function ArtifactList() {
  const taxonomy = useTaxonomy()
  const canEdit = !!useSessionEmail()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [applying, setApplying] = useState(false)

  // Filtros, orden, vista y página viven en la URL: navegar al detalle y
  // volver no pierde nada, y las vistas filtradas se pueden compartir.
  const statusFilter = searchParams.get('estado') ?? ''
  const groupFilter = searchParams.get('grupo') ?? ''
  const moduleFilter = searchParams.get('modulo') ?? ''
  const tagFilter = searchParams.get('etiqueta') ?? ''
  const sortParam = searchParams.get('orden') as SortKey | null
  const sort: SortKey = sortParam && SORT_KEYS.includes(sortParam) ? sortParam : 'date-desc'
  const page = Math.max(1, parseInt(searchParams.get('pagina') ?? '1', 10) || 1)
  const pageSizeParam = parseInt(searchParams.get('porPagina') ?? '', 10)
  const pageSize = PAGE_SIZES.includes(pageSizeParam) ? pageSizeParam : PAGE_SIZES[0]

  // La búsqueda se escribe local y se sincroniza a la URL con debounce.
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  // La vista preferida se recuerda (localStorage); la URL gana si trae ?vista=.
  const [storedView, setStoredView] = useState<View>('list')
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_KEY) as View | null
    if (saved && VIEWS.includes(saved)) setStoredView(saved)
  }, [])
  const viewParam = searchParams.get('vista') as View | null
  const view: View = viewParam && VIEWS.includes(viewParam) ? viewParam : storedView

  const setParams = useCallback((updates: Record<string, string | null>) => {
    const p = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') p.delete(key)
      else p.set(key, value)
    }
    const qs = p.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [searchParams, router, pathname])

  function setView(v: View) {
    setStoredView(v)
    try { localStorage.setItem(VIEW_KEY, v) } catch {}
    setParams({ vista: v === 'list' ? null : v })
  }

  useEffect(() => {
    const current = searchParams.get('q') ?? ''
    const next = query.trim()
    if (current === next) return
    const t = setTimeout(() => setParams({ q: next || null, pagina: null }), 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

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

  const moduleOptions = useMemo(
    () => (groupFilter ? taxonomy.modules.filter((m) => m.groupKey === groupFilter) : taxonomy.modules),
    [groupFilter, taxonomy.modules]
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
      const keys = taxonomy.modules.filter((m) => m.groupKey === groupFilter).map((m) => m.key)
      result = result.filter((a) => keys.includes(a.module))
    }
    return result
  }, [query, artifacts, fuse, statusFilter, tagFilter, groupFilter, moduleFilter, taxonomy.modules])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    switch (sort) {
      case 'date-desc': return arr.sort((a, b) => b.date.localeCompare(a.date))
      case 'date-asc':  return arr.sort((a, b) => a.date.localeCompare(b.date))
      case 'name-asc':  return arr.sort((a, b) => a.name.localeCompare(b.name, 'es'))
      case 'name-desc': return arr.sort((a, b) => b.name.localeCompare(a.name, 'es'))
      case 'status': {
        const order = taxonomy.statuses.map((s) => s.key)
        return arr.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status))
      }
      case 'version-asc':  return arr.sort((a, b) => a.version.localeCompare(b.version, undefined, { numeric: true }))
      case 'version-desc': return arr.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))
    }
  }, [filtered, sort, taxonomy.statuses])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)
  const hasFilters = query || statusFilter || groupFilter || moduleFilter || tagFilter

  function clearFilters() {
    setQuery('')
    setParams({ q: null, estado: null, grupo: null, modulo: null, etiqueta: null, pagina: null })
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
    const previous = artifacts.find((a) => a.id === id)?.status
    // Optimista: se revierte si el servidor rechaza el cambio.
    setArtifacts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    try {
      const res = await fetch(`/api/artifacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
    } catch {
      if (previous) setArtifacts((prev) => prev.map((a) => (a.id === id ? { ...a, status: previous } : a)))
      toast('No se pudo cambiar el estado', 'error')
    }
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
    } catch {
      toast('No se pudo aplicar el cambio a los seleccionados', 'error')
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
            aria-label="Buscar artifacts"
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors"
          />
        </div>

        {/* Filters */}
        <select
          value={statusFilter}
          aria-label="Filtrar por estado"
          onChange={(e) => setParams({ estado: e.target.value || null, pagina: null })}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-night-801 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-lipu-500 transition-colors"
        >
          <option value="">Todos los estados</option>
          {taxonomy.statuses.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>

        <select
          value={groupFilter}
          aria-label="Filtrar por grupo"
          onChange={(e) => setParams({ grupo: e.target.value || null, modulo: null, pagina: null })}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-night-801 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-lipu-500 transition-colors"
        >
          <option value="">Todos los grupos</option>
          {taxonomy.groups.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
        </select>

        <select
          value={moduleFilter}
          aria-label="Filtrar por módulo"
          onChange={(e) => setParams({ modulo: e.target.value || null, pagina: null })}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-night-801 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-lipu-500 transition-colors"
        >
          <option value="">Todos los módulos</option>
          {moduleOptions.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
        </select>

        {allTags.length > 0 && (
          <select
            value={tagFilter}
            aria-label="Filtrar por etiqueta"
            onChange={(e) => setParams({ etiqueta: e.target.value || null, pagina: null })}
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
            aria-label="Ordenar por"
            onChange={(e) => setParams({ orden: e.target.value === 'date-desc' ? null : e.target.value, pagina: null })}
            className="py-2 text-sm rounded-lg bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-lipu-500/20 transition-colors"
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
              aria-pressed={view === 'list'}
              aria-label="Vista lista"
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
              onClick={() => setView('table')}
              aria-pressed={view === 'table'}
              aria-label="Vista tabla"
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-2 text-sm border-l border-gray-200 dark:border-gray-600 transition-colors',
                view === 'table'
                  ? 'bg-lipu-500 text-lipu-text'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801'
              )}
              title="Vista tabla"
            >
              <Table2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView('kanban')}
              aria-pressed={view === 'kanban'}
              aria-label="Vista kanban"
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
            onClick={() => exportCsv(sorted, taxonomy)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          {canEdit && (
            <Link
              href="/artifacts/new"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo
            </Link>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {canEdit && selectedIds.size > 0 && (
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
            {taxonomy.statuses.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
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
            {canEdit && paginated.length > 0 && (
              <input
                type="checkbox"
                checked={allPageSelected}
                ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected }}
                onChange={toggleSelectPage}
                aria-label={allPageSelected ? 'Deseleccionar página' : 'Seleccionar página'}
                className="w-3.5 h-3.5 accent-lipu-500 cursor-pointer shrink-0"
                title={allPageSelected ? 'Deseleccionar página' : 'Seleccionar página'}
              />
            )}
            <span className="text-xs text-gray-400">
              {sorted.length === 0
                ? '0 artifacts'
                : totalPages > 1
                  ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, sorted.length)} de ${sorted.length} artifact${sorted.length !== 1 ? 's' : ''}`
                  : `${sorted.length} artifact${sorted.length !== 1 ? 's' : ''}`}
            </span>
            {hasFilters && <span className="text-xs text-gray-400">· filtrado de {artifacts.length}</span>}
            {canEdit && allPageSelected && selectedIds.size < sorted.length && (
              <button
                onClick={() => setSelectedIds(new Set(sorted.map((a) => a.id)))}
                className="text-xs text-lipu-500 hover:text-lipu-600 font-medium transition-colors"
              >
                Seleccionar los {sorted.length} filtrados
              </button>
            )}
            {sorted.length > PAGE_SIZES[0] && (
              <select
                value={pageSize}
                aria-label="Artifacts por página"
                onChange={(e) => setParams({ porPagina: e.target.value === String(PAGE_SIZES[0]) ? null : e.target.value, pagina: null })}
                className="ml-auto text-xs rounded-lg bg-transparent text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lipu-500/20 transition-colors"
              >
                {PAGE_SIZES.map((n) => <option key={n} value={n}>{n} / página</option>)}
              </select>
            )}
          </div>

          {/* List / Table */}
          <div className="flex-1 overflow-y-auto overflow-x-auto px-6 pb-4">
            {paginated.length === 0 ? (
              <EmptyState hasFilters={!!hasFilters} onClear={clearFilters} canCreate={canEdit} />
            ) : view === 'table' ? (
              <ArtifactTable
                artifacts={paginated}
                sort={sort}
                onSort={(k) => setParams({ orden: k === 'date-desc' ? null : k, pagina: null })}
                selected={selectedIds}
                onToggleSelect={toggleSelect}
                onTagClick={(t) => setParams({ etiqueta: t, pagina: null })}
                allSelected={allPageSelected}
                someSelected={somePageSelected}
                onToggleAll={toggleSelectPage}
                selectable={canEdit}
              />
            ) : (
              <div className="space-y-2">
                {paginated.map((artifact) => (
                  <ArtifactRow
                    key={artifact.id}
                    artifact={artifact}
                    onTagClick={(t) => setParams({ etiqueta: t, pagina: null })}
                    selected={selectedIds.has(artifact.id)}
                    onToggleSelect={toggleSelect}
                    selectable={canEdit}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 dark:border-night-801 flex items-center justify-between">
              <button
                onClick={() => setParams({ pagina: page - 1 <= 1 ? null : String(page - 1) })}
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
                        onClick={() => setParams({ pagina: p === 1 ? null : String(p) })}
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
                onClick={() => setParams({ pagina: String(Math.min(totalPages, page + 1)) })}
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
  selectable,
}: {
  artifact: Artifact
  onTagClick?: (tag: string) => void
  selected?: boolean
  onToggleSelect?: (id: string) => void
  selectable?: boolean
}) {
  const taxonomy = useTaxonomy()
  const [tagsExpanded, setTagsExpanded] = useState(false)
  const mod = findModule(taxonomy, artifact.module)
  const group = findGroup(taxonomy, mod?.groupKey)

  return (
    <div className="flex items-center gap-2">
      {selectable && (
        <input
          type="checkbox"
          checked={selected ?? false}
          onChange={() => onToggleSelect?.(artifact.id)}
          aria-label={`Seleccionar ${artifact.name || 'artifact sin nombre'}`}
          className="w-3.5 h-3.5 accent-lipu-500 shrink-0 cursor-pointer"
        />
      )}
    <Link
      href={`/artifacts/${artifact.id}`}
      className="flex-1 flex items-center gap-4 px-4 py-3 bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 hover:border-lipu-500/40 hover:shadow-light-sm transition-all group"
    >
      <div className="w-36 shrink-0">
        {mod ? (
          <>
            <p className={cn('text-[10px] font-semibold uppercase tracking-wider', colorClasses(group?.color).text)}>
              {group?.label}
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
            {(tagsExpanded ? artifact.tags : artifact.tags.slice(0, 3)).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTagClick?.(tag) }}
                className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-night-801 text-gray-500 dark:text-gray-400 hover:bg-lipu-600/10 hover:text-lipu-500 transition-colors"
              >
                {tag}
              </button>
            ))}
            {artifact.tags.length > 3 && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTagsExpanded((v) => !v) }}
                title={tagsExpanded ? 'Mostrar menos' : artifact.tags.slice(3).join(', ')}
                className="text-[10px] text-gray-400 hover:text-lipu-500 transition-colors"
              >
                {tagsExpanded ? 'menos' : `+${artifact.tags.length - 3}`}
              </button>
            )}
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

function ArtifactTable({
  artifacts,
  sort,
  onSort,
  selected,
  onToggleSelect,
  onTagClick,
  allSelected,
  someSelected,
  onToggleAll,
  selectable,
}: {
  artifacts: Artifact[]
  sort: SortKey
  onSort: (key: SortKey) => void
  selected: Set<string>
  onToggleSelect: (id: string) => void
  onTagClick: (tag: string) => void
  allSelected: boolean
  someSelected: boolean
  onToggleAll: () => void
  selectable: boolean
}) {
  function toggle(asc: SortKey, desc: SortKey): SortKey {
    return sort === asc ? desc : asc
  }
  function active(...keys: SortKey[]) {
    return keys.includes(sort)
  }

  return (
    <table className="w-full text-sm border-separate border-spacing-0">
      <thead>
        <tr>
          {selectable && (
            <th className="w-8 px-3 py-2.5 bg-gray-50 dark:bg-night-803 border-b border-gray-200 dark:border-night-801 sticky top-0 z-10">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected }}
                onChange={onToggleAll}
                aria-label="Seleccionar página"
                className="w-3.5 h-3.5 accent-lipu-500 cursor-pointer"
              />
            </th>
          )}
          <ColHeader label="Nombre" isActive={active('name-asc', 'name-desc')} direction={sort === 'name-asc' ? 'asc' : 'desc'} onClick={() => onSort(toggle('name-asc', 'name-desc'))} />
          <ColHeader label="Módulo" isActive={false} direction="asc" onClick={() => {}} sortable={false} />
          <ColHeader label="Versión" isActive={active('version-asc', 'version-desc')} direction={sort === 'version-asc' ? 'asc' : 'desc'} onClick={() => onSort(toggle('version-asc', 'version-desc'))} />
          <ColHeader label="Status" isActive={active('status')} direction="asc" onClick={() => onSort('status')} />
          <ColHeader label="Fecha" isActive={active('date-asc', 'date-desc')} direction={sort === 'date-asc' ? 'asc' : 'desc'} onClick={() => onSort(toggle('date-desc', 'date-asc'))} />
          <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-night-803 border-b border-gray-200 dark:border-night-801 sticky top-0 z-10">
            Etiquetas
          </th>
          <th className="w-16 bg-gray-50 dark:bg-night-803 border-b border-gray-200 dark:border-night-801 sticky top-0 z-10" />
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-night-801">
        {artifacts.map((artifact) => (
          <TableRow
            key={artifact.id}
            artifact={artifact}
            selected={selected.has(artifact.id)}
            onToggleSelect={onToggleSelect}
            onTagClick={onTagClick}
            selectable={selectable}
          />
        ))}
      </tbody>
    </table>
  )
}

function ColHeader({
  label,
  isActive,
  direction,
  onClick,
  sortable = true,
}: {
  label: string
  isActive: boolean
  direction: 'asc' | 'desc'
  onClick: () => void
  sortable?: boolean
}) {
  return (
    <th className="px-4 py-2.5 text-left bg-gray-50 dark:bg-night-803 border-b border-gray-200 dark:border-night-801 sticky top-0 z-10 whitespace-nowrap">
      {sortable ? (
        <button
          onClick={onClick}
          className={cn(
            'flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider transition-colors',
            isActive ? 'text-lipu-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          )}
        >
          {label}
          {isActive
            ? direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
            : <ArrowUpDown className="w-3 h-3 opacity-30" />}
        </button>
      ) : (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      )}
    </th>
  )
}

function TableRow({
  artifact,
  selected,
  onToggleSelect,
  onTagClick,
  selectable,
}: {
  artifact: Artifact
  selected: boolean
  onToggleSelect: (id: string) => void
  onTagClick: (tag: string) => void
  selectable: boolean
}) {
  const taxonomy = useTaxonomy()
  const [tagsExpanded, setTagsExpanded] = useState(false)
  const mod = findModule(taxonomy, artifact.module)
  const group = findGroup(taxonomy, mod?.groupKey)

  return (
    <tr className={cn('group transition-colors', selected ? 'bg-lipu-500/5' : 'hover:bg-gray-50 dark:hover:bg-night-801/40')}>
      {selectable && (
        <td className="w-8 px-3 py-2.5">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(artifact.id)}
            aria-label={`Seleccionar ${artifact.name || 'artifact sin nombre'}`}
            className="w-3.5 h-3.5 accent-lipu-500 cursor-pointer"
          />
        </td>
      )}
      <td className="px-4 py-2.5 max-w-xs">
        <Link
          href={`/artifacts/${artifact.id}`}
          className="font-medium text-gray-900 dark:text-white hover:text-lipu-600 dark:hover:text-lipu-400 transition-colors truncate block"
        >
          {artifact.name || 'Sin nombre'}
        </Link>
      </td>
      <td className="px-4 py-2.5 w-36">
        {mod ? (
          <div>
            <p className={cn('text-[10px] font-semibold uppercase tracking-wider', colorClasses(group?.color).text)}>
              {group?.label}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{mod.label}</p>
          </div>
        ) : (
          <span className="text-xs text-gray-400">{artifact.module}</span>
        )}
      </td>
      <td className="px-4 py-2.5 w-20 text-center">
        <span className="text-xs text-gray-400 tabular-nums">v{artifact.version}</span>
      </td>
      <td className="px-4 py-2.5 w-32">
        <StatusBadge status={artifact.status} />
      </td>
      <td className="px-4 py-2.5 w-28 text-xs text-gray-400 tabular-nums whitespace-nowrap">
        {formatDate(artifact.date)}
      </td>
      <td className="px-4 py-2.5">
        <div className="flex gap-1 flex-wrap">
          {(tagsExpanded ? artifact.tags : artifact.tags.slice(0, 2)).map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-night-801 text-gray-500 dark:text-gray-400 hover:bg-lipu-600/10 hover:text-lipu-500 transition-colors"
            >
              {tag}
            </button>
          ))}
          {artifact.tags.length > 2 && (
            <button
              type="button"
              onClick={() => setTagsExpanded((v) => !v)}
              title={tagsExpanded ? 'Mostrar menos' : artifact.tags.slice(2).join(', ')}
              className="text-[10px] text-gray-400 hover:text-lipu-500 self-center transition-colors"
            >
              {tagsExpanded ? 'menos' : `+${artifact.tags.length - 2}`}
            </button>
          )}
        </div>
      </td>
      <td className="px-3 py-2.5 w-16">
        <div className="flex items-center gap-1.5 justify-end">
          {artifact.links.length > 0 && <ExternalLink className="w-3 h-3 text-gray-300 dark:text-gray-600" />}
          {artifact.code && <Code2 className="w-3 h-3 text-gray-300 dark:text-gray-600" />}
          <Link href={`/artifacts/${artifact.id}`}>
            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-lipu-500 transition-colors" />
          </Link>
        </div>
      </td>
    </tr>
  )
}

function EmptyState({ hasFilters, onClear, canCreate }: { hasFilters: boolean; onClear: () => void; canCreate?: boolean }) {
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
      ) : canCreate ? (
        <Link href="/artifacts/new" className="flex items-center gap-1 text-xs text-lipu-500 hover:text-lipu-600 font-medium">
          <Plus className="w-3 h-3" />
          Crear artifact
        </Link>
      ) : null}
    </div>
  )
}
