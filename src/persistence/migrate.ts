import { SCHEMA_VERSION } from './schema'

// v1 stored layout in 12-column grid units (colWidth≈80, rowHeight=40, gap=16).
// v2 stores world pixels on the canvas. These constants convert a grid cell to
// pixels so an existing dashboard keeps a comparable arrangement.
const STEP_X = 96
const STEP_Y = 56
const GAP = 16

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function gridItemToPixels(item: unknown): unknown {
  if (!isRecord(item)) return item
  const { i, x, y, w, h } = item
  if (
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof w !== 'number' ||
    typeof h !== 'number'
  ) {
    return item
  }
  return {
    i,
    x: x * STEP_X,
    y: y * STEP_Y,
    w: Math.max(120, w * STEP_X - GAP),
    h: Math.max(100, h * STEP_Y - GAP),
  }
}

/**
 * Upgrade an older raw document to the current schema version, or return null
 * if no migration path exists. Validation happens afterwards, so this only
 * needs to reshape data, not guarantee correctness.
 */
export function migrateToCurrent(input: Record<string, unknown>, fromVersion: number): unknown | null {
  let doc: Record<string, unknown> = input
  let version = fromVersion

  if (version === 1) {
    const layout = Array.isArray(doc.layout) ? doc.layout.map(gridItemToPixels) : doc.layout
    doc = { ...doc, layout, schemaVersion: 2 }
    version = 2
  }

  return version === SCHEMA_VERSION ? doc : null
}
