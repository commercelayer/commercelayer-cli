/** Test helpers: the shared ones from @commercelayer/cli-test-utils, plus this plugin's own. */
import { accessToken, ORG, resource } from '@commercelayer/cli-test-utils'

export { api, apiError, list, notFound, ORG, resource, single, useMockedApi } from '@commercelayer/cli-test-utils'

export const token = (kind = 'integration') => accessToken({ kind })
/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '--accessToken', token()]

export const cleanup = (id: string, attributes: Record<string, unknown> = {}) =>
  resource('cleanups', id, {
    resource_type: 'skus',
    status: 'completed',
    records_count: 3,
    processed_count: 3,
    errors_count: 0,
    filters: { code_start: 'OLD' },
    started_at: '2026-03-01T10:00:00.000Z',
    completed_at: '2026-03-01T10:05:00.000Z',
    reference: 'group1-0001',
    ...attributes,
  })
