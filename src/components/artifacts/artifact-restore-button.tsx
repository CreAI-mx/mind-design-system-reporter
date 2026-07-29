'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export function ArtifactRestoreButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleRestore() {
    setLoading(true)
    try {
      const res = await fetch(`/api/artifacts/${id}/restore`, { method: 'POST' })
      if (!res.ok) throw new Error()
      toast(`"${name}" restaurado correctamente`, 'success')
      router.push(`/artifacts/${id}`)
      router.refresh()
    } catch {
      toast('Error al restaurar el artifact', 'error')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleRestore}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-lipu-500 text-lipu-text hover:bg-lipu-600 transition-colors disabled:opacity-50 shrink-0"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
      Restaurar
    </button>
  )
}
