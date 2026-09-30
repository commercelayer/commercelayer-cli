/** Test helpers: the shared ones from @commercelayer/cli-test-utils, plus this plugin's own. */
import { accessToken, coreApi, list, notFound, ORG, resource } from '@commercelayer/cli-test-utils'
import type nock from 'nock'

export { api, list, ORG, resource, single, useMockedApi } from '@commercelayer/cli-test-utils'

export const API = coreApi()
export const TOKEN = accessToken()
/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '--accessToken', TOKEN]

export const tag = (id: string, name: string) => resource('tags', id, { name, reference: null, reference_origin: null, metadata: {} })

/** checkTag(): lookup by ID fails, then by name */
export const mockTagByName = (scope: nock.Scope, name: string, found?: ReturnType<typeof tag>): nock.Scope =>
  scope
    .get(`/api/tags/${name}`)
    .reply(404, notFound())
    .get('/api/tags')
    .query((q) => q['filter[q][name_eq]'] === name)
    .reply(200, list(found ? [found] : []))
