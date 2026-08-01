import { describe, expect, it } from 'vitest'
import { classifyLevel, computeRms, toDisplayLevel } from './noise'

describe('computeRms', () => {
  it('is zero for silence and empty input', () => {
    expect(computeRms(new Float32Array([0, 0, 0]))).toBe(0)
    expect(computeRms(new Float32Array([]))).toBe(0)
  })
  it('equals the constant amplitude for a DC signal', () => {
    expect(computeRms(new Float32Array([0.5, 0.5, 0.5]))).toBeCloseTo(0.5)
  })
  it('is ~0.707 for a full-scale square wave', () => {
    expect(computeRms(new Float32Array([1, -1, 1, -1]))).toBeCloseTo(1)
  })
})

describe('toDisplayLevel', () => {
  it('scales and clamps to [0, 1]', () => {
    expect(toDisplayLevel(0)).toBe(0)
    expect(toDisplayLevel(0.1, 4)).toBeCloseTo(0.4)
    expect(toDisplayLevel(1, 4)).toBe(1)
  })
})

describe('classifyLevel', () => {
  it('buckets relative to the threshold', () => {
    expect(classifyLevel(0.1, 0.5)).toBe('quiet')
    expect(classifyLevel(0.35, 0.5)).toBe('ok')
    expect(classifyLevel(0.6, 0.5)).toBe('loud')
  })
})
