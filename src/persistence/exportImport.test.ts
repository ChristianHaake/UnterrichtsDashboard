import { describe, expect, it } from 'vitest'
import {
  buildExportFilename,
  deserializeDocument,
  sanitizeFilename,
  serializeDocument,
} from './exportImport'
import { emptyWorkspace, SCHEMA_VERSION } from './schema'

describe('serialize / deserialize round-trip', () => {
  it('round-trips a valid workspace', () => {
    const doc = emptyWorkspace()
    const result = deserializeDocument(serializeDocument(doc))
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.doc.schemaVersion).toBe(SCHEMA_VERSION)
      expect(result.doc.boards).toHaveLength(1)
      expect(result.doc.activeBoardId).toBe(result.doc.boards[0].id)
    }
  })

  it('reports invalid JSON without throwing', () => {
    expect(deserializeDocument('{ not json')).toMatchObject({ ok: false, error: 'invalid-json' })
  })

  it('reports schema errors from parsed-but-invalid JSON', () => {
    expect(deserializeDocument('{"schemaVersion":999,"widgets":[],"layout":[]}')).toMatchObject({
      ok: false,
      error: 'future-version',
    })
  })
})

describe('sanitizeFilename', () => {
  it('strips unsafe characters and normalizes', () => {
    expect(sanitizeFilename('Klasse 5b / Montag!')).toBe('klasse-5b-montag')
  })
  it('falls back when nothing usable remains', () => {
    expect(sanitizeFilename('***')).toBe('dashboard')
  })
})

describe('buildExportFilename', () => {
  it('formats a dated json filename', () => {
    expect(buildExportFilename(new Date(2026, 6, 29))).toBe('dashboard-2026-07-29.json')
  })
})
