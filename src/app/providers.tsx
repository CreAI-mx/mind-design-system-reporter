'use client'

import { ThemeProvider } from 'next-themes'
import { ToastProvider } from '@/components/ui/toast'
import { TaxonomyProvider } from '@/components/taxonomy-provider'
import { SessionProvider } from '@/components/session-provider'
import type { Taxonomy } from '@/lib/types'

export function Providers({
  children,
  taxonomy,
  userEmail,
}: {
  children: React.ReactNode
  taxonomy: Taxonomy
  userEmail: string | null
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <SessionProvider userEmail={userEmail}>
        <TaxonomyProvider taxonomy={taxonomy}>
          <ToastProvider>{children}</ToastProvider>
        </TaxonomyProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
