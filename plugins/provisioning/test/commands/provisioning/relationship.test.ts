import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, list, resource, useMockedApi } from '../../helpers'

describe('provisioning:relationship', () => {
  useMockedApi()

  it('lists a 1-N relationship with filters', async () => {
    api()
      .get('/api/roles/rOl1/permissions')
      .query((q) => q['filter[q][subject_eq]'] === 'orders')
      .reply(200, list([resource('permissions', 'pRm1', { subject: 'orders' })]))
    const ctx = await runCommand(['provisioning:relationship', 'roles', 'rOl1', 'permissions', ...AUTH, '-w', 'subject_eq=orders'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('pRm1')
  })

  it('rejects an unknown relationship', async () => {
    const ctx = await runCommand(['provisioning:relationship', 'roles', 'rOl1', 'unicorns', ...AUTH])
    expect(ctx.error?.message).to.match(/unicorns/)
  })
})
