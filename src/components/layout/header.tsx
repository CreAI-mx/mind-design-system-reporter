'use client'

import { usePathname } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'

const TITLES: Record<string, string> = {
  '/': 'Design System',
  '/artifacts': 'Artifacts',
  '/artifacts/new': 'Nuevo Artifact',
}

export function Header() {
  const pathname = usePathname()

  const title =
    TITLES[pathname] ??
    (pathname.endsWith('/edit') ? 'Editar Artifact' : 'Artifact')

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white dark:bg-night-802 border-b border-gray-200 dark:border-night-801 shrink-0">
      <h1 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h1>
      <ThemeToggle />
    </header>
  )
}
