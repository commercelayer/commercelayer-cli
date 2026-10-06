import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, list, resource, useMockedApi, versionedApi } from '../../helpers'

/** The Core API version in the request path: 2026-05 by default, --api-version or CL_CLI_API_VERSION otherwise */
describe('Core API version', () => {
  useMockedApi()

  let env: string | undefined
  beforeEach(() => {
    env = process.env.CL_CLI_API_VERSION
    delete process.env.CL_CLI_API_VERSION
  })
  afterEach(() => {
    if (env === undefined) delete process.env.CL_CLI_API_VERSION
    else process.env.CL_CLI_API_VERSION = env
  })

  it('calls the 2026-05 API by default', async () => {
    const scope = versionedApi().get('/api/2026-05/skus').query(true).reply(200, list([resource('skus', 'sKu1')]))
    const ctx = await runCommand(['resources:list', 'skus', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(scope.isDone()).to.equal(true)
  })

  it('calls the version of --api-version', async () => {
    const scope = versionedApi().get('/api/2017-08/skus').query(true).reply(200, list([resource('skus', 'sKu1')]))
    const ctx = await runCommand(['resources:list', 'skus', ...AUTH, '--api-version', '2017-08'])
    if (ctx.error) throw ctx.error
    expect(scope.isDone()).to.equal(true)
  })

  it('calls the version of CL_CLI_API_VERSION', async () => {
    process.env.CL_CLI_API_VERSION = '2017-08'
    const scope = versionedApi().get('/api/2017-08/skus').query(true).reply(200, list([resource('skus', 'sKu1')]))
    const ctx = await runCommand(['resources:list', 'skus', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(scope.isDone()).to.equal(true)
  })
})
