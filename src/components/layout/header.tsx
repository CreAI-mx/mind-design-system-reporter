'use client'

import { usePathname } from 'next/navigation'
import { Menu, Search } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

const TITLES: Record<string, string> = {
  '/': 'Inicio',
  '/design-system': 'Design System',
  '/artifacts': 'Artifacts',
  '/artifacts/new': 'Nuevo Artifact',
}

interface HeaderProps {
  onMenuClick: () => void
  onSearchClick: () => void
}

export function Header({ onMenuClick, onSearchClick }: HeaderProps) {
  const pathname = usePathname()

  const title =
    TITLES[pathname] ??
    (pathname.endsWith('/edit') ? 'Editar Artifact' : 'Artifact')

  return (
    <header className="h-14 flex items-center gap-3 px-4 lg:px-6 bg-white dark:bg-night-802 border-b border-gray-200 dark:border-night-801 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-night-801 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{title}</h1>

      <button
        onClick={onSearchClick}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border border-gray-200 dark:border-night-801 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
        aria-label="Buscar artifact"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline text-gray-500 dark:text-gray-400">Buscar</span>
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-100 dark:bg-night-801 text-gray-400 border border-gray-200 dark:border-night-801">
          ⌘K
        </kbd>
      </button>

      <ThemeToggle />
    </header>
  )
}
