'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
}

const inputClass =
  'w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors'

export function TagInput({ value, onChange }: TagInputProps) {
  const [allTags, setAllTags] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/tags')
      .then((r) => r.json())
      .then((tags: string[]) => setAllTags(tags))
      .catch(() => {})
  }, [])

  const lower = input.trim().toLowerCase()
  const suggestions = allTags.filter((t) => (!lower || t.includes(lower)) && !value.includes(t))
  const showCreate = lower && !allTags.includes(lower) && !value.includes(lower)
  const options = [...suggestions, ...(showCreate ? [`__create__:${lower}`] : [])]

  function addTag(opt: string) {
    const normalized = opt.startsWith('__create__:') ? opt.slice(11) : opt
    if (!normalized || value.includes(normalized)) return
    onChange([...value, normalized])
    if (!allTags.includes(normalized)) {
      setAllTags((prev) => [...prev, normalized].sort())
      fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: [normalized] }),
      }).catch(() => {})
    }
    setInput('')
    setOpen(false)
    setHighlighted(0)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (open && options.length > 0) {
        addTag(options[highlighted] ?? lower)
      } else if (lower) {
        addTag(lower)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <input
        value={input}
        onChange={(e) => { setInput(e.target.value); setOpen(true); setHighlighted(0) }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? 'Buscar o crear etiqueta...' : 'Agregar otra etiqueta...'}
        className={inputClass}
      />

      {open && options.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg bg-white dark:bg-night-802 border border-gray-200 dark:border-night-801 shadow-lg overflow-hidden max-h-52 overflow-y-auto">
          {options.map((opt, i) => {
            const isCreate = opt.startsWith('__create__:')
            const label = isCreate ? opt.slice(11) : opt
            return (
              <button
                key={opt}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); addTag(opt) }}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors',
                  i === highlighted
                    ? 'bg-lipu-600/10 text-lipu-500 dark:text-lipu-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801'
                )}
              >
                {isCreate ? (
                  <>
                    <span className="text-xs font-semibold text-lipu-500">+ Crear</span>
                    <span className="font-medium">{label}</span>
                  </>
                ) : (
                  <span>{label}</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {value.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-3">
          {value.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-night-801 text-gray-600 dark:text-gray-300"
            >
              {tag}
              <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))}>
                <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
