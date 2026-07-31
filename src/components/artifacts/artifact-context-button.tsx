'use client'

import { useState } from 'react'
import { ClipboardCopy, Check } from 'lucide-react'
import { MODULES } from '@/lib/modules'
import { formatDate } from '@/lib/utils'
import type { Artifact } from '@/lib/types'

interface ArtifactContextButtonProps {
  artifact: Artifact
  parent: Artifact | null
  children: Artifact[]
}

function buildPrompt(artifact: Artifact, parent: Artifact | null, children: Artifact[]): string {
  const mod = MODULES.find((m) => m.key === artifact.module)
  const lines: string[] = []

  lines.push(`# Artifact: ${artifact.name}`)
  lines.push('')
  lines.push(`**Módulo:** ${mod?.label ?? artifact.module}`)
  lines.push(`**Versión:** ${artifact.version}${artifact.versionNote ? ` — ${artifact.versionNote}` : ''}`)
  lines.push(`**Estado:** ${artifact.status}`)
  lines.push(`**Fecha:** ${formatDate(artifact.date)}`)
  if (artifact.tags.length > 0) lines.push(`**Etiquetas:** ${artifact.tags.join(', ')}`)

  if (artifact.description) {
    lines.push('')
    lines.push('## Descripción')
    lines.push(artifact.description)
  }

  if (parent || children.length > 0) {
    lines.push('')
    lines.push('## Historial de versiones')
    if (parent) {
      lines.push(`- **Versión anterior:** ${parent.name} (v${parent.version})`)
    }
    if (children.length > 0) {
      children.forEach((c) => {
        lines.push(`- **Versión siguiente:** ${c.name} (v${c.version})`)
      })
    }
  }

  if (artifact.links.length > 0) {
    lines.push('')
    lines.push('## Enlaces')
    artifact.links.forEach((l) => lines.push(`- ${l}`))
  }

  if (artifact.imageUrls.length > 0) {
    lines.push('')
    lines.push('## Imágenes de referencia')
    artifact.imageUrls.forEach((u) => lines.push(`- ${u}`))
  }

  if (artifact.codeUrl) {
    lines.push('')
    lines.push('## Código externo')
    lines.push(artifact.codeUrl)
  }

  if (artifact.code) {
    lines.push('')
    lines.push('## Código entregado')
    lines.push('```')
    lines.push(artifact.code)
    lines.push('```')
  }

  lines.push('')
  lines.push('## Instrucciones para Claude Design')
  lines.push('Usa el Design System de LIPU Mind como base. Referencia Flowbite para la estructura de componentes y aplica los tokens del proyecto (`lipu-500` para brand, `night-802` para superficies dark). Mantén el mismo nombre, módulo y contexto de este artifact.')

  return lines.join('\n')
}

export function ArtifactContextButton({ artifact, parent, children }: ArtifactContextButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const prompt = buildPrompt(artifact, parent, children)
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-500" />
          <span className="text-green-600 dark:text-green-400">Copiado</span>
        </>
      ) : (
        <>
          <ClipboardCopy className="w-3.5 h-3.5" />
          Copiar contexto
        </>
      )}
    </button>
  )
}
