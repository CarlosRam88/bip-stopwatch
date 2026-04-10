'use client'

import type { DayCode } from '../lib/types'

interface DrillSetupProps {
  dayCode: string
  dayCodes: readonly DayCode[]
  drillNameInput: string
  canStartDrill: boolean
  sessionFinished: boolean
  onSetDayCode: (code: string) => void
  onSetDrillName: (name: string) => void
  onStartDrill: () => void
}

export default function DrillSetup({
  dayCode,
  dayCodes,
  drillNameInput,
  canStartDrill,
  sessionFinished,
  onSetDayCode,
  onSetDrillName,
  onStartDrill,
}: DrillSetupProps) {
  const disabled = sessionFinished

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canStartDrill) onStartDrill()
  }

  return (
    <section className="rounded-lg border border-bip-border bg-bip-surface p-5 space-y-4">
      <h2 className="text-xs font-semibold tracking-widest text-bip-muted uppercase">
        Drill Setup
      </h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        {/* Day Code */}
        <div className="flex flex-col gap-1.5 sm:w-36">
          <label
            htmlFor="day-code"
            className="text-xs font-medium tracking-wide text-bip-muted uppercase"
          >
            Day Code
          </label>
          <select
            id="day-code"
            value={dayCode}
            onChange={(e) => onSetDayCode(e.target.value)}
            disabled={disabled}
            className="h-10 rounded border border-bip-border bg-bip-bg px-3 text-sm text-bip-text
                       focus:outline-none focus:ring-1 focus:ring-bip-accent
                       disabled:cursor-not-allowed disabled:opacity-40"
          >
            <option value="">— select —</option>
            {dayCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        {/* Drill Name */}
        <div className="flex flex-col gap-1.5 flex-1">
          <label
            htmlFor="drill-name"
            className="text-xs font-medium tracking-wide text-bip-muted uppercase"
          >
            Drill Name
          </label>
          <input
            id="drill-name"
            type="text"
            value={drillNameInput}
            onChange={(e) => onSetDrillName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="e.g. Gameflow"
            className="h-10 rounded border border-bip-border bg-bip-bg px-3 text-sm text-bip-text
                       placeholder:text-bip-muted/50
                       focus:outline-none focus:ring-1 focus:ring-bip-accent
                       disabled:cursor-not-allowed disabled:opacity-40"
          />
        </div>

        {/* Start Drill */}
        <button
          onClick={onStartDrill}
          disabled={!canStartDrill}
          className="h-10 rounded px-6 text-sm font-semibold tracking-wide uppercase
                     bg-bip-accent text-white
                     hover:brightness-110 active:brightness-90
                     transition-all duration-150
                     disabled:cursor-not-allowed disabled:opacity-30"
        >
          Start Drill
        </button>
      </div>
    </section>
  )
}
