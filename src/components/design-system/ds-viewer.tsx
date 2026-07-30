'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Download, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ColorsSection } from './sections/colors'
import { TypographySection } from './sections/typography'
import { ShadowsSection } from './sections/shadows'
import { ButtonsSection } from './sections/buttons'
import { BadgesSection } from './sections/badges'
import { CardsSection } from './sections/cards'
import { InputsSection } from './sections/inputs'
import { MotionSection } from './sections/motion'
import { SkeletonsSection } from './sections/skeletons'
import { TablesSection } from './sections/tables'
import { EmptyStatesSection } from './sections/empty-states'
import { IconsSection } from './sections/icons'

interface NavItem {
  id: string
  label: string
  children?: NavItem[]
}

const NAV: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  {
    id: 'foundations',
    label: 'Foundations',
    children: [
      { id: 'colors', label: 'Colors' },
      { id: 'typography', label: 'Typography' },
      { id: 'shadows', label: 'Shadows' },
      { id: 'motion', label: 'Motion' },
      { id: 'icons', label: 'Icons' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    children: [
      { id: 'buttons', label: 'Buttons' },
      { id: 'badges', label: 'Badges & Pills' },
      { id: 'cards', label: 'Cards' },
      { id: 'inputs', label: 'Inputs & Forms' },
      { id: 'tables', label: 'Tables' },
      { id: 'empty-states', label: 'Empty States' },
      { id: 'skeletons', label: 'Skeletons' },
    ],
  },
  { id: 'layout', label: 'Layout' },
  { id: 'accessibility', label: 'Accessibility' },
  {
    id: 'guidelines',
    label: 'Guidelines',
    children: [
      { id: 'patterns', label: 'Patterns' },
      { id: 'writing', label: 'Writing' },
      { id: 'dodont', label: "Do's & Don'ts" },
      { id: 'spacing', label: 'Spacing' },
      { id: 'states', label: 'States' },
    ],
  },
]

interface DSViewerProps {
  tokens: Record<string, unknown>
  components: Record<string, unknown>
  mdSections: Record<string, string>
  icons?: Record<string, unknown>
}

export function DSViewer({ tokens, components, mdSections, icons }: DSViewerProps) {
  const [active, setActive] = useState('overview')
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['foundations', 'components']))
  const [showDownload, setShowDownload] = useState(false)
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set(['README.md', 'foundations.md', 'components.md', 'layout.md', 'motion.md', 'accessibility.md', 'icons.md', 'patterns.md', 'writing.md', 'do-dont.md', 'spacing.md', 'states.md'])
  )

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleDownloadSection(key: string) {
    setSelectedSections((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function handleDownload() {
    const params = Array.from(selectedSections).join(',')
    window.location.href = `/api/design-system/download?sections=${params}`
    setShowDownload(false)
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Side nav */}
      <nav className="w-48 shrink-0 bg-white dark:bg-night-802 border-r border-gray-200 dark:border-night-801 flex flex-col overflow-hidden">
        <div className="px-3 py-3 border-b border-gray-200 dark:border-night-801">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Design System</p>
        </div>
        <div className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => (
            <NavEntry
              key={item.id}
              item={item}
              active={active}
              expanded={expanded}
              onSelect={setActive}
              onToggle={toggleExpand}
            />
          ))}
        </div>
        <div className="px-3 py-3 border-t border-gray-200 dark:border-night-801">
          <button
            onClick={() => setShowDownload(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar contexto
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <SectionContent
          active={active}
          tokens={tokens}
          components={components}
          mdSections={mdSections}
          icons={icons}
        />
      </div>

      {/* Download modal */}
      {showDownload && (
        <DownloadModal
          selectedSections={selectedSections}
          onToggle={toggleDownloadSection}
          onDownload={handleDownload}
          onClose={() => setShowDownload(false)}
        />
      )}
    </div>
  )
}

function NavEntry({
  item,
  active,
  expanded,
  onSelect,
  onToggle,
}: {
  item: NavItem
  active: string
  expanded: Set<string>
  onSelect: (id: string) => void
  onToggle: (id: string) => void
}) {
  const hasChildren = item.children && item.children.length > 0
  const isExpanded = expanded.has(item.id)
  const isActive = active === item.id

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) onToggle(item.id)
          else onSelect(item.id)
        }}
        className={cn(
          'w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors',
          isActive && !hasChildren
            ? 'bg-lipu-600/15 text-lipu-500 dark:text-lipu-600 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801 hover:text-gray-900 dark:hover:text-white',
          hasChildren && 'font-medium'
        )}
      >
        {item.label}
        {hasChildren && (
          isExpanded
            ? <ChevronDown className="w-3 h-3 opacity-50" />
            : <ChevronRight className="w-3 h-3 opacity-50" />
        )}
      </button>
      {hasChildren && isExpanded && (
        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-gray-100 dark:border-night-801 pl-2">
          {item.children!.map((child) => (
            <button
              key={child.id}
              onClick={() => onSelect(child.id)}
              className={cn(
                'w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors',
                active === child.id
                  ? 'bg-lipu-600/15 text-lipu-500 dark:text-lipu-600 font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionContent({
  active,
  tokens,
  components,
  mdSections,
  icons,
}: {
  active: string
  tokens: Record<string, unknown>
  components: Record<string, unknown>
  mdSections: Record<string, string>
  icons?: Record<string, unknown>
}) {
  const wrapperClass = 'max-w-4xl mx-auto px-8 py-8 space-y-10'

  switch (active) {
    case 'overview':
      return (
        <div className={wrapperClass}>
          <MdSection content={mdSections.readme} />
        </div>
      )
    case 'colors':
      return (
        <div className={wrapperClass}>
          <ColorsSection colors={(tokens as any).colors} chartPalette={(tokens as any).chartPalette} />
          <MdSection content={mdSections.foundations} filter="## Color" />
        </div>
      )
    case 'typography':
      return (
        <div className={wrapperClass}>
          <TypographySection tokens={tokens as any} />
          <MdSection content={mdSections.foundations} filter="## Typography" />
        </div>
      )
    case 'shadows':
      return (
        <div className={wrapperClass}>
          <ShadowsSection shadows={(tokens as any).boxShadow} />
        </div>
      )
    case 'motion':
      return (
        <div className={wrapperClass}>
          <MotionSection motion={(tokens as any).motion} />
          <MdSection content={mdSections.motion} />
        </div>
      )
    case 'icons':
      return (
        <div className={wrapperClass}>
          {icons && (icons as any).icons ? (
            <IconsSection data={icons as any} />
          ) : (
            <p className="text-sm text-gray-400">icons.json no encontrado</p>
          )}
        </div>
      )
    case 'buttons':
      return (
        <div className={wrapperClass}>
          <ButtonsSection buttons={(components as any).buttons} />
        </div>
      )
    case 'badges':
      return (
        <div className={wrapperClass}>
          <BadgesSection badges={(components as any).badgesAndPills} />
        </div>
      )
    case 'cards':
      return (
        <div className={wrapperClass}>
          <CardsSection />
        </div>
      )
    case 'inputs':
      return (
        <div className={wrapperClass}>
          <InputsSection inputs={(components as any).inputsAndForms} />
        </div>
      )
    case 'tables':
      return (
        <div className={wrapperClass}>
          <TablesSection tables={(components as any).tables} />
        </div>
      )
    case 'empty-states':
      return (
        <div className={wrapperClass}>
          <EmptyStatesSection />
        </div>
      )
    case 'skeletons':
      return (
        <div className={wrapperClass}>
          <SkeletonsSection />
        </div>
      )
    case 'layout':
      return (
        <div className={wrapperClass}>
          <MdSection content={mdSections.layout} />
        </div>
      )
    case 'accessibility':
      return (
        <div className={wrapperClass}>
          <MdSection content={mdSections.accessibility} />
        </div>
      )
    case 'patterns':
      return (
        <div className={wrapperClass}>
          <MdSection content={mdSections.patterns} />
        </div>
      )
    case 'writing':
      return (
        <div className={wrapperClass}>
          <MdSection content={mdSections.writing} />
        </div>
      )
    case 'dodont':
      return (
        <div className={wrapperClass}>
          <MdSection content={mdSections.dodont} />
        </div>
      )
    case 'spacing':
      return (
        <div className={wrapperClass}>
          <MdSection content={mdSections.spacing} />
        </div>
      )
    case 'states':
      return (
        <div className={wrapperClass}>
          <MdSection content={mdSections.states} />
        </div>
      )
    default:
      return null
  }
}

const MD_COMPONENTS = {
  pre({ children }: { children?: React.ReactNode }) {
    return (
      <div className="not-prose my-4">
        <pre className="overflow-x-auto rounded-xl bg-[#1e1e1e] border border-gray-700 px-5 py-4 text-xs leading-relaxed">
          {children}
        </pre>
      </div>
    )
  },
  code({ className, children }: { className?: string; children?: React.ReactNode }) {
    const isBlock = Boolean(className)
    if (isBlock) {
      return (
        <code className="text-gray-200 font-mono whitespace-pre">
          {children}
        </code>
      )
    }
    return (
      <code className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[0.85em] font-mono">
        {children}
      </code>
    )
  },
}

function MdSection({ content, filter }: { content: string; filter?: string }) {
  let text = content
  if (filter) {
    const idx = content.indexOf(filter)
    if (idx !== -1) {
      const nextH2 = content.indexOf('\n## ', idx + 1)
      text = nextH2 !== -1 ? content.slice(idx, nextH2) : content.slice(idx)
    }
  }
  if (!text) return null
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none
      prose-headings:font-semibold
      prose-table:text-xs prose-td:py-2 prose-th:py-2
      prose-code:before:content-none prose-code:after:content-none
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS as any}>{text}</ReactMarkdown>
    </div>
  )
}

const DOWNLOAD_FILES = [
  { key: 'README.md', label: 'Overview' },
  { key: 'foundations.md', label: 'Foundations' },
  { key: 'components.md', label: 'Components' },
  { key: 'layout.md', label: 'Layout' },
  { key: 'motion.md', label: 'Motion' },
  { key: 'accessibility.md', label: 'Accessibility' },
  { key: 'icons.md', label: 'Icons' },
  { key: 'patterns.md', label: 'Patterns' },
  { key: 'writing.md', label: 'Writing' },
  { key: 'do-dont.md', label: "Do's & Don'ts" },
  { key: 'spacing.md', label: 'Spacing' },
  { key: 'states.md', label: 'States' },
]

function DownloadModal({
  selectedSections,
  onToggle,
  onDownload,
  onClose,
}: {
  selectedSections: Set<string>
  onToggle: (key: string) => void
  onDownload: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-night-802 rounded-xl shadow-light-xl border border-gray-200 dark:border-night-801 w-full max-w-sm mx-4 p-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Descargar como contexto</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Selecciona las secciones para incluir en el archivo para Claude Design.
        </p>
        <div className="space-y-1.5 mb-5">
          {DOWNLOAD_FILES.map((s) => (
            <label key={s.key} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-night-801 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedSections.has(s.key)}
                onChange={() => onToggle(s.key)}
                className="accent-lipu-500 w-3.5 h-3.5"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{s.label}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onDownload}
            disabled={selectedSections.size === 0}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-lipu-500 text-lipu-text hover:bg-lipu-600 disabled:opacity-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar
          </button>
        </div>
      </div>
    </div>
  )
}
