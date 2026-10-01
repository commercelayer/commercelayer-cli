/**
 * Helpers for the integration suites (`test/integration/*.it.ts`), which run
 * read-only commands against the real Core API of a test organization.
 *
 * They need the credentials of an integration application in the
 * environment, and are skipped without them:
 *   CL_CLI_ORGANIZATION    organization slug (e.g. cli-test-org)
 *   CL_CLI_CLIENT_ID       application client id
 *   CL_CLI_CLIENT_SECRET   application client secret
 *   CL_CLI_DOMAIN          optional, e.g. commercelayer.co for staging
 *
 * Only commands that read data belong in these suites: the organization is
 * shared, and its data can change between runs, so assert on the shape of
 * the output, not on specific records.
 */

const env = process.env

/** True when the credentials of the test organization are available */
export const LIVE = Boolean(env.CL_CLI_ORGANIZATION && env.CL_CLI_CLIENT_ID && env.CL_CLI_CLIENT_SECRET)

export const LIVE_ORG = env.CL_CLI_ORGANIZATION ?? ''

const DOMAIN = env.CL_CLI_DOMAIN || 'commercelayer.io'

/** Base URL of the Core API of the test organization */
export const liveApi = (): string => `https://${LIVE_ORG}.${DOMAIN}`

let token: Promise<string> | undefined

/** An access token of the test application, requested once per run */
export const liveToken = (): Promise<string> => {
  token ??= fetch(`https://auth.${DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: env.CL_CLI_CLIENT_ID, client_secret: env.CL_CLI_CLIENT_SECRET }),
  }).then(async (res) => {
    const body = await res.json()
    if (!res.ok || !body.access_token) throw new Error(`Login to ${LIVE_ORG} failed (${res.status}): ${JSON.stringify(body.errors ?? body)}`)
    return body.access_token as string
  })
  return token
}

/** Organization and token flags for the commands (the domain comes from CL_CLI_DOMAIN) */
export const liveAuth = async (): Promise<string[]> => ['-o', LIVE_ORG, '--accessToken', await liveToken()]

/** The ID of the first resource of a type, or undefined when there is none */
export const liveFirst = async (type: string, query: Record<string, string> = {}): Promise<string | undefined> => {
  const url = new URL(`/api/${type}`, liveApi())
  url.searchParams.set('page[size]', '1')
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v)
  const res = await fetch(url, { headers: { Accept: 'application/vnd.api+json', Authorization: `Bearer ${await liveToken()}` } })
  if (!res.ok) throw new Error(`GET ${url.pathname} failed (${res.status})`)
  const body = await res.json()
  return body.data?.[0]?.id
}

/**
 * A describe block that runs only with the test organization's credentials,
 * with a timeout fit for real API calls.
 */
export const describeLive = (title: string, fn: (this: Mocha.Suite) => void, enabled = LIVE): void => {
  ;(enabled ? describe : describe.skip)(`${title} (live)`, function () {
    this.timeout(60_000)
    fn.call(this)
  })
}


/*
 * Suites that change data create their own resources and delete them in an
 * after() hook. Every name, email, code or reference they create starts with
 * LIVE_PREFIX, so a run never touches existing data and scripts/test/live-sweep.mjs
 * can remove what an interrupted run left behind.
 */

/** Prefix of everything the suites create */
export const LIVE_PREFIX = 'cli-it-'

/** This run's prefix (kept short: tag names are at most 25 characters) */
export const LIVE_RUN = `${LIVE_PREFIX}${(Date.now() % 36 ** 6).toString(36).padStart(6, '0')}`

/** A unique name for a resource of this run */
export const liveName = (suffix: string): string => `${LIVE_RUN}-${suffix}`

/** A request to the Core API of the test organization, with the test token */
export const liveRequest = async (method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, data?: unknown): Promise<any> => {
  const res = await fetch(new URL(path, liveApi()), {
    method,
    headers: { Accept: 'application/vnd.api+json', 'Content-Type': 'application/vnd.api+json', Authorization: `Bearer ${await liveToken()}` },
    body: data ? JSON.stringify({ data }) : undefined,
  })
  if (method === 'DELETE' && res.status === 404) return undefined
  if (!res.ok) throw new Error(`${method} ${path} failed (${res.status}): ${await res.text()}`)
  return res.status === 204 ? undefined : res.json()
}

/** Creates a resource and returns its ID */
export const liveCreate = async (type: string, attributes: Record<string, unknown>, relationships?: Record<string, { type: string; id: string }>): Promise<string> => {
  const rels = relationships ? Object.fromEntries(Object.entries(relationships).map(([k, v]) => [k, { data: v }])) : undefined
  const body = await liveRequest('POST', `/api/${type}`, { type, attributes, ...(rels ? { relationships: rels } : {}) })
  return body.data.id
}

/** Deletes a resource, if it still exists */
export const liveDelete = async (type: string, id?: string): Promise<void> => {
  if (id) await liveRequest('DELETE', `/api/${type}/${id}`)
}

/**
 * Client ID of a sales channel application of the test organization, needed
 * by the commands that only accept sales channel tokens or client IDs
 * (checkout, links): their suites are skipped without it.
 */
export const LIVE_SALES_CHANNEL = env.CL_CLI_SALES_CHANNEL_CLIENT_ID ?? ''

/** A sales channel access token scoped to a market */
export const liveSalesChannelToken = async (marketId: string): Promise<string> => {
  const res = await fetch(`https://auth.${DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: LIVE_SALES_CHANNEL, scope: `market:id:${marketId}` }),
  })
  const body = await res.json()
  if (!res.ok || !body.access_token) throw new Error(`Sales channel login failed (${res.status}): ${JSON.stringify(body.errors ?? body)}`)
  return body.access_token
}

/**
 * The JSON block of a command's output, parsed: with --json the commands
 * still print other lines around it (e.g. the list's Records footer).
 */
export const jsonOutput = (stdout: string): any => {
  const lines = stdout.split('\n')
  const start = lines.findIndex((l) => /^[[{]/.test(l))
  if (start < 0) throw new Error(`No JSON in the output:\n${stdout}`)
  if (/^(\[\]|\{\})$/.test(lines[start])) return JSON.parse(lines[start])
  const end = lines.findIndex((l, i) => i > start && /^[\]}]$/.test(l))
  return JSON.parse(lines.slice(start, end + 1).join('\n'))
}
