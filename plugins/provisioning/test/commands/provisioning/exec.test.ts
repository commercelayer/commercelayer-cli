import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'
import { AUTH, api, useMockedApi } from '../../helpers'

describe('provisioning:exec', () => {
  useMockedApi()

  it('executes the action on the resource', async () => {
    api().post('/api/memberships/mBr1/resend').reply(204)
    const ctx = await runCommand(['provisioning:exec', 'memberships', 'mBr1', 'resend', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(nock.isDone()).to.equal(true)
  })

  it('requires an action', async () => {
    const ctx = await runCommand(['provisioning:exec', 'memberships', 'mBr1', ...AUTH])
    expect(ctx.error?.message).to.match(/Missing action name/)
  })

  it('rejects an unknown action', async () => {
    const ctx = await runCommand(['provisioning:exec', 'memberships', 'mBr1', 'fly', ...AUTH])
    expect(ctx.error?.message).to.match(/Operation not supported for resource memberships: fly/)
  })
})
