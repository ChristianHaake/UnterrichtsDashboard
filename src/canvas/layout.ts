import type { LayoutItem } from '../persistence/schema'
import type { MoveDirection } from '../widgets/types'

/** Bounded world so the canvas cannot pan into infinity. */
export const CANVAS_SIZE = 4000
/** Keyboard nudge distance in world pixels. */
export const NUDGE_STEP = 24

export const MIN_ZOOM = 0.4
export const MAX_ZOOM = 2.5

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function clampZoom(zoom: number): number {
  return clamp(zoom, MIN_ZOOM, MAX_ZOOM)
}

function clampPosition(x: number, y: number, w: number, h: number): [number, number] {
  return [clamp(x, 0, Math.max(0, CANVAS_SIZE - w)), clamp(y, 0, Math.max(0, CANVAS_SIZE - h))]
}

/** Move an item by a world-pixel delta (pointer drag), clamped to the canvas. */
export function dragItem(layout: LayoutItem[], id: string, dx: number, dy: number): LayoutItem[] {
  return layout.map((item) => {
    if (item.i !== id) return item
    const [x, y] = clampPosition(item.x + dx, item.y + dy, item.w, item.h)
    return { ...item, x, y }
  })
}

/** Keyboard alternative to drag: nudge one step in a direction, clamped. */
export function moveItem(
  layout: LayoutItem[],
  id: string,
  direction: MoveDirection,
  step: number = NUDGE_STEP,
): LayoutItem[] {
  const delta: Record<MoveDirection, [number, number]> = {
    left: [-step, 0],
    right: [step, 0],
    up: [0, -step],
    down: [0, step],
  }
  const [dx, dy] = delta[direction]
  return dragItem(layout, id, dx, dy)
}

/** Cascade newly added widgets so they do not stack exactly. */
export function nextPosition(count: number): { x: number; y: number } {
  const offset = (count % 8) * 28
  return { x: 40 + offset, y: 40 + offset }
}
