import { SectionHeader } from '../ds-primitives'

export function BadgesSection({ badges }: { badges: Record<string, unknown> }) {
  const domainExamples = (badges?.domainExamples ?? []) as Array<Record<string, unknown>>

  const contractBadge = domainExamples.find((d) => d.component === 'contract-status-badge')
  const pointBadge = domainExamples.find((d) => d.component === 'point-badge')

  const statusVariants = [
    { key: 'success', label: 'Activo', className: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
    { key: 'warning', label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { key: 'danger', label: 'Vencido', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    { key: 'default', label: 'Inactivo', className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
  ]

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Badges & Pills"
        description="No existe un componente Badge canónico compartido. Los status badges se re-implementan por dominio con el mismo lenguaje visual."
        source="app/components/lipu/display/contract-status-badge.hbs"
      />

      {/* contract-status-badge */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">contract-status-badge</h3>
          <p className="text-xs text-gray-400 mt-0.5">Patrón de referencia para status badges. Base: inline-flex items-center rounded-full font-medium</p>
        </div>

        {/* Variants by status */}
        <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 divide-y divide-gray-100 dark:divide-night-801">
          {statusVariants.map((v) => (
            <div key={v.key} className="flex items-center gap-6 px-5 py-3">
              <div className="w-20 shrink-0">
                <code className="text-xs font-mono text-lipu-500">{v.key}</code>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {Object.entries(sizeClasses).map(([size, sizeClass]) => (
                  <span
                    key={size}
                    className={`inline-flex items-center rounded-full font-medium ${v.className} ${sizeClass}`}
                  >
                    {v.label}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-400 ml-auto">{Object.keys(sizeClasses).join(' / ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* point-badge */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">point-badge</h3>
          <p className="text-xs text-gray-400 mt-0.5">Usado en ubicaciones. Tiene tooltip de coordenadas al hover.</p>
        </div>
        <div className="flex gap-4 px-5 py-4 bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#E8F0B8] text-[#5B6A0E]">
            En ruta (in)
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200">
            Sin asignar (default)
          </span>
        </div>
      </div>

      {/* Pill pattern */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Pill (vendor)</h3>
          <p className="text-xs text-gray-400 mt-0.5">@fleetbase/ember-ui Pill — avatar + title + subtitle.</p>
        </div>
        <div className="flex gap-4 px-5 py-4 bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801">
          <div className="flex flex-row space-x-2 items-center">
            <div className="w-7 h-7 rounded-full ring-2 ring-lipu-500 bg-lipu-600/20 flex items-center justify-center text-xs font-semibold text-lipu-500">JD</div>
            <div>
              <p className="text-sm text-gray-900 dark:text-white font-medium leading-none">Juan Díaz</p>
              <p className="text-xs text-gray-400 mt-0.5">Operador</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
