import { NextRequest, NextResponse } from 'next/server'
import { getArtifact } from '@/lib/artifacts'
import { sendSlackNotification } from '@/lib/slack'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const artifact = await getArtifact(id)
  if (!artifact) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    `${req.nextUrl.protocol}//${req.nextUrl.host}`

  if (!process.env.SLACK_WEBHOOK_URL) {
    return NextResponse.json({ error: 'SLACK_WEBHOOK_URL no configurado' }, { status: 503 })
  }

  const body = await req.json().catch(() => ({}))
  const message: string | undefined = body.message

  try {
    await sendSlackNotification(artifact, baseUrl, message)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[notify-slack]', err)
    return NextResponse.json({ error: String(err) }, { status: 502 })
  }
}
