import fs from 'fs'
import path from 'path'
import type { Artifact } from './types'

export type ArchiveAction = 'created' | 'updated' | 'deleted'

export interface ArchiveEntry {
  archivedAt: string
  action: ArchiveAction
  artifact: Artifact
}

const ARCHIVE_PATH = path.join(process.cwd(), 'data', 'archive.json')

export function readArchive(): ArchiveEntry[] {
  try {
    if (!fs.existsSync(ARCHIVE_PATH)) {
      fs.writeFileSync(ARCHIVE_PATH, JSON.stringify({ entries: [] }, null, 2))
      return []
    }
    const raw = fs.readFileSync(ARCHIVE_PATH, 'utf-8')
    return (JSON.parse(raw).entries ?? []) as ArchiveEntry[]
  } catch {
    return []
  }
}

export function addArchiveEntry(artifact: Artifact, action: ArchiveAction): void {
  const entries = readArchive()
  entries.push({ archivedAt: new Date().toISOString(), action, artifact })
  fs.writeFileSync(ARCHIVE_PATH, JSON.stringify({ entries }, null, 2))
}
