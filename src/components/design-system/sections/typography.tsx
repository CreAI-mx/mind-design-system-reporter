import { SectionHeader, InconsistencyBadge } from '../ds-primitives'

export function TypographySection({ tokens }: { tokens: Record<string, unknown> }) {
  const typeScale = tokens.typeScale as any
  const fontFamily = tokens.fontFamily as any

  const sizes = [
    { label: 'text-xs / 10px', size: '10px', weight: '500', usage: 'micro labels, counters' },
    { label: 'text-xs / 12px', size: '12px', weight: '500', usage: 'badges, captions, timestamps' },
    { label: 'text-sm / 14px', size: '14px', weight: '400', usage: 'body text, table cells' },
    { label: 'text-base / 16px', size: '16px', weight: '600', usage: 'section titles, card headers' },
    { label: 'text-lg / 18px', size: '18px', weight: '500', usage: 'page titles, KPI values (smaller)' },
    { label: 'display / 30px', size: '30px', weight: '500', usage: 'KPI value display (kpi-card.hbs)' },
  ]

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Typography"
        description="No existe una escala tipográfica nominal. Los tamaños y pesos están hardcodeados inline con !important por regla."
        source="console/app/styles/lipu.css, lipu-management.css"
      />

      <InconsistencyBadge note="Inconsistencia conocida: lipu.css hardcodea font-family: Roboto y lipu-management.css hardcodea Inter, ambos con !important. La fuente que renderiza en pantalla depende del orden de carga del CSS, no de una decisión explícita." />

      {/* Font families */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Familias</h3>
        <div className="grid grid-cols-2 gap-4">
          <FontFamilyCard
            name="Roboto"
            source="lipu.css (dominante)"
            canonical
          />
          <FontFamilyCard
            name="Inter"
            source="lipu-management.css"
            canonical={false}
          />
        </div>
      </div>

      {/* Type scale */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Tamaños observados en código</h3>
        <div className="space-y-1 bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 overflow-hidden divide-y divide-gray-100 dark:divide-night-801">
          {sizes.map((s) => (
            <div key={s.size} className="flex items-center gap-4 px-5 py-3">
              <div className="w-36 shrink-0">
                <p className="text-[10px] font-mono text-gray-400">{s.label}</p>
              </div>
              <div className="flex-1">
                <span
                  style={{ fontSize: s.size, fontWeight: s.weight, fontFamily: 'Roboto, sans-serif' }}
                  className="text-gray-900 dark:text-white"
                >
                  LIPU Mind Console
                </span>
              </div>
              <p className="text-xs text-gray-400 w-48 text-right">{s.usage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weights */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Pesos usados</h3>
        <div className="flex gap-4">
          {[['400', 'Regular'], ['500', 'Medium'], ['600', 'Semibold']].map(([w, label]) => (
            <div key={w} className="flex-1 bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 px-5 py-4">
              <p
                style={{ fontWeight: w, fontSize: '20px' }}
                className="text-gray-900 dark:text-white mb-2"
              >
                Aa
              </p>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</p>
              <p className="text-xs font-mono text-gray-400">{w}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FontFamilyCard({ name, source, canonical }: { name: string; source: string; canonical: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${canonical ? 'border-lipu-500/40 bg-lipu-600/5 dark:bg-lipu-600/5' : 'border-gray-200 dark:border-night-801 bg-white dark:bg-night-802'}`}>
      <p
        style={{ fontFamily: `${name}, sans-serif`, fontSize: '24px', fontWeight: 500 }}
        className="text-gray-900 dark:text-white mb-2"
      >
        {name}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{source}</p>
      {canonical && (
        <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full bg-lipu-600/20 text-lipu-500 dark:text-lipu-600 font-medium">
          Dominante
        </span>
      )}
    </div>
  )
}
