import Link from 'next/link'
import { BookOpen, Layers, ArrowRight, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-14 space-y-14">

      {/* Hero */}
      <div className="space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lipu-500/30 bg-lipu-500/5">
          <Sparkles className="w-3 h-3 text-lipu-500" />
          <span className="text-[11px] font-medium text-lipu-500 uppercase tracking-wider">LIPU Mind</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white leading-snug">
          Design System Reporter
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
          Referencia centralizada del sistema de diseño de LIPU Mind. Documenta tokens,
          componentes y guías; versiona artifacts y comparte especificaciones con el equipo.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/design-system"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Abrir Design System
          </Link>
          <Link
            href="/artifacts"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 text-sm font-medium transition-colors"
          >
            <Layers className="w-4 h-4" />
            Ver Artifacts
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FeatureCard
          icon={<BookOpen className="w-4 h-4" />}
          title="Design System"
          description="Foundations, componentes y guidelines en un solo lugar. Tokens, tipografía, sombras, motion e iconos."
          href="/design-system"
          cta="Explorar"
        />
        <FeatureCard
          icon={<Layers className="w-4 h-4" />}
          title="Artifacts"
          description="Registra y versiona cada entregable de diseño. Adjunta imágenes, código y enlaces de referencia."
          href="/artifacts"
          cta="Ver artifacts"
        />
      </div>

      {/* Footer note */}
      <p className="text-[11px] text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-night-801 pt-6">
        Sistema de referencia interno — LIPU Mind Design Team
      </p>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  cta,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  cta: string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 p-5 rounded-xl border border-gray-200 dark:border-night-801 bg-white dark:bg-night-802 hover:border-lipu-500/40 hover:shadow-sm transition-all"
    >
      <div className="w-8 h-8 rounded-lg bg-lipu-500/10 text-lipu-500 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{title}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-lipu-500 font-medium">
        {cta}
        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}
