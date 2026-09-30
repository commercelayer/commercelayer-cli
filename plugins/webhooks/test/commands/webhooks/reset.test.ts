import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, notFound, single, useMockedApi, webhook } from '../../helpers'

describe('webhooks:reset', () => {
  useMockedApi()

  it('resets the circuit breaker', async () => {
    api()
      .patch('/api/webhooks/wHk1', (body) => body.data.attributes._reset_circuit === true)
      .reply(200, single(webhook('wHk1')))
    const ctx = await runCommand(['webhooks:reset', 'wHk1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('circuit breaker associated to the webhook wHk1 has been successfully reset')
  })

  it('reports a missing webhook as a command error', async () => {
    api().patch('/api/webhooks/nope').reply(404, notFound())
    const ctx = await runCommand(['webhooks:reset', 'nope', ...AUTH])
    expect(ctx.error?.message).to.match(/Unable to find webhook with id nope/)
  })
})
