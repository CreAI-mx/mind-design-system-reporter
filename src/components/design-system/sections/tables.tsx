import { SectionHeader } from '../ds-primitives'
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react'

export function TablesSection({ tables }: { tables: Record<string, unknown> }) {
  const rows = [
    { id: 'NP-001', operador: 'Juan Díaz', ruta: 'Norte · Variante A', status: 'En ruta', hora: '08:42' },
    { id: 'NP-812', operador: 'Ana Morales', ruta: 'Sur · Variante B', status: 'En parada', hora: '08:51' },
    { id: 'NP-034', operador: 'Luis Herrera', ruta: 'Centro · Express', status: 'Completado', hora: '09:03' },
    { id: 'NP-217', operador: 'María López', ruta: 'Norte · Variante C', status: 'Retrasado', hora: '09:10' },
  ]

  const statusColor: Record<string, string> = {
    'En ruta': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'En parada': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Completado': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    'Retrasado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Tables"
        description="Sistema de tabla de datos: Lipu::Ui::DataTable con header-cell, pagination y empty-body-row. Los @fleetbase/ember-ui tables no son lo que usan las pantallas reales."
        source="console/app/components/lipu/ui/data-table/"
      />

      {/* Full table demo */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Data table</h3>
        <div className="rounded-xl border border-gray-200 dark:border-night-801 overflow-hidden shadow-light-sm">
          {/* Table toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-night-802 border-b border-gray-200 dark:border-night-801">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Viajes del día</p>
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <Filter className="w-3 h-3" />
              Filtros
            </button>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white dark:bg-night-802">
                  {['Unidad', 'Operador', 'Ruta', 'Status', 'Hora'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 text-left text-xs font-medium cursor-pointer transition-colors select-none
                        ${i === 0
                          ? 'border-b-[3px] border-[#c9d82e] bg-[#fafaf3] text-slate-800 dark:border-[#d0df00] dark:bg-[#d0df00]/10'
                          : 'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-night-801 border-b border-gray-200 dark:border-night-801'
                        }`}
                    >
                      <span className="flex items-center gap-1">
                        {h}
                        {i === 0 && <ArrowUpDown className="w-3 h-3 opacity-60" />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-night-801 bg-white dark:bg-night-802">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-night-801 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300">{row.id}</td>
                    <td className="px-4 py-3 text-xs text-gray-900 dark:text-white">{row.operador}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{row.ruta}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{row.hora}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-gray-200 dark:border-night-801 bg-gray-50 dark:bg-night-803 px-2 py-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">4 resultados</p>
            <div className="flex items-center gap-1">
              <button disabled className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-night-802 disabled:cursor-not-allowed disabled:opacity-40 text-gray-500 dark:text-gray-400">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-xs font-medium transition-colors ${
                    p === 1
                      ? 'border-lipu-500 bg-lipu-500 text-gray-900 shadow-sm'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-night-802 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-night-801'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-night-802 text-gray-500 dark:text-gray-400 hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
