import { describe, expect, it } from 'vitest'
import { APP_CATEGORIES, appsByCategory, MANIFESTS } from './manifest'
import { WIDGET_STATE } from './state'
import { WIDGET_KINDS } from './types'

describe('app manifests', () => {
  it('has exactly one manifest per widget kind', () => {
    expect(Object.keys(MANIFESTS).sort()).toEqual([...WIDGET_KINDS].sort())
  })

  it('each manifest is self-consistent', () => {
    for (const kind of WIDGET_KINDS) {
      const manifest = MANIFESTS[kind]
      expect(manifest.kind).toBe(kind)
      expect(manifest.labelKey).toBe(`widgets.kinds.${kind}`)
      expect(APP_CATEGORIES).toContain(manifest.category)
      expect(manifest.size.w).toBeGreaterThan(0)
      expect(manifest.size.h).toBeGreaterThan(0)
    }
  })

  it('every kind has a persistence state spec', () => {
    for (const kind of WIDGET_KINDS) {
      expect(WIDGET_STATE[kind]).toBeDefined()
    }
  })

  it('groups cover every kind exactly once', () => {
    const grouped = appsByCategory().flatMap((group) => group.kinds)
    expect(grouped.sort()).toEqual([...WIDGET_KINDS].sort())
  })
})
