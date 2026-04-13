'use client'

import type { DrillSummary } from '../lib/types'

interface DrillSummaryCardProps {
  summaries: DrillSummary[]
}

export default function DrillSummaryCard({ summaries }: DrillSummaryCardProps) {
  if (summaries.length === 0) return null

  return (
    <section className="rounded-lg border border-bip-border bg-bip-surface p-4 space-y-3">
      <h2 className="text-xs font-semibold tracking-widest text-bip-muted uppercase">
        Drill Breakdown
      </h2>

      <div className="space-y-3">
        {summaries.map((drill) => {
          const pct = drill.stats.percentage ?? 0

          return (
            <div key={drill.drillNumber} className="space-y-1.5">
              {/* Row: name + live badge + percentage */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-bip-text truncate">
                  {drill.drillName}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  {drill.isActive && (
                    <span className="flex items-center gap-1 text-xs text-in-play">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-in-play" />
                      Live
                    </span>
                  )}
                  <span className="font-mono text-sm font-bold tabular-nums text-bip-accent">
                    {drill.stats.percentage !== null ? `${drill.stats.percentage}%` : '—'}
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-2 w-full rounded-full bg-bip-panel overflow-hidden">
                <div
                  className="h-full rounded-full bg-bip-accent transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
