import fs from 'fs'
import path from 'path'
import type { Artifact, ArtifactsData } from './types'

const DATA_PATH = path.join(process.cwd(), 'data', 'artifacts.json')

export function readArtifacts(): Artifact[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    const data: ArtifactsData = JSON.parse(raw)
    return data.artifacts ?? []
  } catch {
    return []
  }
}

export function writeArtifacts(artifacts: Artifact[]): void {
  const data: ArtifactsData = { artifacts }
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
}
