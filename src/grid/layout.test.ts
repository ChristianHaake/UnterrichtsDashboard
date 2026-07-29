import { describe, expect, it } from 'vitest'
import type { Layout } from 'react-grid-layout'
import { bottomY, moveItem } from './layout'

const base: Layout[] = [
  { i: 'a', x: 0, y: 0, w: 3, h: 4 },
  { i: 'b', x: 3, y: 0, w: 4, h: 6 },
]

describe('bottomY', () => {
  it('returns 0 for an empty layout', () => {
    expect(bottomY([])).toBe(0)
  })
  it('returns the lowest edge across items', () => {
    expect(bottomY(base)).toBe(6)
  })
})

describe('moveItem', () => {
  it('does not mutate the input', () => {
    const copy = structuredClone(base)
    moveItem(base, 'a', 'right', 12)
    expect(base).toEqual(copy)
  })

  it('moves right by one column', () => {
    const next = moveItem(base, 'a', 'right', 12)
    expect(next.find((i) => i.i === 'a')?.x).toBe(1)
  })

  it('clamps at the left edge', () => {
    const next = moveItem(base, 'a', 'left', 12)
    expect(next.find((i) => i.i === 'a')?.x).toBe(0)
  })

  it('clamps at the right edge using the item width', () => {
    // Item b is width 4 at x=3; max x is 12 - 4 = 8.
    let layout = base
    for (let i = 0; i < 10; i++) layout = moveItem(layout, 'b', 'right', 12)
    expect(layout.find((i) => i.i === 'b')?.x).toBe(8)
  })

  it('clamps at the top but allows unlimited downward movement', () => {
    expect(moveItem(base, 'a', 'up', 12).find((i) => i.i === 'a')?.y).toBe(0)
    expect(moveItem(base, 'a', 'down', 12).find((i) => i.i === 'a')?.y).toBe(1)
  })

  it('leaves other items untouched', () => {
    const next = moveItem(base, 'a', 'down', 12)
    expect(next.find((i) => i.i === 'b')).toEqual(base[1])
  })
})
