import type { WidgetKind } from './types'

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

export interface WidgetStateMap {
  timer: TimerPersist
  text: TextPersist
  symbols: SymbolsPersist
  phases: PhasesPersist
  qr: QrPersist
  randomizer: RandomizerPersist
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
}
