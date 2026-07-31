import type { WidgetKind } from './types'
import { MAX_DIM, MIN_DIM } from '../domain/seating'
import { clampRange, MATH_INSTRUMENTS, type MathInstrument } from '../domain/mathtools'

export type SocialForm = 'silent' | 'whisper' | 'partner' | 'group'
const SOCIAL_FORMS: readonly SocialForm[] = ['silent', 'whisper', 'partner', 'group']

export interface TimerPersist {
  durationMs: number
}
export interface TextPersist {
  value: string
}
export interface SymbolsPersist {
  active: SocialForm
}
export interface PhaseEntry {
  id: string
  name: string
}
export interface PhasesPersist {
  phases: PhaseEntry[]
  activeId: string | null
}
export interface QrPersist {
  value: string
}
export interface RandomizerPersist {
  names: string[]
}
export interface ScoreEntry {
  id: string
  name: string
  score: number
}
export interface ScoreboardPersist {
  entries: ScoreEntry[]
}
export interface HallPassStudent {
  id: string
  name: string
  /** Epoch milliseconds since the student left, or null when present. */
  since: number | null
}
export interface HallPassPersist {
  students: HallPassStudent[]
}
export interface SeatName {
  id: string
  name: string
}
export interface SeatingPersist {
  rows: number
  cols: number
  names: SeatName[]
  /** Row-major seat assignments; each cell is a name id or null. */
  seats: (string | null)[]
}
export interface GeoLocation {
  name: string
  lat: number
  lon: number
}
export interface WeatherSnapshot {
  tempC: number
  code: number
  fetchedAt: number
}
export interface MorningBoardPersist {
  location: GeoLocation | null
  word: string
  weather: WeatherSnapshot | null
}
export type StickyColor = 'yellow' | 'green' | 'blue' | 'pink'
export const STICKY_COLORS: readonly StickyColor[] = ['yellow', 'green', 'blue', 'pink']
export interface StickyNote {
  id: string
  text: string
  color: StickyColor
}
export interface StickyNotesPersist {
  notes: StickyNote[]
}
export interface WhiteboardStroke {
  color: string
  width: number
  /** Normalized [x, y] points in the range 0..1 so the drawing scales on resize. */
  points: [number, number][]
}
export interface WhiteboardPersist {
  strokes: WhiteboardStroke[]
}
export interface MathToolsPersist {
  instrument: MathInstrument
  range: number
}

