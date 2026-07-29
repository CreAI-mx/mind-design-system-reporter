import { SectionHeader } from '../ds-primitives'

const SHADOW_GROUPS = [
  {
    label: 'Light elevation ramp',
    note: 'Para cards, dropdowns y modales en light mode',
    keys: ['light-xs', 'light-sm', 'light', 'light-md', 'light-lg', 'light-xl', 'light-2xl', 'light-3xl'],
  },
  {
    label: 'Pop / glow',
    note: 'Efecto de énfasis con glow, distinto de la elevación direccional',
    keys: ['pop', 'pop-less', 'pop-lesser', 'pop-least'],
  },
  {
    label: 'Dark mode',
    note: 'Elevación y overlays para dark mode',
    keys: ['dark-overlay', 'dark-overlay-gray', 'overlay-inner'],
  },
  {
    label: 'Específicos',
    note: 'Sombras para componentes específicos',
    keys: ['xs', 'next-nav'],
  },
]

export function ShadowsSection({ shadows }: { shadows: Record<string, string> }) {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Shadows"
        description="El sistema de sombras es una de las pocas foundations con una escala coherente y nombrada. Segura de referenciar tal cual."
        source="console/tailwind.config.js:96-114"
      />

      {SHADOW_GROUPS.map((group) => (
        <div key={group.label}>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{group.label}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{group.note}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {group.keys.filter((k) => shadows[k]).map((key) => (
              <ShadowCard key={key} name={key} value={shadows[key]} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ShadowCard({ name, value }: { name: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-night-803 rounded-xl p-4 flex flex-col items-center gap-4">
      <div
        className="w-20 h-14 rounded-xl bg-white dark:bg-night-802"
        style={{ boxShadow: value }}
      />
      <div className="text-center">
        <p className="text-xs font-mono font-medium text-gray-700 dark:text-gray-300">{name}</p>
        <p className="text-[10px] text-gray-400 mt-1 break-all font-mono">{value.slice(0, 48)}{value.length > 48 ? '…' : ''}</p>
      </div>
    </div>
  )
}
