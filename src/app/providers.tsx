'use client'

import { ThemeProvider } from 'next-themes'
import { ToastProvider } from '@/components/ui/toast'
import { TaxonomyProvider } from '@/components/taxonomy-provider'
import type { Taxonomy } from '@/lib/types'

export function Providers({ children, taxonomy }: { children: React.ReactNode; taxonomy: Taxonomy }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TaxonomyProvider taxonomy={taxonomy}>
        <ToastProvider>{children}</ToastProvider>
      </TaxonomyProvider>
    </ThemeProvider>
  )
}
