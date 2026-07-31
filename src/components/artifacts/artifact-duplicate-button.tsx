'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import type { Artifact } from '@/lib/types'

function bumpVersion(version: string): string {
  const parts = version.split('.')
  const last = parseInt(parts[parts.length - 1] ?? '0', 10)
  parts[parts.length - 1] = String(isNaN(last) ? 1 : last + 1)
  return parts.join('.')
}

export function ArtifactDuplicateButton({ artifact }: { artifact: Artifact }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleDuplicate() {
    setLoading(true)
    try {
      const nextVersion = bumpVersion(artifact.version)
      const res = await fetch('/api/artifacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: artifact.name,
          module: artifact.module,
          version: nextVersion,
          versionNote: '',
          status: 'borrador',
          description: artifact.description,
          tags: artifact.tags,
          links: artifact.links,
          code: artifact.code,
          codeUrl: artifact.codeUrl,
          imageUrls: artifact.imageUrls,
          date: new Date().toISOString().split('T')[0],
          parentId: artifact.id,
        }),
      })
      if (!res.ok) throw new Error()
      const created = await res.json()
      toast('Artifact duplicado correctamente', 'success')
      router.push(`/artifacts/${created.id}`)
      router.refresh()
    } catch {
      toast('Error al duplicar el artifact', 'error')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDuplicate}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
      Duplicar
    </button>
  )
}
