/**
 * Pure countdown-timer model. Remaining time is always derived from an absolute
 * end timestamp while running, so the timer is drift-free and correct even if
 * the ticking source (a Web Worker heartbeat) is throttled in a background tab.
 */
export interface TimerState {
  /** Configured countdown length in milliseconds. */
  durationMs: number
  /** Remaining milliseconds when paused; recomputed from `endsAt` while running. */
  remainingMs: number
  /** Absolute epoch millisecond at which the countdown reaches zero, or null when paused. */
  endsAt: number | null
  running: boolean
}

export function createTimer(durationMs: number): TimerState {
  return { durationMs, remainingMs: durationMs, endsAt: null, running: false }
}

export function startTimer(state: TimerState, now: number): TimerState {
  if (state.running || state.remainingMs <= 0) return state
  return { ...state, running: true, endsAt: now + state.remainingMs }
}

export function pauseTimer(state: TimerState, now: number): TimerState {
  if (!state.running) return state
  return { ...state, running: false, remainingMs: remainingAt(state, now), endsAt: null }
}

export function resetTimer(state: TimerState): TimerState {
  return { ...state, running: false, remainingMs: state.durationMs, endsAt: null }
}

export function setDuration(_state: TimerState, durationMs: number): TimerState {
  const clamped = Math.max(0, durationMs)
  return { durationMs: clamped, remainingMs: clamped, endsAt: null, running: false }
}

/** Recompute remaining time for the current moment; clamps at zero and stops. */
export function tickTimer(state: TimerState, now: number): TimerState {
  if (!state.running) return state
  const remaining = remainingAt(state, now)
  if (remaining <= 0) {
    return { ...state, running: false, remainingMs: 0, endsAt: null }
  }
  return { ...state, remainingMs: remaining }
}

export function isFinished(state: TimerState): boolean {
  return !state.running && state.remainingMs <= 0
}

function remainingAt(state: TimerState, now: number): number {
  if (state.endsAt === null) return state.remainingMs
  return Math.max(0, state.endsAt - now)
}

/** Format milliseconds as `M:SS` or `H:MM:SS`. */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`
}
