'use client'

import { useStopwatch } from '../hooks/useStopwatch'
import { DAY_CODES } from '../lib/types'
import DrillSetup from './DrillSetup'
import ActiveDrillPanel from './ActiveDrillPanel'
import SessionControls from './SessionControls'
import WRStatsCards from './WRStatsCards'
import SessionDetailCards from './SessionDetailCards'
import SequencesTable from './SegmentsTable'

export default function BipStopwatch() {
  const sw = useStopwatch()

  const handleFinishSession = () => {
    sw.finishSession()
  }

  const handleResetSession = () => {
    if (
      window.confirm(
        'Reset session? All recorded sequences will be permanently cleared.'
      )
    ) {
      sw.resetSession()
    }
  }

  return (
    <div className="min-h-screen text-bip-text font-sans">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-5">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <header className="text-center pb-2">
          <h1 className="font-mono text-2xl font-bold tracking-[0.25em] text-bip-accent uppercase">
            BIP Stopwatch
          </h1>
          <p className="mt-1 text-xs tracking-widest text-bip-muted uppercase">
            Ball-in-Play Session Timer
          </p>
        </header>

        {/* ── Session Finished Banner ────────────────────────────────────── */}
        {sw.sessionFinished && (
          <div className="rounded border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-center text-sm font-medium text-amber-400 tracking-wide">
            Session finished — export your data or reset to start a new session.
          </div>
        )}

        {/* ── Drill Setup ───────────────────────────────────────────────── */}
        <DrillSetup
          dayCode={sw.dayCode}
          dayCodes={DAY_CODES}
          drillNameInput={sw.drillNameInput}
          canStartDrill={sw.canStartDrill}
          sessionFinished={sw.sessionFinished}
          onSetDayCode={sw.setDayCode}
          onSetDrillName={sw.setDrillNameInput}
          onStartDrill={sw.startDrill}
        />

        {/* ── Active Drill Panel ────────────────────────────────────────── */}
        <ActiveDrillPanel
          activeDrill={sw.activeDrill}
          elapsedMs={sw.elapsedMs}
          canToggle={sw.canToggle}
          canStopDrill={sw.canStopDrill}
          canRevert={sw.canRevert}
          onToggle={sw.toggle}
          onStopDrill={sw.stopDrill}
          onRevertLastToggle={sw.revertLastToggle}
        />

        {/* ── W:R% Stats ───────────────────────────────────────────────── */}
        <WRStatsCards
          drillStats={sw.drillStats}
          currentDrillName={sw.currentDrillName}
          sessionStats={sw.sessionStats}
          isLive={Boolean(sw.activeDrill)}
        />

        {/* ── Session Detail Stats ─────────────────────────────────────── */}
        <SessionDetailCards detail={sw.sessionDetail} />

        {/* ── Session Controls ──────────────────────────────────────────── */}
        <SessionControls
          sessionFinished={sw.sessionFinished}
          canExport={sw.canExport}
          canFinish={sw.canFinish}
          onFinishSession={handleFinishSession}
          onExportCSV={sw.handleExportCSV}
          onResetSession={handleResetSession}
        />

        {/* ── Sequences Table ───────────────────────────────────────────── */}
        <SequencesTable sequences={sw.sequences} />
      </div>
    </div>
  )
}
