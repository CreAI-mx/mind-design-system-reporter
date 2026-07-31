'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Download, ChevronRight, ChevronDown, ClipboardCopy, Check, Search, X } from 'lucide-react'
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

// ─── Search types ────────────────────────────────────────────────────────────

interface SearchEntry {
  sectionId: string
  sectionLabel: string
  heading: string
  body: string
}

interface SearchHit {
  sectionId: string
  sectionLabel: string
  heading: string
  snippet: string
  query: string
}

function buildSearchIndex(mdSections: Record<string, string>): SearchEntry[] {
  const entries: SearchEntry[] = []

  function addChunks(
    content: string,
    resolveSectionId: (heading: string) => string,
    resolveSectionLabel: (id: string) => string,
  ) {
    if (!content) return
    const parts = content.split(/\n(?=## )/)
    for (const part of parts) {
      const lines = part.split('\n')
      const firstLine = lines[0]
      const heading = firstLine.startsWith('## ')
        ? firstLine.slice(3).trim()
        : firstLine.startsWith('# ')
          ? firstLine.slice(2).trim()
          : ''
      const body = lines
        .slice(1)
        .join(' ')
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^[-*+>]\s/gm, '')
        .replace(/\s+/g, ' ')
        .trim()
      const sectionId = resolveSectionId(heading)
      entries.push({
        sectionId,
        sectionLabel: resolveSectionLabel(sectionId),
        heading: heading || resolveSectionLabel(sectionId),
        body,
      })
    }
  }

  // readme → overview
  addChunks(mdSections.readme, () => 'overview', () => 'Overview')

  // foundations → colors | typography | shadows
  addChunks(
    mdSections.foundations,
    (h) => {
      const lh = h.toLowerCase()
      if (lh.includes('typog') || lh.includes('font')) return 'typography'
      if (lh.includes('shadow') || lh.includes('elevat')) return 'shadows'
      return 'colors'
    },
    (id) => ({ typography: 'Typography', shadows: 'Shadows', colors: 'Colors' }[id] ?? id),
  )

  // components.md → specific component section
  addChunks(
    mdSections.components,
    (h) => {
      const lh = h.toLowerCase()
      if (lh.includes('button')) return 'buttons'
      if (lh.includes('badge') || lh.includes('pill')) return 'badges'
      if (lh.includes('card')) return 'cards'
      if (lh.includes('input') || lh.includes('form') || lh.includes('field')) return 'inputs'
      if (lh.includes('table')) return 'tables'
      if (lh.includes('empty') || lh.includes('estado vacío') || lh.includes('no result')) return 'empty-states'
      if (lh.includes('skeleton') || lh.includes('loading')) return 'skeletons'
      return 'buttons'
    },
    (id) => {
      const m: Record<string, string> = {
        buttons: 'Buttons',
        badges: 'Badges & Pills',
        cards: 'Cards',
        inputs: 'Inputs & Forms',
        tables: 'Tables',
        'empty-states': 'Empty States',
        skeletons: 'Skeletons',
      }
      return m[id] ?? id
    },
  )

  // 1:1 md sections
  const simple: [string, string, string][] = [
    ['layout', 'layout', 'Layout'],
    ['motion', 'motion', 'Motion'],
    ['accessibility', 'accessibility', 'Accessibility'],
    ['patterns', 'patterns', 'Patterns'],
    ['writing', 'writing', 'Writing'],
    ['dodont', 'dodont', "Do's & Don'ts"],
    ['spacing', 'spacing', 'Spacing'],
    ['states', 'states', 'States'],
  ]
  for (const [mdKey, navId, label] of simple) {
    addChunks(mdSections[mdKey], () => navId, () => label)
  }

  // Live-only sections with keyword hints
  entries.push({ sectionId: 'shadows', sectionLabel: 'Shadows', heading: 'Shadows', body: 'shadow elevation box-shadow depth card layer blur dark light' })
  entries.push({ sectionId: 'icons', sectionLabel: 'Icons', heading: 'Icons', body: 'icon svg lucide symbol glyph visual illustration search name' })

  return entries
}

function runSearch(query: string, entries: SearchEntry[]): SearchHit[] {
  if (query.length < 2) return []
  const q = query.toLowerCase()
  const seen = new Set<string>()
  const hits: SearchHit[] = []

  for (const entry of entries) {
    const searchable = `${entry.heading} ${entry.body}`.toLowerCase()
    if (!searchable.includes(q)) continue

    const key = `${entry.sectionId}::${entry.heading}`
    if (seen.has(key)) continue
    seen.add(key)

    const raw = `${entry.heading} ${entry.body}`
    const idx = raw.toLowerCase().indexOf(q)
    const start = Math.max(0, idx - 55)
    const end = Math.min(raw.length, idx + q.length + 55)
    const snippet =
      (start > 0 ? '…' : '') + raw.slice(start, end).trim() + (end < raw.length ? '…' : '')

    hits.push({ sectionId: entry.sectionId, sectionLabel: entry.sectionLabel, heading: entry.heading, snippet, query })
    if (hits.length >= 10) break
  }

  return hits
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DSViewer({ tokens, components, mdSections, icons }: DSViewerProps) {
  const [active, setActive] = useState('overview')
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['foundations', 'components']))
  const [showDownload, setShowDownload] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set(['README.md', 'foundations.md', 'components.md', 'layout.md', 'motion.md', 'accessibility.md', 'icons.md', 'patterns.md', 'writing.md', 'do-dont.md', 'spacing.md', 'states.md'])
  )

  // Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function navigateTo(sectionId: string) {
    for (const item of NAV) {
      if (item.children?.some((c) => c.id === sectionId)) {
        setExpanded((prev) => new Set([...prev, item.id]))
        break
      }
    }
    setActive(sectionId)
    setShowSearch(false)
  }

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
        <div className="px-3 py-3 border-b border-gray-200 dark:border-night-801 flex items-center justify-between">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Design System</p>
          <button
            onClick={() => setShowSearch(true)}
            title="Buscar (⌘K)"
            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-night-801 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => (
            <NavEntry
              key={item.id}
              item={item}
              active={active}
              expanded={expanded}
              onSelect={navigateTo}
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
          mdSections={mdSections}
          onToggle={toggleDownloadSection}
          onDownload={handleDownload}
          onClose={() => setShowDownload(false)}
        />
      )}

      {/* Search palette */}
      {showSearch && (
        <SearchPalette
          mdSections={mdSections}
          onNavigate={navigateTo}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

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

// ─── Section content ──────────────────────────────────────────────────────────

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
      return <div className={wrapperClass}><MdSection content={mdSections.readme} /></div>
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
      return <div className={wrapperClass}><ShadowsSection shadows={(tokens as any).boxShadow} /></div>
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
      return <div className={wrapperClass}><ButtonsSection buttons={(components as any).buttons} /></div>
    case 'badges':
      return <div className={wrapperClass}><BadgesSection badges={(components as any).badgesAndPills} /></div>
    case 'cards':
      return <div className={wrapperClass}><CardsSection /></div>
    case 'inputs':
      return <div className={wrapperClass}><InputsSection inputs={(components as any).inputsAndForms} /></div>
    case 'tables':
      return <div className={wrapperClass}><TablesSection tables={(components as any).tables} /></div>
    case 'empty-states':
      return <div className={wrapperClass}><EmptyStatesSection /></div>
    case 'skeletons':
      return <div className={wrapperClass}><SkeletonsSection /></div>
    case 'layout':
      return <div className={wrapperClass}><MdSection content={mdSections.layout} /></div>
    case 'accessibility':
      return <div className={wrapperClass}><MdSection content={mdSections.accessibility} /></div>
    case 'patterns':
      return <div className={wrapperClass}><MdSection content={mdSections.patterns} /></div>
    case 'writing':
      return <div className={wrapperClass}><MdSection content={mdSections.writing} /></div>
    case 'dodont':
      return <div className={wrapperClass}><MdSection content={mdSections.dodont} /></div>
    case 'spacing':
      return <div className={wrapperClass}><MdSection content={mdSections.spacing} /></div>
    case 'states':
      return <div className={wrapperClass}><MdSection content={mdSections.states} /></div>
    default:
      return null
  }
}

