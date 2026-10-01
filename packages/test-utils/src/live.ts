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
export const describeLive = (title: string, fn: (this: Mocha.Suite) => void): void => {
  ;(LIVE ? describe : describe.skip)(`${title} (live)`, function () {
    this.timeout(30_000)
    fn.call(this)
  })
}
