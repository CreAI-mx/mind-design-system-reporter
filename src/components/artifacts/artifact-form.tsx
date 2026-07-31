'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus, Loader2, FileCode, ImagePlus } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import type { Artifact, ArtifactStatus } from '@/lib/types'
import { MODULES, MODULE_GROUPS } from '@/lib/modules'
import { StatusBadge } from './status-badge'
import { TagInput } from './tag-input'
import { ArtifactPicker } from './artifact-picker'
import { cn } from '@/lib/utils'

type FormData = Omit<Artifact, 'id' | 'createdAt' | 'updatedAt'>

const EMPTY: FormData = {
  name: '',
  module: '',
  version: '1.0',
  versionNote: '',
  status: 'borrador',
  description: '',
  tags: [],
  links: [],
  code: '',
  codeUrl: '',
  imageUrls: [],
  date: new Date().toISOString().split('T')[0],
  parentId: undefined,
}

const STATUSES: ArtifactStatus[] = ['borrador', 'en-revision', 'aprobado', 'entregado', 'deprecado']

interface ArtifactFormProps {
  initial?: Artifact
  mode: 'create' | 'edit'
}

export function ArtifactForm({ initial, mode }: ArtifactFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState<FormData>(
    initial
      ? {
          name: initial.name,
          module: initial.module,
          version: initial.version,
          versionNote: initial.versionNote,
          status: initial.status,
          description: initial.description,
          tags: initial.tags,
          links: initial.links,
          code: initial.code,
          codeUrl: initial.codeUrl,
          imageUrls: initial.imageUrls,
          date: initial.date,
          parentId: initial.parentId,
        }
      : EMPTY
  )
  const [saving, setSaving] = useState(false)
  const [linkInput, setLinkInput] = useState('')
  const [imageInput, setImageInput] = useState('')

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function addLink() {
    const l = linkInput.trim()
    if (l && !form.links.includes(l)) update('links', [...form.links, l])
    setLinkInput('')
  }

  function addImage() {
    const i = imageInput.trim()
    if (i && !form.imageUrls.includes(i)) update('imageUrls', [...form.imageUrls, i])
    setImageInput('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const url = mode === 'create' ? '/api/artifacts' : `/api/artifacts/${initial?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Error al guardar')
      const saved = await res.json()
      toast(mode === 'create' ? 'Artifact creado correctamente' : 'Artifact actualizado', 'success')
      router.push(mode === 'create' ? `/artifacts/${saved.id}` : '/artifacts')
      router.refresh()
    } catch (err) {
      console.error(err)
      toast('Error al guardar el artifact', 'error')
    } finally {
      setSaving(false)
    }
  }

  const groupedModules = MODULES.reduce<Record<string, typeof MODULES>>((acc, m) => {
    if (!acc[m.group]) acc[m.group] = []
    acc[m.group].push(m)
    return acc
  }, {})

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      {/* Basic info */}
      <section className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-5 space-y-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Información básica</h2>

        <Field label="Nombre del artifact" required>
          <input
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Ej. Modal de creación de cliente"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Módulo" required>
            <select
              required
              value={form.module}
              onChange={(e) => update('module', e.target.value)}
              className={inputClass}
            >
              <option value="">Seleccionar módulo</option>
              {Object.entries(groupedModules).map(([group, mods]) => (
                <optgroup key={group} label={MODULE_GROUPS[group as keyof typeof MODULE_GROUPS]?.label ?? group}>
                  {mods.map((m) => (
                    <option key={m.key} value={m.key}>{m.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>

          <Field label="Fecha">
            <input
              type="date"
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Descripción">
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
            placeholder="Qué hace este artifact, contexto, notas importantes..."
            className={cn(inputClass, 'resize-none')}
          />
        </Field>
      </section>

      {/* Status & version */}
      <section className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-5 space-y-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado y versión</h2>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Estado">
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value as ArtifactStatus)}
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
              ))}
            </select>
            <div className="mt-2">
              <StatusBadge status={form.status} />
            </div>
          </Field>

          <Field label="Versión">
            <input
              value={form.version}
              onChange={(e) => update('version', e.target.value)}
              placeholder="1.0"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Nota de versión">
          <input
            value={form.versionNote}
            onChange={(e) => update('versionNote', e.target.value)}
            placeholder="Qué cambió en esta versión..."
            className={inputClass}
          />
        </Field>
      </section>

      {/* Version link */}
      <section className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-5 space-y-3">
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Versión de (opcional)</h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Vincula este artifact a una versión anterior del mismo componente.</p>
        </div>
        <ArtifactPicker
          value={form.parentId ?? ''}
          onChange={(id) => update('parentId', id || undefined)}
          excludeId={initial?.id}
        />
      </section>

      {/* Tags */}
      <section className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-5 space-y-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Etiquetas</h2>
        <TagInput value={form.tags} onChange={(tags) => update('tags', tags)} />
      </section>

      {/* Links */}
      <section className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-5 space-y-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Enlaces</h2>
        <div className="flex gap-2">
          <input
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
            placeholder="URL del artifact (claude.ai, figma, etc.)"
            className={cn(inputClass, 'flex-1')}
          />
          <button type="button" onClick={addLink} className={btnSecondary}>
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {form.links.map((link) => (
          <div key={link} className="flex items-center gap-2 text-sm">
            <span className="flex-1 truncate text-sky-600 dark:text-sky-400 text-xs">{link}</span>
            <button type="button" onClick={() => update('links', form.links.filter((l) => l !== link))}>
              <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        ))}
      </section>

      {/* Images */}
      <section className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-5 space-y-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Imágenes de referencia</h2>

        {/* Upload area */}
        <ImageUploadArea
          onUploaded={(url) => update('imageUrls', [...form.imageUrls, url])}
        />

        {/* URL manual */}
        <div className="flex gap-2">
          <input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
            placeholder="O pega una URL externa (Figma, Drive, etc.)"
            className={cn(inputClass, 'flex-1')}
          />
          <button type="button" onClick={addImage} className={btnSecondary}>
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Preview grid */}
        {form.imageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {form.imageUrls.map((url) => (
              <div key={url} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-night-801 aspect-video bg-gray-50 dark:bg-night-803">
                {url.startsWith('/uploads/') || url.startsWith('http') ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-xs text-gray-400 truncate px-2 text-center">{url}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => update('imageUrls', form.imageUrls.filter((i) => i !== url))}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Code */}
      <section className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-5 space-y-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Código entregado por Claude Design</h2>

        <Field label="URL externa del código">
          <input
            value={form.codeUrl}
            onChange={(e) => update('codeUrl', e.target.value)}
            placeholder="Link al gist, repositorio, etc."
            className={inputClass}
          />
        </Field>

        <Field label="Código">
          <CodeUploadArea
            code={form.code}
            onChange={(code) => update('code', code)}
          />
        </Field>
      </section>

      {/* Actions */}
      <div className="flex gap-3 justify-end pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className={btnSecondary}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'create' ? 'Crear artifact' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors'

const btnSecondary =
  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors'

/* ── Image upload drop zone ─────────────────────────────────── */
function ImageUploadArea({ onUploaded }: { onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload/image', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) onUploaded(data.url)
    } finally {
      setUploading(false)
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach(uploadFile)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 cursor-pointer transition-colors',
        dragOver
          ? 'border-lipu-500 bg-lipu-600/5'
          : 'border-gray-200 dark:border-gray-600 hover:border-lipu-500/50 hover:bg-gray-50 dark:hover:bg-night-801'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {uploading ? (
        <Loader2 className="w-5 h-5 animate-spin text-lipu-500" />
      ) : (
        <ImagePlus className="w-5 h-5 text-gray-400" />
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {uploading ? 'Subiendo...' : 'Arrastra imágenes aquí o haz clic para seleccionar'}
      </p>
      <p className="text-[10px] text-gray-400">PNG, JPG, GIF, WebP, SVG</p>
    </div>
  )
}

/* ── Code upload + textarea ─────────────────────────────────── */
function CodeUploadArea({ code, onChange }: { code: string; onChange: (code: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const lines = code ? code.split('\n').length : 0

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      onChange(ev.target?.result as string)
      setFileName(file.name)
    }
    reader.readAsText(file)
    // reset input so same file can be re-selected
    e.target.value = ''
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={cn(btnSecondary, 'text-xs')}
        >
          <FileCode className="w-3.5 h-3.5" />
          Cargar archivo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".jsx,.tsx,.js,.ts,.html,.css,.json,.vue,.py,.txt"
          className="hidden"
          onChange={handleFile}
        />
        {fileName && (
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <FileCode className="w-3 h-3 text-lipu-500" />
            {fileName}
            {lines > 0 && <span className="text-gray-400">· {lines} líneas</span>}
          </span>
        )}
        {code && !fileName && lines > 0 && (
          <span className="text-xs text-gray-400">{lines} líneas</span>
        )}
        {code && (
          <button
            type="button"
            onClick={() => { onChange(''); setFileName(null) }}
            className="ml-auto text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      <textarea
        value={code}
        onChange={(e) => { onChange(e.target.value); setFileName(null) }}
        rows={code ? Math.min(Math.max(lines + 2, 8), 24) : 8}
        placeholder="Pega aquí el HTML, JSX o código entregado, o usa el botón para cargar un archivo..."
        className={cn(inputClass, 'resize-y font-mono text-xs leading-relaxed')}
      />
    </div>
  )
}
