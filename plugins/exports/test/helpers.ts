/** Test helpers: the shared ones from @commercelayer/cli-test-utils, plus this plugin's own. */
import { accessToken, ORG, resource } from '@commercelayer/cli-test-utils'

export { api, apiError, list, notFound, ORG, resource, single, useMockedApi } from '@commercelayer/cli-test-utils'

/** exp far in the future: exports:create refreshes expiring tokens */
export const token = (kind = 'integration') => accessToken({ kind, exp: 4102444800 })
/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '--accessToken', token()]

export const exportJob = (id: string, attributes: Record<string, unknown> = {}) =>
  resource('exports', id, {
    resource_type: 'skus',
    format: 'json',
    status: 'completed',
    records_count: 2,
    progress: 100,
    includes: [],
    filters: { code_start: 'TS' },
    dry_data: false,
    started_at: '2026-03-01T10:00:00.000Z',
    completed_at: '2026-03-01T10:01:00.000Z',
    attachment_url: `https://exports.example.com/${id}.json.gz`,
    reference: 'group1-0001',
    ...attributes,
  })
