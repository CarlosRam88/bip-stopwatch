'use client'

import type { Sequence, WRStats, DrillSummary, SessionDetailStats } from '../lib/types'
import { formatDuration } from '../lib/utils'

interface PrintSummaryProps {
  sequences: Sequence[]
  sessionStats: WRStats
  drillSummaries: DrillSummary[]
  sessionDetail: SessionDetailStats
}

export default function PrintSummary({
  sequences,
  sessionStats,
  drillSummaries,
  sessionDetail,
}: PrintSummaryProps) {
  if (sequences.length === 0) return null

  const sessionDate = sequences[0]?.date ?? new Date().toLocaleDateString('en-GB')
  const dayCode = sequences[0]?.dayCode ?? '—'
  const totalInPlayCount = sequences.filter((s) => s.state === 'in-play').length

  return (
    <div className="hidden print:block bg-white text-black p-10 font-sans text-sm leading-relaxed">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="border-b-2 border-black pb-5 mb-6">
        <h1 className="text-2xl font-bold tracking-[0.2em] uppercase">BIP Stopwatch</h1>
        <p className="text-gray-500 text-xs tracking-widest uppercase mt-0.5">
          Scottish Rugby Athletic Performance &amp; Sports Science
        </p>
        <div className="mt-3 flex flex-wrap gap-6 text-sm">
          <span>
            <span className="text-gray-500 uppercase text-xs font-semibold tracking-wide">Date </span>
            {sessionDate}
          </span>
          <span>
            <span className="text-gray-500 uppercase text-xs font-semibold tracking-wide">Day Code </span>
            {dayCode}
          </span>
          <span>
            <span className="text-gray-500 uppercase text-xs font-semibold tracking-wide">Drills </span>
            {drillSummaries.length}
          </span>
          <span>
            <span className="text-gray-500 uppercase text-xs font-semibold tracking-wide">Sequences </span>
            {sequences.length}
          </span>
        </div>
      </div>

      {/* ── Session W:R% ────────────────────────────────────────────────── */}
      <div className="mb-7">
        <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
          Session W:R%
        </h2>
        <div className="flex items-baseline gap-8">
          <span className="text-6xl font-bold font-mono tabular-nums">
            {sessionStats.percentage !== null ? `${sessionStats.percentage}%` : '—'}
          </span>
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              In Play:{' '}
              <span className="font-mono font-semibold">{formatDuration(sessionStats.inPlayMs)}</span>
            </div>
            <div>
              Out of Play:{' '}
              <span className="font-mono font-semibold">{formatDuration(sessionStats.outOfPlayMs)}</span>
            </div>
            <div>
              Total:{' '}
              <span className="font-mono font-semibold">{formatDuration(sessionStats.totalMs)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Drill Breakdown ─────────────────────────────────────────────── */}
      {drillSummaries.length > 0 && (
        <div className="mb-7">
          <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
            Drill Breakdown
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 pr-4 font-semibold text-gray-700 uppercase text-xs tracking-wide">
                  Drill
                </th>
                <th className="text-right py-2 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wide">
                  In Play
                </th>
                <th className="text-right py-2 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wide">
                  Out of Play
                </th>
                <th className="text-right py-2 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wide">
                  Total
                </th>
                <th className="text-right py-2 pl-4 font-semibold text-gray-700 uppercase text-xs tracking-wide">
                  W:R%
                </th>
              </tr>
            </thead>
            <tbody>
              {drillSummaries.map((drill) => (
                <tr key={drill.drillNumber} className="border-b border-gray-100">
                  <td className="py-2 pr-4">{drill.drillName}</td>
                  <td className="text-right py-2 px-4 font-mono">
                    {formatDuration(drill.stats.inPlayMs)}
                  </td>
                  <td className="text-right py-2 px-4 font-mono">
                    {formatDuration(drill.stats.outOfPlayMs)}
                  </td>
                  <td className="text-right py-2 px-4 font-mono">
                    {formatDuration(drill.stats.totalMs)}
                  </td>
                  <td className="text-right py-2 pl-4 font-mono font-bold">
                    {drill.stats.percentage !== null ? `${drill.stats.percentage}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Session Details ─────────────────────────────────────────────── */}
      <div className="mb-7">
        <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
          Session Details
        </h2>
        <div className="flex gap-10">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
              Longest In Play
            </div>
            <div className="font-mono font-bold text-2xl">
              {sessionDetail.longestInPlayMs !== null
                ? formatDuration(sessionDetail.longestInPlayMs)
                : '—'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
              Long Sequences (&gt;60s)
            </div>
            <div className="font-mono font-bold text-2xl">
              {totalInPlayCount > 0 ? String(sessionDetail.longSequenceCount) : '—'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
              Long Sequences %
            </div>
            <div className="font-mono font-bold text-2xl">
              {sessionDetail.longSequencePct !== null ? `${sessionDetail.longSequencePct}%` : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="mt-10 pt-4 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
        <span>BIP Stopwatch · Scottish Rugby</span>
        <span>Exported {new Date().toLocaleString('en-GB')}</span>
      </div>
    </div>
  )
}
