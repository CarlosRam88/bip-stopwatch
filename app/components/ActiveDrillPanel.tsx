'use client'

import type { ActiveDrill } from '../lib/types'
import TimerDisplay from './TimerDisplay'
import ToggleSwitch from './ToggleSwitch'

interface ActiveDrillPanelProps {
  activeDrill: ActiveDrill | null
  elapsedMs: number
  canToggle: boolean
  canStopDrill: boolean
  canRevert: boolean
  onToggle: () => void
  onStopDrill: () => void
  onRevertLastToggle: () => void
}

export default function ActiveDrillPanel({
  activeDrill,
  elapsedMs,
  canToggle,
  canStopDrill,
  canRevert,
  onToggle,
  onStopDrill,
  onRevertLastToggle,
}: ActiveDrillPanelProps) {
  const isActive = activeDrill !== null

  return (
    <section
      className={`rounded-lg border bg-bip-surface p-6 space-y-6 transition-colors duration-300
                  ${isActive ? 'border-bip-accent/40' : 'border-bip-border'}`}
    >
      {/* Timer + State */}
      <TimerDisplay
        elapsedMs={elapsedMs}
        state={activeDrill?.state ?? null}
        drillName={activeDrill?.drillName ?? null}
        sequenceNumber={activeDrill?.sequenceNumber ?? null}
      />

      {/* Toggle */}
      <div className="flex justify-center">
        <ToggleSwitch
          state={activeDrill?.state ?? 'in-play'}
          disabled={!canToggle}
          onToggle={onToggle}
        />
      </div>

      {/* Drill controls */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={onStopDrill}
          disabled={!canStopDrill}
          className="rounded px-6 py-2.5 text-sm font-semibold tracking-wide uppercase
                     border border-red-500/60 text-red-400
                     hover:bg-red-500/10 active:bg-red-500/20
                     transition-colors duration-150
                     disabled:cursor-not-allowed disabled:opacity-30"
        >
          Stop Drill
        </button>

        <button
          onClick={onRevertLastToggle}
          disabled={!canRevert}
          className="rounded px-6 py-2.5 text-sm font-semibold tracking-wide uppercase
                     border border-bip-border text-bip-muted
                     hover:border-amber-500/60 hover:text-amber-400 hover:bg-amber-500/10
                     active:bg-amber-500/20
                     transition-colors duration-150
                     disabled:cursor-not-allowed disabled:opacity-30"
        >
          Revert to Previous Sequence
        </button>
      </div>
    </section>
  )
}
