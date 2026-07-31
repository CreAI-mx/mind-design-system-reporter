'use client'

import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

const TITLES: Record<string, string> = {
  '/': 'Design System',
  '/artifacts': 'Artifacts',
  '/artifacts/new': 'Nuevo Artifact',
}

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()

  const title =
    TITLES[pathname] ??
    (pathname.endsWith('/edit') ? 'Editar Artifact' : 'Artifact')

  return (
    <header className="h-14 flex items-center gap-3 px-4 lg:px-6 bg-white dark:bg-night-802 border-b border-gray-200 dark:border-night-801 shrink-0">
      {/* Hamburger — only visible on mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-night-801 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{title}</h1>
      <ThemeToggle />
    </header>
  )
}
