import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DS_PATH = path.join(process.cwd(), 'design-system')

const SECTIONS = [
  { file: 'README.md', title: 'Overview' },
  { file: 'foundations.md', title: 'Foundations' },
  { file: 'components.md', title: 'Components' },
  { file: 'layout.md', title: 'Layout' },
  { file: 'motion.md', title: 'Motion' },
  { file: 'accessibility.md', title: 'Accessibility' },
  { file: 'icons.md', title: 'Icons' },
  { file: 'patterns.md', title: 'Patterns' },
  { file: 'writing.md', title: 'Writing' },
  { file: 'do-dont.md', title: "Do's & Don'ts" },
  { file: 'spacing.md', title: 'Spacing' },
  { file: 'states.md', title: 'States' },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const selected = searchParams.get('sections')?.split(',') ?? SECTIONS.map((s) => s.file)

  const parts: string[] = [
    '# LIPU Mind — Design System Context',
    `> Generated ${new Date().toISOString().split('T')[0]} for use as Claude Design context.\n`,
  ]

  for (const section of SECTIONS) {
    if (!selected.includes(section.file)) continue
    const filePath = path.join(DS_PATH, section.file)
    if (!fs.existsSync(filePath)) continue
    const content = fs.readFileSync(filePath, 'utf-8')
    parts.push(`\n---\n\n${content}`)
  }

  const combined = parts.join('\n')
  const raw = searchParams.get('raw') === '1'

  return new NextResponse(combined, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      ...(!raw && { 'Content-Disposition': 'attachment; filename="lipu-mind-design-system.md"' }),
    },
  })
}
