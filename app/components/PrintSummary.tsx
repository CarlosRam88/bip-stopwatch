'use client'

import type { Sequence, WRStats, DrillSummary, SessionDetailStats } from '../lib/types'
import { formatDuration } from '../lib/utils'

// Design tokens — mirrors globals.css @theme inline
const C = {
  bg:      '#080e1a',
  surface: '#0d1730',
  panel:   '#060b17',
  border:  '#1a3a5c',
  accent:  '#38bdf8',
  text:    '#cde4f5',
  muted:   '#5a7fa0',
  inPlay:  '#3fb950',
  outPlay: '#f85149',
}

// ── Inline progress ring ───────────────────────────────────────────────────────

const RING = 96
const STROKE = 9
const RADIUS = (RING - STROKE) / 2
const CIRC = 2 * Math.PI * RADIUS

function Ring({ pct }: { pct: number | null }) {
  const offset = pct !== null ? CIRC * (1 - pct / 100) : CIRC
  return (
    <div style={{ position: 'relative', width: RING, height: RING, flexShrink: 0 }}>
      <svg width={RING} height={RING} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={RING / 2} cy={RING / 2} r={RADIUS} fill="none"
          stroke={C.panel} strokeWidth={STROKE} />
        <circle cx={RING / 2} cy={RING / 2} r={RADIUS} fill="none"
          stroke={C.accent} strokeWidth={STROKE} strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={offset} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'monospace', fontWeight: 700, fontSize: 18,
        color: pct !== null ? C.text : C.muted,
      }}>
        {pct !== null ? `${pct}%` : '—'}
      </div>
    </div>
  )
}

// ── Inline timeline bar ────────────────────────────────────────────────────────

