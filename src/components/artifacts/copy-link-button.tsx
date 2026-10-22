'use client'

import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'

// Copiar la URL del artifact: disponible también para visitantes sin sesión.
export function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Sin clipboard API (http antiguo): no hay nada razonable que hacer.
    }
  }

  return (
    <button
      onClick={copy}
      aria-label="Copiar enlace del artifact"
      title="Copiar enlace"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-500" />
          <span className="text-green-600 dark:text-green-400">Copiado</span>
        </>
      ) : (
        <>
          <Link2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Enlace</span>
        </>
      )}
    </button>
  )
}
