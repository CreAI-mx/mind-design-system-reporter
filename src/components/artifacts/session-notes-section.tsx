'use client'

import { useState, useEffect } from 'react'
import { FileText, Plus, Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionNote } from '@/lib/types'

const TOKEN_KEY = 'mind_session_token'
const MY_NOTES_KEY = 'mind_my_session_notes'

function getBrowserToken(): string {
  let token = localStorage.getItem(TOKEN_KEY)
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem(TOKEN_KEY, token)
  }
  return token
}

function getMyNoteIds(): Set<string> {
  try {
    const raw = localStorage.getItem(MY_NOTES_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function saveMyNoteId(id: string) {
  const ids = getMyNoteIds()
  ids.add(id)
  localStorage.setItem(MY_NOTES_KEY, JSON.stringify([...ids]))
}

function removeMyNoteId(id: string) {
  const ids = getMyNoteIds()
  ids.delete(id)
  localStorage.setItem(MY_NOTES_KEY, JSON.stringify([...ids]))
}

const inputClass =
  'w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors'

interface Props {
  artifactId: string
}

export function SessionNotesSection({ artifactId }: Props) {
  const [notes, setNotes] = useState<SessionNote[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [myNoteIds, setMyNoteIds] = useState<Set<string>>(new Set())

  const [sessionName, setSessionName] = useState('')
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0])
  const [noteText, setNoteText] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    setMyNoteIds(getMyNoteIds())
    fetch(`/api/artifacts/${artifactId}/session-notes`)
      .then((r) => r.json())
      .then((data) => { setNotes(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [artifactId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!sessionName.trim() || !noteText.trim()) return
    setSaving(true)
    const token = getBrowserToken()
    try {
      const res = await fetch(`/api/artifacts/${artifactId}/session-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionName, sessionDate, notes: noteText, browserToken: token }),
      })
      if (!res.ok) throw new Error()
      const created: SessionNote = await res.json()
      saveMyNoteId(created.id)
      setMyNoteIds((prev) => new Set([...prev, created.id]))
      setNotes((prev) => [created, ...prev])
      setSessionName('')
      setNoteText('')
      setSessionDate(new Date().toISOString().split('T')[0])
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    const token = getBrowserToken()
    try {
      const res = await fetch(`/api/artifacts/${artifactId}/session-notes/${id}`, {
        method: 'DELETE',
        headers: { 'x-session-token': token },
      })
      if (res.ok) {
        removeMyNoteId(id)
        setMyNoteIds((prev) => { const next = new Set(prev); next.delete(id); return next })
        setNotes((prev) => prev.filter((n) => n.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 overflow-hidden">
      {/* Header — always visible, toggles form */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
      >
        <h2 className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          Notas de sesión
          {notes.length > 0 && (
            <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-night-801 text-gray-500">
              {notes.length}
            </span>
          )}
        </h2>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-gray-100 dark:border-night-801 pt-4">
          {/* Add form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Nombre de la sesión <span className="text-red-500">*</span>
                </label>
                <input
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Ej. Design review sprint 4"
                  className={inputClass}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Fecha</label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                Notas <span className="text-red-500">*</span>
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                placeholder="Qué se discutió, qué cambios se solicitaron, quién participó..."
                className={cn(inputClass, 'resize-none')}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !sessionName.trim() || !noteText.trim()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-xs font-medium disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Agregar nota
              </button>
            </div>
          </form>

          {/* Notes list */}
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          ) : notes.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              Sin notas de sesión aún. Agrega la primera arriba.
            </p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="group rounded-lg border border-gray-100 dark:border-night-801 bg-gray-50 dark:bg-night-803 p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {note.sessionName}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-lipu-500/10 text-lipu-500">
                        {new Date(note.sessionDate + 'T12:00:00').toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    {myNoteIds.has(note.id) && (
                      <button
                        onClick={() => handleDelete(note.id)}
                        disabled={deletingId === note.id}
                        className="shrink-0 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Eliminar nota"
                      >
                        {deletingId === note.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {note.notes}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
