#!/usr/bin/env node
// Post-deploy smoke check: verifies the deployed instance returns the expected
// security headers and serves the SPA shell. Usage:
//   node scripts/smoke-production.mjs https://ud.haak3.de

const target = process.argv[2] ?? process.env.SMOKE_URL ?? 'https://ud.haak3.de'

const REQUIRED_HEADERS = {
  'content-security-policy': /default-src 'self'/i,
  'x-content-type-options': /nosniff/i,
  'referrer-policy': /.+/,
  'permissions-policy': /microphone=/i,
}

const failures = []

const res = await fetch(target, { redirect: 'follow' })
if (!res.ok) {
  failures.push(`GET ${target} returned HTTP ${res.status}`)
}

for (const [header, pattern] of Object.entries(REQUIRED_HEADERS)) {
  const value = res.headers.get(header)
  if (!value || !pattern.test(value)) {
    failures.push(`Header "${header}" missing or unexpected: ${value ?? '(absent)'}`)
  }
}

const body = await res.text()
if (!body.includes('<div id="root">')) {
  failures.push('Response body does not contain the SPA root element')
}

if (failures.length > 0) {
  console.error(`Smoke check FAILED for ${target}:`)
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}

console.log(`Smoke check passed for ${target}`)
