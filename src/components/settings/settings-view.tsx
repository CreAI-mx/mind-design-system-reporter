'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp, Check, Eye, EyeOff, Loader2, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { colorClasses, COLOR_TOKEN_KEYS } from '@/lib/colors'
import type { Taxonomy, TaxonomyGroup, TaxonomyModule, TaxonomyStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SettingsViewProps {
  taxonomy: Taxonomy
  moduleUsage: Record<string, number>
  statusUsage: Record<string, number>
  tags: string[]
  tagUsage: Record<string, number>
}

type Tab = 'groups' | 'modules' | 'statuses' | 'tags' | 'account'

const TABS: { id: Tab; label: string }[] = [
  { id: 'groups', label: 'Grupos' },
  { id: 'modules', label: 'Módulos' },
  { id: 'statuses', label: 'Estados' },
  { id: 'tags', label: 'Etiquetas' },
  { id: 'account', label: 'Cuenta' },
]

const inputClass =
  'w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors'

const selectClass =
  'px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-night-801 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-lipu-500 transition-colors'

const btnPrimary =
  'flex items-center gap-1.5 px-3 py-2 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium disabled:opacity-50 transition-colors'

const btnSecondary =
  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'

const iconBtn =
  'p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-night-801 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors'

export function SettingsView(props: SettingsViewProps) {
  const [tab, setTab] = useState<Tab>('groups')

  // La pestaña activa vive en el hash: recargar o compartir conserva dónde estabas.
  useEffect(() => {
    const fromHash = window.location.hash.slice(1) as Tab
    if (TABS.some((t) => t.id === fromHash)) setTab(fromHash)
  }, [])

  function selectTab(t: Tab) {
    setTab(t)
    history.replaceState(null, '', t === 'groups'
      ? window.location.pathname + window.location.search
      : `#${t}`)
  }

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-night-801">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => selectTab(t.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === t.id
                ? 'border-lipu-500 text-lipu-500'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'groups' && <GroupsTab {...props} />}
      {tab === 'modules' && <ModulesTab {...props} />}
      {tab === 'statuses' && <StatusesTab {...props} />}
      {tab === 'tags' && <TagsTab {...props} />}
      {tab === 'account' && <AccountTab />}
    </div>
  )
}

/* ── Cuenta (cambiar contraseña propia) ──────────────────────── */

function AccountTab() {
  const { toast } = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [saving, setSaving] = useState(false)

  const tooShort = password.length > 0 && password.length < 8
  const mismatch = confirm.length > 0 && password !== confirm

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8 || password !== confirm) return
    setSaving(true)
    try {
      const { createClient } = await import('@/lib/supabase-browser')
      const { error } = await createClient().auth.updateUser({ password })
      if (error) {
        toast(
          /same.*password|different from the old/i.test(error.message)
            ? 'La nueva contraseña debe ser distinta a la actual'
            : 'No se pudo cambiar la contraseña',
          'error'
        )
      } else {
        toast('Contraseña actualizada', 'success')
        setPassword('')
        setConfirm('')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-5 max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">Cambiar contraseña</h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Cambia la contraseña de tu propia cuenta. Mínimo 8 caracteres.
          </p>
        </div>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña"
            className={cn(inputClass, 'pr-10')}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            tabIndex={-1}
            aria-label={show ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <input
          type={show ? 'text' : 'password'}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirmar nueva contraseña"
          className={inputClass}
        />
        {tooShort && <p className="text-xs text-red-500">Mínimo 8 caracteres.</p>}
        {!tooShort && mismatch && <p className="text-xs text-red-500">Las contraseñas no coinciden.</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || password.length < 8 || password !== confirm}
            className={btnPrimary}
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Guardar contraseña
          </button>
        </div>
      </form>
    </div>
  )
}

/* ── Helpers compartidos ─────────────────────────────────────── */

function useApi() {
  const router = useRouter()
  const { toast } = useToast()
  const [busy, setBusy] = useState(false)

  async function call(method: string, url: string, body: unknown, opts?: { refresh?: boolean }): Promise<boolean> {
    setBusy(true)
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast(data.error ?? 'Error al guardar', 'error')
        return false
      }
      if (opts?.refresh !== false) router.refresh()
      return true
    } catch {
      toast('Error de conexión', 'error')
      return false
    } finally {
      setBusy(false)
    }
  }

  return { call, busy }
}

