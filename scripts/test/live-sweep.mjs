#!/usr/bin/env node
/**
 * Deletes what the integration suites created in the test organization and
 * an interrupted run left behind: every resource whose name, email or
 * reference starts with the suites' prefix (cli-it-, see
 * packages/test-utils/src/live.ts). Nothing else is touched.
 *
 * Runs before the integration suites in CI (integration.yml).
 *
 * Usage:  CL_CLI_ORGANIZATION=… CL_CLI_CLIENT_ID=… CL_CLI_CLIENT_SECRET=… node scripts/test/live-sweep.mjs [--dry-run]
 */
const PREFIX = 'cli-it-'
const DRY = process.argv.includes('--dry-run')

/** Resource types the suites create, and the filter matching their test resources */
const SWEEP = [
  ['orders', 'reference_start'],
  ['orders', 'customer_email_start'],
  ['customers', 'email_start'],
  ['customer_groups', 'name_start'],
  ['tags', 'name_start'],
  ['links', 'name_start'],
]

const { CL_CLI_ORGANIZATION: org, CL_CLI_CLIENT_ID: clientId, CL_CLI_CLIENT_SECRET: clientSecret } = process.env
const domain = process.env.CL_CLI_DOMAIN || 'commercelayer.io'
if (!org || !clientId || !clientSecret) {
  console.error('CL_CLI_ORGANIZATION, CL_CLI_CLIENT_ID and CL_CLI_CLIENT_SECRET are required')
  process.exit(1)
}

const auth = await fetch(`https://auth.${domain}/oauth/token`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
}).then((r) => r.json())
if (!auth.access_token) {
  console.error(`Login to ${org} failed: ${JSON.stringify(auth.errors ?? auth)}`)
  process.exit(1)
}

const api = (path, init = {}) =>
  fetch(new URL(path, `https://${org}.${domain}`), {
    ...init,
    headers: { Accept: 'application/vnd.api+json', Authorization: `Bearer ${auth.access_token}` },
  })

let deleted = 0
let failed = 0
for (const [type, filter] of SWEEP) {
  const kept = new Set()
  // Deleted resources leave the page: move on only when the whole page is kept
  for (let page = 1; ; ) {
    const res = await api(`/api/${type}?filter[q][${filter}]=${PREFIX}&page[size]=25&page[number]=${page}&fields[${type}]=id`)
    if (!res.ok) {
      console.error(`GET ${type} failed (${res.status})`)
      failed++
      break
    }
    const ids = (await res.json()).data.map((r) => r.id)
    if (ids.length === 0) break
    for (const id of ids.filter((i) => !kept.has(i))) {
      if (DRY) {
        console.log(`would delete ${type}/${id}`)
        kept.add(id)
        continue
      }
      const del = await api(`/api/${type}/${id}`, { method: 'DELETE' })
      if (del.ok || del.status === 404) {
        console.log(`deleted ${type}/${id}`)
        deleted++
      } else {
        // e.g. an order that is no longer a draft: leave it
        console.error(`DELETE ${type}/${id} failed (${del.status})`)
        failed++
        kept.add(id)
      }
    }
    if (ids.every((i) => kept.has(i))) page++
  }
}

console.log(`${DRY ? 'Dry run: ' : ''}${deleted} deleted, ${failed} failed`)
