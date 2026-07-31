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

```text
Rule: All functionality must be keyboard operable (WCAG 2.2 AA).
Reason: The Whiteboard widget is freehand drawing; capturing arbitrary ink has
  no meaningful keyboard equivalent.
Scope: Whiteboard widget drawing surface only. Its clear/undo/colour/width
  controls are keyboard operable; the canvas has an accessible name.
Temporary or permanent: Permanent for freehand input.
Most accessible alternative: The Text and Sticky Notes widgets cover
  keyboard-authored content on the dashboard.
Review date: Revisit if a structured (non-freehand) drawing mode is added.
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
- Layout: a custom **pan/zoom canvas** with free widget positioning, not a
  grid. This is a deliberate deviation from SocialMediaCreator's grid/editor
  shell, justified by the product identity (a classroom "digital Tafel" on
  touch displays and beamers). The standard's shell (header, footer, legal
  pages), persistence, validation, security, and accessibility rules are all
  kept; only the work-area layout differs. `react-grid-layout` was removed.
  Widgets remain discrete, focusable, and keyboard-movable (nudge buttons), and
  zoom/reset controls are keyboard operable, so no accessibility regression.
- App-module architecture: each canvas item is a self-contained "app" declared
  by a manifest (`src/widgets/manifest.ts`): kind, label, category, default
  size, and a lazily-loaded component. A generic host renders by manifest (no
  per-kind switch), and a searchable, categorized palette places apps. Adding an
  app = add a state parser (`WIDGET_STATE`), a kind (`WIDGET_KINDS`), and one
  manifest line. A completeness test enforces one manifest + parser per kind.
- Workspace of multiple **boards** (schema v3): each board has its own apps,
  canvas layout, and viewport; a tab bar switches/adds/renames/deletes boards.
  Persisted as one workspace document; export/import and reset cover all boards.
  Migrations chain v1 (grid) → v2 (canvas) → v3 (workspace), so existing stored
  dashboards upgrade automatically without data loss.
- Persistence: Dexie.js over IndexedDB; `localStorage` only for small
  preferences (language under key `ud:lang`).
- Content pages are German-only for now; the UI is multilingual (DE/EN/FR/ES/NL).
  A language note will be added if a legally authoritative translation diverges.
- Production `_headers` CSP keeps `connect-src` tight: `'self'` plus exactly the
  two Open-Meteo hosts used by the optional Morning Board weather feature
  (`api.open-meteo.com`, `geocoding-api.open-meteo.com`). No wildcards. The
  microphone is disabled in `Permissions-Policy` until the noise meter lands.
  The weather call and its data flow are documented in the privacy page; the
  feature degrades without blocking when offline.

## Status

Phases 1–4 core complete: shell + infrastructure, six MVP widgets, IndexedDB
persistence with versioned schema and validated import/export/reset, and the
release-readiness pass (privacy/help content, Playwright + axe e2e). Outstanding
before public release are tracked in `docs/review-checklist.md`: operator legal
review of the imprint, manual device/screen-reader testing, the Phase 0
noise-meter spike, and a bundle code-split.
