import { lazy, type ComponentType } from 'react'
import type { WidgetKind } from './types'

export type AppCategory = 'time' | 'classroom' | 'creative' | 'math'
export const APP_CATEGORIES: readonly AppCategory[] = ['time', 'classroom', 'creative', 'math']

/** Uniform props every app component receives. State is narrowed per kind at
 * the persistence boundary (WIDGET_STATE parser + default), so the cast below
 * is safe — the same contract the manifest guarantees. */
export type WidgetComponent = ComponentType<{ state: unknown; onChange: (next: unknown) => void }>

export interface AppManifest {
  kind: WidgetKind
  labelKey: string
  category: AppCategory
  size: { w: number; h: number }
  Lazy: WidgetComponent
}

function app(
  kind: WidgetKind,
  category: AppCategory,
  size: { w: number; h: number },
  loader: () => Promise<{ default: WidgetComponent }>,
): AppManifest {
  return {
    kind,
    labelKey: `widgets.kinds.${kind}`,
    category,
    size,
    Lazy: lazy(loader),
  }
}

// One entry per app. Adding an app = add its parser to WIDGET_STATE, its kind to
// WIDGET_KINDS, and one line here. The component loads on demand (own chunk).
export const MANIFESTS: Record<WidgetKind, AppManifest> = {
  timer: app('timer', 'time', { w: 260, h: 240 }, () =>
    import('./timer/TimerWidget').then((m) => ({ default: m.TimerWidget as unknown as WidgetComponent })),
  ),
  symbols: app('symbols', 'classroom', { w: 260, h: 320 }, () =>
    import('./symbols/SymbolsWidget').then((m) => ({ default: m.SymbolsWidget as unknown as WidgetComponent })),
  ),
  phases: app('phases', 'classroom', { w: 320, h: 340 }, () =>
    import('./phases/PhasesWidget').then((m) => ({ default: m.PhasesWidget as unknown as WidgetComponent })),
  ),
  randomizer: app('randomizer', 'classroom', { w: 340, h: 380 }, () =>
    import('./randomizer/RandomizerWidget').then((m) => ({ default: m.RandomizerWidget as unknown as WidgetComponent })),
  ),
  scoreboard: app('scoreboard', 'classroom', { w: 340, h: 340 }, () =>
    import('./scoreboard/ScoreboardWidget').then((m) => ({ default: m.ScoreboardWidget as unknown as WidgetComponent })),
  ),
  hallpass: app('hallpass', 'classroom', { w: 340, h: 340 }, () =>
    import('./hallpass/HallPassWidget').then((m) => ({ default: m.HallPassWidget as unknown as WidgetComponent })),
  ),
  seating: app('seating', 'classroom', { w: 480, h: 440 }, () =>
    import('./seating/SeatingWidget').then((m) => ({ default: m.SeatingWidget as unknown as WidgetComponent })),
  ),
  morningboard: app('morningboard', 'classroom', { w: 340, h: 340 }, () =>
    import('./morningboard/MorningBoardWidget').then((m) => ({ default: m.MorningBoardWidget as unknown as WidgetComponent })),
  ),
  text: app('text', 'creative', { w: 320, h: 220 }, () =>
    import('./text/TextWidget').then((m) => ({ default: m.TextWidget as unknown as WidgetComponent })),
  ),
  qr: app('qr', 'creative', { w: 260, h: 340 }, () =>
    import('./qr/QrWidget').then((m) => ({ default: m.QrWidget as unknown as WidgetComponent })),
  ),
  stickynotes: app('stickynotes', 'creative', { w: 360, h: 340 }, () =>
    import('./stickynotes/StickyNotesWidget').then((m) => ({ default: m.StickyNotesWidget as unknown as WidgetComponent })),
  ),
  whiteboard: app('whiteboard', 'creative', { w: 480, h: 380 }, () =>
    import('./whiteboard/WhiteboardWidget').then((m) => ({ default: m.WhiteboardWidget as unknown as WidgetComponent })),
  ),
  mathtools: app('mathtools', 'math', { w: 360, h: 380 }, () =>
    import('./mathtools/MathToolsWidget').then((m) => ({ default: m.MathToolsWidget as unknown as WidgetComponent })),
  ),
}

/** App kinds grouped by category, preserving category order. */
export function appsByCategory(): { category: AppCategory; kinds: WidgetKind[] }[] {
  return APP_CATEGORIES.map((category) => ({
    category,
    kinds: (Object.keys(MANIFESTS) as WidgetKind[]).filter((k) => MANIFESTS[k].category === category),
  })).filter((group) => group.kinds.length > 0)
}
