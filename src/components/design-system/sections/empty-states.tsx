import { SectionHeader } from '../ds-primitives'
import { FolderOpen, Plus } from 'lucide-react'

export function EmptyStatesSection() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Empty States"
        description="No existe un componente EmptyState compartido. Dos instancias independientes con el mismo lenguaje visual pero implementadas por separado."
        source="app/components/lipu/ui/data-table/empty-body-row.hbs"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Table empty state */}
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Table scoped (empty-body-row)</p>
          <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 overflow-hidden">
            <div className="px-4 py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 mx-auto">
                <FolderOpen className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">Sin resultados</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No hay viajes que coincidan con los filtros aplicados.</p>
              <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium transition-colors">
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Feature-local empty state */}
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Feature local (approvals/empty-state)</p>
          <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 overflow-hidden">
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">Sin aprobaciones</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No hay solicitudes pendientes de revisión.</p>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-lipu-500 text-lipu-text hover:bg-lipu-600 text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                Nueva solicitud
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pattern code */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Patrón común</p>
        <div className="rounded-xl bg-gray-900 dark:bg-night-805 p-4 overflow-x-auto">
          <code className="text-xs font-mono text-gray-300 whitespace-pre">{`icon circle: w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700
title:       text-base font-semibold text-gray-900 dark:text-white mb-1
description: text-sm text-gray-500 dark:text-gray-400
cta:         Lipu::Ui::Button @variant="primary"`}</code>
        </div>
      </div>
    </div>
  )
}
