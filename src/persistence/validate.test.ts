import { describe, expect, it } from 'vitest'
import { parseDashboardDocument } from './validate'
import { SCHEMA_VERSION } from './schema'

function validDoc() {
  return {
    schemaVersion: SCHEMA_VERSION,
    widgets: [
      { id: 'w-0', kind: 'timer', state: { durationMs: 60000 } },
      { id: 'w-1', kind: 'phases', state: { phases: [{ id: 'p0', name: 'Einstieg' }], activeId: 'p0' } },
    ],
    layout: [
      { i: 'w-0', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
      { i: 'w-1', x: 3, y: 0, w: 4, h: 6 },
    ],
  }
}

describe('parseDashboardDocument', () => {
  it('accepts a valid document', () => {
    const result = parseDashboardDocument(validDoc())
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.doc.widgets).toHaveLength(2)
      expect(result.doc.layout).toHaveLength(2)
    }
  })

  it('rejects non-objects', () => {
    expect(parseDashboardDocument(null).ok).toBe(false)
    expect(parseDashboardDocument('nope').ok).toBe(false)
    expect(parseDashboardDocument([]).ok).toBe(false)
  })

  it('rejects a missing or non-integer schema version', () => {
    const doc = validDoc() as Record<string, unknown>
    delete doc.schemaVersion
    expect(parseDashboardDocument(doc)).toMatchObject({ ok: false, error: 'missing-schema-version' })
  })

  it('migrates a v1 (grid-unit) document to v2 pixel coordinates', () => {
    const v1 = {
      schemaVersion: 1,
      widgets: [{ id: 'w-0', kind: 'timer', state: { durationMs: 60000 } }],
      layout: [{ i: 'w-0', x: 1, y: 2, w: 3, h: 4, minW: 2, minH: 3 }],
    }
    const result = parseDashboardDocument(v1)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.doc.schemaVersion).toBe(SCHEMA_VERSION)
      const item = result.doc.layout[0]
      expect(item).toEqual({ i: 'w-0', x: 96, y: 112, w: 272, h: 208 })
    }
  })

  it('rejects a future schema version cleanly', () => {
    expect(parseDashboardDocument({ ...validDoc(), schemaVersion: SCHEMA_VERSION + 1 })).toMatchObject({
      ok: false,
      error: 'future-version',
    })
  })

  it('rejects malformed collections', () => {
    expect(parseDashboardDocument({ ...validDoc(), widgets: {} })).toMatchObject({
      ok: false,
      error: 'malformed-collections',
    })
  })

  it('rejects an unknown widget kind', () => {
    const doc = validDoc()
    doc.widgets[0].kind = 'bogus'
    expect(parseDashboardDocument(doc)).toMatchObject({ ok: false, error: 'invalid-widget' })
  })

  it('rejects invalid widget state without trusting declared types', () => {
    const doc = validDoc()
    // A negative duration must be rejected by the timer state parser.
    doc.widgets[0].state = { durationMs: -1 }
    expect(parseDashboardDocument(doc)).toMatchObject({
      ok: false,
      error: 'invalid-widget-state:timer',
    })
  })

  it('rejects duplicate widget ids', () => {
    const doc = validDoc()
    doc.widgets[1].id = 'w-0'
    doc.layout[1].i = 'w-0'
    expect(parseDashboardDocument(doc)).toMatchObject({ ok: false, error: 'duplicate-widget-id' })
  })

  it('rejects a layout item referencing an unknown widget id', () => {
    const doc = validDoc()
    doc.layout[0].i = 'ghost'
    expect(parseDashboardDocument(doc)).toMatchObject({ ok: false, error: 'invalid-layout-item' })
  })

  it('rejects a layout item with a non-numeric coordinate', () => {
    const doc = validDoc() as unknown as { layout: Record<string, unknown>[] }
    doc.layout[0].x = 'left'
    expect(parseDashboardDocument(doc)).toMatchObject({ ok: false, error: 'invalid-layout-item' })
  })

  it('drops an activeId that does not match any phase', () => {
    const doc = validDoc()
    doc.widgets[1].state = { phases: [{ id: 'p0', name: 'X' }], activeId: 'missing' }
    const result = parseDashboardDocument(doc)
    expect(result.ok).toBe(true)
    if (result.ok) {
      const phases = result.doc.widgets[1].state as { activeId: string | null }
      expect(phases.activeId).toBeNull()
    }
  })
})
