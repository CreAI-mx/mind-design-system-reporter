'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

// "Volver" que respeta el origen: usa el historial si lo hay (home, búsqueda,
// lista filtrada) y cae al href cuando se llegó por enlace directo.
export function BackLink({ fallback, label }: { fallback: string; label: string }) {
  const router = useRouter()

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    if (window.history.length > 1) router.back()
    else router.push(fallback)
  }

  return (
    <a
      href={fallback}
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      {label}
    </a>
  )
}
