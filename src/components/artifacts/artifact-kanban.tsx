'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Code2, GitBranch } from 'lucide-react'
import { findGroup, findModule, type Artifact, type ArtifactStatus } from '@/lib/types'
import { colorClasses } from '@/lib/colors'
import { useTaxonomy } from '@/components/taxonomy-provider'
import { StatusBadge } from './status-badge'
import { formatDate, cn } from '@/lib/utils'

interface ArtifactKanbanProps {
  artifacts: Artifact[]
  onStatusChange: (id: string, status: ArtifactStatus) => Promise<void>
}

export function ArtifactKanban({ artifacts, onStatusChange }: ArtifactKanbanProps) {
  const { statuses } = useTaxonomy()
  const columns = statuses.map((s) => ({
    status: s.key,
    label: s.label,
    accent: colorClasses(s.color).text,
    drop: colorClasses(s.color).drop,
  }))
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<ArtifactStatus | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const byStatus = (status: ArtifactStatus) =>
    artifacts.filter((a) => a.status === status)

  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggingId(id)
    e.dataTransfer.setData('artifactId', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragEnd() {
    setDraggingId(null)
    setOverColumn(null)
  }

  function handleDragOver(e: React.DragEvent, status: ArtifactStatus) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOverColumn(status)
  }

  function handleDragLeave() {
    setOverColumn(null)
  }

  async function handleDrop(e: React.DragEvent, status: ArtifactStatus) {
    e.preventDefault()
    setOverColumn(null)
    const id = e.dataTransfer.getData('artifactId')
    const artifact = artifacts.find((a) => a.id === id)
    if (!artifact || artifact.status === status) return
    setUpdating(id)
    try {
      await onStatusChange(id, status)
    } finally {
      setUpdating(null)
      setDraggingId(null)
    }
  }

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex gap-3 p-6 min-w-max h-full">
        {columns.map((col) => {
          const cards = byStatus(col.status)
          const isOver = overColumn === col.status

          return (
            <div
              key={col.status}
              className="flex flex-col w-64 shrink-0"
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.status)}
            >
              {/* Column header */}
              <div className={cn(
                'flex items-center justify-between px-3 py-2 rounded-t-xl border border-b-0 transition-colors',
                isOver ? col.drop : 'border-gray-200 dark:border-night-801 bg-white dark:bg-night-802'
              )}>
                <span className={cn('text-xs font-semibold', col.accent)}>{col.label}</span>
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-night-801 rounded-full px-1.5 py-0.5 font-medium">
                  {cards.length}
                </span>
              </div>

              {/* Drop zone */}
              <div className={cn(
                'flex-1 rounded-b-xl border border-t-0 p-2 space-y-2 transition-colors min-h-32',
                isOver
                  ? cn(col.drop, 'border-2 border-dashed')
                  : 'border-gray-200 dark:border-night-801 bg-gray-50 dark:bg-night-803'
              )}>
                {cards.map((artifact) => (
                  <KanbanCard
                    key={artifact.id}
                    artifact={artifact}
                    dragging={draggingId === artifact.id}
                    updating={updating === artifact.id}
                    onDragStart={(e) => handleDragStart(e, artifact.id)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
                {cards.length === 0 && (
                  <div className="flex items-center justify-center h-16">
                    <p className="text-xs text-gray-400 italic">Sin artifacts</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KanbanCard({
  artifact,
  dragging,
  updating,
  onDragStart,
  onDragEnd,
}: {
  artifact: Artifact
  dragging: boolean
  updating: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
}) {
  const taxonomy = useTaxonomy()
  const mod = findModule(taxonomy, artifact.module)
  const group = findGroup(taxonomy, mod?.groupKey)

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'bg-white dark:bg-night-802 rounded-lg border border-gray-200 dark:border-night-801 p-3 cursor-grab active:cursor-grabbing transition-all select-none',
        dragging && 'opacity-40 scale-95',
        updating && 'opacity-60 pointer-events-none',
        !dragging && !updating && 'hover:border-lipu-500/40 hover:shadow-sm',
      )}
    >
      {/* Module */}
      {mod && (
        <p className={cn('text-[10px] font-semibold uppercase tracking-wider mb-1', colorClasses(group?.color).text)}>
          {mod.label}
        </p>
      )}

      {/* Name */}
      <Link
        href={`/artifacts/${artifact.id}`}
        onClick={(e) => e.stopPropagation()}
        className="block text-sm font-medium text-gray-900 dark:text-white hover:text-lipu-500 transition-colors line-clamp-2 mb-2"
        draggable={false}
      >
        {artifact.name || 'Sin nombre'}
      </Link>

      {/* Tags */}
      {artifact.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-2">
          {artifact.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-night-801 text-gray-500 dark:text-gray-400">
              {tag}
            </span>
          ))}
          {artifact.tags.length > 2 && (
            <span className="text-[10px] text-gray-400">+{artifact.tags.length - 2}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-gray-400 font-mono">v{artifact.version}</span>
        <div className="flex items-center gap-1.5">
          {artifact.parentId && <GitBranch className="w-3 h-3 text-gray-300 dark:text-gray-600" />}
          {artifact.links.length > 0 && <ExternalLink className="w-3 h-3 text-gray-300 dark:text-gray-600" />}
          {artifact.code && <Code2 className="w-3 h-3 text-gray-300 dark:text-gray-600" />}
          <span className="text-[10px] text-gray-400">{formatDate(artifact.date)}</span>
        </div>
      </div>
    </div>
  )
}
