'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Sequence, ActiveDrill, WRStats, SessionDetailStats, DrillSummary } from '../lib/types'
import { formatDate, exportToCSV, exportCatapultJSON, computeWRStats, computeSessionDetailStats } from '../lib/utils'

export interface StopwatchReturn {
  // ── State ──────────────────────────────────────────────────────────────────
  dayCode: string
  drillNameInput: string
  sequences: Sequence[]
  activeDrill: ActiveDrill | null
  sessionFinished: boolean
  /** Elapsed ms for the currently running sequence */
  elapsedMs: number

  // ── W:R% stats ─────────────────────────────────────────────────────────────
  /** Stats for the active drill, or the most recently stopped drill. null if no drill has run. */
  drillStats: WRStats | null
  /** Display name for the drill being shown in drillStats */
  currentDrillName: string | null
  /** Stats across the entire session (all drills, including active sequence) */
  sessionStats: WRStats
  /** Session-level detail stats: longest In Play, long-sequence count/% */
  sessionDetail: SessionDetailStats
  /** Per-drill W:R% summaries, in order, including the active drill */
  drillSummaries: DrillSummary[]

  // ── Derived UI flags ───────────────────────────────────────────────────────
  canStartDrill: boolean
  canToggle: boolean
  canStopDrill: boolean
  canRevert: boolean
  canExport: boolean
  canFinish: boolean

  // ── Actions ────────────────────────────────────────────────────────────────
  setDayCode: (code: string) => void
  setDrillNameInput: (name: string) => void
  startDrill: () => void
  toggle: () => void
  stopDrill: () => void
  revertLastToggle: () => void
  finishSession: () => void
  handleExportCSV: () => void
  handleExportCatapult: () => void
  resetSession: () => void
}

