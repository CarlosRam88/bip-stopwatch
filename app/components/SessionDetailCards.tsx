'use client'

import type { SessionDetailStats } from '../lib/types'
import { formatDuration } from '../lib/utils'

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  isEmpty: boolean
}

function StatCard({ title, value, subtitle, isEmpty }: StatCardProps) {
  return (
    <div className="rounded-lg border border-bip-border bg-bip-surface px-4 py-3 flex-1">
      <h3 className="text-xs font-semibold tracking-widest text-bip-muted uppercase">
        {title}
      </h3>
      <p
        className={`mt-2 font-mono text-2xl font-bold tabular-nums transition-colors duration-300 ${
          isEmpty ? 'text-bip-muted/25' : 'text-bip-text'
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-bip-muted/60">{subtitle}</p>
    </div>
  )
}

interface SessionDetailCardsProps {
  detail: SessionDetailStats
}

export default function SessionDetailCards({ detail }: SessionDetailCardsProps) {
  const hasData = detail.totalInPlayCount > 0

  return (
    <div className="flex gap-4">
      <StatCard
        title="Longest Duration"
        value={detail.longestInPlayMs !== null ? formatDuration(detail.longestInPlayMs) : '—'}
        subtitle="longest In Play sequence"
        isEmpty={!hasData}
      />
      <StatCard
        title="Long Sequences"
        value={hasData ? String(detail.longSequenceCount) : '—'}
        subtitle="In Play sequences > 60s"
        isEmpty={!hasData}
      />
      <StatCard
        title="Long Sequences %"
        value={detail.longSequencePct !== null ? `${detail.longSequencePct}%` : '—'}
        subtitle="of all In Play sequences"
        isEmpty={!hasData}
      />
    </div>
  )
}
