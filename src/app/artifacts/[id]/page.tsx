import { notFound } from 'next/navigation'
import Link from 'next/link'
import { readArtifacts } from '@/lib/artifacts'
import { getModule, MODULE_GROUPS } from '@/lib/modules'
import { StatusBadge } from '@/components/artifacts/status-badge'
import { ArtifactDeleteButton } from '@/components/artifacts/artifact-delete-button'
import { ArtifactDuplicateButton } from '@/components/artifacts/artifact-duplicate-button'
import { CodeSection } from '@/components/artifacts/code-section'
import { ImageGallery } from '@/components/artifacts/image-gallery'
import { formatDate, cn } from '@/lib/utils'
import { ExternalLink, Calendar, Tag, Code2, Image, Pencil, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ArtifactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const artifacts = readArtifacts()
  const artifact = artifacts.find((a) => a.id === id)
  if (!artifact) notFound()

  const mod = getModule(artifact.module)
  const group = mod?.group
  const groupConfig = group ? MODULE_GROUPS[group] : null

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      {/* Back */}
      <Link href="/artifacts" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a Artifacts
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {mod && (
              <p className={cn('text-[10px] font-semibold uppercase tracking-wider mb-1', groupConfig?.color)}>
                {groupConfig?.label} · {mod.label}
              </p>
            )}
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{artifact.name || 'Sin nombre'}</h1>
            {artifact.description && (
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{artifact.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <ArtifactDuplicateButton artifact={artifact} />
            <Link
              href={`/artifacts/${artifact.id}/edit`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar
            </Link>
            <ArtifactDeleteButton id={artifact.id} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <StatusBadge status={artifact.status} />
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(artifact.date)}
          </span>
          <span className="text-xs text-gray-400">v{artifact.version}</span>
          {artifact.versionNote && (
            <span className="text-xs text-gray-500 dark:text-gray-400 italic">{artifact.versionNote}</span>
          )}
        </div>

        {artifact.tags.length > 0 && (
          <div className="mt-3 flex gap-1.5 flex-wrap items-center">
            <Tag className="w-3 h-3 text-gray-400" />
            {artifact.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-night-801 text-gray-600 dark:text-gray-300">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      {artifact.links.length > 0 && (
        <Section title="Enlaces" icon={<ExternalLink className="w-3.5 h-3.5" />}>
          <div className="space-y-1.5">
            {artifact.links.map((link, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:underline truncate"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                {link}
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Images */}
      {artifact.imageUrls.length > 0 && (
        <Section title="Imágenes de referencia" icon={<Image className="w-3.5 h-3.5" />}>
          <ImageGallery urls={artifact.imageUrls} />
        </Section>
      )}

      {/* Code URL */}
      {artifact.codeUrl && (
        <Section title="Código externo" icon={<Code2 className="w-3.5 h-3.5" />}>
          <a
            href={artifact.codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:underline"
          >
            <ExternalLink className="w-3 h-3 shrink-0" />
            {artifact.codeUrl}
          </a>
        </Section>
      )}

      {/* Code inline */}
      {artifact.code && (
        <CodeSection
          code={artifact.code}
          filename={`${(artifact.name || 'component').toLowerCase().replace(/\s+/g, '-')}.jsx`}
        />
      )}

      {/* Meta */}
      <div className="text-[10px] text-gray-400 flex gap-4 pb-4">
        <span>Creado: {new Date(artifact.createdAt).toLocaleString('es-MX')}</span>
        <span>Actualizado: {new Date(artifact.updatedAt).toLocaleString('es-MX')}</span>
      </div>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-night-802 rounded-xl border border-gray-200 dark:border-night-801 p-5 space-y-3">
      <h2 className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  )
}

