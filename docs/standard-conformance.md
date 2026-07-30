# haak3 Standard Conformance

Standard:
https://github.com/ChristianHaake/haak3-webapp-standard

Standard version: `1.0.0-draft`

Last reviewed: `2026-07-29`

## Exceptions

```text
Rule: Noise meter as a calibrated dB-SPL measurement.
Reason: Browser microphones are not reliably calibratable without a
  device-specific reference, and iOS Safari does not reliably honor the
  autoGainControl/noiseSuppression constraints.
Scope: "Lärmpegel-Messer" feature — implemented as a relative loudness
  indicator with an adjustable threshold, not an absolute measurement device.
Temporary or permanent: Permanent (design decision).
Review date: After the Phase 0 feasibility spike.
```

## Not applicable (scope filter)

This product is a classroom dashboard, not a document generator. The following
standard areas are intentionally out of scope:

- Editor/preview split and A4/document preview layouts.
- Document-export accessibility rules (PDF text flow, DOCX headings/tables).

Exception within scope: the exported layout JSON still follows the data-safety,
runtime-validation, and schema-versioning rules.

## App-specific decisions

- Framework: React + Vite + TypeScript (strict). Justified by the many
  stateful, draggable widgets and the React visual baseline (SocialMediaCreator).
- Grid: `react-grid-layout` (to be added in Phase 2).
- Persistence: Dexie.js over IndexedDB (to be added in Phase 3); `localStorage`
  only for small preferences (language under key `ud:lang`).
- Content pages are German-only for now; the UI is multilingual (DE/EN/FR/ES/NL).
  A language note will be added if a legally authoritative translation diverges.
- Production `_headers` currently sets `connect-src 'none'` and disables the
  microphone, matching actual Phase 1 behavior (no network calls, no audio).
  These will be loosened to the minimum required when the noise meter and any
  optional network features land, and reflected in the privacy page.

## Status

Phases 1–4 core complete: shell + infrastructure, six MVP widgets, IndexedDB
persistence with versioned schema and validated import/export/reset, and the
release-readiness pass (privacy/help content, Playwright + axe e2e). Outstanding
before public release are tracked in `docs/review-checklist.md`: operator legal
review of the imprint, manual device/screen-reader testing, the Phase 0
noise-meter spike, and a bundle code-split.
