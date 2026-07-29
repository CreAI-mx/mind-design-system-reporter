import { SectionHeader } from '../ds-primitives'
import { Loader2 } from 'lucide-react'

export function ButtonsSection({ buttons }: { buttons: Record<string, unknown> }) {
  const canonical = (buttons?.canonical ?? {}) as Record<string, unknown>
  const variants = (canonical?.variants ?? {}) as Record<string, string>
  const sizes = (canonical?.sizes ?? {}) as Record<string, string>

  const variantList = [
    { key: 'primary', label: 'Primary', className: 'bg-lipu-500 text-lipu-text hover:bg-lipu-600' },
    { key: 'secondary', label: 'Secondary', className: 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600' },
    { key: 'danger', label: 'Danger', className: 'bg-red-600 text-white hover:bg-red-700' },
    { key: 'inline', label: 'Inline', className: 'border-0 bg-transparent shadow-none text-lipu-500 dark:text-lipu-400 hover:bg-transparent' },
    { key: 'ghost', label: 'Ghost', className: 'border-0 bg-transparent shadow-none text-lipu-600 dark:text-lipu-400 hover:text-lipu-700' },
  ]

  const sizeList = [
    { key: 'sm', label: 'sm', className: 'px-3 py-2 text-xs' },
    { key: 'md', label: 'md (default)', className: 'px-4 py-2.5 text-sm' },
    { key: 'lg', label: 'lg', className: 'px-5 py-3 text-sm' },
  ]

  const baseClass = 'cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors shadow-sm'

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Buttons"
        description="Componente canónico: Lipu::Ui::Button. Renderiza <LinkTo> cuando @route está presente, <button> otherwise."
        source="console/app/components/lipu/ui/button.js + button.hbs"
      />

      {/* Variants */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Variantes</h3>
        <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 divide-y divide-gray-100 dark:divide-night-801">
          {variantList.map((v) => (
            <div key={v.key} className="flex items-center gap-6 px-5 py-4">
              <div className="w-24 shrink-0">
                <code className="text-xs font-mono text-lipu-500">{v.key}</code>
              </div>
              <div className="flex-1 flex gap-3 flex-wrap">
                {sizeList.map((s) => (
                  <button
                    key={s.key}
                    className={`${baseClass} ${v.className} ${s.className}`}
                  >
                    Button
                  </button>
                ))}
              </div>
              <div className="hidden lg:block text-xs text-gray-400 font-mono max-w-xs truncate">{v.className.split(' ')[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes row */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Tamaños</h3>
        <div className="flex items-end gap-6 px-5 py-5 bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801">
          {sizeList.map((s) => (
            <div key={s.key} className="flex flex-col items-center gap-2">
              <button className={`${baseClass} bg-lipu-500 text-lipu-text hover:bg-lipu-600 ${s.className}`}>
                Button {s.key}
              </button>
              <code className="text-[10px] font-mono text-gray-400">{s.className}</code>
            </div>
          ))}
        </div>
      </div>

      {/* States */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Estados</h3>
        <div className="flex items-center gap-4 flex-wrap px-5 py-5 bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801">
          <button className={`${baseClass} bg-lipu-500 text-lipu-text px-4 py-2.5 text-sm`}>Normal</button>
          <button className={`${baseClass} bg-lipu-600 text-lipu-text px-4 py-2.5 text-sm`}>Hover</button>
          <button disabled className={`${baseClass} bg-lipu-500 text-lipu-text px-4 py-2.5 text-sm opacity-50 cursor-not-allowed`}>Disabled</button>
          <button className={`${baseClass} bg-lipu-500 text-lipu-text px-4 py-2.5 text-sm`}>
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading
          </button>
        </div>
      </div>

      {/* Token detail */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Base class</h3>
        <div className="rounded-xl bg-gray-900 dark:bg-night-805 p-4 overflow-x-auto">
          <code className="text-xs font-mono text-gray-300">
            {String(canonical?.baseClass ?? '')}
          </code>
        </div>
      </div>
    </div>
  )
}
