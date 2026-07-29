import { parseDashboardDocument, type ParseResult } from './validate'
import type { DashboardDocument } from './schema'

export function serializeDocument(doc: DashboardDocument): string {
  return JSON.stringify(doc, null, 2)
}

/** Parse imported file text into a validated document, or an actionable error. */
export function deserializeDocument(text: string): ParseResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'invalid-json' }
  }
  return parseDashboardDocument(parsed)
}

/** Reduce an arbitrary base name to a safe, meaningful filename stem. */
export function sanitizeFilename(base: string): string {
  const cleaned = base
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned.length > 0 ? cleaned : 'dashboard'
}

/** Build an export filename such as `dashboard-2026-07-29.json`. */
export function buildExportFilename(now: Date, base = 'dashboard'): string {
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${sanitizeFilename(base)}-${yyyy}-${mm}-${dd}.json`
}
