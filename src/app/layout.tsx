import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { AppShell } from '@/components/layout/app-shell'
import { getSessionUser } from '@/lib/supabase-server'
import { getTaxonomy } from '@/lib/taxonomy'

const roboto = Roboto({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'LIPU Mind — Design System Reporter',
  description: 'Design system reference and artifact manager for LIPU Mind',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, taxonomy] = await Promise.all([getSessionUser(), getTaxonomy()])

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans`}>
        <Providers taxonomy={taxonomy} userEmail={user?.email ?? null}>
          <AppShell userEmail={user?.email ?? null}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
