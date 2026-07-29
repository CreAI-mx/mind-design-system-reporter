'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export function ArtifactDeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [confirm, setConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/artifacts/${id}`, { method: 'DELETE' })
    toast('Artifact eliminado', 'success')
    router.push('/artifacts')
    router.refresh()
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">¿Eliminar?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Sí, eliminar'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Eliminar
    </button>
  )
}