function TimelineBar({ sequences }: { sequences: Sequence[] }) {
  if (sequences.length === 0) return null
  const totalMs = sequences.reduce((s, q) => s + q.durationMs, 0)
  if (totalMs === 0) return null

  // Compute drill label positions
  const drillLabels: { drillNumber: number; drillName: string; leftPct: number }[] = []
  let cumMs = 0
  let prevDrillNum: number | null = null
  for (const seq of sequences) {
    if (seq.drillNumber !== prevDrillNum) {
      drillLabels.push({ drillNumber: seq.drillNumber, drillName: seq.drillName, leftPct: (cumMs / totalMs) * 100 })
      prevDrillNum = seq.drillNumber
    }
    cumMs += seq.durationMs
  }

  return (
    <div style={{ position: 'relative', height: 28, width: '100%', borderRadius: 6, overflow: 'hidden', backgroundColor: C.panel }}>
      {/* Colour segments */}
      <div style={{ display: 'flex', height: '100%' }}>
        {sequences.map((seq, idx) => {
          const w = (seq.durationMs / totalMs) * 100
          const prev = idx > 0 ? sequences[idx - 1].drillNumber : null
          const boundary = prev !== null && seq.drillNumber !== prev
          return (
            <div
              key={seq.id}
              style={{
                height: '100%',
                width: `${w}%`,
                minWidth: w > 0 ? 2 : 0,
                backgroundColor: seq.state === 'in-play' ? C.inPlay : C.outPlay,
                borderLeft: boundary ? `4px solid ${C.bg}` : undefined,
              }}
            />
          )
        })}
      </div>
      {/* Drill name overlays */}
      {drillLabels.map((lbl) => (
        <div
          key={lbl.drillNumber}
          style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `calc(${lbl.leftPct}% + 8px)`,
            display: 'flex', alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <span style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 10,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          }}>
            {lbl.drillName}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

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
  const dayCode     = sequences[0]?.dayCode ?? '—'
  const totalInPlay = sequences.filter((s) => s.state === 'in-play').length

  const label = (text: string) => (
    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted }}>
      {text}
    </span>
  )

  const statBox = (title: string, value: string) => (
    <div style={{
      flex: 1,
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: '12px 16px',
    }}>
      {label(title)}
      <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 22, color: C.text, marginTop: 6 }}>
        {value}
      </div>
    </div>
  )

  return (
    <div
      className="hidden print:block"
      style={{
        backgroundColor: C.bg,
        color: C.text,
        fontFamily: 'Arial, sans-serif',
        fontSize: 13,
        lineHeight: 1.5,
        padding: '36px 44px',
        minHeight: '100vh',
        // Blueprint grid
        backgroundImage: `linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${C.border}`,
        paddingBottom: 20,
        marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/scotlandlogo.png" alt="Scottish Rugby" width={56} height={56} loading="eager" />
          <div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 22, letterSpacing: '0.2em', color: C.accent }}>
              BIP REPORT
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginTop: 2 }}>
              Scottish Rugby Athletic Performance &amp; Sports Science
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              {label('Date')}
              <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{sessionDate}</div>
            </div>
            <div>
              {label('Day Code')}
              <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{dayCode}</div>
            </div>
            <div>
              {label('Drills')}
              <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{drillSummaries.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Session W:R% hero ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        {label('Session W:R%')}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 12 }}>
          <Ring pct={sessionStats.percentage} />
          <div style={{ display: 'flex', gap: 16, flex: 1 }}>
            {statBox('In Play',     formatDuration(sessionStats.inPlayMs))}
            {statBox('Out of Play', formatDuration(sessionStats.outOfPlayMs))}
            {statBox('Total',       formatDuration(sessionStats.totalMs))}
          </div>
        </div>
      </div>

      {/* ── Session Timeline ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          {label('Session Timeline')}
          <div style={{ display: 'flex', gap: 16, fontSize: 10, color: C.muted }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ display: 'inline-block', width: 12, height: 8, borderRadius: 2, backgroundColor: C.inPlay }} />
              In Play
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ display: 'inline-block', width: 12, height: 8, borderRadius: 2, backgroundColor: C.outPlay }} />
              Out of Play
            </span>
          </div>
        </div>
        <TimelineBar sequences={sequences} />
      </div>

      {/* ── Drill Breakdown ─────────────────────────────────────────────── */}
      {drillSummaries.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          {label('Drill Breakdown')}
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {drillSummaries.map((drill) => {
              const pct = drill.stats.percentage ?? 0
              return (
                <div key={drill.drillNumber} style={{
                  backgroundColor: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '12px 16px',
                }}>
                  {/* Row: name + stats */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{drill.drillName}</span>
                    <div style={{ display: 'flex', gap: 20, fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>
                      <span>
                        <span style={{ color: C.inPlay }}>▪</span>{' '}
                        {formatDuration(drill.stats.inPlayMs)}
                      </span>
                      <span>
                        <span style={{ color: C.outPlay }}>▪</span>{' '}
                        {formatDuration(drill.stats.outOfPlayMs)}
                      </span>
                      <span style={{ color: C.accent, fontWeight: 700, fontSize: 13 }}>
                        {drill.stats.percentage !== null ? `${drill.stats.percentage}%` : '—'}
                      </span>
                    </div>
                  </div>
                  {/* Bar */}
                  <div style={{ height: 6, width: '100%', borderRadius: 9999, backgroundColor: C.panel, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 9999, backgroundColor: C.accent }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Session Details ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        {label('Session Details')}
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          {statBox('Longest In Play',
            sessionDetail.longestInPlayMs !== null ? formatDuration(sessionDetail.longestInPlayMs) : '—')}
          {statBox('Long Sequences (>60s)',
            totalInPlay > 0 ? String(sessionDetail.longSequenceCount) : '—')}
          {statBox('Long Sequences %',
            sessionDetail.longSequencePct !== null ? `${sessionDetail.longSequencePct}%` : '—')}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div style={{
        borderTop: `1px solid ${C.border}`,
        paddingTop: 14,
        marginTop: 8,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 10,
        color: C.muted,
        letterSpacing: '0.05em',
      }}>
        <span>BIP Stopwatch · Scottish Rugby Athletic Performance &amp; Sports Science</span>
        <span>Exported {new Date().toLocaleString('en-GB')}</span>
      </div>
    </div>
  )
}
