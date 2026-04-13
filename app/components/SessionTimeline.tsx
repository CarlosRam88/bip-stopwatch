'use client'

import type { Sequence, ActiveDrill } from '../lib/types'
import { formatDuration } from '../lib/utils'

interface SessionTimelineProps {
  sequences: Sequence[]
  activeDrill: ActiveDrill | null
  elapsedMs: number
}

export default function SessionTimeline({ sequences, activeDrill, elapsedMs }: SessionTimelineProps) {
  const totalMs =
    sequences.reduce((sum, s) => sum + s.durationMs, 0) + (activeDrill ? elapsedMs : 0)

  if (totalMs === 0) return null

  // Build a unified list of closed + active segments
  const segments = [
    ...sequences.map((s) => ({
      id: s.id,
      state: s.state,
      durationMs: s.durationMs,
      drillNumber: s.drillNumber,
      drillName: s.drillName,
      isActive: false,
    })),
    ...(activeDrill && elapsedMs > 0
      ? [
          {
            id: 'active',
            state: activeDrill.state,
            durationMs: elapsedMs,
            drillNumber: activeDrill.drillNumber,
            drillName: activeDrill.drillName,
            isActive: true,
          },
        ]
      : []),
  ]

  return (
    <section className="rounded-lg border border-bip-border bg-bip-surface p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-widest text-bip-muted uppercase">
          Session Timeline
        </h2>
        <div className="flex items-center gap-4 text-xs text-bip-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-3 rounded-sm bg-in-play" />
            In Play
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-3 rounded-sm bg-out-play" />
            Out of Play
          </span>
          <span className="font-mono tabular-nums">{formatDuration(totalMs)}</span>
        </div>
      </div>

      {/* Bar */}
      <div className="flex h-9 w-full overflow-hidden rounded-md bg-bip-panel">
        {segments.map((seg, idx) => {
          const widthPct = (seg.durationMs / totalMs) * 100
          const prevDrillNumber = idx > 0 ? segments[idx - 1].drillNumber : null
          const isDrillBoundary = prevDrillNumber !== null && seg.drillNumber !== prevDrillNumber
          const isInPlay = seg.state === 'in-play'

          return (
            <div
              key={seg.id}
              title={`${seg.drillName} · ${isInPlay ? 'In Play' : 'Out of Play'} · ${formatDuration(seg.durationMs)}`}
              className={`h-full relative transition-[width] duration-100 ${
                isInPlay ? 'bg-in-play' : 'bg-out-play'
              } ${isDrillBoundary ? 'border-l-4 border-bip-panel' : ''} ${
                seg.isActive ? 'opacity-70' : ''
              }`}
              style={{ width: `${widthPct}%`, minWidth: widthPct > 0 ? 2 : 0 }}
            />
          )
        })}
      </div>
    </section>
  )
}
