import { describe, expect, it } from 'vitest'
import { clampDim, MAX_DIM, resizeSeats } from './seating'

describe('clampDim', () => {
  it('clamps into range and floors', () => {
    expect(clampDim(0)).toBe(1)
    expect(clampDim(3.9)).toBe(3)
    expect(clampDim(999)).toBe(MAX_DIM)
    expect(clampDim(NaN)).toBe(1)
  })
})

describe('resizeSeats', () => {
  // 2x2 grid: seats indexed row-major.
  const seats = ['a', 'b', 'c', 'd']

  it('keeps assignments that still fit when growing', () => {
    const next = resizeSeats(seats, 2, 2, 2, 3)
    // Row 0: a b _, Row 1: c d _
    expect(next).toEqual(['a', 'b', null, 'c', 'd', null])
  })

  it('drops assignments outside the new bounds when shrinking', () => {
    const next = resizeSeats(seats, 2, 2, 1, 2)
    expect(next).toEqual(['a', 'b'])
  })

  it('returns the correct length', () => {
    expect(resizeSeats(seats, 2, 2, 3, 3)).toHaveLength(9)
  })

  it('does not mutate the input', () => {
    const copy = [...seats]
    resizeSeats(seats, 2, 2, 3, 3)
    expect(seats).toEqual(copy)
  })
})
