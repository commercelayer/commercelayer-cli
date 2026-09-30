import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, resource, single, useMockedApi } from '../../helpers'

describe('provisioning:retrieve', () => {
  useMockedApi()

  const role = single(resource('roles', 'rOl1', { name: 'Admin', kind: 'admin' }))

  it('retrieves a resource by type and ID', async () => {
    api().get('/api/roles/rOl1').reply(200, role)
    const ctx = await runCommand(['provisioning:retrieve', 'roles', 'rOl1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Admin')
  })

  it('accepts type/ID and includes relationships', async () => {
    api().get('/api/roles/rOl1').query((q) => q.include === 'organization').reply(200, role)
    const ctx = await runCommand(['provisioning:retrieve', 'roles/rOl1', ...AUTH, '-i', 'organization'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('rOl1')
  })

  it('rejects an ID given twice', async () => {
    const ctx = await runCommand(['provisioning:retrieve', 'roles/rOl1', 'rOl2', ...AUTH])
    expect(ctx.error?.message).to.match(/Double definition of resource id/)
  })

  it('requires an ID', async () => {
    const ctx = await runCommand(['provisioning:retrieve', 'roles', ...AUTH])
    expect(ctx.error?.message).to.match(/Resource id not defined/)
  })

  it('reports a missing resource', async () => {
    api().get('/api/roles/nope').reply(404, apiError(404, 'Record not found', 'The requested resource was not found'))
    const ctx = await runCommand(['provisioning:retrieve', 'roles', 'nope', ...AUTH])
    expect(ctx.error?.message).to.match(/Record not found/)
  })
})
