'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { LayoutDashboard, Loader2, MailCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase-browser'
import { cn } from '@/lib/utils'

const inputClass =
  'w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors'

function LoginForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(
    searchParams.get('error') ? 'El enlace no es válido o expiró. Solicita uno nuevo.' : null
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return
    setSending(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(
          /not allowed|signups|user not found|otp/i.test(error.message)
            ? 'Ese correo no tiene acceso. Pide a un admin que te agregue.'
            : 'No se pudo enviar el enlace. Intenta de nuevo en unos minutos.'
        )
      } else {
        setSent(true)
      }
    } finally {
      setSending(false)
    }
  }

  return (
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

      {sent ? (
        <div className="space-y-3 py-2">
          <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <MailCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Revisa tu correo</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Enviamos un enlace de acceso a <span className="font-medium text-gray-700 dark:text-gray-300">{email.trim()}</span>.
            Ábrelo en este mismo navegador. Si no llega, revisa spam.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-xs text-lipu-500 hover:text-lipu-600 font-medium transition-colors"
          >
            Usar otro correo
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Iniciar sesión</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Escribe tu correo y te enviamos un enlace de acceso.
            </p>
          </div>

          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu-correo@silia.com"
            className={inputClass}
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={sending}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium disabled:opacity-50 transition-colors'
            )}
          >
            {sending && <Loader2 className="w-4 h-4 animate-spin" />}
            Enviar enlace
          </button>
        </form>
      )}

      <p className="text-[10px] text-gray-400 leading-relaxed border-t border-gray-100 dark:border-night-801 pt-4">
        Sistema de referencia interno. Solo correos autorizados.
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-night-804">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
