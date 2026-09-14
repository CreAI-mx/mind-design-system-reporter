'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface StatusStat {
  key: string
  label: string
  color: string
  count: number
}

export interface GroupStat {
  key: string
  label: string
  color: string
  count: number
}

interface Props {
  total: number
  byStatus: StatusStat[]
  groups: GroupStat[]
}

function StatValue({ target }: { target: number }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (target === 0) { setVal(0); return }
    let startTime: number | null = null
    const duration = 850

    function step(ts: number) {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) requestAnimationFrame(step)
    }

    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])

  return <>{val}</>
}

export function StatsSection({ total, byStatus, groups }: Props) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5 px-4 py-3 rounded-xl border border-lipu-500/30 bg-lipu-500/5 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-lipu-500">
            Total artifacts
          </span>
          <span className="text-3xl font-bold text-lipu-600 dark:text-lipu-400 tabular-nums">
            <StatValue target={total} />
          </span>
        </div>
        {byStatus.filter(s => s.count > 0).map(s => (
          <div
            key={s.key}
            className="flex flex-col gap-1.5 px-4 py-3 rounded-xl border border-gray-200 dark:border-night-801 bg-white dark:bg-night-802"
          >
            <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded self-start', s.color)}>
              {s.label}
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
              <StatValue target={s.count} />
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {groups.map(g => (
          <div
            key={g.key}
            className="flex flex-col gap-1.5 px-4 py-3 rounded-xl border border-gray-200 dark:border-night-801 bg-white dark:bg-night-802"
          >
            <span className={cn('text-[10px] font-semibold uppercase tracking-wider', g.color)}>
              {g.label}
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
              <StatValue target={g.count} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
