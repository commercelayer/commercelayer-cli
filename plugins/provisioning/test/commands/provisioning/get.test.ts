import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, list, resource, single, useMockedApi } from '../../helpers'

describe('provisioning:get', () => {
  useMockedApi()

  it('lists without an ID', async () => {
    api().get('/api/roles').reply(200, list([resource('roles', 'rOl1', { name: 'Admin' })]))
    const ctx = await runCommand(['provisioning:get', 'roles', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('rOl1')
  })

  it('retrieves with an ID', async () => {
    api().get('/api/roles/rOl1').reply(200, single(resource('roles', 'rOl1', { name: 'Admin' })))
    const ctx = await runCommand(['provisioning:get', 'roles/rOl1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Admin')
  })
})
