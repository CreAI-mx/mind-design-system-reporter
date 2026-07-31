import type { Artifact } from './types'
import { getModule, MODULE_GROUPS } from './modules'
import { STATUS_CONFIG } from './types'

export async function sendSlackNotification(artifact: Artifact, baseUrl: string, message?: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) throw new Error('SLACK_WEBHOOK_URL no configurado')

  const mod = getModule(artifact.module)
  const group = mod?.group
  const groupConfig = group ? MODULE_GROUPS[group] : null
  const statusLabel = STATUS_CONFIG[artifact.status]?.label ?? artifact.status
  const artifactUrl = `${baseUrl}/artifacts/${artifact.id}`

  const body = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🔔 Actualización en Design System', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Componente*\n${artifact.name}` },
          {
            type: 'mrkdwn',
            text: `*Módulo*\n${groupConfig ? `${groupConfig.label} · ` : ''}${mod?.label ?? artifact.module}`,
          },
          { type: 'mrkdwn', text: `*Versión*\nv${artifact.version}` },
          { type: 'mrkdwn', text: `*Estado*\n${statusLabel}` },
        ],
      },
      ...(artifact.versionNote
        ? [{ type: 'section', text: { type: 'mrkdwn', text: `*Nota de versión*\n${artifact.versionNote}` } }]
        : []),
      ...(message?.trim()
        ? [
            { type: 'divider' },
            { type: 'section', text: { type: 'mrkdwn', text: `💬 *Mensaje del designer*\n${message.trim()}` } },
          ]
        : []),
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Ver artifact', emoji: true },
            url: artifactUrl,
            style: 'primary',
          },
        ],
      },
    ],
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error(`Slack responded with ${res.status}`)
}
