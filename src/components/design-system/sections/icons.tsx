'use client'

import { useState } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconName } from '@fortawesome/fontawesome-svg-core'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'
import { SectionHeader } from '../ds-primitives'

// Register the entire free-solid pack so icons can be looked up by name string
library.add(fas)

/* ── types ── */

interface IconEntry {
  name: string
  viewBox: string
  colorMode: 'currentColor' | 'hardcoded' | 'hardcoded-parametric'
  hardcodedColor?: string
  defaultClass: string | null
  svg: string
  note?: string
}

interface FontAwesomeData {
  component: string
  package: string
  filesUsingIt: number
  distinctIconNamesUsed: number
  note: string
  sidebarModuleIconMap: Record<string, string>
  otherNavigationIcons: Record<string, string | string[]>
  topByFrequency: Record<string, number>
  allDistinctNames: string[]
}

interface IconsData {
  count: number
  fontAwesome?: FontAwesomeData
  knownIssues: {
    hardcodedColors: { note: string; icons: string[] }
    duplicateGeometry: { note: string; pairs: [string, string][] }
    parametric: { note: string; icons: string[] }
  }
  icons: IconEntry[]
}

export interface IconsSectionProps {
  data: IconsData
}

/* ── FA icon renderer ── */

function FaIcon({ name, className }: { name: string; className?: string }) {
  return (
    <FontAwesomeIcon
      icon={['fas', name as IconName]}
      className={className ?? 'w-4 h-4'}
    />
  )
}

/* ── FA icon card (click to copy name) ── */

function FaIconCard({
  name,
  count,
  onCopy,
}: {
  name: string
  count?: number
  onCopy: (name: string) => void
}) {
  const [flash, setFlash] = useState(false)

  function handleClick() {
    onCopy(name)
    setFlash(true)
    setTimeout(() => setFlash(false), 1200)
  }

  return (
    <button
      onClick={handleClick}
      title={`${name} — click para copiar nombre`}
      className={cn(
        'group flex flex-col items-center gap-1.5 p-2.5 rounded-xl border w-full transition-all',
        flash
          ? 'border-green-400 bg-green-50 dark:bg-green-900/10'
          : 'border-gray-200 dark:border-night-801 hover:border-lipu-500/40 hover:bg-gray-50 dark:hover:bg-night-801'
      )}
    >
      <div className="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-gray-300 shrink-0">
        <FaIcon name={name} className="w-[18px] h-[18px]" />
      </div>
      <span
        className={cn(
          'text-[9px] font-mono text-center leading-snug break-all w-full',
          flash
            ? 'text-green-600 dark:text-green-400'
            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
        )}
      >
        {flash ? '✓ copiado' : name}
      </span>
      {count !== undefined && (
        <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 tabular-nums">
          ×{count}
        </span>
      )}
    </button>
  )
}

/* ── FontAwesome section ── */

