import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, resource, single, useMockedApi } from '../../helpers'

describe('provisioning:retrieve', () => {
  useMockedApi()

  const role = single(resource('roles', 'rOl1', { name: 'Admin', kind: 'admin' }))

  test
    .do(() => {
      api().get('/api/roles/rOl1').reply(200, role)
    })
    .stdout()
    .command(['provisioning:retrieve', 'roles', 'rOl1', ...AUTH])
    .it('retrieves a resource by type and ID', (ctx) => {
      expect(ctx.stdout).to.contain('Admin')
    })

  test
    .do(() => {
      api().get('/api/roles/rOl1').query((q) => q.include === 'organization').reply(200, role)
    })
    .stdout()
    .command(['provisioning:retrieve', 'roles/rOl1', ...AUTH, '-i', 'organization'])
    .it('accepts type/ID and includes relationships', (ctx) => {
      expect(ctx.stdout).to.contain('rOl1')
    })

  test
    .command(['provisioning:retrieve', 'roles/rOl1', 'rOl2', ...AUTH])
    .catch(/Double definition of resource id/)
    .it('rejects an ID given twice')

  test
    .command(['provisioning:retrieve', 'roles', ...AUTH])
    .catch(/Resource id not defined/)
    .it('requires an ID')

  test
    .do(() => {
      api().get('/api/roles/nope').reply(404, apiError(404, 'Record not found', 'The requested resource was not found'))
    })
    .command(['provisioning:retrieve', 'roles', 'nope', ...AUTH])
    .catch(/Record not found/)
    .it('reports a missing resource')
})
