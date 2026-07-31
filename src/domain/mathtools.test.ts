import { describe, expect, it } from 'vitest'
import { axisTicks, clampRange } from './mathtools'

describe('clampRange', () => {
  it('clamps and floors into range', () => {
    expect(clampRange(1)).toBe(2)
    expect(clampRange(5.8)).toBe(5)
    expect(clampRange(99)).toBe(12)
    expect(clampRange(NaN)).toBe(5)
  })
})

describe('axisTicks', () => {
  it('spans -range..range inclusive', () => {
    expect(axisTicks(3)).toEqual([-3, -2, -1, 0, 1, 2, 3])
    expect(axisTicks(2)).toHaveLength(5)
  })
})
