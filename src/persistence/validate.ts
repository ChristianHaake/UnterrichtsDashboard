import { WIDGET_KINDS, type WidgetKind } from '../widgets/types'
import { WIDGET_STATE } from '../widgets/state'
import { migrateToCurrent } from './migrate'
import {
  SCHEMA_VERSION,
  type Board,
  type CanvasView,
  type LayoutItem,
  type PersistedWidget,
  type WorkspaceDocument,
} from './schema'

export type ParseResult =
  | { ok: true; doc: WorkspaceDocument }
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

function parseView(input: unknown): CanvasView | undefined {
  if (!isRecord(input)) return undefined
  const { x, y, zoom } = input
  if (
    typeof x === 'number' &&
    Number.isFinite(x) &&
    typeof y === 'number' &&
    Number.isFinite(y) &&
    typeof zoom === 'number' &&
    Number.isFinite(zoom) &&
    zoom > 0
  ) {
    return { x, y, zoom }
  }
  return undefined
}

function parseBoard(input: unknown): Board | { error: string } {
  if (!isRecord(input) || typeof input.id !== 'string' || typeof input.name !== 'string') {
    return { error: 'invalid-board' }
  }
  if (!Array.isArray(input.widgets) || !Array.isArray(input.layout)) {
    return { error: 'malformed-collections' }
  }

  const widgets: PersistedWidget[] = []
  const ids = new Set<string>()
  for (const raw of input.widgets) {
    if (!isRecord(raw) || typeof raw.id !== 'string' || !isWidgetKind(raw.kind)) {
      return { error: 'invalid-widget' }
    }
    if (ids.has(raw.id)) return { error: 'duplicate-widget-id' }
    const state = WIDGET_STATE[raw.kind].parse(raw.state)
    if (state === undefined) return { error: `invalid-widget-state:${raw.kind}` }
    ids.add(raw.id)
    widgets.push({ id: raw.id, kind: raw.kind, state })
  }

  const layout: LayoutItem[] = []
  for (const raw of input.layout) {
    const item = parseLayoutItem(raw, ids)
    if (item === null) return { error: 'invalid-layout-item' }
    layout.push(item)
  }

  const view = parseView(input.view)
  return { id: input.id, name: input.name, widgets, layout, ...(view ? { view } : {}) }
}

/**
 * Validate an untrusted value (imported file or restored storage) into a
 * WorkspaceDocument. Never trusts declared types; migrates older versions
 * first. Returns an actionable error on any structural mismatch.
 */
export function parseWorkspaceDocument(input: unknown): ParseResult {
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

  if (!Array.isArray(source.boards) || source.boards.length === 0) {
    return { ok: false, error: 'no-boards' }
  }

  const boards: Board[] = []
  const boardIds = new Set<string>()
  for (const raw of source.boards) {
    const parsed = parseBoard(raw)
    if ('error' in parsed) return { ok: false, error: parsed.error }
    if (boardIds.has(parsed.id)) return { ok: false, error: 'duplicate-board-id' }
    boardIds.add(parsed.id)
    boards.push(parsed)
  }

  const active =
    typeof source.activeBoardId === 'string' && boardIds.has(source.activeBoardId)
      ? source.activeBoardId
      : boards[0].id

  return { ok: true, doc: { schemaVersion: SCHEMA_VERSION, boards, activeBoardId: active } }
}
