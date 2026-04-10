export type PlayState = 'in-play' | 'out-of-play'

export const DAY_CODES = ['MD-5', 'MD-4', 'MD-3', 'MD-2', 'Other'] as const
export type DayCode = (typeof DAY_CODES)[number]

export interface Sequence {
  id: string
  date: string           // formatted display date (e.g. "10/04/2026")
  dayCode: string
  drillName: string
  drillNumber: number
  sequenceNumber: number
  state: PlayState
  startTimestamp: number // epoch ms
  endTimestamp: number   // epoch ms
  durationMs: number
}

export interface SessionDetailStats {
  /** Duration of the longest In Play sequence (null = no In Play data yet) */
  longestInPlayMs: number | null
  /** Count of In Play sequences longer than the long-sequence threshold */
  longSequenceCount: number
  /** Total number of In Play sequences */
  totalInPlayCount: number
  /** longSequenceCount / totalInPlayCount × 100, null when no In Play data */
  longSequencePct: number | null
}

export interface WRStats {
  inPlayMs: number
  outOfPlayMs: number
  totalMs: number
  /** null when totalMs === 0 (no data yet) */
  percentage: number | null
}

export interface ActiveDrill {
  drillNumber: number
  drillName: string
  dayCode: string
  /** The number that will be assigned to the CURRENTLY RUNNING sequence when it closes */
  sequenceNumber: number
  state: PlayState
  /** Epoch ms when the current sequence started */
  sequenceStartTime: number
}
