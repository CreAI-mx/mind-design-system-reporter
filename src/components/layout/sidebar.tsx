'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Layers, LayoutDashboard, BarChart3, Archive, Settings, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/design-system', label: 'Design System', icon: BookOpen },
  { href: '/artifacts', label: 'Artifacts', icon: Layers },
  { href: '/artifacts/dashboard', label: 'Progreso', icon: BarChart3, sub: true },
  { href: '/artifacts/archive', label: 'Archivo', icon: Archive, sub: true },
  { href: '/settings', label: 'Configuración', icon: Settings },
]

const COLLAPSED_KEY = 'mind_sidebar_collapsed'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  // Colapsado solo aplica en desktop; se recuerda entre sesiones.
  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => {
    try { setCollapsed(localStorage.getItem(COLLAPSED_KEY) === '1') } catch {}
  }, [])
  function toggleCollapsed() {
    setCollapsed((v) => {
      try { localStorage.setItem(COLLAPSED_KEY, v ? '0' : '1') } catch {}
      return !v
    })
  }

  // Item activo: la ruta de NAV más específica que prefija el pathname,
  // para que /artifacts/123 marque "Artifacts" y /artifacts/archive, "Archivo".
  const activeHref = NAV
    .filter(({ href }) => pathname === href || pathname.startsWith(href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <aside
      className={cn(
        // Base: full-height column, fixed on mobile / static on desktop
        'fixed inset-y-0 left-0 z-30 w-64 shrink-0 flex flex-col',
        'bg-white dark:bg-night-802 border-r border-gray-200 dark:border-night-801',
        'transition-all duration-200 ease-in-out',
        // Desktop: always visible, not fixed
        'lg:static lg:translate-x-0',
        collapsed ? 'lg:w-16' : 'lg:w-56',
        // Mobile: slide in/out
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      {/* Logo + close button (close only shown on mobile) */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200 dark:border-night-801">
        <Link href="/" onClick={onClose} className="flex items-center gap-2 min-w-0 flex-1 group" title="Inicio">
          <div className="w-7 h-7 rounded-lg bg-lipu-600 flex items-center justify-center shrink-0 group-hover:bg-lipu-700 transition-colors">
            <LayoutDashboard className="w-4 h-4 text-gray-900" />
          </div>
          <div className={cn('min-w-0', collapsed && 'lg:hidden')}>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">LIPU Mind</p>
            <p className="text-[10px] text-gray-400 mt-0.5">DS Reporter</p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-night-801 transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon, sub }) => {
          const active = activeHref === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              title={label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-lg text-sm font-medium transition-colors',
                // Larger touch targets on mobile
                sub && !collapsed ? 'px-3 py-2 lg:py-1.5 ml-3' : 'px-3 py-2.5 lg:py-2',
                sub && collapsed && 'lg:ml-0',
                collapsed && 'lg:justify-center lg:px-0',
                active
                  ? 'bg-lipu-600/15 text-lipu-500 dark:text-lipu-600'
                  : sub
                    ? 'text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-night-801 hover:text-gray-700 dark:hover:text-gray-300 text-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-night-801 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <Icon className={cn('shrink-0', sub ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
              <span className={cn(collapsed && 'lg:hidden')}>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-night-801 flex items-center gap-2">
        <p className={cn('text-[10px] text-gray-400 leading-relaxed flex-1', collapsed && 'lg:hidden')}>
          Sistema de referencia interno.
        </p>
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
          title={collapsed ? 'Expandir' : 'Contraer'}
          className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-night-801 transition-colors shrink-0 mx-auto"
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  )
}
