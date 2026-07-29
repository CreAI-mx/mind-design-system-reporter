'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

const ToastContext = createContext<{ toast: (message: string, type?: ToastType) => void }>({
  toast: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            {...t}
            onDismiss={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
          />
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

function Toast({ message, type, onDismiss }: ToastItem & { onDismiss: () => void }) {
  const { icon: Icon, bar, iconColor } = CONFIG[type]
  return (
    <div className="pointer-events-auto flex items-stretch bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 shadow-lg overflow-hidden w-80">
      <div className={cn('w-1 shrink-0', bar)} />
      <div className="flex items-start gap-3 flex-1 px-3 py-3">
        <Icon className={cn('w-4 h-4 shrink-0 mt-0.5', iconColor)} />
        <p className="flex-1 text-sm text-gray-800 dark:text-gray-100 leading-snug">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
