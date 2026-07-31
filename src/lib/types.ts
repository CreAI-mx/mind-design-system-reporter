export type ArtifactStatus = 'borrador' | 'en-revision' | 'aprobado' | 'entregado' | 'deprecado'

export type ModuleGroup = 'management' | 'operations' | 'administration'

export interface ArtifactModule {
  group: ModuleGroup
  key: string
  label: string
  description: string
}

export interface Artifact {
  id: string
  name: string
  module: string
  version: string
  versionNote: string
  status: ArtifactStatus
  description: string
  tags: string[]
  links: string[]
  code: string
  codeUrl: string
  imageUrls: string[]
  date: string
  createdAt: string
  updatedAt: string
  parentId?: string
}

export interface ArtifactsData {
  artifacts: Artifact[]
}

export const STATUS_CONFIG: Record<ArtifactStatus, { label: string; color: string }> = {
  borrador: {
    label: 'Borrador',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  },
  'en-revision': {
    label: 'En revisión',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  aprobado: {
    label: 'Aprobado',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  entregado: {
    label: 'Entregado',
    color: 'bg-lipu-600/20 text-lipu-500 dark:bg-lipu-600/10 dark:text-lipu-600',
  },
  deprecado: {
    label: 'Deprecado',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
}
