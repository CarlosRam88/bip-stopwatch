import type { Sequence, PlayState, WRStats, SessionDetailStats } from './types'

/** Format milliseconds as mm:ss.cc (centiseconds) */
export function formatDuration(ms: number): string {
  if (ms < 0) ms = 0
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const centiseconds = Math.floor((ms % 1000) / 10)
  return (
    String(minutes).padStart(2, '0') +
    ':' +
    String(seconds).padStart(2, '0') +
    '.' +
    String(centiseconds).padStart(2, '0')
  )
}

/** Format epoch ms as a local date string (DD/MM/YYYY) */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-GB')
}

/**
 * Compute W:R% stats from a set of closed sequences plus an optional active
 * sequence (identified by its current play state and elapsed ms).
 *
 * Pass activeState=null / elapsedMs=0 when no drill is currently running.
 */
export function computeWRStats(
  sequences: Sequence[],
  activeState: PlayState | null,
  elapsedMs: number
): WRStats {
  let inPlayMs = 0
  let outOfPlayMs = 0

  for (const seq of sequences) {
    if (seq.state === 'in-play') inPlayMs += seq.durationMs
    else outOfPlayMs += seq.durationMs
  }

  if (activeState === 'in-play') inPlayMs += elapsedMs
  else if (activeState === 'out-of-play') outOfPlayMs += elapsedMs

  const totalMs = inPlayMs + outOfPlayMs
  return {
    inPlayMs,
    outOfPlayMs,
    totalMs,
    percentage: totalMs > 0 ? Math.round((inPlayMs / totalMs) * 100) : null,
  }
}

const LONG_SEQUENCE_THRESHOLD_MS = 60_000

/**
 * Compute session-level detail stats (longest In Play, long-sequence count/%).
 * Includes the currently active sequence when activeState / elapsedMs are provided.
 */
export function computeSessionDetailStats(
  sequences: Sequence[],
  activeState: PlayState | null,
  elapsedMs: number
): SessionDetailStats {
  let longestInPlayMs: number | null = null
  let longSequenceCount = 0
  let totalInPlayCount = 0

  for (const seq of sequences) {
    if (seq.state !== 'in-play') continue
    totalInPlayCount++
    if (longestInPlayMs === null || seq.durationMs > longestInPlayMs) {
      longestInPlayMs = seq.durationMs
    }
    if (seq.durationMs > LONG_SEQUENCE_THRESHOLD_MS) longSequenceCount++
  }

  // Include the active sequence if it is In Play
  if (activeState === 'in-play') {
    totalInPlayCount++
    if (longestInPlayMs === null || elapsedMs > longestInPlayMs) {
      longestInPlayMs = elapsedMs
    }
    if (elapsedMs > LONG_SEQUENCE_THRESHOLD_MS) longSequenceCount++
  }

  return {
    longestInPlayMs,
    longSequenceCount,
    totalInPlayCount,
    longSequencePct:
      totalInPlayCount > 0
        ? Math.round((longSequenceCount / totalInPlayCount) * 100)
        : null,
  }
}

/** Export all sequences to a CSV file and trigger a browser download */
export function exportToCSV(sequences: Sequence[]): void {
  const headers = [
    'Date',
    'Day Code',
    'Drill Number',
    'Drill Name',
    'Sequence Number',
    'State',
    'Duration',
    'Duration (s)',
    'Start Timestamp',
    'End Timestamp',
  ]

  const rows = sequences.map((s) => [
    s.date,
    s.dayCode,
    String(s.drillNumber),
    s.drillName,
    String(s.sequenceNumber),
    s.state === 'in-play' ? 'In Play' : 'Out of Play',
    formatDuration(s.durationMs),
    String(s.durationMs / 1000),
    new Date(s.startTimestamp).toISOString(),
    new Date(s.endTimestamp).toISOString(),
  ])

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
    .join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bip-session-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
