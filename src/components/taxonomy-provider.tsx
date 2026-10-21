'use client'

import { createContext, useContext } from 'react'
import type { Taxonomy } from '@/lib/types'

const TaxonomyContext = createContext<Taxonomy>({ groups: [], modules: [], statuses: [] })

export function TaxonomyProvider({ taxonomy, children }: { taxonomy: Taxonomy; children: React.ReactNode }) {
  return <TaxonomyContext.Provider value={taxonomy}>{children}</TaxonomyContext.Provider>
}

/** Taxonomía (grupos, módulos, estados) para componentes cliente. */
export function useTaxonomy(): Taxonomy {
  return useContext(TaxonomyContext)
}
