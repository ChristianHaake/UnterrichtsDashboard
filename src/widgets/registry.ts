import type { WidgetKind } from './types'

export interface WidgetSize {
  w: number
  h: number
  minW: number
  minH: number
}

export interface WidgetDefinition {
  labelKey: string
  size: WidgetSize
}

export const WIDGET_REGISTRY: Record<WidgetKind, WidgetDefinition> = {
  timer: { labelKey: 'widgets.kinds.timer', size: { w: 3, h: 4, minW: 2, minH: 3 } },
  symbols: { labelKey: 'widgets.kinds.symbols', size: { w: 3, h: 6, minW: 2, minH: 4 } },
  phases: { labelKey: 'widgets.kinds.phases', size: { w: 4, h: 6, minW: 3, minH: 4 } },
  text: { labelKey: 'widgets.kinds.text', size: { w: 4, h: 4, minW: 2, minH: 3 } },
  qr: { labelKey: 'widgets.kinds.qr', size: { w: 3, h: 6, minW: 2, minH: 5 } },
  randomizer: { labelKey: 'widgets.kinds.randomizer', size: { w: 4, h: 7, minW: 3, minH: 5 } },
  scoreboard: { labelKey: 'widgets.kinds.scoreboard', size: { w: 4, h: 6, minW: 3, minH: 4 } },
  hallpass: { labelKey: 'widgets.kinds.hallpass', size: { w: 4, h: 6, minW: 3, minH: 4 } },
  seating: { labelKey: 'widgets.kinds.seating', size: { w: 6, h: 8, minW: 4, minH: 5 } },
  morningboard: { labelKey: 'widgets.kinds.morningboard', size: { w: 4, h: 6, minW: 3, minH: 4 } },
  stickynotes: { labelKey: 'widgets.kinds.stickynotes', size: { w: 4, h: 6, minW: 3, minH: 4 } },
  whiteboard: { labelKey: 'widgets.kinds.whiteboard', size: { w: 6, h: 7, minW: 4, minH: 5 } },
}

export const GRID_COLS = 12