// Orden local optimista: las flechas reordenan al instante y el PUT corre
// en segundo plano; si falla, se revierte. Se resincroniza cuando el server
// devuelve datos nuevos (crear/editar/borrar hacen router.refresh).
function useOrderedList<T extends { key: string }>(items: T[]) {
  const [order, setOrder] = useState(() => items.map((i) => i.key))
  useEffect(() => { setOrder(items.map((i) => i.key)) }, [items])
  const byKey = new Map(items.map((i) => [i.key, i]))
  const list = [
    ...order.map((k) => byKey.get(k)).filter((i): i is T => !!i),
    ...items.filter((i) => !order.includes(i.key)),
  ]
  return { list, order, setOrder }
}

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {COLOR_TOKEN_KEYS.map((token) => (
        <button
          key={token}
          type="button"
          onClick={() => onChange(token)}
          title={token}
          className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110',
            colorClasses(token).swatch,
            value === token && 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-night-802'
          )}
        >
          {value === token && <Check className="w-3.5 h-3.5 text-white" />}
        </button>
      ))}
    </div>
  )
}

function UsageBadge({ count, noun }: { count: number; noun: string }) {
  return (
    <span className="text-[10px] text-gray-400 whitespace-nowrap">
      {count} {noun}{count !== 1 ? 's' : ''}
    </span>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 divide-y divide-gray-100 dark:divide-night-801">
      {children}
    </div>
  )
}

/* ── Grupos ──────────────────────────────────────────────────── */

