import { supabase } from './supabase'

export interface Comment {
  id: string
  artifactId: string
  body: string
  author: string
  createdAt: string
}

function toComment(row: Record<string, unknown>): Comment {
  return {
    id: row.id as string,
    artifactId: row.artifact_id as string,
    body: row.body as string,
    author: row.author as string,
    createdAt: row.created_at as string,
  }
}

export async function getComments(artifactId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('artifact_id', artifactId)
    .order('created_at', { ascending: true })
  if (error) return []
  return (data ?? []).map(toComment)
}

export async function createComment(
  artifactId: string,
  body: string,
  author: string,
  token: string,
): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert({ artifact_id: artifactId, body: body.trim(), author: author.trim() || 'Anónimo', token })
    .select()
    .single()
  if (error) throw error
  return toComment(data)
}

export async function deleteComment(id: string, token: string): Promise<void> {
  const { data } = await supabase.from('comments').select('token').eq('id', id).single()
  if (data?.token && data.token !== token) throw new Error('Unauthorized')
  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) throw error
}
