import { describe, expect, it } from 'vitest'
import {
  createTimer,
  formatDuration,
  isFinished,
  pauseTimer,
  resetTimer,
  setDuration,
  startTimer,
  tickTimer,
} from './timer'

describe('timer model', () => {
  it('creates a paused timer at full duration', () => {
    const t = createTimer(60_000)
    expect(t.running).toBe(false)
    expect(t.remainingMs).toBe(60_000)
    expect(t.endsAt).toBeNull()
  })

  it('starting sets an absolute end timestamp', () => {
    const t = startTimer(createTimer(60_000), 1_000)
    expect(t.running).toBe(true)
    expect(t.endsAt).toBe(61_000)
  })

  it('derives remaining from the end timestamp (drift-free on catch-up)', () => {
    const started = startTimer(createTimer(60_000), 0)
    // Simulate a throttled tab: no ticks for 45s, then one late tick.
    const ticked = tickTimer(started, 45_000)
    expect(ticked.remainingMs).toBe(15_000)
  })

  it('pausing freezes remaining and clears the end timestamp', () => {
    const started = startTimer(createTimer(60_000), 0)
    const paused = pauseTimer(started, 20_000)
    expect(paused.running).toBe(false)
    expect(paused.remainingMs).toBe(40_000)
    expect(paused.endsAt).toBeNull()
    // Time passing while paused does not change remaining.
    expect(tickTimer(paused, 99_000).remainingMs).toBe(40_000)
  })

  it('resuming after pause continues from the frozen remaining', () => {
    const started = startTimer(createTimer(60_000), 0)
    const paused = pauseTimer(started, 20_000)
    const resumed = startTimer(paused, 100_000)
    expect(resumed.endsAt).toBe(140_000)
    expect(tickTimer(resumed, 130_000).remainingMs).toBe(10_000)
  })

  it('stops and clamps at zero when time runs out', () => {
    const started = startTimer(createTimer(5_000), 0)
    const done = tickTimer(started, 10_000)
    expect(done.running).toBe(false)
    expect(done.remainingMs).toBe(0)
    expect(isFinished(done)).toBe(true)
  })

  it('reset returns to full duration and stops', () => {
    const started = startTimer(createTimer(60_000), 0)
    const reset = resetTimer(tickTimer(started, 30_000))
    expect(reset.remainingMs).toBe(60_000)
    expect(reset.running).toBe(false)
  })

  it('setDuration replaces duration and stops', () => {
    const t = setDuration(startTimer(createTimer(60_000), 0), 120_000)
    expect(t.durationMs).toBe(120_000)
    expect(t.remainingMs).toBe(120_000)
    expect(t.running).toBe(false)
  })

  it('formats durations as M:SS and H:MM:SS', () => {
    expect(formatDuration(0)).toBe('0:00')
    expect(formatDuration(65_000)).toBe('1:05')
    expect(formatDuration(3_661_000)).toBe('1:01:01')
  })
})
