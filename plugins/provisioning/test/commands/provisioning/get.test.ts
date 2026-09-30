import { expect, test } from '@oclif/test'
import { AUTH, api, list, resource, single, useMockedApi } from '../../helpers'

describe('provisioning:get', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/roles').reply(200, list([resource('roles', 'rOl1', { name: 'Admin' })]))
    })
    .stdout()
    .command(['provisioning:get', 'roles', ...AUTH])
    .it('lists without an ID', (ctx) => {
      expect(ctx.stdout).to.contain('rOl1')
    })

  test
    .do(() => {
      api().get('/api/roles/rOl1').reply(200, single(resource('roles', 'rOl1', { name: 'Admin' })))
    })
    .stdout()
    .command(['provisioning:get', 'roles/rOl1', ...AUTH])
    .it('retrieves with an ID', (ctx) => {
      expect(ctx.stdout).to.contain('Admin')
    })
})
