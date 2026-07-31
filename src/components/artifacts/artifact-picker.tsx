'use client'

import { useState, useEffect, useRef } from 'react'
import { X, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MODULES } from '@/lib/modules'
import type { Artifact } from '@/lib/types'

interface ArtifactPickerProps {
  value: string
  onChange: (id: string) => void
  excludeId?: string
}

const inputClass =
  'w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors'

export function ArtifactPicker({ value, onChange, excludeId }: ArtifactPickerProps) {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/artifacts')
      .then((r) => r.json())
      .then((data: Artifact[]) =>
        setArtifacts(data.filter((a) => a.id !== excludeId))
      )
      .catch(() => {})
  }, [excludeId])

  const selected = artifacts.find((a) => a.id === value)

  const options = artifacts
    .filter((a) => {
      if (!input) return true
      const q = input.toLowerCase()
      const mod = MODULES.find((m) => m.key === a.module)
      return (
        a.name.toLowerCase().includes(q) ||
        (mod?.label ?? a.module).toLowerCase().includes(q)
      )
    })
    .slice(0, 10)

  function select(artifact: Artifact) {
    onChange(artifact.id)
    setInput('')
    setOpen(false)
    setHighlighted(0)
  }

  function clear() {
    onChange('')
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (open && options[highlighted]) select(options[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (selected) {
    const mod = MODULES.find((m) => m.key === selected.module)
    return (
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-lipu-500/40 bg-lipu-600/5 dark:bg-lipu-600/10">
        <GitBranch className="w-3.5 h-3.5 text-lipu-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{selected.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {mod?.label ?? selected.module} · v{selected.version}
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-night-801 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        value={input}
        onChange={(e) => { setInput(e.target.value); setOpen(true); setHighlighted(0) }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar artifact por nombre o módulo..."
        className={inputClass}
      />

      {open && options.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg bg-white dark:bg-night-802 border border-gray-200 dark:border-night-801 shadow-lg overflow-hidden max-h-60 overflow-y-auto">
          {options.map((artifact, i) => {
            const mod = MODULES.find((m) => m.key === artifact.module)
            return (
              <button
                key={artifact.id}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); select(artifact) }}
                className={cn(
                  'w-full text-left px-3 py-2.5 flex flex-col gap-0.5 transition-colors border-b border-gray-50 dark:border-night-801 last:border-0',
                  i === highlighted
                    ? 'bg-lipu-600/10'
                    : 'hover:bg-gray-50 dark:hover:bg-night-801'
                )}
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{artifact.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {mod?.label ?? artifact.module} · v{artifact.version}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
