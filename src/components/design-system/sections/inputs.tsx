'use client'

import { useState } from 'react'
import { SectionHeader } from '../ds-primitives'
import { Search, Eye, EyeOff } from 'lucide-react'

export function InputsSection({ inputs }: { inputs: Record<string, unknown> }) {
  const focusPattern = (inputs?.focusStatePattern as any)?.classes ?? ''

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Inputs & Forms"
        description="Los inputs canónicos usan un focus state con ring lipu-600/35. El patrón de focus es consistente en los componentes Lipu pero está hardcodeado como hex en lugar de referenciar el token."
        source="app/components/lipu/ui/data-table/column-filter-popover.hbs"
      />

      {/* Text inputs */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Text Input (patrón canónico)</h3>
        <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 divide-y divide-gray-100 dark:divide-night-801">
          <InputRow label="Normal" state="normal" />
          <InputRow label="Focus" state="focus" />
          <InputRow label="Disabled" state="disabled" />
          <InputRow label="Con icono" state="icon" />
        </div>
        <div className="mt-3 rounded-xl bg-gray-900 dark:bg-night-805 p-4 overflow-x-auto">
          <code className="text-xs font-mono text-gray-300 break-all">{focusPattern || 'w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm focus:border-[#b8c700] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d0df00]/35 dark:border-gray-600 dark:bg-gray-700/80'}</code>
        </div>
      </div>

      {/* Toggle */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Toggle</h3>
        <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 divide-y divide-gray-100 dark:divide-night-801">
          <ToggleRow label="Off" checked={false} />
          <ToggleRow label="On" checked={true} />
          <ToggleRow label="Disabled" checked={false} disabled />
        </div>
      </div>

      {/* Select */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Select</h3>
        <div className="px-5 py-4 bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801">
          <select className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors max-w-xs">
            <option>Seleccionar módulo</option>
            <option>Management / Clientes</option>
            <option>Operations / Viajes</option>
            <option>Administration / Usuarios</option>
          </select>
        </div>
      </div>

      {/* Form example */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Ejemplo de formulario</h3>
        <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-5 space-y-4 max-w-lg">
          <FormField label="Nombre del operador" required>
            <input
              placeholder="Ej. Juan Díaz García"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-[#d0df00]/35 focus:bg-white dark:focus:bg-night-801 transition-colors"
            />
          </FormField>
          <FormField label="Módulo">
            <select className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-night-801 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-lipu-500 focus:ring-2 focus:ring-lipu-500/20 transition-colors">
              <option>Operations / Operadores</option>
            </select>
          </FormField>
          <div className="flex items-center justify-between pt-2">
            <button className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors">
              Cancelar
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-lipu-500 text-lipu-text hover:bg-lipu-600 transition-colors">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InputRow({ label, state, }: { label: string; state: 'normal' | 'focus' | 'disabled' | 'icon' }) {
  const baseClass = 'w-full rounded-lg border bg-gray-100 dark:bg-night-801 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 transition-colors outline-none'
  const [show, setShow] = useState(false)

  return (
    <div className="flex items-center gap-6 px-5 py-3">
      <div className="w-20 shrink-0">
        <p className="text-xs text-gray-400">{label}</p>
      </div>
      <div className="flex-1 max-w-xs">
        {state === 'icon' ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input placeholder="Buscar..." className={`${baseClass} pl-8 border-gray-200 dark:border-gray-600`} />
          </div>
        ) : (
          <input
            disabled={state === 'disabled'}
            placeholder={state === 'focus' ? '' : 'Texto de ejemplo...'}
            defaultValue={state === 'focus' ? 'Input con focus' : ''}
            className={`${baseClass} ${
              state === 'focus'
                ? 'border-[#b8c700] bg-white dark:bg-night-801 ring-2 ring-[#d0df00]/35'
                : state === 'disabled'
                ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                : 'border-gray-200 dark:border-gray-600'
            }`}
          />
        )}
      </div>
    </div>
  )
}

function ToggleRow({ label, checked, disabled }: { label: string; checked: boolean; disabled?: boolean }) {
  return (
    <div className={`flex items-center gap-6 px-5 py-3 ${disabled ? 'opacity-50' : ''}`}>
      <div className="w-20 shrink-0">
        <p className="text-xs text-gray-400">{label}</p>
      </div>
      <div className="relative h-5 w-9">
        <div className={`absolute inset-0 mx-auto h-4 w-9 rounded-full transition-colors ${checked ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-600'}`} />
        <div className={`absolute top-[-2px] h-5 w-5 rounded-full border border-gray-200 bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </div>
  )
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
