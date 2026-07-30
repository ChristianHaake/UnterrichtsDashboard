import { describe, expect, it } from 'vitest'
import { WIDGET_STATE } from './state'

describe('widget state parsers (untrusted import validation)', () => {
  it('every kind rejects a non-object', () => {
    for (const spec of Object.values(WIDGET_STATE)) {
      expect(spec.parse(null)).toBeUndefined()
      expect(spec.parse(42)).toBeUndefined()
      expect(spec.parse([])).toBeUndefined()
    }
  })

  it('every default state parses back to itself', () => {
    for (const spec of Object.values(WIDGET_STATE)) {
      expect(spec.parse(spec.default)).toEqual(spec.default)
    }
  })

  it('timer rejects negative or non-finite durations', () => {
    expect(WIDGET_STATE.timer.parse({ durationMs: -1 })).toBeUndefined()
    expect(WIDGET_STATE.timer.parse({ durationMs: Infinity })).toBeUndefined()
    expect(WIDGET_STATE.timer.parse({ durationMs: 1000 })).toEqual({ durationMs: 1000 })
  })

  it('symbols rejects unknown social forms', () => {
    expect(WIDGET_STATE.symbols.parse({ active: 'shouting' })).toBeUndefined()
    expect(WIDGET_STATE.symbols.parse({ active: 'group' })).toEqual({ active: 'group' })
  })

  it('scoreboard requires numeric scores', () => {
    expect(WIDGET_STATE.scoreboard.parse({ entries: [{ id: 'a', name: 'A', score: 'x' }] })).toBeUndefined()
    expect(
      WIDGET_STATE.scoreboard.parse({ entries: [{ id: 'a', name: 'A', score: 3 }] }),
    ).toEqual({ entries: [{ id: 'a', name: 'A', score: 3 }] })
  })

  it('hallpass accepts null or a numeric since, rejects other types', () => {
    expect(WIDGET_STATE.hallpass.parse({ students: [{ id: 'a', name: 'A', since: 'now' }] })).toBeUndefined()
    expect(
      WIDGET_STATE.hallpass.parse({ students: [{ id: 'a', name: 'A', since: null }] }),
    ).toEqual({ students: [{ id: 'a', name: 'A', since: null }] })
    expect(
      WIDGET_STATE.hallpass.parse({ students: [{ id: 'a', name: 'A', since: 123 }] }),
    ).toEqual({ students: [{ id: 'a', name: 'A', since: 123 }] })
  })

  it('randomizer requires an array of strings', () => {
    expect(WIDGET_STATE.randomizer.parse({ names: ['a', 2] })).toBeUndefined()
    expect(WIDGET_STATE.randomizer.parse({ names: ['a', 'b'] })).toEqual({ names: ['a', 'b'] })
  })

  it('seating rejects a seat count that does not match rows*cols', () => {
    expect(
      WIDGET_STATE.seating.parse({ rows: 2, cols: 2, names: [], seats: [null, null, null] }),
    ).toBeUndefined()
  })

  it('seating rejects out-of-range dimensions', () => {
    expect(
      WIDGET_STATE.seating.parse({ rows: 0, cols: 2, names: [], seats: [] }),
    ).toBeUndefined()
    expect(
      WIDGET_STATE.seating.parse({ rows: 99, cols: 1, names: [], seats: new Array(99).fill(null) }),
    ).toBeUndefined()
  })

  it('morningboard accepts null location/weather and rejects malformed ones', () => {
    expect(WIDGET_STATE.morningboard.parse({ location: null, word: '', weather: null })).toEqual({
      location: null,
      word: '',
      weather: null,
    })
    // Non-numeric coordinate is rejected.
    expect(
      WIDGET_STATE.morningboard.parse({ location: { name: 'X', lat: 'a', lon: 1 }, word: '', weather: null }),
    ).toBeUndefined()
    // Missing word is rejected.
    expect(WIDGET_STATE.morningboard.parse({ location: null, weather: null })).toBeUndefined()
  })

  it('morningboard accepts a full valid snapshot', () => {
    const doc = {
      location: { name: 'Hannover', lat: 52.37, lon: 9.73 },
      word: 'Photosynthese',
      weather: { tempC: 14.2, code: 3, fetchedAt: 1000 },
    }
    expect(WIDGET_STATE.morningboard.parse(doc)).toEqual(doc)
  })

  it('seating drops seat assignments referencing unknown name ids', () => {
    const result = WIDGET_STATE.seating.parse({
      rows: 1,
      cols: 2,
      names: [{ id: 'n1', name: 'Ada' }],
      seats: ['n1', 'ghost'],
    })
    expect(result).toEqual({
      rows: 1,
      cols: 2,
      names: [{ id: 'n1', name: 'Ada' }],
      seats: ['n1', null],
    })
  })
})
