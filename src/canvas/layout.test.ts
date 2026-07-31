import { describe, expect, it } from 'vitest'
import type { LayoutItem } from '../persistence/schema'
import { CANVAS_SIZE, clampZoom, dragItem, moveItem, nextPosition, NUDGE_STEP } from './layout'

const base: LayoutItem[] = [
  { i: 'a', x: 100, y: 100, w: 200, h: 150 },
  { i: 'b', x: 400, y: 300, w: 200, h: 150 },
]

describe('dragItem', () => {
  it('moves only the target item by the delta', () => {
    const next = dragItem(base, 'a', 30, -20)
    expect(next[0]).toMatchObject({ x: 130, y: 80 })
    expect(next[1]).toEqual(base[1])
  })
  it('clamps to the canvas bounds', () => {
    expect(dragItem(base, 'a', -9999, -9999)[0]).toMatchObject({ x: 0, y: 0 })
    const far = dragItem(base, 'a', 99999, 99999)[0]
    expect(far.x).toBe(CANVAS_SIZE - 200)
    expect(far.y).toBe(CANVAS_SIZE - 150)
  })
  it('does not mutate the input', () => {
    const copy = structuredClone(base)
    dragItem(base, 'a', 10, 10)
    expect(base).toEqual(copy)
  })
})

describe('moveItem', () => {
  it('nudges one step per direction', () => {
    expect(moveItem(base, 'a', 'right')[0].x).toBe(100 + NUDGE_STEP)
    expect(moveItem(base, 'a', 'up')[0].y).toBe(100 - NUDGE_STEP)
  })
  it('clamps at the top-left edge', () => {
    const at0: LayoutItem[] = [{ i: 'a', x: 0, y: 0, w: 100, h: 100 }]
    expect(moveItem(at0, 'a', 'left')[0].x).toBe(0)
    expect(moveItem(at0, 'a', 'up')[0].y).toBe(0)
  })
})

describe('clampZoom', () => {
  it('clamps into the allowed range', () => {
    expect(clampZoom(0.1)).toBe(0.4)
    expect(clampZoom(9)).toBe(2.5)
    expect(clampZoom(1)).toBe(1)
  })
})

describe('nextPosition', () => {
  it('cascades and wraps every 8 widgets', () => {
    expect(nextPosition(0)).toEqual({ x: 40, y: 40 })
    expect(nextPosition(8)).toEqual({ x: 40, y: 40 })
    expect(nextPosition(1).x).toBeGreaterThan(40)
  })
})
