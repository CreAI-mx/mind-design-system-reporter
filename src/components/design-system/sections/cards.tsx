import { SectionHeader } from '../ds-primitives'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function CardsSection() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Cards"
        description="No existe un componente Card canónico. ~40 archivos *-card.* independientes. El patrón de referencia es kpi-card.hbs."
        source="console/app/components/client/kpi-card.hbs"
      />

      {/* KPI cards */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">KPI Card (patrón de referencia)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard title="Viajes completados" value="1,284" change={+12.4} unit="este mes" />
          <KpiCard title="Incidentes activos" value="7" change={-3.1} unit="vs semana anterior" />
          <KpiCard title="Cobertura de rutas" value="94.2%" change={+0.8} unit="objetivo: 95%" />
        </div>
        <div className="mt-3 rounded-xl bg-gray-900 dark:bg-night-805 p-4 overflow-x-auto">
          <code className="text-xs font-mono text-gray-300 whitespace-pre">{`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6
title: text-sm font-medium text-gray-500 dark:text-gray-400 mb-3
value: font-size:30px; font-weight:500; line-height:150%  ← inline style (sin token)`}</code>
        </div>
      </div>

      {/* Content card */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Content card</h3>
        <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 overflow-hidden max-w-lg">
          <div className="border-b border-gray-200 dark:border-night-801 px-5 py-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Operador · Juan Díaz</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Activo</span>
          </div>
          <div className="px-5 py-4 space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Unidad asignada</p>
            <p className="text-sm text-gray-900 dark:text-white font-medium">NP-812-B · Ruta Norte</p>
          </div>
          <div className="px-5 py-3 bg-gray-50 dark:bg-night-803 border-t border-gray-200 dark:border-night-801 flex gap-2">
            <button className="text-xs text-lipu-500 hover:text-lipu-600 font-medium transition-colors">Ver perfil</button>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Editar</button>
          </div>
        </div>
      </div>

      {/* Notification card */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Notification card</h3>
        <div className="space-y-2 max-w-lg">
          <NotificationCard
            type="warning"
            title="Retraso en ruta"
            message="La unidad NP-812-B lleva 18 min de retraso en parada 4."
            time="Hace 3 min"
          />
          <NotificationCard
            type="error"
            title="Incidente reportado"
            message="Operador reportó falla mecánica. Requiere atención inmediata."
            time="Hace 7 min"
          />
        </div>
      </div>
    </div>
  )
}

function KpiCard({ title, value, change, unit }: { title: string; value: string; change: number; unit: string }) {
  const isPositive = change > 0
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{title}</p>
      <h2 className="text-gray-900 dark:text-white mb-3" style={{ fontSize: '30px', fontWeight: 500, lineHeight: '150%' }}>
        {value}
      </h2>
      <div className="flex items-center gap-1.5">
        {isPositive
          ? <TrendingUp className="w-3.5 h-3.5 text-green-500" />
          : <TrendingDown className="w-3.5 h-3.5 text-red-500" />
        }
        <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-xs text-gray-400">{unit}</span>
      </div>
    </div>
  )
}

function NotificationCard({ type, title, message, time }: {
  type: 'warning' | 'error'
  title: string
  message: string
  time: string
}) {
  const colors = {
    warning: 'border-l-yellow-400 bg-yellow-50 dark:bg-yellow-900/10',
    error: 'border-l-red-500 bg-red-50 dark:bg-red-900/10',
  }
  return (
    <div className={`border-l-4 ${colors[type]} rounded-r-xl px-4 py-3 border border-gray-200 dark:border-night-801`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        <span className="text-xs text-gray-400 shrink-0">{time}</span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{message}</p>
    </div>
  )
}
