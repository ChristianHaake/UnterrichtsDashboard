import { WIDGET_KINDS, type WidgetKind } from '../widgets/types'
import { WIDGET_STATE } from '../widgets/state'
import { migrateToCurrent } from './migrate'
import { SCHEMA_VERSION, type DashboardDocument, type LayoutItem, type PersistedWidget } from './schema'

export type ParseResult =
  | { ok: true; doc: DashboardDocument }
  | { ok: false; error: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isWidgetKind(value: unknown): value is WidgetKind {
  return typeof value === 'string' && (WIDGET_KINDS as readonly string[]).includes(value)
}

function parseLayoutItem(input: unknown, ids: Set<string>): LayoutItem | null {
  if (!isRecord(input)) return null
  const { i, x, y, w, h } = input
  if (typeof i !== 'string' || !ids.has(i)) return null
  for (const value of [x, y, w, h]) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return null
  }
  return { i, x: x as number, y: y as number, w: w as number, h: h as number }
}

/**
 * Validate an untrusted value (parsed JSON from an imported file or restored
 * from storage) into a DashboardDocument. Never trusts the input's declared
 * types. Returns an actionable error on any mismatch; on success the returned
 * document is safe to replace application state with.
 */
export function parseDashboardDocument(input: unknown): ParseResult {
  if (!isRecord(input)) {
    return { ok: false, error: 'not-an-object' }
  }

  const { schemaVersion } = input
  if (typeof schemaVersion !== 'number' || !Number.isInteger(schemaVersion)) {
    return { ok: false, error: 'missing-schema-version' }
  }
  if (schemaVersion > SCHEMA_VERSION) {
    return { ok: false, error: 'future-version' }
  }

  let source: Record<string, unknown> = input
  if (schemaVersion < SCHEMA_VERSION) {
    const migrated = migrateToCurrent(input, schemaVersion)
    if (!isRecord(migrated)) {
      return { ok: false, error: 'unsupported-version' }
    }
    source = migrated
  }

  if (!Array.isArray(source.widgets) || !Array.isArray(source.layout)) {
    return { ok: false, error: 'malformed-collections' }
  }

  const widgets: PersistedWidget[] = []
  const ids = new Set<string>()
  for (const raw of source.widgets) {
    if (!isRecord(raw) || typeof raw.id !== 'string' || !isWidgetKind(raw.kind)) {
      return { ok: false, error: 'invalid-widget' }
    }
    if (ids.has(raw.id)) {
      return { ok: false, error: 'duplicate-widget-id' }
    }
    const state = WIDGET_STATE[raw.kind].parse(raw.state)
    if (state === undefined) {
      return { ok: false, error: `invalid-widget-state:${raw.kind}` }
    }
    ids.add(raw.id)
    widgets.push({ id: raw.id, kind: raw.kind, state })
  }

  const layout: LayoutItem[] = []
  for (const raw of source.layout) {
    const item = parseLayoutItem(raw, ids)
    if (item === null) {
      return { ok: false, error: 'invalid-layout-item' }
    }
    layout.push(item)
  }

  return { ok: true, doc: { schemaVersion: SCHEMA_VERSION, widgets, layout } }
}
