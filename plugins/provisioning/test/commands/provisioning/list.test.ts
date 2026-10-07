import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, list, resource, useMockedApi } from '../../helpers'

describe('provisioning:list', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/roles')
        .reply(200, list([resource('roles', 'rOl1', { name: 'Admin', kind: 'admin' }), resource('roles', 'rOl2', { name: 'Read only', kind: 'read_only' })]))
    })
    .stdout()
    .command(['provisioning:list', 'roles', ...AUTH])
    .it('lists the resources', (ctx) => {
      expect(ctx.stdout).to.contain('rOl1')
      expect(ctx.stdout).to.contain('Read only')
    })

  test
    .do(() => {
      api()
        .get('/api/roles')
        .query((q) => q['filter[q][name_eq]'] === 'Admin' && q.sort === '-created_at' && q['page[size]'] === '5' && q['page[number]'] === '2' && q['fields[roles]'] === 'name,kind')
        .reply(200, list([resource('roles', 'rOl1', { name: 'Admin' })]))
    })
    .stdout()
    .command(['provisioning:list', 'roles', ...AUTH, '-w', 'name_eq=Admin', '-s', '-created_at', '-n', '5', '-p', '2', '-f', 'name,kind'])
    .it('passes filters, sort, paging and fields to the API', (ctx) => {
      expect(ctx.stdout).to.contain('rOl1')
    })

  test
    .do(() => {
      api().get('/api/roles').reply(200, list([resource('roles', 'rOl1', { name: 'Admin' })]))
    })
    .stdout()
    .command(['provisioning:list', 'roles', ...AUTH, '-j', '-u'])
    .it('prints unformatted JSON', (ctx) => {
      expect(JSON.parse(ctx.stdout.substring(ctx.stdout.indexOf('['), ctx.stdout.lastIndexOf(']') + 1))[0].name).to.equal('Admin')
    })

  test
    .command(['provisioning:list', 'unicorns', ...AUTH])
    .catch(/Invalid resource unicorns/)
    .it('rejects an unknown resource')

  test
    .do(() => {
      api().get('/api/roles').reply(401, apiError(401, 'Invalid token'))
    })
    .command(['provisioning:list', 'roles', ...AUTH])
    .catch(/Invalid token/)
    .it('reports the API error')
})
