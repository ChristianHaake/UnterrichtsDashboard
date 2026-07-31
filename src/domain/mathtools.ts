export type MathInstrument = 'coordinate' | 'protractor' | 'ruler'
export const MATH_INSTRUMENTS: readonly MathInstrument[] = ['coordinate', 'protractor', 'ruler']

export const MIN_RANGE = 2
export const MAX_RANGE = 12

export function clampRange(value: number): number {
  if (!Number.isFinite(value)) return 5
  return Math.min(MAX_RANGE, Math.max(MIN_RANGE, Math.floor(value)))
}

/** Integer tick values from -range to +range inclusive. */
export function axisTicks(range: number): number[] {
  const r = clampRange(range)
  const ticks: number[] = []
  for (let i = -r; i <= r; i++) ticks.push(i)
  return ticks
}
