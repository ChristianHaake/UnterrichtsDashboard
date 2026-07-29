import type { Layout } from 'react-grid-layout'
import type { MoveDirection } from '../widgets/types'

/** Lowest free row below all current items. */
export function bottomY(layout: Layout[]): number {
  return layout.reduce((max, item) => Math.max(max, item.y + item.h), 0)
}

/**
 * Move a single item one grid cell in a direction, clamped to the grid.
 * This is the keyboard alternative to pointer drag-and-drop; it never mutates
 * the input array.
 */
export function moveItem(
  layout: Layout[],
  id: string,
  direction: MoveDirection,
  cols: number,
): Layout[] {
  return layout.map((item) => {
    if (item.i !== id) return item
    let { x, y } = item
    switch (direction) {
      case 'left':
        x = Math.max(0, x - 1)
        break
      case 'right':
        x = Math.min(cols - item.w, x + 1)
        break
      case 'up':
        y = Math.max(0, y - 1)
        break
      case 'down':
        y = y + 1
        break
    }
    return { ...item, x, y }
  })
}
