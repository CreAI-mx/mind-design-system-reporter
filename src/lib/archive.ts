import { supabase } from './supabase'
import type { Artifact } from './types'

export type ArchiveAction = 'created' | 'updated' | 'deleted'

export interface ArchiveEntry {
  archivedAt: string
  action: ArchiveAction
  artifact: Artifact
}

export async function readArchive(): Promise<ArchiveEntry[]> {
  const { data, error } = await supabase
    .from('archive')
    .select('*')
    .order('archived_at', { ascending: false })
    .limit(500)
  if (error) throw error
  return (data ?? []).map((row) => ({
    archivedAt: row.archived_at as string,
    action: row.action as ArchiveAction,
    artifact: row.artifact as Artifact,
  }))
}

export async function addArchiveEntry(artifact: Artifact, action: ArchiveAction): Promise<void> {
  const { error } = await supabase.from('archive').insert({
    archived_at: new Date().toISOString(),
    action,
    artifact,
  })
  if (error) throw error
}
