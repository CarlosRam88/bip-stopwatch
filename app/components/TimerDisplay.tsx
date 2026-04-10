'use client'

import type { PlayState } from '../lib/types'
import { formatDuration } from '../lib/utils'

interface TimerDisplayProps {
  elapsedMs: number
  state: PlayState | null  // null when no drill is active
  drillName: string | null
  sequenceNumber: number | null
}

export default function TimerDisplay({
  elapsedMs,
  state,
  drillName,
  sequenceNumber,
}: TimerDisplayProps) {
  const isInPlay = state === 'in-play'
  const isActive = state !== null

  return (
    <div className="flex flex-col items-center gap-3">
      {/* State badge */}
      <div
        className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold tracking-widest uppercase
                    transition-colors duration-300
                    ${
                      !isActive
                        ? 'bg-bip-panel text-bip-muted'
                        : isInPlay
                          ? 'bg-in-play/20 text-in-play border border-in-play/40'
                          : 'bg-out-play/20 text-out-play border border-out-play/40'
                    }`}
      >
        {/* Pulse dot */}
        {isActive && (
          <span
            className={`h-2 w-2 rounded-full animate-pulse ${
              isInPlay ? 'bg-in-play' : 'bg-out-play'
            }`}
          />
        )}
        {isActive ? (isInPlay ? 'In Play' : 'Out of Play') : 'No Drill Running'}
      </div>

      {/* Large timer */}
      <div
        className={`font-mono text-6xl font-bold tabular-nums tracking-tight transition-colors duration-300
                    ${
                      !isActive
                        ? 'text-bip-muted/40'
                        : isInPlay
                          ? 'text-in-play'
                          : 'text-out-play'
                    }`}
      >
        {formatDuration(elapsedMs)}
      </div>

      {/* Drill / sequence context */}
      {isActive && drillName && (
        <p className="text-xs text-bip-muted tracking-wide">
          {drillName}
          {sequenceNumber !== null && (
            <span className="ml-2 text-bip-muted/60">· seq {sequenceNumber}</span>
          )}
        </p>
      )}
    </div>
  )
}