export interface WidgetStateMap {
  timer: TimerPersist
  text: TextPersist
  symbols: SymbolsPersist
  phases: PhasesPersist
  qr: QrPersist
  randomizer: RandomizerPersist
  scoreboard: ScoreboardPersist
  hallpass: HallPassPersist
  seating: SeatingPersist
  morningboard: MorningBoardPersist
  stickynotes: StickyNotesPersist
  whiteboard: WhiteboardPersist
  mathtools: MathToolsPersist
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

interface WidgetStateSpec<S> {
  default: S
  /** Runtime validation of untrusted (imported) state. Returns undefined on any mismatch. */
  parse: (input: unknown) => S | undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const WIDGET_STATE: { [K in WidgetKind]: WidgetStateSpec<WidgetStateMap[K]> } = {
  timer: {
    default: { durationMs: 5 * 60_000 },
    parse(input) {
      if (!isRecord(input)) return undefined
      const { durationMs } = input
      if (typeof durationMs !== 'number' || !Number.isFinite(durationMs) || durationMs < 0) {
        return undefined
      }
      return { durationMs }
    },
  },
  text: {
    default: { value: '' },
    parse(input) {
      if (!isRecord(input)) return undefined
      if (typeof input.value !== 'string') return undefined
      return { value: input.value }
    },
  },
  symbols: {
    default: { active: 'silent' },
    parse(input) {
      if (!isRecord(input)) return undefined
      const active = input.active
      if (typeof active !== 'string' || !SOCIAL_FORMS.includes(active as SocialForm)) {
        return undefined
      }
      return { active: active as SocialForm }
    },
  },
  phases: {
    default: { phases: [], activeId: null },
    parse(input) {
      if (!isRecord(input)) return undefined
      const { phases, activeId } = input
      if (!Array.isArray(phases)) return undefined
      const parsed: PhaseEntry[] = []
      for (const entry of phases) {
        if (!isRecord(entry) || typeof entry.id !== 'string' || typeof entry.name !== 'string') {
          return undefined
        }
        parsed.push({ id: entry.id, name: entry.name })
      }
      if (activeId !== null && typeof activeId !== 'string') return undefined
      const activeExists = activeId === null || parsed.some((p) => p.id === activeId)
      return { phases: parsed, activeId: activeExists ? (activeId as string | null) : null }
    },
  },
  qr: {
    default: { value: '' },
    parse(input) {
      if (!isRecord(input)) return undefined
      if (typeof input.value !== 'string') return undefined
      return { value: input.value }
    },
  },
  randomizer: {
    default: { names: [] },
    parse(input) {
      if (!isRecord(input)) return undefined
      const { names } = input
      if (!Array.isArray(names) || names.some((name) => typeof name !== 'string')) {
        return undefined
      }
      return { names: names as string[] }
    },
  },
  scoreboard: {
    default: { entries: [] },
    parse(input) {
      if (!isRecord(input)) return undefined
      const { entries } = input
      if (!Array.isArray(entries)) return undefined
      const parsed: ScoreEntry[] = []
      for (const entry of entries) {
        if (
          !isRecord(entry) ||
          typeof entry.id !== 'string' ||
          typeof entry.name !== 'string' ||
          typeof entry.score !== 'number' ||
          !Number.isFinite(entry.score)
        ) {
          return undefined
        }
        parsed.push({ id: entry.id, name: entry.name, score: entry.score })
      }
      return { entries: parsed }
    },
  },
  hallpass: {
    default: { students: [] },
    parse(input) {
      if (!isRecord(input)) return undefined
      const { students } = input
      if (!Array.isArray(students)) return undefined
      const parsed: HallPassStudent[] = []
      for (const student of students) {
        if (!isRecord(student) || typeof student.id !== 'string' || typeof student.name !== 'string') {
          return undefined
        }
        const since = student.since
        if (since !== null && (typeof since !== 'number' || !Number.isFinite(since))) {
          return undefined
        }
        parsed.push({ id: student.id, name: student.name, since: since as number | null })
      }
      return { students: parsed }
    },
  },
  seating: {
    default: { rows: 4, cols: 5, names: [], seats: new Array(20).fill(null) },
    parse(input) {
      if (!isRecord(input)) return undefined
      const { rows, cols, names, seats } = input
      if (
        !Number.isInteger(rows) ||
        !Number.isInteger(cols) ||
        (rows as number) < MIN_DIM ||
        (rows as number) > MAX_DIM ||
        (cols as number) < MIN_DIM ||
        (cols as number) > MAX_DIM
      ) {
        return undefined
      }
      if (!Array.isArray(names) || !Array.isArray(seats)) return undefined

      const parsedNames: SeatName[] = []
      const ids = new Set<string>()
      for (const entry of names) {
        if (!isRecord(entry) || typeof entry.id !== 'string' || typeof entry.name !== 'string') {
          return undefined
        }
        if (ids.has(entry.id)) return undefined
        ids.add(entry.id)
        parsedNames.push({ id: entry.id, name: entry.name })
      }

      if (seats.length !== (rows as number) * (cols as number)) return undefined
      const parsedSeats: (string | null)[] = []
      for (const seat of seats) {
        if (seat === null) {
          parsedSeats.push(null)
        } else if (typeof seat === 'string') {
          // Drop assignments referencing an unknown name id.
          parsedSeats.push(ids.has(seat) ? seat : null)
        } else {
          return undefined
        }
      }

      return { rows: rows as number, cols: cols as number, names: parsedNames, seats: parsedSeats }
    },
  },
  morningboard: {
    default: { location: null, word: '', weather: null },
    parse(input) {
      if (!isRecord(input)) return undefined
      const { location, word, weather } = input
      if (typeof word !== 'string') return undefined

      let parsedLocation: MorningBoardPersist['location'] = null
      if (location !== null && location !== undefined) {
        if (
          !isRecord(location) ||
          typeof location.name !== 'string' ||
          !isFiniteNumber(location.lat) ||
          !isFiniteNumber(location.lon)
        ) {
          return undefined
        }
        parsedLocation = { name: location.name, lat: location.lat, lon: location.lon }
      }

      let parsedWeather: MorningBoardPersist['weather'] = null
      if (weather !== null && weather !== undefined) {
        if (
          !isRecord(weather) ||
          !isFiniteNumber(weather.tempC) ||
          !isFiniteNumber(weather.code) ||
          !isFiniteNumber(weather.fetchedAt)
        ) {
          return undefined
        }
        parsedWeather = { tempC: weather.tempC, code: weather.code, fetchedAt: weather.fetchedAt }
      }

      return { location: parsedLocation, word, weather: parsedWeather }
    },
  },
  stickynotes: {
    default: { notes: [] },
    parse(input) {
      if (!isRecord(input)) return undefined
      const { notes } = input
      if (!Array.isArray(notes)) return undefined
      const parsed: StickyNote[] = []
      for (const note of notes) {
        if (
          !isRecord(note) ||
          typeof note.id !== 'string' ||
          typeof note.text !== 'string' ||
          typeof note.color !== 'string' ||
          !STICKY_COLORS.includes(note.color as StickyColor)
        ) {
          return undefined
        }
        parsed.push({ id: note.id, text: note.text, color: note.color as StickyColor })
      }
      return { notes: parsed }
    },
  },
  whiteboard: {
    default: { strokes: [] },
    parse(input) {
      if (!isRecord(input)) return undefined
      const { strokes } = input
      if (!Array.isArray(strokes)) return undefined
      const parsed: WhiteboardStroke[] = []
      for (const stroke of strokes) {
        if (
          !isRecord(stroke) ||
          typeof stroke.color !== 'string' ||
          !isFiniteNumber(stroke.width) ||
          stroke.width <= 0 ||
          !Array.isArray(stroke.points)
        ) {
          return undefined
        }
        const points: [number, number][] = []
        for (const point of stroke.points) {
          if (!Array.isArray(point) || point.length !== 2 || !isFiniteNumber(point[0]) || !isFiniteNumber(point[1])) {
            return undefined
          }
          points.push([point[0], point[1]])
        }
        parsed.push({ color: stroke.color, width: stroke.width, points })
      }
      return { strokes: parsed }
    },
  },
  mathtools: {
    default: { instrument: 'coordinate', range: 5 },
    parse(input) {
      if (!isRecord(input)) return undefined
      const { instrument, range } = input
      if (typeof instrument !== 'string' || !MATH_INSTRUMENTS.includes(instrument as MathInstrument)) {
        return undefined
      }
      if (!isFiniteNumber(range)) return undefined
      return { instrument: instrument as MathInstrument, range: clampRange(range) }
    },
  },
}
