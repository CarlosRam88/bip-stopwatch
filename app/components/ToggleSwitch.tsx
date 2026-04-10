'use client'

import type { PlayState } from '../lib/types'

interface ToggleSwitchProps {
  state: PlayState
  disabled: boolean
  onToggle: () => void
}

export default function ToggleSwitch({ state, disabled, onToggle }: ToggleSwitchProps) {
  const isInPlay = state === 'in-play'

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onToggle}
        disabled={disabled}
        aria-label={`Toggle to ${isInPlay ? 'Out of Play' : 'In Play'}`}
        aria-pressed={isInPlay}
        className="relative h-16 w-80 max-w-full rounded-full overflow-hidden
                   border-2 border-bip-border
                   disabled:cursor-not-allowed disabled:opacity-30
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-bip-accent
                   transition-shadow duration-150 hover:shadow-lg hover:shadow-black/40"
      >
        {/* Sliding background pill */}
        <span
          className={`absolute inset-0 transition-colors duration-300 ${
            isInPlay ? 'bg-in-play/20' : 'bg-out-play/20'
          }`}
        />

        {/* Sliding thumb */}
        <span
          className={`absolute top-2 h-[calc(100%-16px)] w-[calc(50%-10px)] rounded-full
                      shadow-lg transition-all duration-300 ease-in-out
                      ${
                        isInPlay
                          ? 'left-2 bg-in-play shadow-in-play/40'
                          : 'left-[calc(50%+6px)] bg-out-play shadow-out-play/40'
                      }`}
        />

        {/* Labels */}
        <span
          className={`absolute left-0 top-0 flex h-full w-1/2 items-center justify-center
                      text-xs font-bold tracking-widest uppercase
                      transition-colors duration-300
                      ${isInPlay ? 'text-white' : 'text-bip-muted'}`}
        >
          In Play
        </span>
        <span
          className={`absolute right-0 top-0 flex h-full w-1/2 items-center justify-center
                      text-xs font-bold tracking-widest uppercase
                      transition-colors duration-300
                      ${!isInPlay ? 'text-white' : 'text-bip-muted'}`}
        >
          Out of Play
        </span>
      </button>

      <p className="text-xs text-bip-muted">tap to toggle state</p>
    </div>
  )
}
