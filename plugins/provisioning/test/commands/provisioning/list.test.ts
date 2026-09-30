import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, list, resource, useMockedApi } from '../../helpers'

describe('provisioning:list', () => {
  useMockedApi()

  it('lists the resources', async () => {
    api()
      .get('/api/roles')
      .reply(200, list([resource('roles', 'rOl1', { name: 'Admin', kind: 'admin' }), resource('roles', 'rOl2', { name: 'Read only', kind: 'read_only' })]))
    const ctx = await runCommand(['provisioning:list', 'roles', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('rOl1')
    expect(ctx.stdout).to.contain('Read only')
  })

  it('passes filters, sort, paging and fields to the API', async () => {
    api()
      .get('/api/roles')
      .query((q) => q['filter[q][name_eq]'] === 'Admin' && q.sort === '-created_at' && q['page[size]'] === '5' && q['page[number]'] === '2' && q['fields[roles]'] === 'name,kind')
      .reply(200, list([resource('roles', 'rOl1', { name: 'Admin' })]))
    const ctx = await runCommand(['provisioning:list', 'roles', ...AUTH, '-w', 'name_eq=Admin', '-s', '-created_at', '-n', '5', '-p', '2', '-f', 'name,kind'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('rOl1')
  })

  it('prints unformatted JSON', async () => {
    api().get('/api/roles').reply(200, list([resource('roles', 'rOl1', { name: 'Admin' })]))
    const ctx = await runCommand(['provisioning:list', 'roles', ...AUTH, '-j', '-u'])
    if (ctx.error) throw ctx.error
    expect(JSON.parse(ctx.stdout.substring(ctx.stdout.indexOf('['), ctx.stdout.lastIndexOf(']') + 1))[0].name).to.equal('Admin')
  })

  it('rejects an unknown resource', async () => {
    const ctx = await runCommand(['provisioning:list', 'unicorns', ...AUTH])
    expect(ctx.error?.message).to.match(/Invalid resource unicorns/)
  })

  it('reports the API error', async () => {
    api().get('/api/roles').reply(401, apiError(401, 'Invalid token'))
    const ctx = await runCommand(['provisioning:list', 'roles', ...AUTH])
    expect(ctx.error?.message).to.match(/Invalid token/)
  })
})
