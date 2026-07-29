import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

const roboto = Roboto({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'LIPU Mind — Design System Reporter',
  description: 'Design system reference and artifact manager for LIPU Mind',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans`}>
        <Providers>
          <div className="flex h-screen bg-white dark:bg-night-803 overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-night-804">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
