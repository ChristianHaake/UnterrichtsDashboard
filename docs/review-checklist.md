# Release Review

Copy the current checklist from:
https://github.com/ChristianHaake/haak3-webapp-standard/blob/main/docs/review-checklist.md

Record release-specific results below.

## Release

- Version: `0.1.0`
- Review date: `2026-07-29`
- Reviewer: `Christian Haake`

## Results

- [x] Automated verification passed (`npm run verify`: typecheck, lint, 44 unit tests, build).
- [x] End-to-end tests pass (`npm run test:e2e`: 9 tests — workflow, persistence-across-reload, reset, failed-import preservation, keyboard move, SPA routing, language switch, axe a11y).
- [x] Import, export, reset, and recovery tested (unit + e2e; failed import preserves current state).
- [ ] Mobile and tablet workflow tested on real hardware (pending — see Phase 0 / Phase 4 device testing).
- [ ] Legal and privacy content reviewed by operator (privacy text matches behavior; imprint + legal review still required before release).
- [x] Exceptions documented (`docs/standard-conformance.md`).

## Detailed checklist

### Product
- [x] Intended users and educational purpose explicit (README, About).
- [x] Core workflow works without login.
- [x] Empty states and recovery paths clear.
- [x] Destructive actions protect existing work (reset + replace-on-import confirm).

### Design and responsive
- [x] Semantic design tokens used.
- [x] Header, footer, content pages follow shared patterns.
- [ ] Primary workflow verified at 320/390/tablet/desktop on real devices (automated desktop only so far).
- [x] No horizontal page scrolling in tested widths.

### Accessibility
- [x] Primary workflow keyboard operable (drag has button alternative).
- [x] Focus visible.
- [x] Controls have names/labels; import error associated via `role="alert"`.
- [x] Status changes announced (timer done, symbols, randomizer results, import error).
- [x] Automated axe scan clean (no serious/critical) on dashboard and a content page.
- [ ] Manual screen-reader pass (pending).
- [x] Drag-and-drop has a keyboard alternative.
- [ ] 200% zoom and reduced-motion manually verified (reduced-motion handled in CSS; manual check pending).

### Data and privacy
- [x] Storage keys namespaced; schema versioned (`schemaVersion`).
- [x] Imported data validated before state replacement (11 validation tests).
- [ ] File/archive resource limits — N/A (no file/image uploads or archives yet).
- [x] Failed imports preserve current work (unit + e2e).
- [x] Reset and local-data behavior documented (privacy + help).
- [x] Privacy claims match network requests (no network calls; CSP `connect-src 'none'`).

### Content and legal
- [x] Help, privacy, imprint routes work on direct navigation (e2e).
- [x] Footer links to required pages and source repository.
- [x] Markdown does not render unsafe raw HTML (`markdown-it` `html: false`).
- [ ] Legal text reviewed by operator (imprint address + legal review outstanding).

### Engineering and release
- [x] Node and package-manager requirements documented (`engines`, README, CI Node 22).
- [x] Build, test, lint, typecheck pass.
- [x] Persistence, migration, invalid import, core domain behavior tested.
- [x] Primary browser workflow has automated coverage (Playwright).
- [x] Production security headers present (`public/_headers`: CSP, Referrer-Policy, X-Content-Type-Options, Permissions-Policy, frame-ancestors).
- [x] HTML revalidates; fingerprinted assets immutable-cached (`_headers`).
- [x] README, package metadata, and LICENSE name the same license (GPL-3.0-only).
- [x] Exceptions documented.

## Notes

Outstanding before public release:

1. Operator to complete and legally review the imprint (address) and privacy legal sections.
2. Manual device testing on iPad, Promethean/ViewSonic, Windows convertible; 200% zoom; screen reader.
3. Phase 0 noise-meter feasibility spike (not yet built).
4. Bundle is ~634 KB (218 KB gzip); code-split (lazy-load QR/Randomizer) to clear the Vite warning.
5. `verify:live`/`smoke:production` to be run against the deployed instance once Cloudflare Pages is set up.
