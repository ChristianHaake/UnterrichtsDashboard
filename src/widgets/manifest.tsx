import { lazy, type ComponentType, type ReactNode } from 'react'
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
  icon: ReactNode
  size: { w: number; h: number }
  Lazy: WidgetComponent
}

function svg(children: ReactNode): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function app(
  kind: WidgetKind,
  category: AppCategory,
  icon: ReactNode,
  size: { w: number; h: number },
  loader: () => Promise<{ default: WidgetComponent }>,
): AppManifest {
  return { kind, labelKey: `widgets.kinds.${kind}`, category, icon, size, Lazy: lazy(loader) }
}

const dot = (cx: number, cy: number) => <circle cx={cx} cy={cy} r={1.2} fill="currentColor" stroke="none" />

// One entry per app. Adding an app = add its parser to WIDGET_STATE, its kind to
// WIDGET_KINDS, and one line here. The component loads on demand (own chunk).
export const MANIFESTS: Record<WidgetKind, AppManifest> = {
  timer: app(
    'timer',
    'time',
    svg(
      <>
        <circle cx={12} cy={13} r={7} />
        <path d="M12 13V9.5" />
        <path d="M9.5 3h5" />
      </>,
    ),
    { w: 260, h: 240 },
    () => import('./timer/TimerWidget').then((m) => ({ default: m.TimerWidget as unknown as WidgetComponent })),
  ),
  symbols: app(
    'symbols',
    'classroom',
    svg(
      <>
        <circle cx={12} cy={8} r={3.2} />
        <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </>,
    ),
    { w: 260, h: 320 },
    () => import('./symbols/SymbolsWidget').then((m) => ({ default: m.SymbolsWidget as unknown as WidgetComponent })),
  ),
  phases: app(
    'phases',
    'classroom',
    svg(
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h10" />
      </>,
    ),
    { w: 320, h: 340 },
    () => import('./phases/PhasesWidget').then((m) => ({ default: m.PhasesWidget as unknown as WidgetComponent })),
  ),
  randomizer: app(
    'randomizer',
    'classroom',
    svg(
      <>
        <rect x={4} y={4} width={16} height={16} rx={3} />
        {dot(9, 9)}
        {dot(12, 12)}
        {dot(15, 15)}
      </>,
    ),
    { w: 340, h: 380 },
    () =>
      import('./randomizer/RandomizerWidget').then((m) => ({
        default: m.RandomizerWidget as unknown as WidgetComponent,
      })),
  ),
  scoreboard: app(
    'scoreboard',
    'classroom',
    svg(
      <>
        <path d="M4 20h16" />
        <path d="M7 20v-6" />
        <path d="M12 20V5" />
        <path d="M17 20v-9" />
      </>,
    ),
    { w: 340, h: 340 },
    () =>
      import('./scoreboard/ScoreboardWidget').then((m) => ({
        default: m.ScoreboardWidget as unknown as WidgetComponent,
      })),
  ),
  hallpass: app(
    'hallpass',
    'classroom',
    svg(
      <>
        <rect x={6} y={3} width={12} height={18} rx={1} />
        {dot(14.5, 12)}
      </>,
    ),
    { w: 340, h: 340 },
    () => import('./hallpass/HallPassWidget').then((m) => ({ default: m.HallPassWidget as unknown as WidgetComponent })),
  ),
  seating: app(
    'seating',
    'classroom',
    svg(
      <>
        <rect x={4} y={4} width={7} height={7} rx={1} />
        <rect x={13} y={4} width={7} height={7} rx={1} />
        <rect x={4} y={13} width={7} height={7} rx={1} />
        <rect x={13} y={13} width={7} height={7} rx={1} />
      </>,
    ),
    { w: 480, h: 440 },
    () => import('./seating/SeatingWidget').then((m) => ({ default: m.SeatingWidget as unknown as WidgetComponent })),
  ),
  morningboard: app(
    'morningboard',
    'classroom',
    svg(
      <>
        <circle cx={12} cy={12} r={4} />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M6 6l1.4 1.4M16.6 16.6L18 18M18 6l-1.4 1.4M7.4 16.6L6 18" />
      </>,
    ),
    { w: 340, h: 340 },
    () =>
      import('./morningboard/MorningBoardWidget').then((m) => ({
        default: m.MorningBoardWidget as unknown as WidgetComponent,
      })),
  ),
  text: app(
    'text',
    'creative',
    svg(
      <>
        <path d="M5 5h14" />
        <path d="M5 9h14" />
        <path d="M5 13h14" />
        <path d="M5 17h8" />
      </>,
    ),
    { w: 320, h: 220 },
    () => import('./text/TextWidget').then((m) => ({ default: m.TextWidget as unknown as WidgetComponent })),
  ),
  qr: app(
    'qr',
    'creative',
    svg(
      <>
        <rect x={4} y={4} width={6} height={6} rx={1} />
        <rect x={14} y={4} width={6} height={6} rx={1} />
        <rect x={4} y={14} width={6} height={6} rx={1} />
        <path d="M14 14h3v3M20 14v6M14 20h3" />
      </>,
    ),
    { w: 260, h: 340 },
    () => import('./qr/QrWidget').then((m) => ({ default: m.QrWidget as unknown as WidgetComponent })),
  ),
  stickynotes: app(
    'stickynotes',
    'creative',
    svg(
      <>
        <path d="M5 4h14v11l-5 5H5z" />
        <path d="M19 15h-5v5" />
      </>,
    ),
    { w: 360, h: 340 },
    () =>
      import('./stickynotes/StickyNotesWidget').then((m) => ({
        default: m.StickyNotesWidget as unknown as WidgetComponent,
      })),
  ),
  whiteboard: app(
    'whiteboard',
    'creative',
    svg(
      <>
        <path d="M4 20l1-4L16 5l3 3L8 19z" />
        <path d="M14 7l3 3" />
      </>,
    ),
    { w: 480, h: 380 },
    () =>
      import('./whiteboard/WhiteboardWidget').then((m) => ({
        default: m.WhiteboardWidget as unknown as WidgetComponent,
      })),
  ),
  mathtools: app(
    'mathtools',
    'math',
    svg(
      <>
        <path d="M4 20V5l15 15z" />
        <path d="M4 14h4M4 10h6" />
      </>,
    ),
    { w: 360, h: 380 },
    () =>
      import('./mathtools/MathToolsWidget').then((m) => ({
        default: m.MathToolsWidget as unknown as WidgetComponent,
      })),
  ),
  noisemeter: app(
    'noisemeter',
    'classroom',
    svg(
      <>
        <path d="M4 9v6h4l5 4V5L8 9z" />
        <path d="M16.5 8.5c1.6 1.6 1.6 5.4 0 7" />
      </>,
    ),
    { w: 300, h: 300 },
    () =>
      import('./noisemeter/NoiseMeterWidget').then((m) => ({
        default: m.NoiseMeterWidget as unknown as WidgetComponent,
      })),
  ),
}

/** App kinds grouped by category, preserving category order. */
export function appsByCategory(): { category: AppCategory; kinds: WidgetKind[] }[] {
  return APP_CATEGORIES.map((category) => ({
    category,
    kinds: (Object.keys(MANIFESTS) as WidgetKind[]).filter((k) => MANIFESTS[k].category === category),
  })).filter((group) => group.kinds.length > 0)
}
