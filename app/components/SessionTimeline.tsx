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

  // Compute left-offset % for the first segment of each drill
  const drillLabels: { drillNumber: number; drillName: string; leftPct: number }[] = []
  let cumMs = 0
  let prevDrillNum: number | null = null
  for (const seg of segments) {
    if (seg.drillNumber !== prevDrillNum) {
      drillLabels.push({
        drillNumber: seg.drillNumber,
        drillName: seg.drillName,
        leftPct: (cumMs / totalMs) * 100,
      })
      prevDrillNum = seg.drillNumber
    }
    cumMs += seg.durationMs
  }

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

      {/* Bar — relative wrapper lets us overlay drill name labels */}
      <div className="relative flex h-9 w-full overflow-hidden rounded-md bg-bip-panel">
        {/* Colour segments */}
        {segments.map((seg, idx) => {
          const widthPct = (seg.durationMs / totalMs) * 100
          const prevDrillNumber = idx > 0 ? segments[idx - 1].drillNumber : null
          const isDrillBoundary = prevDrillNumber !== null && seg.drillNumber !== prevDrillNumber
          const isInPlay = seg.state === 'in-play'

          return (
            <div
              key={seg.id}
              title={`${seg.drillName} · ${isInPlay ? 'In Play' : 'Out of Play'} · ${formatDuration(seg.durationMs)}`}
              className={`h-full transition-[width] duration-100 ${
                isInPlay ? 'bg-in-play' : 'bg-out-play'
              } ${isDrillBoundary ? 'border-l-4 border-bip-panel' : ''} ${
                seg.isActive ? 'opacity-70' : ''
              }`}
              style={{ width: `${widthPct}%`, minWidth: widthPct > 0 ? 2 : 0 }}
            />
          )
        })}

        {/* Drill name overlays */}
        {drillLabels.map((lbl) => (
          <div
            key={lbl.drillNumber}
            className="absolute top-0 bottom-0 flex items-center pointer-events-none"
            style={{ left: `calc(${lbl.leftPct}% + 8px)` }}
          >
            <span
              className="text-white/80 text-xs font-semibold whitespace-nowrap"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
            >
              {lbl.drillName}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
