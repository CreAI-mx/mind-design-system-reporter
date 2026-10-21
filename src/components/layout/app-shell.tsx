'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { GlobalSearch } from './global-search'

export function AppShell({ children, userEmail }: { children: React.ReactNode; userEmail: string | null }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(v => !v)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // El login se renderiza sin shell (sidebar/header).
  if (pathname === '/login') return <>{children}</>

  return (
    <div className="flex h-screen bg-white dark:bg-night-803 overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(v => !v)}
          onSearchClick={() => setSearchOpen(true)}
          userEmail={userEmail}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-night-804">
          {children}
        </main>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
