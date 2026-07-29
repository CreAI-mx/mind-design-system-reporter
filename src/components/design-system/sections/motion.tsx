import { SectionHeader, InconsistencyBadge } from '../ds-primitives'

export function MotionSection({ motion }: { motion: Record<string, unknown> }) {
  const transitionFreq = (motion?.tailwindTransitionUtilityFrequency ?? {}) as Record<string, number>
  const durations = (motion?.tailwindDurationValuesUsed ?? []) as string[]
  const animateFreq = (motion?.animateUtilityFrequency ?? {}) as Record<string, unknown>

  const transitionEntries = Object.entries(transitionFreq).sort(([, a], [, b]) => b - a)
  const total = transitionEntries.reduce((sum, [, v]) => sum + v, 0)

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Motion"
        description="Sin escala de duración o easing customizada. Tailwind defaults + transition-colors dominante."
        source="console/app/styles/*.css, tailwind.config.js"
      />

      <InconsistencyBadge note="Zero ocurrencias de prefers-reduced-motion en todo el codebase. animate-pulse (~30) y animate-spin (~25) no tienen fallback para usuarios con reduced-motion preference." />

      {/* Transitions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Transition utilities <span className="text-xs font-normal text-gray-400 ml-1">({total} ocurrencias totales)</span>
        </h3>
        <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 divide-y divide-gray-100 dark:divide-night-801">
          {transitionEntries.map(([key, count]) => {
            const pct = Math.round((count / total) * 100)
            return (
              <div key={key} className="flex items-center gap-4 px-5 py-2.5">
                <code className="text-xs font-mono text-lipu-500 w-40 shrink-0">{key}</code>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-night-801 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-lipu-600/60 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-16 text-right">{count} usos</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Duration scale */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Duraciones usadas</h3>
        <div className="flex flex-wrap gap-3">
          {durations.map((d) => (
            <div key={d} className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 px-4 py-3 flex flex-col items-center gap-2">
              <div
                className="w-12 h-1.5 rounded-full bg-lipu-600 transition-opacity"
                title={d}
              />
              <code className="text-xs font-mono text-gray-600 dark:text-gray-300">{d}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Animate utilities */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Animate utilities</h3>
        <div className="flex flex-wrap gap-4 px-5 py-5 bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801">
          {/* pulse */}
          <div className="flex flex-col items-center gap-2">
            <div className="animate-pulse w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <code className="text-[10px] font-mono text-gray-400">animate-pulse (~30)</code>
          </div>
          {/* spin */}
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin w-5 h-5 text-lipu-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <code className="text-[10px] font-mono text-gray-400">animate-spin (~25)</code>
          </div>
          {/* ping */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="animate-ping absolute w-3 h-3 rounded-full bg-lipu-500 opacity-75" />
              <div className="w-3 h-3 rounded-full bg-lipu-600" />
            </div>
            <code className="text-[10px] font-mono text-gray-400">animate-ping (1)</code>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Keyframes custom</h3>
        <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 divide-y divide-gray-100 dark:divide-night-801">
          <div className="px-5 py-3 flex items-center gap-4">
            <code className="text-xs font-mono text-lipu-500 w-36">lipu-boot-spin</code>
            <p className="text-xs text-gray-500 dark:text-gray-400">Boot spinner. 0.85s linear infinite. console.css:148</p>
          </div>
          <div className="px-5 py-3 flex items-center gap-4">
            <code className="text-xs font-mono text-lipu-500 w-36">fadeIn</code>
            <p className="text-xs text-gray-500 dark:text-gray-400">Language selector dropdown. 0.15s ease-in-out.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
