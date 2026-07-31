import { supabase } from './supabase'

export async function readTags(): Promise<string[]> {
  const { data, error } = await supabase.from('tags').select('name').order('name')
  if (error) throw error
  return data.map((r) => r.name as string)
}

export async function ensureTags(names: string[]): Promise<void> {
  if (!names.length) return
  const { error } = await supabase
    .from('tags')
    .upsert(names.map((name) => ({ name })), { onConflict: 'name', ignoreDuplicates: true })
  if (error) throw error
}
