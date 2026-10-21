// Los estados viven en la tabla `statuses`; la key es un string libre.
export type ArtifactStatus = string

/* ── Taxonomía configurable (tablas module_groups / modules / statuses) ── */

export interface TaxonomyGroup {
  key: string
  label: string
  color: string
  sortOrder: number
}

export interface TaxonomyModule {
  key: string
  groupKey: string
  label: string
  description: string
  sortOrder: number
}

export interface TaxonomyStatus {
  key: string
  label: string
  color: string
  sortOrder: number
  countsAsDone: boolean
  isDefault: boolean
}

export interface Taxonomy {
  groups: TaxonomyGroup[]
  modules: TaxonomyModule[]
  statuses: TaxonomyStatus[]
}

export function findModule(t: Taxonomy, key: string): TaxonomyModule | undefined {
  return t.modules.find((m) => m.key === key)
}

export function findGroup(t: Taxonomy, key: string | undefined): TaxonomyGroup | undefined {
  return key ? t.groups.find((g) => g.key === key) : undefined
}

export function findStatus(t: Taxonomy, key: string): TaxonomyStatus | undefined {
  return t.statuses.find((s) => s.key === key)
}

export function defaultStatus(t: Taxonomy): TaxonomyStatus | undefined {
  return t.statuses.find((s) => s.isDefault) ?? t.statuses[0]
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

export interface SessionNote {
  id: string
  artifactId: string
  sessionName: string
  sessionDate: string
  notes: string
  createdAt: string
}
