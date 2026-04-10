'use client'

import type { WRStats } from '../lib/types'
import { formatDuration } from '../lib/utils'

// ── Progress ring ──────────────────────────────────────────────────────────────

const RING_SIZE = 120
const STROKE = 10
const RADIUS = (RING_SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface ProgressRingProps {
  percentage: number | null
  hasData: boolean
}

function ProgressRing({ percentage, hasData }: ProgressRingProps) {
  const offset = hasData && percentage !== null
    ? CIRCUMFERENCE * (1 - percentage / 100)
    : CIRCUMFERENCE

  return (
    <div className="relative flex items-center justify-center" style={{ width: RING_SIZE, height: RING_SIZE }}>
      {/* SVG rotated so progress starts at 12 o'clock */}
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        className="-rotate-90"
        aria-hidden
      >
        {/* Track */}
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          className="text-bip-panel"
        />
        {/* Progress arc */}
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="text-bip-accent transition-all duration-300"
        />
      </svg>

      {/* Centred label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-mono text-2xl font-bold tabular-nums transition-colors duration-300 ${
            hasData ? 'text-bip-text' : 'text-bip-muted/30'
          }`}
        >
          {percentage !== null ? `${percentage}%` : '—'}
        </span>
      </div>
    </div>
  )
}

// ── Single card ────────────────────────────────────────────────────────────────

interface WRCardProps {
  title: string
  subtitle: string | null
  isLive: boolean
  stats: WRStats | null
}

function WRCard({ title, subtitle, isLive, stats }: WRCardProps) {
  const hasData = stats !== null && stats.totalMs > 0
  const pct = stats?.percentage ?? null

  return (
    <div className="rounded-lg border border-bip-border bg-bip-surface p-4 flex-1 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-xs font-semibold tracking-widest text-bip-muted uppercase">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-bip-muted/60">{subtitle}</p>
          )}
        </div>
        {isLive && (
          <span className="flex shrink-0 items-center gap-1 text-xs text-in-play">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-in-play" />
            Live
          </span>
        )}
      </div>

      {/* Progress ring */}
      <div className="flex justify-center">
        <ProgressRing percentage={pct} hasData={hasData} />
      </div>

      {/* Breakdown */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-medium text-in-play">In Play</span>
          <span className="font-mono text-bip-text">
            {hasData ? formatDuration(stats!.inPlayMs) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-out-play">Out of Play</span>
          <span className="font-mono text-bip-text">
            {hasData ? formatDuration(stats!.outOfPlayMs) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-bip-border/50 pt-1.5">
          <span className="font-medium text-bip-muted">Total</span>
          <span className="font-mono text-bip-text">
            {hasData ? formatDuration(stats!.totalMs) : '—'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Paired cards ───────────────────────────────────────────────────────────────

interface WRStatsCardsProps {
  drillStats: WRStats | null
  currentDrillName: string | null
  sessionStats: WRStats
  isLive: boolean
}

export default function WRStatsCards({
  drillStats,
  currentDrillName,
  sessionStats,
  isLive,
}: WRStatsCardsProps) {
  return (
    <div className="flex gap-4">
      <WRCard
        title="Current Drill W:R%"
        subtitle={currentDrillName}
        isLive={isLive}
        stats={drillStats}
      />
      <WRCard
        title="Session W:R%"
        subtitle="All drills"
        isLive={isLive}
        stats={sessionStats.totalMs > 0 ? sessionStats : null}
      />
    </div>
  )
}
