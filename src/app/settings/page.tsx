import { Settings } from 'lucide-react'
import { readArtifacts } from '@/lib/artifacts'
import { readTags } from '@/lib/tags'
import { getTaxonomy } from '@/lib/taxonomy'
import { SettingsView } from '@/components/settings/settings-view'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Configuración — LIPU Mind DS Reporter' }

export default async function SettingsPage() {
  const [taxonomy, artifacts, tags] = await Promise.all([getTaxonomy(), readArtifacts(), readTags()])

  // Conteos de uso para las reglas de borrado/reasignación.
  const moduleUsage: Record<string, number> = {}
  const statusUsage: Record<string, number> = {}
  const tagUsage: Record<string, number> = {}
  for (const a of artifacts) {
    moduleUsage[a.module] = (moduleUsage[a.module] ?? 0) + 1
    statusUsage[a.status] = (statusUsage[a.status] ?? 0) + 1
    for (const t of a.tags) tagUsage[t] = (tagUsage[t] ?? 0) + 1
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-lipu-600/15 flex items-center justify-center">
          <Settings className="w-4.5 h-4.5 text-lipu-500" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración</h1>
          <p className="text-xs text-gray-400">Grupos, módulos, estados y etiquetas de los artifacts</p>
        </div>
      </div>

      <SettingsView
        taxonomy={taxonomy}
        moduleUsage={moduleUsage}
        statusUsage={statusUsage}
        tags={tags}
        tagUsage={tagUsage}
      />
    </div>
  )
}
