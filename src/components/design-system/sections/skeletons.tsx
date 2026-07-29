import { SectionHeader } from '../ds-primitives'

export function SkeletonsSection() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Skeletons & Loading"
        description="Dos skeleton components con animate-pulse + bloques grises planos. animate-spin se usa aparte para spinners inline en botones y acciones async."
        source="app/components/lipu/ui/kpi-skeleton.hbs + table-skeleton.hbs"
      />

      {/* KPI Skeleton */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">KPI Skeleton</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3"
            >
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Table Skeleton</h3>
        <div className="rounded-xl border border-gray-200 dark:border-night-801 overflow-hidden bg-white dark:bg-night-802">
          <div className="animate-pulse space-y-2 py-4 px-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-8 gap-3">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md"
                    style={{ opacity: 1 - i * 0.1 }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline spinner */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Inline spinner (animate-spin)</h3>
        <div className="flex items-center gap-4 flex-wrap px-5 py-5 bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801">
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-lipu-500 text-lipu-text text-sm font-medium cursor-not-allowed opacity-80">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Guardando...
          </button>

          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium cursor-not-allowed opacity-80">
            <svg className="animate-spin w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Cargando...
          </button>
        </div>
      </div>

      {/* Animate-pulse note */}
      <div className="flex gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30">
        <span className="text-yellow-500 text-sm shrink-0">⚠</span>
        <p className="text-xs text-yellow-700 dark:text-yellow-400">
          Ningún skeleton ni spinner respeta <code className="font-mono">prefers-reduced-motion</code>. Zero ocurrencias en el codebase — candidato para a11y fix.
        </p>
      </div>
    </div>
  )
}
