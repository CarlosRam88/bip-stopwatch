'use client'

import type { Sequence } from '../lib/types'
import { formatDuration } from '../lib/utils'

interface SequencesTableProps {
  sequences: Sequence[]
}

export default function SequencesTable({ sequences }: SequencesTableProps) {
  if (sequences.length === 0) return null

  return (
    <section className="rounded-lg border border-bip-border bg-bip-surface overflow-hidden">
      <header className="px-4 py-3 border-b border-bip-border flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-widest text-bip-muted uppercase">
          Session Log
        </h2>
        <span className="text-xs text-bip-muted">
          {sequences.length} sequence{sequences.length !== 1 ? 's' : ''}
        </span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-bip-border text-left">
              {['Drill Name', 'Seq #', 'State', 'Duration'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-xs font-semibold tracking-wide text-bip-muted uppercase whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {sequences.map((seq, idx) => {
              const prevDrill = idx > 0 ? sequences[idx - 1].drillNumber : null
              const isDrillBoundary = prevDrill !== null && seq.drillNumber !== prevDrill
              const isInPlay = seq.state === 'in-play'

              return (
                <tr
                  key={seq.id}
                  className={`border-b border-bip-border/50 transition-colors
                              ${isDrillBoundary ? 'border-t-2 border-t-bip-border' : ''}
                              hover:bg-bip-panel/50`}
                >
                  <td className="px-4 py-2.5 text-bip-text">{seq.drillName}</td>
                  <td className="px-4 py-2.5 text-bip-muted text-center">{seq.sequenceNumber}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5
                                  text-xs font-semibold
                                  ${
                                    isInPlay
                                      ? 'bg-in-play/15 text-in-play'
                                      : 'bg-out-play/15 text-out-play'
                                  }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isInPlay ? 'bg-in-play' : 'bg-out-play'
                        }`}
                      />
                      {isInPlay ? 'In Play' : 'Out of Play'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-bip-text whitespace-nowrap">
                    {formatDuration(seq.durationMs)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
