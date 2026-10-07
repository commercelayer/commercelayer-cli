import { expect, test } from '@oclif/test'
import { AUTH, api, list, resource, useMockedApi } from '../../helpers'

// The oclif 3 line keeps the published arguments (resource, path, id), with
// which fetch only works in the oclif 5 major, where it takes a path only
describe.skip('provisioning:fetch', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/roles').reply(200, list([resource('roles', 'rOl1', { name: 'Admin' })]))
    })
    .stdout()
    .command(['provisioning:fetch', 'roles', ...AUTH])
    .it('fetches a resource list', (ctx) => {
      expect(ctx.stdout).to.contain('rOl1')
    })

  test
    .do(() => {
      api().get('/api/roles/rOl1/permissions').reply(200, list([resource('permissions', 'pRm1', { subject: 'orders' })]))
    })
    .stdout()
    .command(['provisioning:fetch', 'roles/rOl1/permissions', ...AUTH])
    .it('fetches a relationship from a path', (ctx) => {
      expect(ctx.stdout).to.contain('pRm1')
    })
})
