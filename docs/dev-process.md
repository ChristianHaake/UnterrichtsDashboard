# Development Process

Engineering execution plan for the UnterrichtsDashboard. Complements
[`projectplan.md`](../projectplan.md) (product/market/spec) with the concrete
build process. Conforms to the
[haak3 Web App Standard](https://github.com/ChristianHaake/haak3-webapp-standard)
(version 1.0.0-draft).

## Locked decisions

| Concern | Decision | Rationale |
| --- | --- | --- |
| Framework | **React + Vite + TypeScript (strict)** | Many stateful, draggable widgets; standard's visual baseline (SocialMediaCreator) is React; strongest ecosystem for grid, DnD, a11y, testing. |
| Grid layout | **react-grid-layout** | Mature, purpose-built for draggable/resizable widget dashboards; JSON-serializable layout. This is the core interaction — library maturity is decisive. |
| Persistence | **Dexie.js** over IndexedDB | Standard-endorsed IndexedDB wrapper for blobs and structured data. |
| Small prefs | **`localStorage`** (namespaced) | Language, theme — small text config only. |
| Unit/logic tests | **Vitest** | Vite-native. |
| E2E tests | **Playwright** | Cross-browser (`PLAYWRIGHT_BROWSERS=all`), pinned locale. |
| i18n | **react-i18next** (or lightweight equivalent) | Static JSON locale assets, DE/EN/FR/ES/NL. |
| Hosting | **Cloudflare Pages** (static SPA) | Git-integrated CI/CD, global CDN, free tier. |
| Noise meter | **Spike first (Phase 0), then Go/No-go** | High-demand feature with real feasibility risk on iOS Safari; cheap spike de-risks before MVP commit. |

Vue remains standard-valid; if adopted, grid → Gridstack.js and the rest maps
1:1. This document assumes React.

## Repository bootstrap (Phase 1)

The standard mandates adopting the template rather than hand-rolling the shell.

1. Copy the template into the repo root, preserving hidden files:
   ```bash
   cp -R ../haak3-webapp-standard/templates/app-repo/. .
   ```
2. Replace every `{{PLACEHOLDER}}` (search for `{{`): app name, live URL,
   Node/npm versions, repository link.
3. Scaffold Vite React-TS **into** the folder without deleting the supplied
   `AGENTS.md`, `CLAUDE.md`, `.claude/`, `.agents/`, `docs/`, `content/`,
   `public/_headers`, or `wrangler.jsonc`.
4. Add strict `tsconfig` and the predictable scripts: `dev`, `build`, `test`,
   `lint`, `typecheck`, `verify` (plus `verify:live`/`smoke:production`). Pin the
   supported Node major version.
5. Configure `wrangler.jsonc`: app name, `dist` output directory,
   `not_found_handling: "single-page-application"`.
6. Enable `.github/workflows/ci.yml` (runs `verify`).
7. Confirm agent skills are discovered (`.claude/skills/` and `.agents/skills/`
   for caveman and cavecrew).
8. **License check:** `LICENSE`, `README`, and `package.json` must all declare
   `GPL-3.0-only`. The family has a known MIT-vs-GPL conflict elsewhere; verify
   consistency now.
9. Delete `TEMPLATE-CHECKLIST.md` once its steps are complete.

## Source architecture

Keep domain data, persistence, export/import logic, and UI rendering separable.
Prefer pure functions for parsing, migration, validation, and shuffling — these
carry the mandatory unit tests.

```
src/
  app/          shell: Header, Footer, router, tokens.css
  widgets/      timer/ randomizer/ phases/ symbols/ text-media/ qr/ noise-meter/
  grid/         react-grid-layout wrapper + keyboard reorder alternative
  persistence/  dexie db, schema (schemaVersion), migrations, validators   [pure, tested]
  domain/       Fisher-Yates shuffle, phase model, worker-based timer clock [pure, tested]
  i18n/         locales/{de,en,fr,es,nl}.json
  pages/        content-page routes (Hilfe / Datenschutz / Impressum / Über)
  lib/          shared utilities
content/        *.md content, bundled at build time, HTML sanitized
public/_headers wrangler.jsonc
tests/e2e/      Playwright specs
```

Boundaries to enforce:

- A widget never touches Dexie directly — access goes through `persistence/`.
- Import validation lives in `persistence/validators`, not in components.
- State replacement happens only after complete validation.
- Object URLs and other browser resources are released after use.
- File-size, image-dimension, and entry-count limits are explicit constants.

## Git and CI workflow

- **Trunk-based**: short feature branches, pull requests into `main`. No direct
  commits to `main`.
- Each PR triggers a **Cloudflare Pages preview deploy** (`X-Robots-Tag:
  noindex`) for real on-device testing — essential for iPad and interactive
  panels.
- CI gate on every PR: `npm ci && npm run verify`. Playwright runs as a separate
  cross-browser job.
- Merge to `main` triggers the production deploy.
- Solo development still uses PRs: cheap preview environment plus a
  checklist-driven forcing function.

## Definition of Done (per widget / PR)

- TypeScript strict; never trust parsed JSON or archive contents by type alone.
- Fully keyboard operable; focus visible and never obscured by sticky UI.
- Icon-only controls have accessible names; tooltips where meaning is unclear.
- Uses semantic design tokens — no raw color values in components.
- Respects `prefers-reduced-motion`; color is never the only signal.
- Interactive targets ≥ 44×44 CSS px (touch-first).
- Strings routed through i18n; no translation keys leak into the UI.
- Pure logic has unit tests; destructive and persistence paths are tested.

## Build order

Weeks are guidance for a small team; the Phase 0 outcome can reshuffle the MVP.

| Phase | Weeks | Deliverable | Exit gate |
| --- | --- | --- | --- |
| **0 — Noise-meter spike** | 0–1 | AudioWorklet level measurement tested on Dienst-iPad (iOS Safari), Promethean/ViewSonic, Windows convertible. Decide MVP inclusion. | Go/No-go documented in `docs/standard-conformance.md`. |
| **1 — Shell & infra** | 1–2 | Template adopted; routing; four content pages (Markdown); i18n skeleton; `_headers`/CSP; CI green. | `verify` passes in CI. |
| **2 — Core widgets** | 3–4 | Grid + Timer (worker clock), Text/Media, QR, Phases, Symbols, Randomizer; keyboard reorder. | Definition of Done met per widget. |
| **3 — Persistence & data safety** | 5–6 | Dexie; versioned schema; JSON export/import with runtime validation; Reset. Noise meter if Go. | Unit tests: persistence, migration, invalid import, reset. |
| **4 — A11y & MVP release** | 7 | Keyboard/screen-reader/200%-zoom/reduced-motion pass; Playwright primary flow; hardware test; privacy page vs. real behavior; operator-signed imprint. | `docs/review-checklist.md` fully complete. |
| **5 — Post-MVP management** | 8–10 | Sitzplan (DnD + keyboard alt), Morning Board (weather with offline fallback), Scoreboard, Hall Pass. | Same DoD; external features degrade offline. |
| **6 — Advanced didactics** | 11–13 | Math instruments, Sticky Notes, Whiteboard (palm rejection); optional Cloudflare Workers + WebSockets for live quizzes. | Cost model and privacy reviewed; core works without server. |

## Testing strategy

Layered, per coding-standards.

- **Mandatory unit (Vitest):** persistence serialization/restoration; schema
  migration and invalid imports; destructive transitions (reset); core domain
  transformations (Fisher-Yates fairness, phase logic, timer drift).
- **Recommended browser (Playwright):** primary workflow (create → arrange →
  save → reload); direct navigation to each content page; import/export;
  keyboard access to critical controls. Cross-browser runs; pinned locale.
- **Manual on target hardware:** noise-meter behavior; touch ergonomics on
  interactive panels; contrast in poorly darkened rooms; iPad quota behavior.

## Release gate (MVP)

Ship only when `docs/review-checklist.md` is fully green. Hard blockers:

- Imported data validated before state replacement; failed import preserves
  current work.
- Storage keys namespaced; persisted and exported schemas versioned.
- Footer links Hilfe / Datenschutz / Impressum / repository; direct navigation
  works for every content route.
- CSP reflects actual network behavior, including `Permissions-Policy:
  microphone` for the noise meter and any optional API endpoints.
- Privacy page matches real production requests; imprint reviewed by the
  operator (generated text is not legal approval).
- `verify` green; persistence, migration, and reset covered by tests.
- License name identical across `LICENSE`, `README`, and `package.json`.
- Standard exceptions recorded in `docs/standard-conformance.md`.

## Standard conformance

Tracked in [`docs/standard-conformance.md`](standard-conformance.md). Current
recorded exception: the noise meter is a relative loudness indicator, not a
calibrated dB-SPL meter (browser microphones are not reliably calibratable;
iOS Safari does not honor AGC constraints). Scope-filtered as not applicable:
editor/preview split, A4/document preview, and document-export accessibility
rules — this is a dashboard, not a document generator. The exported layout JSON
still follows the data-safety and versioning rules.
