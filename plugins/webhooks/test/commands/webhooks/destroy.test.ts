import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, notFound, useMockedApi } from '../../helpers'

describe('webhooks:destroy', () => {
  useMockedApi()

  it('destroys the webhook', async () => {
    api().delete('/api/webhooks/wHk1').reply(204)
    const ctx = await runCommand(['webhooks:destroy', 'wHk1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('destroyed webhook with id wHk1')
  })

  it('reports a missing webhook as a command error', async () => {
    api().delete('/api/webhooks/nope').reply(404, notFound())
    const ctx = await runCommand(['webhooks:destroy', 'nope', ...AUTH])
    expect(ctx.error?.message).to.match(/Unable to find webhook with id nope/)
  })
})
