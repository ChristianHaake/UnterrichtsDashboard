import type { WidgetKind } from '../widgets/types'

/** Bump when the persisted shape changes; add a migration in migrate.ts.
 * v1: 12-column grid layout. v2: canvas world-pixel layout, single board.
 * v3: workspace of multiple boards. */
export const SCHEMA_VERSION = 3

/** Canvas world-pixel coordinates. */
export interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
}

export interface PersistedWidget {
  id: string
  kind: WidgetKind
  state: unknown
}

/** Canvas pan/zoom. Optional and non-critical: an invalid view is dropped. */
export interface CanvasView {
  x: number
  y: number
  zoom: number
}

/** One named board (its own widgets, canvas layout, and viewport). */
export interface Board {
  id: string
  name: string
  widgets: PersistedWidget[]
  layout: LayoutItem[]
  view?: CanvasView
}

export interface WorkspaceDocument {
  schemaVersion: number
  boards: Board[]
  activeBoardId: string
}

export function emptyBoard(id: string, name: string): Board {
  return { id, name, widgets: [], layout: [] }
}

export function emptyWorkspace(): WorkspaceDocument {
  const board = emptyBoard('b-0', 'Board 1')
  return { schemaVersion: SCHEMA_VERSION, boards: [board], activeBoardId: board.id }
}
