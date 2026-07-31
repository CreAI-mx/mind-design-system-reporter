import { NextResponse } from 'next/server'
import { readTags, ensureTags } from '@/lib/tags'

export const dynamic = 'force-dynamic'

export async function GET() {
  const tags = await readTags()
  return NextResponse.json(tags)
}

export async function POST(request: Request) {
  const { names } = await request.json()
  await ensureTags(names as string[])
  return NextResponse.json({ ok: true })
}
