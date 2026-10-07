/** Test helpers: the shared ones from @commercelayer/cli-test-utils, plus this plugin's own. */
import { accessToken, ORG, resource } from '@commercelayer/cli-test-utils'

export { api, apiError, list, notFound, ORG, resource, single, useMockedApi } from '@commercelayer/cli-test-utils'

export const token = (kind = 'integration') => accessToken({ kind })
/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '--accessToken', token()]

export const importJob = (id: string, attributes: Record<string, unknown> = {}) =>
  resource('imports', id, {
    resource_type: 'skus',
    format: 'json',
    status: 'completed',
    inputs_size: 2,
    processed_count: 2,
    warnings_count: 0,
    errors_count: 0,
    started_at: '2026-03-01T10:00:00.000Z',
    completed_at: '2026-03-01T10:01:00.000Z',
    reference: 'group1-0001',
    ...attributes,
  })
