'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, GitBranch } from 'lucide-react'
import type { Artifact } from '@/lib/types'
import { MODULES } from '@/lib/modules'
import { StatusBadge } from './status-badge'
import { formatDate, cn } from '@/lib/utils'

/* ── Diff engine ──────────────────────────────────────────── */

type DiffLine = { type: 'same' | 'added' | 'removed'; text: string }

function diffLines(oldStr: string, newStr: string): DiffLine[] {
  const oldLines = (oldStr ?? '').split('\n')
  const newLines = (newStr ?? '').split('\n')

  // Performance guard
  if (oldLines.length > 600 || newLines.length > 600) {
    return [
      ...oldLines.map((text) => ({ type: 'removed' as const, text })),
      ...newLines.map((text) => ({ type: 'added' as const, text })),
    ]
  }

  const m = oldLines.length
  const n = newLines.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        oldLines[i - 1] === newLines[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  const result: DiffLine[] = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.unshift({ type: 'same', text: oldLines[i - 1] })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', text: newLines[j - 1] })
      j--
    } else {
      result.unshift({ type: 'removed', text: oldLines[i - 1] })
      i--
    }
  }
  return result
}

function tagDiff(oldTags: string[], newTags: string[]) {
  const removed = oldTags.filter((t) => !newTags.includes(t))
  const added = newTags.filter((t) => !oldTags.includes(t))
  const same = newTags.filter((t) => oldTags.includes(t))
  return { removed, added, same }
}

/* ── CompareView ──────────────────────────────────────────── */

interface CompareViewProps {
  artifact: Artifact
  parent: Artifact
}

export function CompareView({ artifact, parent }: CompareViewProps) {
  const mod = MODULES.find((m) => m.key === artifact.module)
  const codeDiff = diffLines(parent.code ?? '', artifact.code ?? '')
  const descDiff = diffLines(parent.description ?? '', artifact.description ?? '')
  const { removed: tagsRemoved, added: tagsAdded, same: tagsSame } = tagDiff(parent.tags, artifact.tags)

  const hasCodeChange = parent.code !== artifact.code
  const hasDescChange = parent.description !== artifact.description
  const hasTagChange = tagsRemoved.length > 0 || tagsAdded.length > 0
  const hasStatusChange = parent.status !== artifact.status

  const addedLines = codeDiff.filter((l) => l.type === 'added').length
  const removedLines = codeDiff.filter((l) => l.type === 'removed').length

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {/* Back */}
      <Link
        href={`/artifacts/${artifact.id}`}
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver al artifact
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-5">
        <div className="flex items-center gap-2 mb-1">
          <GitBranch className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Comparación de versiones</span>
        </div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {artifact.name}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">v{parent.version}</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white font-mono">v{artifact.version}</span>
          {artifact.versionNote && (
            <span className="text-xs text-gray-500 dark:text-gray-400 italic">— {artifact.versionNote}</span>
          )}
          {mod && <span className="text-xs text-gray-400">{mod.label}</span>}
        </div>

        {/* Summary pills */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {hasCodeChange && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium">
              Código
              {addedLines > 0 && <span className="ml-1 text-green-600 dark:text-green-400">+{addedLines}</span>}
              {removedLines > 0 && <span className="ml-1 text-red-500">-{removedLines}</span>}
            </span>
          )}
          {hasDescChange && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium">Descripción</span>
          )}
          {hasTagChange && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium">Etiquetas</span>
          )}
          {hasStatusChange && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">Status</span>
          )}
          {!hasCodeChange && !hasDescChange && !hasTagChange && !hasStatusChange && (
            <span className="text-xs text-gray-400 italic">Sin cambios detectados en campos comparables</span>
          )}
        </div>
      </div>

      {/* Metadata comparison */}
      <Section title="Metadatos">
        <div className="divide-y divide-gray-100 dark:divide-night-801">
          <MetaRow label="Status" changed={hasStatusChange}>
            <StatusBadge status={parent.status} />
            {hasStatusChange && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <StatusBadge status={artifact.status} />
              </>
            )}
          </MetaRow>
          <MetaRow label="Versión" changed={parent.version !== artifact.version}>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-mono">v{parent.version}</span>
            {parent.version !== artifact.version && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white font-mono">v{artifact.version}</span>
              </>
            )}
          </MetaRow>
          <MetaRow label="Fecha" changed={parent.date !== artifact.date}>
            <span className="text-sm text-gray-600 dark:text-gray-300">{formatDate(parent.date)}</span>
            {parent.date !== artifact.date && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(artifact.date)}</span>
              </>
            )}
          </MetaRow>
        </div>
      </Section>

      {/* Tags */}
      {hasTagChange && (
        <Section title="Etiquetas">
          <div className="flex gap-2 flex-wrap">
            {tagsRemoved.map((t) => (
              <span key={t} className="flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 line-through">
                {t}
              </span>
            ))}
            {tagsSame.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-night-801 text-gray-500 dark:text-gray-400">
                {t}
              </span>
            ))}
            {tagsAdded.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium">
                + {t}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Description diff */}
      {hasDescChange && (
        <Section title="Descripción">
          <DiffBlock lines={descDiff} />
        </Section>
      )}

      {/* Code diff */}
      {hasCodeChange && (
        <Section title="Código">
          {codeDiff.length === 0 ? (
            <p className="text-xs text-gray-400 italic">Sin contenido en ambas versiones</p>
          ) : (
            <CodeDiff lines={codeDiff} />
          )}
        </Section>
      )}
    </div>
  )
}

