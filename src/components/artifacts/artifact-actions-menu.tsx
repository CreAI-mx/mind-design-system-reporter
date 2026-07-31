'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MoreHorizontal, Bell, Check, GitCompare,
  Copy, Trash2, Loader2,
} from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import type { Artifact } from '@/lib/types'

function bumpVersion(version: string): string {
  const parts = version.split('.')
  const last = parseInt(parts[parts.length - 1] ?? '0', 10)
  parts[parts.length - 1] = String(isNaN(last) ? 1 : last + 1)
  return parts.join('.')
}

interface Props {
  artifact: Artifact
  hasParent: boolean
  hasSlack: boolean
}

type NotifyState = 'idle' | 'loading' | 'sent' | 'error'

export function ArtifactActionsMenu({ artifact, hasParent, hasSlack }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const ref = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'menu' | 'notify'>('menu')
  const [notifyMessage, setNotifyMessage] = useState('')
  const [notifyState, setNotifyState] = useState<NotifyState>('idle')
  const [duplicating, setDuplicating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setConfirmDelete(false)
        setView('menu')
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  async function handleNotify() {
    if (notifyState !== 'idle') return
    setNotifyState('loading')
    try {
      const res = await fetch(`/api/artifacts/${artifact.id}/notify-slack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: notifyMessage }),
      })
      if (!res.ok) throw new Error()
      setNotifyState('sent')
      setNotifyMessage('')
      setTimeout(() => { setNotifyState('idle'); setView('menu'); setOpen(false) }, 1500)
    } catch {
      setNotifyState('error')
      setTimeout(() => setNotifyState('idle'), 3000)
    }
  }

  async function handleDuplicate() {
    setDuplicating(true)
    try {
      const res = await fetch('/api/artifacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: artifact.name,
          module: artifact.module,
          version: bumpVersion(artifact.version),
          versionNote: '',
          status: 'borrador',
          description: artifact.description,
          tags: artifact.tags,
          links: artifact.links,
          code: artifact.code,
          codeUrl: artifact.codeUrl,
          imageUrls: artifact.imageUrls,
          date: new Date().toISOString().split('T')[0],
          parentId: artifact.id,
        }),
      })
      if (!res.ok) throw new Error()
      const created = await res.json()
      toast('Artifact duplicado correctamente', 'success')
      router.push(`/artifacts/${created.id}`)
      router.refresh()
    } catch {
      toast('Error al duplicar el artifact', 'error')
      setDuplicating(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/artifacts/${artifact.id}`, { method: 'DELETE' })
    toast('Artifact eliminado', 'success')
    router.push('/artifacts')
    router.refresh()
  }

  const item = 'flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors text-left disabled:opacity-50'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
        aria-label="Más acciones"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-20 w-56 bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 shadow-light-lg overflow-hidden">

          {/* ── Notify compose view ── */}
          {view === 'notify' && (
            <div className="p-3 space-y-2.5">
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => { setView('menu'); setNotifyMessage('') }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  aria-label="Volver"
                >
                  ←
                </button>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Notificar al equipo</span>
              </div>
              <textarea
                value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
                placeholder="Mensaje para el equipo (opcional)&#10;Ej. Listo para implementar, prioridad sprint 4"
                rows={4}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-night-801 px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors resize-none"
                autoFocus
              />
              <button
                onClick={handleNotify}
                disabled={notifyState === 'loading' || notifyState === 'sent'}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-lipu-500 text-lipu-text hover:bg-lipu-600 disabled:opacity-60 transition-colors"
              >
                {notifyState === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {notifyState === 'sent'    && <Check   className="w-3.5 h-3.5" />}
                {notifyState === 'error'   && <Bell    className="w-3.5 h-3.5" />}
                {notifyState === 'idle'    && <Bell    className="w-3.5 h-3.5" />}
                {notifyState === 'loading' ? 'Enviando…' : notifyState === 'sent' ? 'Enviado' : notifyState === 'error' ? 'Error, reintentar' : 'Enviar notificación'}
              </button>
            </div>
          )}

          {/* ── Main menu ── */}
          {view === 'menu' && (
            <div className="py-1.5">
              {hasSlack && (
                <button onClick={() => setView('notify')} className={item}>
                  <Bell className="w-3.5 h-3.5" />
                  Notificar al equipo
                </button>
              )}

              {hasParent && (
                <Link href={`/artifacts/${artifact.id}/compare`} onClick={() => setOpen(false)} className={item}>
                  <GitCompare className="w-3.5 h-3.5" />
                  Comparar versiones
                </Link>
              )}

              <button onClick={handleDuplicate} disabled={duplicating} className={item}>
                {duplicating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
                Duplicar
              </button>

              <div className="border-t border-gray-100 dark:border-night-801 mt-1 pt-1">
                {!confirmDelete ? (
                  <button onClick={() => setConfirmDelete(true)} className={cn(item, 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20')}>
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </button>
                ) : (
                  <div className="px-3 py-2 space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">¿Confirmar eliminación?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Eliminar'}
                      </button>
                      <button onClick={() => setConfirmDelete(false)} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