function FontAwesomeSection({ fa, onCopy }: { fa: FontAwesomeData; onCopy: (n: string) => void }) {
  const [showAll, setShowAll] = useState(false)
  const [faSearch, setFaSearch] = useState('')

  const topEntries = Object.entries(fa.topByFrequency).sort(([, a], [, b]) => b - a)

  const filteredAll = faSearch
    ? fa.allDistinctNames.filter((n) => n.includes(faSearch.toLowerCase()))
    : fa.allDistinctNames

  const displayedAll = showAll ? filteredAll : filteredAll.slice(0, 48)

  return (
    <div className="space-y-7">
      {/* summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-200 dark:border-night-801 p-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{fa.filesUsingIt}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">archivos .hbs</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-night-801 p-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{fa.distinctIconNamesUsed}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">nombres distintos usados</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-night-801 p-4">
          <code className="text-xs font-mono text-lipu-500 dark:text-lipu-600 block">{fa.component}</code>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{fa.package}</p>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 p-3.5 text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
        {fa.note}
      </div>

      {/* sidebar module map */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Sidebar por módulo</h4>
        <div className="rounded-xl border border-gray-200 dark:border-night-801 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-night-801 bg-gray-50 dark:bg-night-803">
                <th className="text-left px-4 py-2 font-semibold text-gray-600 dark:text-gray-400 w-8"></th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600 dark:text-gray-400">Módulo / ruta</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600 dark:text-gray-400">Ícono</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(fa.sidebarModuleIconMap).map(([module, icon]) => (
                <tr key={module} className="border-b border-gray-100 dark:border-night-801 last:border-0">
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300 text-center">
                    <FaIcon name={icon} className="w-3.5 h-3.5" />
                  </td>
                  <td className="px-4 py-2 font-mono text-gray-700 dark:text-gray-300">{module}</td>
                  <td className="px-4 py-2">
                    <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-night-803 text-gray-600 dark:text-gray-400 font-mono">
                      {icon}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* top by frequency — icon grid */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Más usados</h4>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {topEntries.map(([name, count]) => (
            <FaIconCard key={name} name={name} count={count} onCopy={onCopy} />
          ))}
        </div>
      </div>

      {/* all distinct names — searchable icon grid */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">
            Todos ({fa.allDistinctNames.length} íconos)
          </h4>
          <input
            type="text"
            placeholder="Buscar..."
            value={faSearch}
            onChange={(e) => { setFaSearch(e.target.value); setShowAll(true) }}
            className="flex-1 h-7 px-2.5 text-xs rounded-lg border border-gray-300 dark:border-night-801 bg-white dark:bg-night-803 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-lipu-500/30 focus:border-lipu-500"
          />
          {filteredAll.length !== displayedAll.length && (
            <p className="text-xs text-gray-400 shrink-0">{displayedAll.length} de {filteredAll.length}</p>
          )}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {displayedAll.map((name) => (
            <FaIconCard key={name} name={name} onCopy={onCopy} />
          ))}
        </div>
        {!showAll && filteredAll.length > 48 && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-3 w-full py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-night-801 rounded-xl hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
          >
            Ver los {filteredAll.length - 48} restantes
          </button>
        )}
      </div>
    </div>
  )
}

/* ── custom SVG helpers ── */

function normalizeSvg(raw: string): string {
  return raw.replace(/(<svg)([^>]*)>/, (_, tag, attrs) => {
    const cleaned = attrs
      .replace(/ class="[^"]*"/g, '')
      .replace(/ width="[^"]*"/g, '')
      .replace(/ height="[^"]*"/g, '')
      .replace(/ style="[^"]*"/g, '')
    return `${tag}${cleaned} width="100%" height="100%">`
  })
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'currentColor', label: 'currentColor' },
  { value: 'hardcoded', label: 'Hardcoded' },
  { value: 'hardcoded-parametric', label: 'Parametric' },
]

function ColorModePill({ mode }: { mode: IconEntry['colorMode'] }) {
  if (mode === 'currentColor')
    return (
      <span className="px-1.5 py-px text-[9px] leading-none rounded font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        currentColor
      </span>
    )
  if (mode === 'hardcoded')
    return (
      <span className="px-1.5 py-px text-[9px] leading-none rounded font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
        hardcoded
      </span>
    )
  return (
    <span className="px-1.5 py-px text-[9px] leading-none rounded font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
      parametric
    </span>
  )
}

function SvgIconCard({
  icon,
  isDuplicate,
  onCopy,
}: {
  icon: IconEntry
  isDuplicate: boolean
  onCopy: () => void
}) {
  const [flash, setFlash] = useState(false)

  function handleClick() {
    onCopy()
    setFlash(true)
    setTimeout(() => setFlash(false), 1200)
  }

  return (
    <button
      onClick={handleClick}
      title={`${icon.name} — click para copiar SVG`}
      className={cn(
        'group flex flex-col items-center gap-1.5 p-2.5 rounded-xl border w-full transition-all',
        flash
          ? 'border-green-400 bg-green-50 dark:bg-green-900/10'
          : 'border-gray-200 dark:border-night-801 hover:border-lipu-500/40 hover:bg-gray-50 dark:hover:bg-night-801'
      )}
    >
      <div className="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-gray-300 shrink-0">
        <div
          className="w-6 h-6"
          dangerouslySetInnerHTML={{ __html: normalizeSvg(icon.svg) }}
        />
      </div>
      <span
        className={cn(
          'text-[9px] font-mono text-center leading-snug break-all w-full',
          flash
            ? 'text-green-600 dark:text-green-400'
            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
        )}
      >
        {flash ? '✓ copiado' : icon.name}
      </span>
      <div className="flex flex-wrap justify-center gap-1">
        <ColorModePill mode={icon.colorMode} />
        {isDuplicate && (
          <span className="px-1.5 py-px text-[9px] leading-none rounded font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500">
            dup
          </span>
        )}
      </div>
    </button>
  )
}

/* ── main section ── */

export function IconsSection({ data }: IconsSectionProps) {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [colorFilter, setColorFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<'fa' | 'custom'>(data.fontAwesome ? 'fa' : 'custom')

  const duplicateSet = new Set(data.knownIssues.duplicateGeometry.pairs.flat())

  const filtered = data.icons.filter((icon) => {
    const matchName = !search || icon.name.includes(search.toLowerCase())
    const matchColor = colorFilter === 'all' || icon.colorMode === colorFilter
    return matchName && matchColor
  })

  function copySvg(icon: IconEntry) {
    navigator.clipboard.writeText(icon.svg).then(() => {
      toast(`SVG de "${icon.name}" copiado`, 'success')
    })
  }

  function copyFaName(name: string) {
    navigator.clipboard.writeText(name).then(() => {
      toast(`"${name}" copiado`, 'success')
    })
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Icons"
        description="Dos sistemas coexisten en console/. FontAwesome es el dominante (225 archivos, ~150 nombres). El set custom de 48 SVG inline cubre íconos de dominio no disponibles en FA."
        source="console/app/components/icons/*.hbs + @fortawesome/ember-fontawesome"
      />

      {/* tab selector */}
      {data.fontAwesome && (
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-night-803 w-fit">
          <button
            onClick={() => setActiveTab('fa')}
            className={cn(
              'px-4 py-1.5 text-xs rounded-lg font-medium transition-colors',
              activeTab === 'fa'
                ? 'bg-white dark:bg-night-802 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            )}
          >
            FontAwesome
            <span className="ml-1.5 text-[10px] text-gray-400 dark:text-gray-500">dominante</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={cn(
              'px-4 py-1.5 text-xs rounded-lg font-medium transition-colors',
              activeTab === 'custom'
                ? 'bg-white dark:bg-night-802 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            )}
          >
            Custom SVG
            <span className="ml-1.5 text-[10px] text-gray-400 dark:text-gray-500">{data.count} íconos</span>
          </button>
        </div>
      )}

      {/* fontawesome tab */}
      {activeTab === 'fa' && data.fontAwesome && (
        <FontAwesomeSection fa={data.fontAwesome} onCopy={copyFaName} />
      )}

      {/* custom svg tab */}
      {activeTab === 'custom' && (
        <div className="space-y-5">
          {/* known issues */}
          <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 p-4">
            <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-500 uppercase tracking-wider mb-3">
              Known issues
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {data.knownIssues.hardcodedColors.icons.length} hardcoded colors
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  No adaptan al dark mode ni al{' '}
                  <code className="text-[10px] font-mono">text-*</code> del padre.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {data.knownIssues.duplicateGeometry.pairs.length * 2} duplicados
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-0.5">
                  {data.knownIssues.duplicateGeometry.pairs.map(([a, b]) => (
                    <p key={a} className="font-mono">{a} ≡ {b}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">1 parametric</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  <code className="font-mono">sort-arrow-down</code> acepta args dinámicos
                  (@topLabel, @bottomLabel, @colors).
                </p>
              </div>
            </div>
          </div>

          {/* filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Buscar ícono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-44 h-8 px-3 text-sm rounded-lg border border-gray-300 dark:border-night-801 bg-white dark:bg-night-803 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-lipu-500/30 focus:border-lipu-500"
            />
            <div className="flex h-8 gap-px p-1 rounded-lg bg-gray-100 dark:bg-night-803">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setColorFilter(opt.value)}
                  className={cn(
                    'px-2.5 text-xs rounded-md font-medium transition-colors whitespace-nowrap',
                    colorFilter === opt.value
                      ? 'bg-white dark:bg-night-802 text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600 shrink-0">
              {filtered.length} de {data.count}
            </p>
          </div>

          {/* grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {filtered.map((icon) => (
                <SvgIconCard
                  key={icon.name}
                  icon={icon}
                  isDuplicate={duplicateSet.has(icon.name)}
                  onCopy={() => copySvg(icon)}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-gray-400">
              No se encontraron íconos con &ldquo;{search}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  )
}
