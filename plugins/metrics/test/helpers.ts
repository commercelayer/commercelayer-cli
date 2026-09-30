/** Test helpers: the shared ones from @commercelayer/cli-test-utils, plus this plugin's own. */
import { accessToken, api, ORG } from '@commercelayer/cli-test-utils'

export { apiError, ORG, useMockedApi } from '@commercelayer/cli-test-utils'

/** An access token of the given application kind and organization */
export const token = (kind = 'integration', org = ORG) => accessToken({ kind, org })
/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '-a', token()]

/** Mocks one Metrics API query and captures its body */
export const mockQuery = (path: string, status: number, response: unknown): { body?: any } => {
  const captured: { body?: any } = {}
  api()
    .post(`/metrics/${path}`, (body) => {
      captured.body = body
      return true
    })
    .matchHeader('authorization', (h) => h.startsWith('Bearer '))
    .reply(status, response)
  return captured
}
