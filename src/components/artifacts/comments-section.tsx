'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, Send, Trash2, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Comment } from '@/lib/comments'

const AUTHOR_KEY = 'mind_comment_author'
const TOKEN_KEY = 'mind_comment_token'
const MY_COMMENTS_KEY = 'mind_my_comments'

function getBrowserToken(): string {
  let token = localStorage.getItem(TOKEN_KEY)
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem(TOKEN_KEY, token)
  }
  return token
}

function getMyCommentIds(): Set<string> {
  try {
    const raw = localStorage.getItem(MY_COMMENTS_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function saveMyCommentId(id: string) {
  const ids = getMyCommentIds()
  ids.add(id)
  localStorage.setItem(MY_COMMENTS_KEY, JSON.stringify([...ids]))
}

function removeMyCommentId(id: string) {
  const ids = getMyCommentIds()
  ids.delete(id)
  localStorage.setItem(MY_COMMENTS_KEY, JSON.stringify([...ids]))
}

interface CommentsSectionProps {
  artifactId: string
}

export function CommentsSection({ artifactId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState('')
  const [author, setAuthor] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [myCommentIds, setMyCommentIds] = useState<Set<string>>(new Set())
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(AUTHOR_KEY)
    if (saved) setAuthor(saved)
    setMyCommentIds(getMyCommentIds())
  }, [])

  useEffect(() => {
    fetch(`/api/artifacts/${artifactId}/comments`)
      .then((r) => r.json())
      .then((data: Comment[]) => setComments(data))
      .finally(() => setLoading(false))
  }, [artifactId])

  useEffect(() => {
    if (!loading) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments, loading])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim() || submitting) return
    setSubmitting(true)
    const token = getBrowserToken()
    localStorage.setItem(AUTHOR_KEY, author.trim() || 'Anónimo')
    try {
      const res = await fetch(`/api/artifacts/${artifactId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, author: author.trim() || 'Anónimo', token }),
      })
      const comment: Comment = await res.json()
      saveMyCommentId(comment.id)
      setMyCommentIds((prev) => new Set([...prev, comment.id]))
      setComments((prev) => [...prev, comment])
      setBody('')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    const token = getBrowserToken()
    try {
      const res = await fetch(`/api/artifacts/${artifactId}/comments/${id}`, {
        method: 'DELETE',
        headers: { 'x-comment-token': token },
      })
      if (res.ok) {
        removeMyCommentId(id)
        setMyCommentIds((prev) => { const next = new Set(prev); next.delete(id); return next })
        setComments((prev) => prev.filter((c) => c.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors'

  return (
    <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 dark:border-night-801 flex items-center gap-2">
        <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Comentarios
          {comments.length > 0 && (
            <span className="ml-2 text-gray-300 font-normal normal-case tracking-normal">{comments.length}</span>
          )}
        </h2>
      </div>

      {/* Comments list */}
      <div className="px-5 py-4 space-y-4 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6 italic">
            Sin comentarios. Sé el primero en agregar feedback.
          </p>
        ) : (
          comments.map((comment) => (
            <CommentBubble
              key={comment.id}
              comment={comment}
              canDelete={myCommentIds.has(comment.id)}
              deleting={deletingId === comment.id}
              onDelete={() => handleDelete(comment.id)}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-night-801">
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Tu nombre (opcional)"
            className={cn(inputClass, 'text-xs py-1.5')}
          />
          <div className="flex gap-2">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e as any)
              }}
              placeholder="Escribe un comentario... (Cmd+Enter para enviar)"
              rows={3}
              className={cn(inputClass, 'resize-none flex-1')}
            />
            <button
              type="submit"
              disabled={!body.trim() || submitting}
              className="self-end flex items-center gap-1.5 px-3 py-2 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium disabled:opacity-50 transition-colors shrink-0"
            >
              {submitting
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Send className="w-3.5 h-3.5" />
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CommentBubble({
  comment,
  canDelete,
  deleting,
  onDelete,
}: {
  comment: Comment
  canDelete: boolean
  deleting: boolean
  onDelete: () => void
}) {
  const date = new Date(comment.createdAt)
  const relative = formatRelative(date)

  return (
    <div className="group flex gap-3">
      <div className="w-7 h-7 rounded-full bg-lipu-600/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-xs font-semibold text-lipu-500">
          {comment.author.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-gray-900 dark:text-white">{comment.author}</span>
          <span className="text-[10px] text-gray-400">{relative}</span>
        </div>
        <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
          {comment.body}
        </p>
      </div>
      {canDelete && <button
        onClick={onDelete}
        disabled={deleting}
        className="opacity-0 group-hover:opacity-100 self-start mt-0.5 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-all disabled:opacity-50"
        title="Eliminar comentario"
      >
        {deleting
          ? <Loader2 className="w-3 h-3 animate-spin" />
          : <Trash2 className="w-3 h-3" />
        }
      </button>}
    </div>
  )
}

function formatRelative(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `hace ${days} d`
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}
