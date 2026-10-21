'use client'

import { createContext, useContext } from 'react'

const SessionContext = createContext<string | null>(null)

export function SessionProvider({ userEmail, children }: { userEmail: string | null; children: React.ReactNode }) {
  return <SessionContext.Provider value={userEmail}>{children}</SessionContext.Provider>
}

/** Email de la sesión, o null si no hay login. Úsalo para ocultar acciones de edición. */
export function useSessionEmail(): string | null {
  return useContext(SessionContext)
}
