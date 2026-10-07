import { expect, test } from '@oclif/test'
import { AUTH, list, resource, useMockedApi, versionedApi } from '../../helpers'

/** The Core API version in the request path: 2026-05 by default, --api-version or CL_CLI_API_VERSION otherwise */
describe('Core API version', () => {
  useMockedApi()

  let scope: ReturnType<typeof versionedApi>

  test
    .env({ CL_CLI_API_VERSION: undefined })
    .do(() => {
      scope = versionedApi().get('/api/2026-05/skus').query(true).reply(200, list([resource('skus', 'sKu1')]))
    })
    .stdout()
    .command(['resources:list', 'skus', ...AUTH])
    .it('calls the 2026-05 API by default', () => {
      expect(scope.isDone()).to.equal(true)
    })

  test
    .env({ CL_CLI_API_VERSION: undefined })
    .do(() => {
      scope = versionedApi().get('/api/2017-08/skus').query(true).reply(200, list([resource('skus', 'sKu1')]))
    })
    .stdout()
    .command(['resources:list', 'skus', ...AUTH, '--api-version', '2017-08'])
    .it('calls the version of --api-version', () => {
      expect(scope.isDone()).to.equal(true)
    })

  test
    .env({ CL_CLI_API_VERSION: '2017-08' })
    .do(() => {
      scope = versionedApi().get('/api/2017-08/skus').query(true).reply(200, list([resource('skus', 'sKu1')]))
    })
    .stdout()
    .command(['resources:list', 'skus', ...AUTH])
    .it('calls the version of CL_CLI_API_VERSION', () => {
      expect(scope.isDone()).to.equal(true)
    })
})