function GroupsTab({ taxonomy }: SettingsViewProps) {
  const { call, busy } = useApi()
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const { list: groups, order, setOrder } = useOrderedList(taxonomy.groups)

  const moduleCount = (key: string) => taxonomy.modules.filter((m) => m.groupKey === key).length

  async function move(index: number, dir: -1 | 1) {
    const previous = order
    const keys = groups.map((g) => g.key)
    ;[keys[index], keys[index + dir]] = [keys[index + dir], keys[index]]
    setOrder(keys)
    const ok = await call('PUT', '/api/taxonomy/reorder', { kind: 'groups', keys }, { refresh: false })
    if (!ok) setOrder(previous)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Los grupos organizan los módulos. Solo se pueden borrar grupos sin módulos.
        </p>
        <button onClick={() => { setCreating(true); setEditing(null) }} className={btnPrimary}>
          <Plus className="w-3.5 h-3.5" />
          Nuevo grupo
        </button>
      </div>

      {creating && (
        <GroupForm
          onCancel={() => setCreating(false)}
          onSave={async (label, color) => {
            if (await call('POST', '/api/taxonomy/groups', { label, color })) setCreating(false)
          }}
          busy={busy}
        />
      )}

      <Card>
        {groups.map((group, i) =>
          editing === group.key ? (
            <GroupForm
              key={group.key}
              initial={group}
              onCancel={() => setEditing(null)}
              onSave={async (label, color) => {
                if (await call('PATCH', '/api/taxonomy/groups', { key: group.key, label, color })) setEditing(null)
              }}
              busy={busy}
            />
          ) : (
            <div key={group.key} className="flex items-center gap-3 px-4 py-3">
              <span className={cn('w-3 h-3 rounded-full shrink-0', colorClasses(group.color).swatch)} />
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold', colorClasses(group.color).text)}>{group.label}</p>
                <p className="text-[10px] text-gray-400 font-mono truncate">{group.key}</p>
              </div>
              <UsageBadge count={moduleCount(group.key)} noun="módulo" />
              <div className="flex items-center gap-0.5 shrink-0">
                <button className={iconBtn} disabled={i === 0 || busy} onClick={() => move(i, -1)} title="Subir">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button className={iconBtn} disabled={i === groups.length - 1 || busy} onClick={() => move(i, 1)} title="Bajar">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button className={iconBtn} onClick={() => { setEditing(group.key); setCreating(false) }} title="Editar">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  className={cn(iconBtn, 'hover:text-red-500')}
                  disabled={moduleCount(group.key) > 0 || busy}
                  title={moduleCount(group.key) > 0 ? 'Mueve sus módulos a otro grupo primero' : 'Borrar grupo'}
                  onClick={async () => {
                    if (confirm(`¿Borrar el grupo "${group.label}"?`)) {
                      await call('DELETE', '/api/taxonomy/groups', { key: group.key })
                    }
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        )}
      </Card>
    </div>
  )
}

function GroupForm({
  initial,
  onSave,
  onCancel,
  busy,
}: {
  initial?: TaxonomyGroup
  onSave: (label: string, color: string) => void
  onCancel: () => void
  busy: boolean
}) {
  const [label, setLabel] = useState(initial?.label ?? '')
  const [color, setColor] = useState(initial?.color ?? 'sky')

  return (
    <div className={cn('px-4 py-4 space-y-3', !initial && 'bg-white dark:bg-night-802 rounded-xl border border-lipu-500/40')}>
      <input
        autoFocus
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Nombre del grupo"
        className={inputClass}
      />
      <ColorPicker value={color} onChange={setColor} />
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className={btnSecondary}>Cancelar</button>
        <button onClick={() => onSave(label, color)} disabled={busy || !label.trim()} className={btnPrimary}>
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {initial ? 'Guardar' : 'Crear'}
        </button>
      </div>
    </div>
  )
}

/* ── Módulos ─────────────────────────────────────────────────── */

function ModulesTab({ taxonomy, moduleUsage }: SettingsViewProps) {
  const { call, busy } = useApi()
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const { list: modules, order, setOrder } = useOrderedList(taxonomy.modules)

  const q = search.trim().toLowerCase()
  const visible = q
    ? modules.filter((m) => `${m.label} ${m.key} ${m.description}`.toLowerCase().includes(q))
    : modules

  async function move(index: number, dir: -1 | 1) {
    const previous = order
    const keys = modules.map((m) => m.key)
    ;[keys[index], keys[index + dir]] = [keys[index + dir], keys[index]]
    setOrder(keys)
    const ok = await call('PUT', '/api/taxonomy/reorder', { kind: 'modules', keys }, { refresh: false })
    if (!ok) setOrder(previous)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Para borrar un módulo en uso, primero reasigna sus artifacts a otro.
        </p>
        <button onClick={() => { setCreating(true); setEditing(null) }} className={btnPrimary}>
          <Plus className="w-3.5 h-3.5" />
          Nuevo módulo
        </button>
      </div>

      {creating && (
        <ModuleForm
          groups={taxonomy.groups}
          onCancel={() => setCreating(false)}
          onSave={async (values) => {
            if (await call('POST', '/api/taxonomy/modules', values)) setCreating(false)
          }}
          busy={busy}
        />
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar módulo..."
          aria-label="Buscar módulo"
          className={cn(inputClass, 'pl-8')}
        />
      </div>

      <Card>
        {visible.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-gray-400">Sin módulos que coincidan con «{search}».</p>
        )}
        {visible.map((mod) => {
          const i = modules.findIndex((m) => m.key === mod.key)
          const group = taxonomy.groups.find((g) => g.key === mod.groupKey)
          const usage = moduleUsage[mod.key] ?? 0

          if (editing === mod.key) {
            return (
              <ModuleForm
                key={mod.key}
                initial={mod}
                groups={taxonomy.groups}
                onCancel={() => setEditing(null)}
                onSave={async (values) => {
                  if (await call('PATCH', '/api/taxonomy/modules', { key: mod.key, ...values })) setEditing(null)
                }}
                busy={busy}
              />
            )
          }

          return (
            <div key={mod.key} className="px-4 py-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{mod.label}</p>
                    <span className={cn('text-[10px] font-semibold uppercase tracking-wider', colorClasses(group?.color).text)}>
                      {group?.label ?? mod.groupKey}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono truncate">{mod.key}</p>
                  {mod.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{mod.description}</p>
                  )}
                </div>
                <UsageBadge count={usage} noun="artifact" />
                <div className="flex items-center gap-0.5 shrink-0">
                  {!q && (
                    <>
                      <button className={iconBtn} disabled={i === 0 || busy} onClick={() => move(i, -1)} title="Subir">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button className={iconBtn} disabled={i === modules.length - 1 || busy} onClick={() => move(i, 1)} title="Bajar">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button className={iconBtn} onClick={() => { setEditing(mod.key); setCreating(false) }} title="Editar">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className={cn(iconBtn, 'hover:text-red-500')}
                    title="Borrar módulo"
                    onClick={async () => {
                      if (usage > 0) {
                        setDeleting(deleting === mod.key ? null : mod.key)
                      } else if (confirm(`¿Borrar el módulo "${mod.label}"?`)) {
                        await call('DELETE', '/api/taxonomy/modules', { key: mod.key })
                      }
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {deleting === mod.key && (
                <ReassignRow
                  message={`${usage} artifact${usage !== 1 ? 's' : ''} usan este módulo. Elige a dónde moverlos:`}
                  options={taxonomy.modules.filter((m) => m.key !== mod.key).map((m) => ({ value: m.key, label: m.label }))}
                  busy={busy}
                  onCancel={() => setDeleting(null)}
                  onConfirm={async (reassignTo) => {
                    if (await call('DELETE', '/api/taxonomy/modules', { key: mod.key, reassignTo })) setDeleting(null)
                  }}
                />
              )}
            </div>
          )
        })}
      </Card>
    </div>
  )
}

function ModuleForm({
  initial,
  groups,
  onSave,
  onCancel,
  busy,
}: {
  initial?: TaxonomyModule
  groups: TaxonomyGroup[]
  onSave: (values: { label: string; description: string; groupKey: string }) => void
  onCancel: () => void
  busy: boolean
}) {
  const [label, setLabel] = useState(initial?.label ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [groupKey, setGroupKey] = useState(initial?.groupKey ?? groups[0]?.key ?? '')

  return (
    <div className={cn('px-4 py-4 space-y-3', !initial && 'bg-white dark:bg-night-802 rounded-xl border border-lipu-500/40')}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          autoFocus
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Nombre del módulo"
          className={inputClass}
        />
        <select value={groupKey} onChange={(e) => setGroupKey(e.target.value)} className={selectClass}>
          {groups.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
        </select>
      </div>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción (opcional)"
        className={inputClass}
      />
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className={btnSecondary}>Cancelar</button>
        <button
          onClick={() => onSave({ label, description, groupKey })}
          disabled={busy || !label.trim() || !groupKey}
          className={btnPrimary}
        >
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {initial ? 'Guardar' : 'Crear'}
        </button>
      </div>
    </div>
  )
}

/* ── Estados ─────────────────────────────────────────────────── */

function StatusesTab({ taxonomy, statusUsage }: SettingsViewProps) {
  const { call, busy } = useApi()
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const { list: statuses, order, setOrder } = useOrderedList(taxonomy.statuses)

  async function move(index: number, dir: -1 | 1) {
    const previous = order
    const keys = statuses.map((s) => s.key)
    ;[keys[index], keys[index + dir]] = [keys[index + dir], keys[index]]
    setOrder(keys)
    const ok = await call('PUT', '/api/taxonomy/reorder', { kind: 'statuses', keys }, { refresh: false })
    if (!ok) setOrder(previous)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          El orden define las columnas del kanban. &ldquo;Completado&rdquo; marca qué estados cuentan en el progreso.
        </p>
        <button onClick={() => { setCreating(true); setEditing(null) }} className={btnPrimary}>
          <Plus className="w-3.5 h-3.5" />
          Nuevo estado
        </button>
      </div>

      {creating && (
        <StatusForm
          onCancel={() => setCreating(false)}
          onSave={async (values) => {
            if (await call('POST', '/api/taxonomy/statuses', values)) setCreating(false)
          }}
          busy={busy}
        />
      )}

      <Card>
        {statuses.map((status, i) => {
          const usage = statusUsage[status.key] ?? 0

          if (editing === status.key) {
            return (
              <StatusForm
                key={status.key}
                initial={status}
                onCancel={() => setEditing(null)}
                onSave={async (values) => {
                  if (await call('PATCH', '/api/taxonomy/statuses', { key: status.key, ...values })) setEditing(null)
                }}
                busy={busy}
              />
            )
          }

          return (
            <div key={status.key} className="px-4 py-3 space-y-2">
              <div className="flex items-center gap-3">
                <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0', colorClasses(status.color).badge)}>
                  {status.label}
                </span>
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-mono truncate">{status.key}</p>
                  {status.isDefault && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-night-801 text-gray-500 dark:text-gray-400 shrink-0">default</span>
                  )}
                  {status.countsAsDone && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 shrink-0">completado</span>
                  )}
                </div>
                <UsageBadge count={usage} noun="artifact" />
                <div className="flex items-center gap-0.5 shrink-0">
                  {!status.isDefault && (
                    <button
                      className={cn(iconBtn, 'text-[10px] font-medium px-2')}
                      disabled={busy}
                      title="Usar como estado inicial de artifacts nuevos"
                      onClick={() => call('PATCH', '/api/taxonomy/statuses', { key: status.key, isDefault: true })}
                    >
                      Hacer default
                    </button>
                  )}
                  <button className={iconBtn} disabled={i === 0 || busy} onClick={() => move(i, -1)} title="Subir">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button className={iconBtn} disabled={i === statuses.length - 1 || busy} onClick={() => move(i, 1)} title="Bajar">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button className={iconBtn} onClick={() => { setEditing(status.key); setCreating(false) }} title="Editar">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className={cn(iconBtn, 'hover:text-red-500')}
                    disabled={status.isDefault || taxonomy.statuses.length <= 1 || busy}
                    title={status.isDefault ? 'Marca otro estado como default primero' : 'Borrar estado'}
                    onClick={async () => {
                      if (usage > 0) {
                        setDeleting(deleting === status.key ? null : status.key)
                      } else if (confirm(`¿Borrar el estado "${status.label}"?`)) {
                        await call('DELETE', '/api/taxonomy/statuses', { key: status.key })
                      }
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {deleting === status.key && (
                <ReassignRow
                  message={`${usage} artifact${usage !== 1 ? 's' : ''} tienen este estado. Elige a cuál moverlos:`}
                  options={taxonomy.statuses.filter((s) => s.key !== status.key).map((s) => ({ value: s.key, label: s.label }))}
                  busy={busy}
                  onCancel={() => setDeleting(null)}
                  onConfirm={async (reassignTo) => {
                    if (await call('DELETE', '/api/taxonomy/statuses', { key: status.key, reassignTo })) setDeleting(null)
                  }}
                />
              )}
            </div>
          )
        })}
      </Card>
    </div>
  )
}

function StatusForm({
  initial,
  onSave,
  onCancel,
  busy,
}: {
  initial?: TaxonomyStatus
  onSave: (values: { label: string; color: string; countsAsDone: boolean }) => void
  onCancel: () => void
  busy: boolean
}) {
  const [label, setLabel] = useState(initial?.label ?? '')
  const [color, setColor] = useState(initial?.color ?? 'sky')
  const [countsAsDone, setCountsAsDone] = useState(initial?.countsAsDone ?? false)

  return (
    <div className={cn('px-4 py-4 space-y-3', !initial && 'bg-white dark:bg-night-802 rounded-xl border border-lipu-500/40')}>
      <input
        autoFocus
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Nombre del estado"
        className={inputClass}
      />
      <ColorPicker value={color} onChange={setColor} />
      <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
        <input
          type="checkbox"
          checked={countsAsDone}
          onChange={(e) => setCountsAsDone(e.target.checked)}
          className="w-3.5 h-3.5 accent-lipu-500"
        />
        Cuenta como completado en el progreso
      </label>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className={btnSecondary}>Cancelar</button>
        <button onClick={() => onSave({ label, color, countsAsDone })} disabled={busy || !label.trim()} className={btnPrimary}>
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {initial ? 'Guardar' : 'Crear'}
        </button>
      </div>
    </div>
  )
}

/* ── Etiquetas ───────────────────────────────────────────────── */

function TagsTab({ tags, tagUsage }: SettingsViewProps) {
  const { call, busy } = useApi()
  const [editing, setEditing] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [search, setSearch] = useState('')

  const q = search.trim().toLowerCase()
  const visible = q ? tags.filter((t) => t.includes(q)) : tags

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400">
        Renombrar actualiza la etiqueta en todos los artifacts. Si el nuevo nombre ya existe, se fusionan.
        Las etiquetas nuevas se crean desde el formulario de artifact.
      </p>

      {tags.length > 5 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar etiqueta..."
            aria-label="Buscar etiqueta"
            className={cn(inputClass, 'pl-8')}
          />
        </div>
      )}

      {tags.length === 0 ? (
        <Card>
          <p className="px-4 py-8 text-center text-sm text-gray-400">No hay etiquetas todavía.</p>
        </Card>
      ) : (
        <Card>
          {visible.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-gray-400">Sin etiquetas que coincidan con «{search}».</p>
          )}
          {visible.map((tag) => {
            const usage = tagUsage[tag] ?? 0
            const isEditing = editing === tag
            const mergeTarget = isEditing && newName.trim().toLowerCase() !== tag && tags.includes(newName.trim().toLowerCase())

            return (
              <div key={tag} className="flex items-center gap-3 px-4 py-2.5">
                {isEditing ? (
                  <>
                    <div className="flex-1 space-y-1">
                      <input
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={async (e) => {
                          if (e.key === 'Escape') setEditing(null)
                          if (e.key === 'Enter' && newName.trim()) {
                            if (await call('PATCH', '/api/tags', { name: tag, newName })) setEditing(null)
                          }
                        }}
                        className={inputClass}
                      />
                      {mergeTarget && (
                        <p className="text-[10px] text-yellow-600 dark:text-yellow-400">
                          &ldquo;{newName.trim().toLowerCase()}&rdquo; ya existe: se fusionarán.
                        </p>
                      )}
                    </div>
                    <button
                      className={btnPrimary}
                      disabled={busy || !newName.trim()}
                      onClick={async () => {
                        if (await call('PATCH', '/api/tags', { name: tag, newName })) setEditing(null)
                      }}
                    >
                      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : mergeTarget ? 'Fusionar' : 'Guardar'}
                    </button>
                    <button className={iconBtn} onClick={() => setEditing(null)}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-night-801 text-gray-600 dark:text-gray-300">
                      {tag}
                    </span>
                    <div className="flex-1" />
                    <UsageBadge count={usage} noun="artifact" />
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        className={iconBtn}
                        title="Renombrar"
                        onClick={() => { setEditing(tag); setNewName(tag) }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className={cn(iconBtn, 'hover:text-red-500')}
                        title="Borrar etiqueta"
                        disabled={busy}
                        onClick={async () => {
                          const msg = usage > 0
                            ? `¿Borrar "${tag}"? Se quitará de ${usage} artifact${usage !== 1 ? 's' : ''}.`
                            : `¿Borrar la etiqueta "${tag}"?`
                          if (confirm(msg)) await call('DELETE', '/api/tags', { name: tag })
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </Card>
      )}
    </div>
  )
}

/* ── Fila de reasignación para borrados en uso ───────────────── */

function ReassignRow({
  message,
  options,
  onConfirm,
  onCancel,
  busy,
}: {
  message: string
  options: { value: string; label: string }[]
  onConfirm: (reassignTo: string) => void
  onCancel: () => void
  busy: boolean
}) {
  const [target, setTarget] = useState('')

  return (
    <div className="flex items-center gap-2 flex-wrap rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 px-3 py-2">
      <p className="text-xs text-red-600 dark:text-red-400 flex-1 min-w-40">{message}</p>
      <select value={target} onChange={(e) => setTarget(e.target.value)} className={cn(selectClass, 'text-xs py-1.5')}>
        <option value="">Elegir destino...</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button
        className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 text-xs font-medium disabled:opacity-50 transition-colors"
        disabled={!target || busy}
        onClick={() => onConfirm(target)}
      >
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Reasignar y borrar'}
      </button>
      <button className={iconBtn} onClick={onCancel}>
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
