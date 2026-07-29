'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Layers, LayoutDashboard, BarChart3, Archive } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Design System', icon: BookOpen },
  { href: '/artifacts', label: 'Artifacts', icon: Layers },
  { href: '/artifacts/dashboard', label: 'Progreso', icon: BarChart3, sub: true },
  { href: '/artifacts/archive', label: 'Archivo', icon: Archive, sub: true },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-white dark:bg-night-802 border-r border-gray-200 dark:border-night-801">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200 dark:border-night-801">
        <div className="w-7 h-7 rounded-lg bg-lipu-600 flex items-center justify-center">
          <LayoutDashboard className="w-4 h-4 text-gray-900" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">LIPU Mind</p>
          <p className="text-[10px] text-gray-400 mt-0.5">DS Reporter</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, sub }) => {
          const active = href === '/' ? pathname === '/' : pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg text-sm font-medium transition-colors',
                sub ? 'px-3 py-1.5 ml-3' : 'px-3 py-2',
                active
                  ? 'bg-lipu-600/15 text-lipu-500 dark:text-lipu-600'
                  : sub
                    ? 'text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-night-801 hover:text-gray-700 dark:hover:text-gray-300 text-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-night-801 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <Icon className={cn('shrink-0', sub ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-night-801">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Sistema de referencia interno.<br />No compartir externamente.
        </p>
      </div>
    </aside>
  )
}
