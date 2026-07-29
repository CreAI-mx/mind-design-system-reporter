import fs from 'fs'
import path from 'path'
import { DSViewer } from '@/components/design-system/ds-viewer'

const DS_PATH = path.join(process.cwd(), 'design-system')

export const dynamic = 'force-dynamic'

function readJson(file: string) {
  try {
    return JSON.parse(fs.readFileSync(path.join(DS_PATH, file), 'utf-8'))
  } catch {
    return {}
  }
}

function readMd(file: string) {
  try {
    return fs.readFileSync(path.join(DS_PATH, file), 'utf-8')
  } catch {
    return ''
  }
}

export default function DesignSystemPage() {
  const tokens = readJson('tokens.json')
  const components = readJson('components.json')
  const icons = readJson('icons.json')

  const mdSections = {
    readme: readMd('README.md'),
    foundations: readMd('foundations.md'),
    components: readMd('components.md'),
    layout: readMd('layout.md'),
    motion: readMd('motion.md'),
    accessibility: readMd('accessibility.md'),
  }

  return <DSViewer tokens={tokens} components={components} mdSections={mdSections} icons={icons} />
}