// ─── Markdown renderer ────────────────────────────────────────────────────────

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
      return <code className="text-gray-200 font-mono whitespace-pre">{children}</code>
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

// ─── Search palette ───────────────────────────────────────────────────────────

function SearchPalette({
  mdSections,
  onNavigate,
  onClose,
}: {
  mdSections: Record<string, string>
  onNavigate: (sectionId: string) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const index = useMemo(() => buildSearchIndex(mdSections), [mdSections])
  const hits = useMemo(() => runSearch(query, index), [query, index])

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => { setSelectedIdx(0) }, [query])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, hits.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && hits[selectedIdx]) onNavigate(hits[selectedIdx].sectionId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-night-802 rounded-xl shadow-light-xl border border-gray-200 dark:border-night-801 w-full max-w-lg overflow-hidden">

        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-night-801">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Buscar en el Design System..."
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:flex text-[10px] text-gray-400 bg-gray-100 dark:bg-night-801 rounded px-1.5 py-0.5 font-mono leading-none">
              Esc
            </kbd>
          )}
        </div>

        {/* Results */}
        {hits.length > 0 && (
          <ul className="max-h-80 overflow-y-auto py-1">
            {hits.map((hit, i) => (
              <li key={`${hit.sectionId}-${hit.heading}-${i}`}>
                <button
                  onClick={() => onNavigate(hit.sectionId)}
                  onMouseEnter={() => setSelectedIdx(i)}
                  className={cn(
                    'w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors',
                    i === selectedIdx ? 'bg-lipu-600/10' : 'hover:bg-gray-50 dark:hover:bg-night-801'
                  )}
                >
                  <span className="mt-0.5 shrink-0 inline-block text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-night-801 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {hit.sectionLabel}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate leading-snug mb-0.5">
                      {hit.heading}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      <HighlightSnippet text={hit.snippet} query={hit.query} />
                    </p>
                  </div>
                  {i === selectedIdx && (
                    <kbd className="hidden sm:flex mt-0.5 shrink-0 text-[10px] text-gray-400 bg-gray-100 dark:bg-night-801 rounded px-1.5 py-0.5 font-mono leading-none">
                      ↵
                    </kbd>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.length >= 2 && hits.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-400">
              Sin resultados para{' '}
              <span className="text-gray-600 dark:text-gray-300">"{query}"</span>
            </p>
          </div>
        )}

        {query.length < 2 && (
          <div className="py-5 px-4 text-center">
            <p className="text-xs text-gray-400">
              Busca en foundations, components y guidelines
            </p>
            <p className="mt-1.5 text-[10px] text-gray-300 dark:text-gray-600">
              Navega con ↑↓ · selecciona con Enter · cierra con Esc
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function HighlightSnippet({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-lipu-500/20 text-lipu-500 not-italic font-medium px-0.5 rounded">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

// ─── Download modal ───────────────────────────────────────────────────────────

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

const FILE_TO_MD_KEY: Record<string, string> = {
  'README.md': 'readme',
  'foundations.md': 'foundations',
  'components.md': 'components',
  'layout.md': 'layout',
  'motion.md': 'motion',
  'accessibility.md': 'accessibility',
  'icons.md': 'icons',
  'patterns.md': 'patterns',
  'writing.md': 'writing',
  'do-dont.md': 'dodont',
  'spacing.md': 'spacing',
  'states.md': 'states',
}

function estimateTokens(selectedSections: Set<string>, mdSections: Record<string, string>): number {
  let totalChars = 0
  for (const fileKey of selectedSections) {
    const mdKey = FILE_TO_MD_KEY[fileKey]
    if (mdKey && mdSections[mdKey]) totalChars += mdSections[mdKey].length
  }
  return Math.ceil(totalChars / 4)
}

function formatTokens(n: number): string {
  if (n >= 1000) return `~${(n / 1000).toFixed(1)}k tokens`
  return `~${n} tokens`
}

function DownloadModal({
  selectedSections,
  mdSections,
  onToggle,
  onDownload,
  onClose,
}: {
  selectedSections: Set<string>
  mdSections: Record<string, string>
  onToggle: (key: string) => void
  onDownload: () => void
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [copying, setCopying] = useState(false)
  const tokenEstimate = estimateTokens(selectedSections, mdSections)

  async function handleCopy() {
    if (selectedSections.size === 0) return
    setCopying(true)
    try {
      const params = Array.from(selectedSections).join(',')
      const res = await fetch(`/api/design-system/download?sections=${params}&raw=1`)
      const text = await res.text()
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } finally {
      setCopying(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-night-802 rounded-xl shadow-light-xl border border-gray-200 dark:border-night-801 w-full max-w-sm mx-4 p-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Contexto para Claude Design</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Selecciona las secciones a incluir.
        </p>
        <div className="space-y-1.5 mb-4">
          {DOWNLOAD_FILES.map((s) => (
            <label key={s.key} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-night-801 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedSections.has(s.key)}
                onChange={() => onToggle(s.key)}
                className="accent-lipu-500 w-3.5 h-3.5"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{s.label}</span>
            </label>
          ))}
        </div>

        {selectedSections.size > 0 && (
          <p className="text-xs text-gray-400 text-right mb-4">
            {formatTokens(tokenEstimate)} estimados
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCopy}
            disabled={selectedSections.size === 0 || copying}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 disabled:opacity-50 transition-colors"
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5 text-green-500" /><span className="text-green-600 dark:text-green-400">Copiado</span></>
            ) : (
              <><ClipboardCopy className="w-3.5 h-3.5" />Copiar</>
            )}
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
