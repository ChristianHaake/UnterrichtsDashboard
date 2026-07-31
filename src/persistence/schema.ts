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

export interface DashboardDocument {
  schemaVersion: number
  widgets: PersistedWidget[]
  layout: LayoutItem[]
}

export function emptyDocument(): DashboardDocument {
  return { schemaVersion: SCHEMA_VERSION, widgets: [], layout: [] }
}
