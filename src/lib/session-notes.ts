import { supabase } from './supabase'
import type { SessionNote } from './types'

function toSessionNote(row: Record<string, unknown>): SessionNote {
  return {
    id: row.id as string,
    artifactId: row.artifact_id as string,
    sessionName: row.session_name as string,
    sessionDate: row.session_date as string,
    notes: row.notes as string,
    createdAt: row.created_at as string,
  }
}

export async function getSessionNotes(artifactId: string): Promise<SessionNote[]> {
  const { data, error } = await supabase
    .from('session_notes')
    .select('*')
    .eq('artifact_id', artifactId)
    .order('session_date', { ascending: false })
  if (error) return []
  return (data ?? []).map(toSessionNote)
}

export async function createSessionNote(
  artifactId: string,
  note: Pick<SessionNote, 'sessionName' | 'sessionDate' | 'notes'>,
  browserToken: string
): Promise<SessionNote> {
  const { data, error } = await supabase
    .from('session_notes')
    .insert({
      artifact_id: artifactId,
      session_name: note.sessionName,
      session_date: note.sessionDate,
      notes: note.notes,
      browser_token: browserToken,
    })
    .select()
    .single()
  if (error) throw error
  return toSessionNote(data)
}

export async function deleteSessionNote(id: string, browserToken: string): Promise<boolean> {
  const { data } = await supabase
    .from('session_notes')
    .select('browser_token')
    .eq('id', id)
    .single()

  if (!data || data.browser_token !== browserToken) return false

  const { error } = await supabase.from('session_notes').delete().eq('id', id)
  if (error) throw error
  return true
}
