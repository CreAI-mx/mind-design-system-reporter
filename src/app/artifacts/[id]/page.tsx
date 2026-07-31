import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArtifact, getArtifactsByParentId } from '@/lib/artifacts'
import { getModule, MODULE_GROUPS } from '@/lib/modules'
import { StatusBadge } from '@/components/artifacts/status-badge'
import { ArtifactContextButton } from '@/components/artifacts/artifact-context-button'
import { ArtifactActionsMenu } from '@/components/artifacts/artifact-actions-menu'
import { CommentsSection } from '@/components/artifacts/comments-section'
import { SessionNotesSection } from '@/components/artifacts/session-notes-section'
import { CodeSection } from '@/components/artifacts/code-section'
import { ImageGallery } from '@/components/artifacts/image-gallery'
import { formatDate, cn } from '@/lib/utils'
import { ExternalLink, Calendar, Tag, Code2, Image, Pencil, ArrowLeft, GitBranch, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ArtifactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const artifact = await getArtifact(id)
  if (!artifact) notFound()

  const [parent, children] = await Promise.all([
    artifact.parentId ? getArtifact(artifact.parentId) : Promise.resolve(null),
    getArtifactsByParentId(id),
  ])

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {mod && (
              <p className={cn('text-[10px] font-semibold uppercase tracking-wider mb-1', groupConfig?.color)}>
                {groupConfig?.label} · {mod.label}
              </p>
            )}
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{artifact.name || 'Sin nombre'}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ArtifactContextButton artifact={artifact} parent={parent} children={children} />
            <Link
              href={`/artifacts/${artifact.id}/edit`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-801 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar
            </Link>
            <ArtifactActionsMenu
              artifact={artifact}
              hasParent={!!parent}
              hasSlack={!!process.env.SLACK_WEBHOOK_URL}
            />
          </div>
        </div>

        {artifact.description && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 break-words whitespace-pre-wrap">
            {artifact.description}
          </p>
        )}

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

      {/* Version history */}
      {(parent || children.length > 0) && (
        <Section title="Historial de versiones" icon={<GitBranch className="w-3.5 h-3.5" />}>
          <div className="space-y-2">
            {parent && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-400 w-24 shrink-0">Versión anterior</span>
                <VersionCard artifact={parent} />
              </div>
            )}
            {(parent && children.length > 0) && (
              <div className="border-t border-gray-100 dark:border-night-801 pt-3" />
            )}
            {children.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-400 w-24 shrink-0 mt-2">
                  {children.length === 1 ? 'Versión siguiente' : 'Versiones siguientes'}
                </span>
                <div className="flex-1 space-y-2">
                  {children.map((child) => (
                    <VersionCard key={child.id} artifact={child} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Session notes */}
      <SessionNotesSection artifactId={artifact.id} />

      {/* Comments */}
      <CommentsSection artifactId={artifact.id} />

      {/* Meta */}
      <div className="text-[10px] text-gray-400 flex flex-wrap gap-4 pb-4">
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

function VersionCard({ artifact }: { artifact: import('@/lib/types').Artifact }) {
  const mod = getModule(artifact.module)
  return (
    <Link
      href={`/artifacts/${artifact.id}`}
      className="flex items-center gap-3 flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-night-801 hover:border-lipu-500/40 hover:bg-gray-50 dark:hover:bg-night-801 transition-all group"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{artifact.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {mod?.label ?? artifact.module} · v{artifact.version} · {formatDate(artifact.date)}
        </p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-lipu-500 transition-colors shrink-0" />
    </Link>
  )
}

