'use client'

import { useStopwatch } from '../hooks/useStopwatch'
import { useEffect } from 'react'
import { DAY_CODES } from '../lib/types'
import DrillSetup from './DrillSetup'
import ActiveDrillPanel from './ActiveDrillPanel'
import SessionControls from './SessionControls'
import WRStatsCards from './WRStatsCards'
import SessionDetailCards from './SessionDetailCards'
import DrillSummaryCard from './DrillSummaryCard'
import SessionTimeline from './SessionTimeline'
import PrintSummary from './PrintSummary'
import SequencesTable from './SegmentsTable'
import Image from 'next/image'

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

  // Spacebar toggles In Play / Out of Play when a drill is active
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      // Don't fire if focus is inside an input or button
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'BUTTON' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (!sw.canToggle) return
      e.preventDefault()
      sw.toggle()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [sw.canToggle, sw.toggle])

  return (
    <div className="min-h-screen text-bip-text font-sans">
      {/* ── Print-only summary (hidden on screen) ─────────────────────── */}
      <PrintSummary
        sequences={sw.sequences}
        sessionStats={sw.sessionStats}
        drillSummaries={sw.drillSummaries}
        sessionDetail={sw.sessionDetail}
      />

      <div className="print:hidden mx-auto max-w-3xl px-4 py-8 space-y-5">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <header className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <Image
              src="/scotlandlogo.png"
              alt="Scottish Rugby Logo"
              width={80}
              height={80}
            />
          </div>

          <h1 className="font-mono text-2xl font-bold tracking-[0.25em] text-bip-accent uppercase">
            BIP Stopwatch
          </h1>

          <p className="mt-1 text-xs tracking-widest text-bip-muted uppercase">
            Scottish Rugby Athletic Performance & Sports Science
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

        {/* ── Drill Breakdown ───────────────────────────────────────────── */}
        <DrillSummaryCard summaries={sw.drillSummaries} />

        {/* ── Session Timeline ──────────────────────────────────────────── */}
        <SessionTimeline
          sequences={sw.sequences}
          activeDrill={sw.activeDrill}
          elapsedMs={sw.elapsedMs}
        />

        {/* ── Session Controls ──────────────────────────────────────────── */}
        <SessionControls
          sessionFinished={sw.sessionFinished}
          canExport={sw.canExport}
          canFinish={sw.canFinish}
          onFinishSession={handleFinishSession}
          onExportCSV={sw.handleExportCSV}
          onExportCatapult={sw.handleExportCatapult}
          onPrint={() => window.print()}
          onResetSession={handleResetSession}
        />

        {/* ── Sequences Table ───────────────────────────────────────────── */}
        <SequencesTable sequences={sw.sequences} />
      </div>
    </div>
  )
}