/* ── Sub-components ───────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 dark:border-night-801">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function MetaRow({ label, changed, children }: { label: string; changed: boolean; children: React.ReactNode }) {
  return (
    <div className={cn('flex items-center gap-3 py-2.5', changed && 'bg-amber-50/50 dark:bg-amber-900/10 -mx-5 px-5 rounded')}>
      <span className="text-xs text-gray-400 w-20 shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-wrap">{children}</div>
    </div>
  )
}

function DiffBlock({ lines }: { lines: DiffLine[] }) {
  return (
    <div className="space-y-0.5 text-sm font-mono">
      {lines.map((line, i) => (
        <div
          key={i}
          className={cn(
            'px-3 py-0.5 rounded text-xs whitespace-pre-wrap break-all',
            line.type === 'added' && 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300',
            line.type === 'removed' && 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 line-through opacity-70',
            line.type === 'same' && 'text-gray-500 dark:text-gray-400',
          )}
        >
          <span className="select-none mr-2 opacity-50">
            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
          </span>
          {line.text || ' '}
        </div>
      ))}
    </div>
  )
}

function CodeDiff({ lines }: { lines: DiffLine[] }) {
  let oldN = 0, newN = 0

  return (
    <div className="not-prose overflow-x-auto rounded-xl bg-[#1e1e1e] border border-gray-700 text-xs font-mono leading-5">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, i) => {
            if (line.type === 'removed') oldN++
            else if (line.type === 'added') newN++
            else { oldN++; newN++ }

            const currentOld = line.type !== 'added' ? oldN : null
            const currentNew = line.type !== 'removed' ? newN : null

            return (
              <tr
                key={i}
                className={cn(
                  line.type === 'added' && 'bg-green-900/30',
                  line.type === 'removed' && 'bg-red-900/30',
                )}
              >
                <td className="select-none text-right pr-3 pl-4 py-px text-gray-600 w-10 border-r border-gray-700">
                  {currentOld ?? ''}
                </td>
                <td className="select-none text-right pr-3 py-px text-gray-600 w-10 border-r border-gray-700">
                  {currentNew ?? ''}
                </td>
                <td className="select-none px-2 py-px w-4">
                  <span className={cn(
                    line.type === 'added' && 'text-green-400',
                    line.type === 'removed' && 'text-red-400',
                    line.type === 'same' && 'text-gray-600',
                  )}>
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </span>
                </td>
                <td className={cn(
                  'py-px pr-4 whitespace-pre',
                  line.type === 'added' && 'text-green-200',
                  line.type === 'removed' && 'text-red-300 opacity-75',
                  line.type === 'same' && 'text-gray-300',
                )}>
                  {line.text || ' '}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
