'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastOptions {
  action?: ToastAction
  /** ms visibles; default 3500 (con acción: 6000) */
  duration?: number
}

interface ToastItem {
  id: string
  message: string
  type: ToastType
  action?: ToastAction
  duration: number
}

const ToastContext = createContext<{
  toast: (message: string, type?: ToastType, options?: ToastOptions) => void
}>({
  toast: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success', options?: ToastOptions) => {
    const id = Math.random().toString(36).slice(2)
    const duration = options?.duration ?? (options?.action ? 6000 : 3500)
    setToasts((prev) => [...prev, { id, message, type, action: options?.action, duration }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const CONFIG = {
  success: {
    icon: CheckCircle2,
    bar: 'bg-green-500',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  error: {
    icon: XCircle,
    bar: 'bg-red-500',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  info: {
    icon: Info,
    bar: 'bg-blue-500',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
}

function Toast({ message, type, action, duration, onDismiss }: ToastItem & { onDismiss: () => void }) {
  const { icon: Icon, bar, iconColor } = CONFIG[type]
  const [paused, setPaused] = useState(false)
  const remaining = useRef(duration)
  const startedAt = useRef<number>(0)

  // Auto-dismiss con pausa al hacer hover (se conserva el tiempo restante).
  useEffect(() => {
    if (paused) return
    startedAt.current = Date.now()
    const timer = setTimeout(onDismiss, remaining.current)
    return () => {
      clearTimeout(timer)
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused])

  return (
    <div
      role="status"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="pointer-events-auto flex items-stretch bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 shadow-lg overflow-hidden w-80"
    >
      <div className={cn('w-1 shrink-0', bar)} />
      <div className="flex items-start gap-3 flex-1 px-3 py-3">
        <Icon className={cn('w-4 h-4 shrink-0 mt-0.5', iconColor)} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 dark:text-gray-100 leading-snug">{message}</p>
          {action && (
            <button
              onClick={() => { action.onClick(); onDismiss() }}
              className="mt-1.5 text-xs font-semibold text-lipu-600 dark:text-lipu-500 hover:underline focus:outline-none focus:ring-2 focus:ring-lipu-500/20 rounded"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Cerrar notificación"
        className="px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
