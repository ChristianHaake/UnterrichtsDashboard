# UnterrichtsDashboard

Ein lokal-first Classroom-Management-Dashboard für den Beamer- und Tafeleinsatz
im Präsenzunterricht.

Live application: [https://ud.haak3.de](https://ud.haak3.de)

## Purpose

The UnterrichtsDashboard is the "digitale Tafel" for a classroom: a pan/zoom
**canvas** onto which a teacher places small **apps** to orchestrate a lesson on
a beamer or an interactive display (Promethean, ViewSonic) or a Dienst-iPad.

- **Intended users:** teachers in face-to-face lessons.
- **Shortest workflow:** open the app → *App hinzufügen* → pick an app (e.g. a
  timer) → drag it on the canvas. Everything autosaves locally.
- **Workspaces:** multiple named **boards** (tabs), each with its own apps,
  layout, and viewport — e.g. one board per class or lesson.

### Apps (14)

Grouped in the palette by category:

- **Zeit:** Timer.
- **Klassenraum:** Arbeitssymbole (Sozialformen), Unterrichtsphasen,
  Zufallsgenerator, Punktetafel, Flurpass, Sitzplan, Morning Board, Lärmampel.
- **Kreativ:** Textfeld, QR-Code, Klebezettel, Whiteboard.
- **Mathe:** Mathe-Instrumente (Koordinatensystem, Geodreieck, Lineal).

## Privacy and storage

The whole app runs in the browser without an account. Apps, their content, the
canvas layout, and the viewport are stored **locally**.

- **IndexedDB** — database `unterrichtsdashboard`: the workspace (all boards,
  their apps + content, layout, and view). Autosaved.
- **`localStorage`** — `ud:lang`: the chosen interface language. No cookies.
- **Backup:** *Layout exportieren* writes a JSON file; *Layout importieren*
  loads one (validated; a failed import leaves the current workspace intact).
- **Delete:** *Zurücksetzen* clears the workspace; clearing site data also
  removes the language preference.

### Network requests in production

The app is local-first. The only outbound requests are optional and per-app:

- **Morning Board weather:** on use, the queried location is sent to Open-Meteo
  (`geocoding-api.open-meteo.com`, `api.open-meteo.com`). No personal data.
- **Lärmampel microphone:** with explicit consent and only while running; the
  signal is converted to a relative level locally and never recorded or sent.

No analytics, tracking, advertising, or third-party scripts. The CSP allows only
the hosts above. The hosting provider necessarily processes technical connection
data (IP, time, request). See [content/datenschutz.md](content/datenschutz.md).

## Development

Requirements: Node.js `22`, npm `10`.

```bash
npm ci
npm run dev
```

## Verification

```bash
npm run verify        # typecheck + lint + unit tests + build
npm run test:e2e      # Playwright (needs: npx playwright install chromium)
npm run smoke:production   # checks live headers/CSP/SPA against ud.haak3.de
```

## Architecture

- Stack: React + Vite + TypeScript (strict). No `react-grid-layout` — a custom
  pan/zoom canvas.
- Each app is a self-contained module declared in
  [`src/widgets/manifest.tsx`](src/widgets/manifest.tsx) (label, category, icon,
  size, lazy component) with a runtime state parser in
  [`src/widgets/state.ts`](src/widgets/state.ts). Adding an app is a few lines.
- Persistence is a versioned workspace document (schema v3) with migrations from
  v1 (grid) and v2 (single-board canvas). See
  [docs/architecture.md](docs/architecture.md) and
  [docs/dev-process.md](docs/dev-process.md).

Deployment target: **Cloudflare** (Workers static assets via `wrangler.jsonc`),
custom domain `ud.haak3.de`.

## Known limitations

- **Lärmampel** is a *relative* loudness indicator, not a calibrated dB meter;
  reliability depends on the device (iOS Safari may ignore the AGC-off request).
  Needs on-device validation.
- **Whiteboard** freehand drawing has no keyboard equivalent (documented
  exception; Text/Klebezettel cover keyboard-authored content).
- The **imprint** and legal sections of the privacy page require operator review
  before public release.

## haak3 standard

This app follows the
[haak3 Web App Standard](https://github.com/ChristianHaake/haak3-webapp-standard).
Conformance and exceptions (canvas layout, app-module architecture, multi-board,
weather/mic CSP) are documented in
[docs/standard-conformance.md](docs/standard-conformance.md).

## License

GNU General Public License v3.0 only. See [LICENSE](LICENSE).
