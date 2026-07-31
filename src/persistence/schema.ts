import type { WidgetKind } from '../widgets/types'

/** Bump when the persisted shape changes; add a migration in migrate.ts. */
export const SCHEMA_VERSION = 2

/**
 * Canvas layout: `x`/`y` are world-pixel coordinates on the pannable surface
 * (v2). In v1 these were 12-column grid units; see migrate.ts.
 */
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

/** Canvas pan/zoom. Optional and non-critical: an invalid view is dropped, not
 * rejected, so a bad viewport never blocks loading a valid dashboard. */
export interface CanvasView {
  x: number
  y: number
  zoom: number
}

export interface DashboardDocument {
  schemaVersion: number
  widgets: PersistedWidget[]
  layout: LayoutItem[]
  view?: CanvasView
}

export function emptyDocument(): DashboardDocument {
  return { schemaVersion: SCHEMA_VERSION, widgets: [], layout: [] }
}
