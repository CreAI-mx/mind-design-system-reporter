import { supabase } from './supabase'
import type { Artifact } from './types'

function toArtifact(row: Record<string, unknown>): Artifact {
  return {
    id: row.id as string,
    name: row.name as string,
    module: row.module as string,
    version: row.version as string,
    versionNote: row.version_note as string,
    status: row.status as Artifact['status'],
    description: row.description as string,
    tags: (row.tags ?? []) as string[],
    links: (row.links ?? []) as string[],
    code: row.code as string,
    codeUrl: row.code_url as string,
    imageUrls: (row.image_urls ?? []) as string[],
    date: row.date as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function toRow(artifact: Artifact) {
  return {
    id: artifact.id,
    name: artifact.name,
    module: artifact.module,
    version: artifact.version,
    version_note: artifact.versionNote,
    status: artifact.status,
    description: artifact.description,
    tags: artifact.tags,
    links: artifact.links,
    code: artifact.code,
    code_url: artifact.codeUrl,
    image_urls: artifact.imageUrls,
    date: artifact.date,
    created_at: artifact.createdAt,
    updated_at: artifact.updatedAt,
  }
}

export async function readArtifacts(): Promise<Artifact[]> {
  const { data, error } = await supabase
    .from('artifacts')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(toArtifact)
}

export async function getArtifact(id: string): Promise<Artifact | null> {
  const { data, error } = await supabase
    .from('artifacts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return toArtifact(data)
}

export async function createArtifact(artifact: Artifact): Promise<Artifact> {
  const { data, error } = await supabase
    .from('artifacts')
    .insert(toRow(artifact))
    .select()
    .single()
  if (error) throw error
  return toArtifact(data)
}

export async function updateArtifact(id: string, updates: Partial<Artifact>): Promise<Artifact> {
  const partial: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.name !== undefined) partial.name = updates.name
  if (updates.module !== undefined) partial.module = updates.module
  if (updates.version !== undefined) partial.version = updates.version
  if (updates.versionNote !== undefined) partial.version_note = updates.versionNote
  if (updates.status !== undefined) partial.status = updates.status
  if (updates.description !== undefined) partial.description = updates.description
  if (updates.tags !== undefined) partial.tags = updates.tags
  if (updates.links !== undefined) partial.links = updates.links
  if (updates.code !== undefined) partial.code = updates.code
  if (updates.codeUrl !== undefined) partial.code_url = updates.codeUrl
  if (updates.imageUrls !== undefined) partial.image_urls = updates.imageUrls
  if (updates.date !== undefined) partial.date = updates.date

  const { data, error } = await supabase
    .from('artifacts')
    .update(partial)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return toArtifact(data)
}

export async function deleteArtifact(id: string): Promise<void> {
  const { error } = await supabase.from('artifacts').delete().eq('id', id)
  if (error) throw error
}
