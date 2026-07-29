import type { ComponentType } from 'react'
import type { WidgetKind } from './types'
import { TimerWidget } from './timer/TimerWidget'
import { SymbolsWidget } from './symbols/SymbolsWidget'
import { PhasesWidget } from './phases/PhasesWidget'
import { TextWidget } from './text/TextWidget'

export interface WidgetSize {
  w: number
  h: number
  minW: number
  minH: number
}

export interface WidgetDefinition {
  labelKey: string
  size: WidgetSize
  Component: ComponentType
}

export const WIDGET_REGISTRY: Record<WidgetKind, WidgetDefinition> = {
  timer: {
    labelKey: 'widgets.kinds.timer',
    size: { w: 3, h: 4, minW: 2, minH: 3 },
    Component: TimerWidget,
  },
  symbols: {
    labelKey: 'widgets.kinds.symbols',
    size: { w: 3, h: 6, minW: 2, minH: 4 },
    Component: SymbolsWidget,
  },
  phases: {
    labelKey: 'widgets.kinds.phases',
    size: { w: 4, h: 6, minW: 3, minH: 4 },
    Component: PhasesWidget,
  },
  text: {
    labelKey: 'widgets.kinds.text',
    size: { w: 4, h: 4, minW: 2, minH: 3 },
    Component: TextWidget,
  },
}

export const GRID_COLS = 12
