'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-browser'

const inputClass =
  'w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (error) {
        setError(
          /invalid login credentials/i.test(error.message)
            ? 'Correo o contraseña incorrectos.'
            : 'No se pudo iniciar sesión. Intenta de nuevo.'
        )
        setSending(false)
        return
      }
      router.push('/')
      router.refresh()
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-night-804">
      <div className="w-full max-w-sm bg-white dark:bg-night-802 rounded-2xl border border-gray-200 dark:border-night-801 p-8 space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-lipu-600 flex items-center justify-center shrink-0">
            <LayoutDashboard className="w-5 h-5 text-gray-900" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">LIPU Mind</p>
            <p className="text-[10px] text-gray-400 mt-0.5">DS Reporter</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Iniciar sesión</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Entra con tu correo y contraseña del equipo.
            </p>
          </div>

          <input
            type="email"
            required
            autoFocus
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu-correo@silia.com"
            className={inputClass}
          />

          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className={inputClass}
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {sending && <Loader2 className="w-4 h-4 animate-spin" />}
            Entrar
          </button>
        </form>

        <p className="text-[10px] text-gray-400 leading-relaxed border-t border-gray-100 dark:border-night-801 pt-4">
          Sistema de referencia interno. Solo correos autorizados.
          ¿Olvidaste tu contraseña? Pide a un admin que te la restablezca.
        </p>
      </div>
    </div>
  )
}
