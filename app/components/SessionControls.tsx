'use client'

interface SessionControlsProps {
  sessionFinished: boolean
  canExport: boolean
  canFinish: boolean
  onFinishSession: () => void
  onExportCSV: () => void
  onExportCatapult: () => void
  onResetSession: () => void
}

export default function SessionControls({
  sessionFinished,
  canExport,
  canFinish,
  onFinishSession,
  onExportCSV,
  onExportCatapult,
  onResetSession,
}: SessionControlsProps) {
  return (
    <section className="rounded-lg border border-bip-border bg-bip-surface p-4">
      <h2 className="text-xs font-semibold tracking-widest text-bip-muted uppercase mb-3">
        Session
      </h2>

      <div className="flex flex-wrap gap-3">
        {/* Finish Session */}
        <button
          onClick={onFinishSession}
          disabled={!canFinish}
          className="rounded px-5 py-2.5 text-sm font-semibold tracking-wide uppercase
                     border border-amber-500/60 text-amber-400
                     hover:bg-amber-500/10 active:bg-amber-500/20
                     transition-colors duration-150
                     disabled:cursor-not-allowed disabled:opacity-30"
        >
          {sessionFinished ? 'Session Finished' : 'Finish Session'}
        </button>

        {/* Export CSV */}
        <button
          onClick={onExportCSV}
          disabled={!canExport}
          className="rounded px-5 py-2.5 text-sm font-semibold tracking-wide uppercase
                     border border-bip-accent/60 text-bip-accent
                     hover:bg-bip-accent/10 active:bg-bip-accent/20
                     transition-colors duration-150
                     disabled:cursor-not-allowed disabled:opacity-30"
        >
          Export CSV
        </button>

        {/* Export Catapult JSON */}
        <button
          onClick={onExportCatapult}
          disabled={!canExport}
          className="rounded px-5 py-2.5 text-sm font-semibold tracking-wide uppercase
                     border border-bip-accent/60 text-bip-accent
                     hover:bg-bip-accent/10 active:bg-bip-accent/20
                     transition-colors duration-150
                     disabled:cursor-not-allowed disabled:opacity-30"
        >
          Export Catapult
        </button>

        {/* Reset Session */}
        <button
          onClick={onResetSession}
          className="rounded px-5 py-2.5 text-sm font-semibold tracking-wide uppercase
                     border border-bip-border text-bip-muted
                     hover:border-red-500/60 hover:text-red-400 hover:bg-red-500/10
                     active:bg-red-500/20
                     transition-colors duration-150"
        >
          Reset Session
        </button>
      </div>
    </section>
  )
}
