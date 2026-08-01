export type WidgetKind =
  | 'timer'
  | 'symbols'
  | 'phases'
  | 'text'
  | 'qr'
  | 'randomizer'
  | 'scoreboard'
  | 'hallpass'
  | 'seating'
  | 'morningboard'
  | 'stickynotes'
  | 'whiteboard'
  | 'mathtools'
  | 'noisemeter'

export const WIDGET_KINDS: readonly WidgetKind[] = [
  'timer',
  'symbols',
  'phases',
  'text',
  'qr',
  'randomizer',
  'scoreboard',
  'hallpass',
  'seating',
  'morningboard',
  'stickynotes',
  'whiteboard',
  'mathtools',
  'noisemeter',
]

export interface WidgetInstance {
  id: string
  kind: WidgetKind
}

/** Direction for the keyboard-based move alternative to drag-and-drop. */
export type MoveDirection = 'up' | 'down' | 'left' | 'right'
