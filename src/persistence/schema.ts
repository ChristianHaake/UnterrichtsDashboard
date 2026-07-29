import type { WidgetKind } from '../widgets/types'

/** Bump when the persisted shape changes; add a migration in migrate.ts. */
export const SCHEMA_VERSION = 1

export interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
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
