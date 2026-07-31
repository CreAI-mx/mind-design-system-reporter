'use client'

import { useState } from 'react'
import { Bell, Check, Loader2 } from 'lucide-react'

type State = 'idle' | 'loading' | 'sent' | 'error'

export function ArtifactNotifyButton({ artifactId }: { artifactId: string }) {
  const [state, setState] = useState<State>('idle')

  async function handleClick() {
    if (state !== 'idle') return
    setState('loading')
    try {
      const res = await fetch(`/api/artifacts/${artifactId}/notify-slack`, { method: 'POST' })
      if (!res.ok) throw new Error()
      setState('sent')
      setTimeout(() => setState('idle'), 3000)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={state !== 'idle'}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors disabled:cursor-default ${
        state === 'sent'
          ? 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
          : state === 'error'
          ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801'
      }`}
    >
      {state === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {state === 'sent'    && <Check className="w-3.5 h-3.5" />}
      {state === 'error'   && <Bell className="w-3.5 h-3.5" />}
      {state === 'idle'    && <Bell className="w-3.5 h-3.5" />}
      {state === 'loading' ? 'Enviando…' : state === 'sent' ? 'Enviado' : state === 'error' ? 'Error' : 'Notificar'}
    </button>
  )
}
