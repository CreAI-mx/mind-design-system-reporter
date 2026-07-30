'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { SectionHeader, Token } from '../ds-primitives'

interface ChartPalette {
  sequence: string[]
  note?: string
  shadeLabelConflict?: { componentCommentLabels: Record<string, string> }
}

interface ColorsProps {
  colors: Record<string, unknown>
  chartPalette?: ChartPalette
}

const GROUP_NOTES: Record<string, string> = {
  lipu: 'Brand color. lipu-600 (#D0DF00) es el amarillo-verde signature usado en botones primarios, estados activos y focus rings.',
  'fleetbase-green': 'Legacy Fleetbase brand green. Presente desde la plataforma base, todavía en uso.',
  'fleetbase-gray': 'Legacy Fleetbase neutral ramp.',
  sky: 'Blue ramp — dashboards y charts.',
  nightsky: 'Dark blue-black ramp para dark mode.',
  night: 'Dark neutral con dos sub-escalas (80x y 90x). Sin regla documentada de cuándo usar vs midnight.',
  midnight: 'Otro dark neutral ramp. Coexiste con night y Tailwind gray-800/900.',
  moregray: 'Dos grays adicionales que no caben en las escalas anteriores.',
}

export function ColorsSection({ colors, chartPalette }: ColorsProps) {
  const groups = Object.entries(colors).filter(([k]) => k !== 'note') as [string, Record<string, string>][]

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Colors"
        description="Paleta custom de LIPU Mind. Los colores de stock de Tailwind (gray, red, green, etc.) también se usan libremente — esta paleta los extiende, no los reemplaza."
        source="console/tailwind.config.js:29-89"
      />

      {groups.map(([group, shades]) => (
        <div key={group}>
          <div className="flex items-baseline gap-3 mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{group}</h3>
            {GROUP_NOTES[group] && (
              <p className="text-xs text-gray-400 max-w-xl">{GROUP_NOTES[group]}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(shades).map(([shade, hex]) => (
              <ColorSwatch key={shade} group={group} shade={shade} hex={hex} />
            ))}
          </div>
        </div>
      ))}

      {chartPalette?.sequence && chartPalette.sequence.length > 0 && (
        <ChartPaletteSection palette={chartPalette} />
      )}
    </div>
  )
}

function ColorSwatch({ group, shade, hex }: { group: string; shade: string; hex: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const isLight = isLightColor(hex)

  return (
    <button
      onClick={copy}
      title={`${group}-${shade}: ${hex}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-night-801 hover:scale-105 transition-transform shadow-light-xs"
    >
      <div
        className="w-20 h-14 flex items-center justify-center"
        style={{ backgroundColor: hex }}
      >
        {copied
          ? <Check className="w-4 h-4" style={{ color: isLight ? '#000' : '#fff' }} />
          : <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: isLight ? '#000' : '#fff' }} />
        }
      </div>
      <div className="px-2 py-1.5 bg-white dark:bg-night-802 min-w-0">
        <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300 truncate">{shade}</p>
        <p className="text-[10px] text-gray-400 font-mono">{hex}</p>
      </div>
    </button>
  )
}

function ChartPaletteSection({ palette }: { palette: ChartPalette }) {
  const { sequence, shadeLabelConflict } = palette
  const gradientStyle = {
    background: `linear-gradient(to right, ${sequence.join(', ')})`,
  }

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Chart palette — lipu gradient</h3>
        <p className="text-xs text-gray-400 max-w-xl">
          7-step gradient hardcodeado en componentes de chart. No forma parte de tailwind.config.js.
        </p>
      </div>

      {/* Gradient bar */}
      <div
        className="w-full h-10 rounded-xl mb-4 shadow-light-xs border border-gray-200 dark:border-night-801"
        style={gradientStyle}
      />

      {/* Swatches */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sequence.map((hex, i) => {
          const label = shadeLabelConflict?.componentCommentLabels?.[hex]
          return (
            <ColorSwatch
              key={hex}
              group="chart"
              shade={label ?? `step-${i + 1}`}
              hex={hex}
            />
          )
        })}
      </div>

      <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
        Los shade labels del componente (lipu-900…lipu-200) contradicen tailwind.config.js — usar el valor hex, no el shade number.
      </p>
    </div>
  )
}

function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '')
  if (clean.length < 6) return true
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}
