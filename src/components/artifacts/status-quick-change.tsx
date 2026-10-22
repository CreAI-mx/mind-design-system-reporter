'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { useTaxonomy } from '@/components/taxonomy-provider'
import { colorClasses } from '@/lib/colors'
import { findStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

// Cambio de estado de un clic desde el detalle: la mutación más frecuente
// del ciclo de vida sin pasar por el formulario de edición.
export function StatusQuickChange({ artifactId, status }: { artifactId: string; status: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const taxonomy = useTaxonomy()
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const current = findStatus(taxonomy, status)

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  async function change(key: string) {
    setOpen(false)
    if (key === status) return
    setSaving(true)
    try {
      const res = await fetch(`/api/artifacts/${artifactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: key }),
      })
      if (!res.ok) throw new Error()
      toast(`Estado cambiado a ${findStatus(taxonomy, key)?.label ?? key}`, 'success')
      router.refresh()
    } catch {
      toast('No se pudo cambiar el estado', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={saving}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Cambiar estado"
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-shadow',
          'hover:ring-2 hover:ring-lipu-500/30 focus:outline-none focus:ring-2 focus:ring-lipu-500/40 disabled:opacity-60',
          colorClasses(current?.color).badge
        )}
      >
        {current?.label ?? status}
        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-1.5 z-20 w-44 bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 shadow-light-lg overflow-hidden py-1.5"
        >
          {taxonomy.statuses.map((s) => (
            <button
              key={s.key}
              role="menuitem"
              onClick={() => change(s.key)}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm transition-colors',
                s.key === status
                  ? 'text-gray-400 cursor-default'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801'
              )}
            >
              <span className={cn('inline-block px-1.5 py-0.5 rounded-full text-[10px] font-medium', colorClasses(s.color).badge)}>
                {s.label}
              </span>
              {s.key === status && <span className="ml-auto text-[10px]">actual</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
