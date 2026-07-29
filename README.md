# UnterrichtsDashboard

Ein lokal-first Classroom-Management-Dashboard für den Beamer- und Tafeleinsatz im Präsenzunterricht.

Live application: [https://unterrichtsdashboard.pages.dev](https://unterrichtsdashboard.pages.dev)

## Purpose

Describe:

- the educational problem this app solves;
- its intended users;
- the shortest successful workflow;
- important limitations or responsible-use considerations.

## Privacy and storage

The core workflow runs in the browser without an account.

Document precisely:

- which data is stored in `localStorage` or IndexedDB;
- whether uploaded files leave the device;
- which network requests occur in production;
- how users delete local data;
- how users create a durable project backup.

Do not claim that no data is transmitted: the hosting provider necessarily
processes technical connection data.

## Development

Requirements:

- Node.js `22`
- npm `10`

```bash
npm ci
npm run dev
```

## Verification

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

Replace these commands if the selected stack uses different scripts.

## Architecture

See [docs/architecture.md](docs/architecture.md).

## haak3 standard

This app follows the
[haak3 Web App Standard](https://github.com/ChristianHaake/haak3-webapp-standard).
Conformance and exceptions are documented in
[docs/standard-conformance.md](docs/standard-conformance.md).

## License

GNU General Public License v3.0 only. See [LICENSE](LICENSE).
