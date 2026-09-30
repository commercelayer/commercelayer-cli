import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, list, resource, useMockedApi } from '../../helpers'

describe('provisioning:fetch', () => {
  useMockedApi()

  it('fetches a resource list', async () => {
    api().get('/api/roles').reply(200, list([resource('roles', 'rOl1', { name: 'Admin' })]))
    const ctx = await runCommand(['provisioning:fetch', 'roles', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('rOl1')
  })

  it('fetches a relationship from a path', async () => {
    api().get('/api/roles/rOl1/permissions').reply(200, list([resource('permissions', 'pRm1', { subject: 'orders' })]))
    const ctx = await runCommand(['provisioning:fetch', 'roles/rOl1/permissions', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('pRm1')
  })
})