export function useStopwatch(): StopwatchReturn {
  const [dayCode, setDayCode] = useState('')
  const [drillNameInput, setDrillNameInput] = useState('')
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [activeDrill, setActiveDrill] = useState<ActiveDrill | null>(null)
  const [sessionFinished, setSessionFinished] = useState(false)
  const [now, setNow] = useState<number>(() => Date.now())

  const drillCounterRef = useRef(0)
  const drillActive = activeDrill !== null

  // Tick the live timer at ~20 fps while a drill is running
  useEffect(() => {
    if (!drillActive) return
    const id = setInterval(() => setNow(Date.now()), 50)
    return () => clearInterval(id)
  }, [drillActive])

  // Build a closed sequence record from the currently active drill
  const buildSequence = useCallback(
    (drill: ActiveDrill, endTime: number): Sequence => ({
      id: `${drill.drillNumber}-${drill.sequenceNumber}-${endTime}`,
      date: formatDate(drill.sequenceStartTime),
      dayCode: drill.dayCode,
      drillName: drill.drillName,
      drillNumber: drill.drillNumber,
      sequenceNumber: drill.sequenceNumber,
      state: drill.state,
      startTimestamp: drill.sequenceStartTime,
      endTimestamp: endTime,
      durationMs: endTime - drill.sequenceStartTime,
    }),
    []
  )

  const startDrill = useCallback(() => {
    if (!dayCode || !drillNameInput.trim() || sessionFinished) return
    drillCounterRef.current += 1
    const startTime = Date.now()
    setNow(startTime)
    setActiveDrill({
      drillNumber: drillCounterRef.current,
      drillName: drillNameInput.trim(),
      dayCode,
      sequenceNumber: 1,
      state: 'in-play',
      sequenceStartTime: startTime,
    })
  }, [dayCode, drillNameInput, sessionFinished])

  const toggle = useCallback(() => {
    if (!activeDrill) return
    const endTime = Date.now()
    const closed = buildSequence(activeDrill, endTime)
    setSequences((prev) => [...prev, closed])
    setActiveDrill({
      ...activeDrill,
      state: activeDrill.state === 'in-play' ? 'out-of-play' : 'in-play',
      sequenceNumber: activeDrill.sequenceNumber + 1,
      sequenceStartTime: endTime,
    })
    setNow(endTime)
  }, [activeDrill, buildSequence])

  const stopDrill = useCallback(() => {
    if (!activeDrill) return
    const endTime = Date.now()
    const closed = buildSequence(activeDrill, endTime)
    setSequences((prev) => [...prev, closed])
    setActiveDrill(null)
    setDrillNameInput('')
  }, [activeDrill, buildSequence])

  /**
   * Undo the last toggle:
   * - Remove the last recorded sequence from the log
   * - If that sequence belongs to the active drill, restore the drill's play
   *   state and resume timing from the original start of that sequence
   *   (so the clock shows accumulated time, not a fresh zero)
   * - If there is no active drill, just remove the row (no time restoration)
   */
  const revertLastToggle = useCallback(() => {
    if (sequences.length === 0) return
    const lastSeq = sequences[sequences.length - 1]
    setSequences(sequences.slice(0, -1))

    if (activeDrill && lastSeq.drillNumber === activeDrill.drillNumber) {
      setActiveDrill({
        ...activeDrill,
        state: lastSeq.state,
        sequenceNumber: lastSeq.sequenceNumber,
        sequenceStartTime: lastSeq.startTimestamp,
      })
      // No need to reset `now` — the interval is still ticking and
      // elapsedMs = now - sequenceStartTime will automatically reflect
      // the full accumulated time for that sequence.
    }
  }, [sequences, activeDrill])

  const finishSession = useCallback(() => {
    if (activeDrill) {
      const endTime = Date.now()
      const closed = buildSequence(activeDrill, endTime)
      setSequences((prev) => [...prev, closed])
      setActiveDrill(null)
      setDrillNameInput('')
    }
    setSessionFinished(true)
  }, [activeDrill, buildSequence])

  const handleExportCSV = useCallback(() => {
    if (sequences.length === 0) return
    exportToCSV(sequences)
  }, [sequences])

  const handleExportCatapult = useCallback(() => {
    if (sequences.length === 0) return
    exportCatapultJSON(sequences)
  }, [sequences])

  const resetSession = useCallback(() => {
    setDayCode('')
    setDrillNameInput('')
    setSequences([])
    setActiveDrill(null)
    setSessionFinished(false)
    drillCounterRef.current = 0
    setNow(Date.now())
  }, [])

  const elapsedMs = activeDrill ? now - activeDrill.sequenceStartTime : 0

  // ── W:R% stats ─────────────────────────────────────────────────────────────
  // "Current drill" = whichever drill is active, or the last one that ran.
  const currentDrillNumber =
    activeDrill?.drillNumber ?? sequences[sequences.length - 1]?.drillNumber ?? null

  const currentDrillName: string | null =
    activeDrill?.drillName ??
    sequences.find((s) => s.drillNumber === currentDrillNumber)?.drillName ??
    null

  const drillIsActive = activeDrill !== null && activeDrill.drillNumber === currentDrillNumber

  const drillStats: WRStats | null =
    currentDrillNumber !== null
      ? computeWRStats(
          sequences.filter((s) => s.drillNumber === currentDrillNumber),
          drillIsActive ? activeDrill!.state : null,
          drillIsActive ? elapsedMs : 0
        )
      : null

  const sessionStats: WRStats = computeWRStats(
    sequences,
    activeDrill?.state ?? null,
    elapsedMs
  )

  const sessionDetail: SessionDetailStats = computeSessionDetailStats(
    sequences,
    activeDrill?.state ?? null,
    elapsedMs
  )

  // Collect unique drill numbers in the order they first appeared
  const seenDrillNums: number[] = []
  for (const s of sequences) {
    if (!seenDrillNums.includes(s.drillNumber)) seenDrillNums.push(s.drillNumber)
  }
  if (activeDrill && !seenDrillNums.includes(activeDrill.drillNumber)) {
    seenDrillNums.push(activeDrill.drillNumber)
  }

  const drillSummaries: DrillSummary[] = seenDrillNums.map((num) => {
    const isActive = activeDrill?.drillNumber === num
    const name = isActive
      ? activeDrill!.drillName
      : sequences.find((s) => s.drillNumber === num)?.drillName ?? ''
    return {
      drillNumber: num,
      drillName: name,
      isActive,
      stats: computeWRStats(
        sequences.filter((s) => s.drillNumber === num),
        isActive ? activeDrill!.state : null,
        isActive ? elapsedMs : 0
      ),
    }
  })

  return {
    dayCode,
    drillNameInput,
    sequences,
    activeDrill,
    sessionFinished,
    elapsedMs,
    drillStats,
    currentDrillName,
    sessionStats,
    sessionDetail,
    drillSummaries,

    canStartDrill:
      Boolean(dayCode && drillNameInput.trim()) &&
      !activeDrill &&
      !sessionFinished,
    canToggle: Boolean(activeDrill) && !sessionFinished,
    canStopDrill: Boolean(activeDrill) && !sessionFinished,
    canRevert: sequences.length > 0,
    canExport: sequences.length > 0,
    canFinish: !sessionFinished,

    setDayCode,
    setDrillNameInput,
    startDrill,
    toggle,
    stopDrill,
    revertLastToggle,
    finishSession,
    handleExportCSV,
    handleExportCatapult,
    resetSession,
  }
}
