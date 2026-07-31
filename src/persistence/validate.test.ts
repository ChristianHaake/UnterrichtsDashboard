import { describe, expect, it } from 'vitest'
import { parseWorkspaceDocument } from './validate'
import { SCHEMA_VERSION } from './schema'

function validBoard() {
  return {
    id: 'b-0',
    name: 'Tafel 1',
    widgets: [
      { id: 'w-0', kind: 'timer', state: { durationMs: 60000 } },
      { id: 'w-1', kind: 'phases', state: { phases: [{ id: 'p0', name: 'Einstieg' }], activeId: 'p0' } },
    ],
    layout: [
      { i: 'w-0', x: 0, y: 0, w: 260, h: 240 },
      { i: 'w-1', x: 300, y: 0, w: 320, h: 340 },
    ],
  }
}

function validWorkspace() {
  return { schemaVersion: SCHEMA_VERSION, boards: [validBoard()], activeBoardId: 'b-0' }
}

describe('parseWorkspaceDocument', () => {
  it('accepts a valid workspace', () => {
    const result = parseWorkspaceDocument(validWorkspace())
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.doc.boards).toHaveLength(1)
      expect(result.doc.boards[0].widgets).toHaveLength(2)
      expect(result.doc.activeBoardId).toBe('b-0')
    }
  })

  it('accepts an optional board view and drops a malformed one', () => {
    const good = validWorkspace()
    good.boards[0] = { ...good.boards[0], view: { x: 10, y: -20, zoom: 1.5 } } as never
    const r1 = parseWorkspaceDocument(good)
    expect(r1.ok && r1.doc.boards[0].view).toEqual({ x: 10, y: -20, zoom: 1.5 })

    const bad = validWorkspace()
    bad.boards[0] = { ...bad.boards[0], view: { x: 'a', y: 0, zoom: 1 } } as never
    const r2 = parseWorkspaceDocument(bad)
    expect(r2.ok).toBe(true)
    if (r2.ok) expect(r2.doc.boards[0].view).toBeUndefined()
  })

  it('rejects non-objects and missing schema version', () => {
    expect(parseWorkspaceDocument(null).ok).toBe(false)
    const doc = validWorkspace() as Record<string, unknown>
    delete doc.schemaVersion
    expect(parseWorkspaceDocument(doc)).toMatchObject({ ok: false, error: 'missing-schema-version' })
  })

  it('rejects a future schema version', () => {
    expect(parseWorkspaceDocument({ ...validWorkspace(), schemaVersion: SCHEMA_VERSION + 1 })).toMatchObject({
      ok: false,
      error: 'future-version',
    })
  })

  it('rejects an empty board list', () => {
    expect(parseWorkspaceDocument({ ...validWorkspace(), boards: [] })).toMatchObject({
      ok: false,
      error: 'no-boards',
    })
  })

  it('rejects a board missing its name', () => {
    const doc = validWorkspace()
    delete (doc.boards[0] as Record<string, unknown>).name
    expect(parseWorkspaceDocument(doc)).toMatchObject({ ok: false, error: 'invalid-board' })
  })

  it('rejects unknown widget kinds and invalid widget state', () => {
    const badKind = validWorkspace()
    badKind.boards[0].widgets[0].kind = 'bogus'
    expect(parseWorkspaceDocument(badKind)).toMatchObject({ ok: false, error: 'invalid-widget' })

    const badState = validWorkspace()
    badState.boards[0].widgets[0].state = { durationMs: -1 }
    expect(parseWorkspaceDocument(badState)).toMatchObject({
      ok: false,
      error: 'invalid-widget-state:timer',
    })
  })

  it('rejects duplicate board ids', () => {
    const doc = validWorkspace()
    doc.boards = [validBoard(), validBoard()]
    expect(parseWorkspaceDocument(doc)).toMatchObject({ ok: false, error: 'duplicate-board-id' })
  })

  it('rejects a layout item referencing an unknown widget id', () => {
    const doc = validWorkspace()
    doc.boards[0].layout[0].i = 'ghost'
    expect(parseWorkspaceDocument(doc)).toMatchObject({ ok: false, error: 'invalid-layout-item' })
  })

  it('defaults an invalid activeBoardId to the first board', () => {
    const result = parseWorkspaceDocument({ ...validWorkspace(), activeBoardId: 'nope' })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.doc.activeBoardId).toBe('b-0')
  })

  it('migrates a v1 (grid-unit) document to a v3 pixel workspace', () => {
    const v1 = {
      schemaVersion: 1,
      widgets: [{ id: 'w-0', kind: 'timer', state: { durationMs: 60000 } }],
      layout: [{ i: 'w-0', x: 1, y: 2, w: 3, h: 4 }],
    }
    const result = parseWorkspaceDocument(v1)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.doc.schemaVersion).toBe(SCHEMA_VERSION)
      expect(result.doc.boards).toHaveLength(1)
      expect(result.doc.boards[0].layout[0]).toEqual({ i: 'w-0', x: 96, y: 112, w: 272, h: 208 })
    }
  })

  it('migrates a v2 (single-board) document to a v3 workspace', () => {
    const v2 = {
      schemaVersion: 2,
      widgets: [{ id: 'w-0', kind: 'text', state: { value: 'hi' } }],
      layout: [{ i: 'w-0', x: 40, y: 40, w: 320, h: 220 }],
      view: { x: 5, y: 5, zoom: 1.2 },
    }
    const result = parseWorkspaceDocument(v2)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.doc.boards).toHaveLength(1)
      expect(result.doc.boards[0].widgets[0]).toMatchObject({ kind: 'text' })
      expect(result.doc.boards[0].view).toEqual({ x: 5, y: 5, zoom: 1.2 })
      expect(result.doc.activeBoardId).toBe('b-0')
    }
  })
})
